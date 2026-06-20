'use client';

import { useEffect, useState, useCallback } from 'react';

const API_URL       = '/api/proxy';
const TREASURY_EVM  = '0x4C0B07Ad19D47994639D18ac2Af2FF82A0F95F37';
const USDT_BSC      = '0x55d398326f99059fF775485246999027B3197955'; // BSC USDT (18 decimals)
const BSC_CHAIN_ID  = '0x38'; // 56 in hex

interface Plan {
  slug:           string;
  name:           string;
  price_sol:      number;
  price_usd:      number;
  price_stars:    number;
  duration_hours: number;
  features:       string[];
}

type Step = 'idle' | 'connecting' | 'switching' | 'sending' | 'confirming' | 'verifying' | 'done' | 'error';

function planIcon(slug: string) {
  if (slug === 'monthly') return '💎';
  if (slug === 'trial_3d') return '⚡';
  return '🧪';
}
function planDuration(hours: number) {
  return hours < 48 ? `${hours} hours` : `${Math.round(hours / 24)} days`;
}

// Encode ERC-20 transfer(address,uint256) call data
function encodeUsdtTransfer(to: string, amountUsd: number): string {
  const selector    = 'a9059cbb'; // keccak256("transfer(address,uint256)")[0:4]
  const paddedAddr  = to.replace('0x', '').toLowerCase().padStart(64, '0');
  // BSC USDT has 18 decimals — use integer multiplication to avoid float precision issues
  const dollars     = BigInt(Math.round(amountUsd));
  const amountWei   = dollars * BigInt('1000000000000000000');
  const paddedAmt   = amountWei.toString(16).padStart(64, '0');
  return '0x' + selector + paddedAddr + paddedAmt;
}

async function ensureBscNetwork(ethereum: any): Promise<void> {
  try {
    await ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: BSC_CHAIN_ID }] });
  } catch (e: any) {
    if (e.code === 4902) {
      await ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId:         BSC_CHAIN_ID,
          chainName:       'BNB Smart Chain',
          nativeCurrency:  { name: 'BNB', symbol: 'BNB', decimals: 18 },
          rpcUrls:         ['https://bsc-dataseed1.binance.org'],
          blockExplorerUrls: ['https://bscscan.com'],
        }],
      });
    } else {
      throw e;
    }
  }
}

export default function PayPage() {
  const [plans,    setPlans]   = useState<Plan[]>([]);
  const [selected, setSelected]= useState<Plan | null>(null);
  const [tgId,     setTgId]    = useState('');
  const [evmAddr,  setEvmAddr] = useState('');
  const [step,     setStep]    = useState<Step>('idle');
  const [txHash,   setTxHash]  = useState('');
  const [error,    setError]   = useState('');
  const [mounted,  setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const params = new URLSearchParams(window.location.search);
    setTgId(params.get('tg_id') ?? '');
    // Load plans
    fetch(`${API_URL}/subscription/plans`)
      .then(r => r.json())
      .then(d => {
        const p: Plan[] = (d.plans ?? []).map((pl: any) => ({
          ...pl,
          price_usd:   Number(pl.price_usd   ?? 0),
          price_stars: Number(pl.price_stars ?? 0),
          features:    pl.features ?? [],
        }));
        setPlans(p);
        if (p.length) setSelected(p[0]);
      })
      .catch(() => {
        const fallback: Plan[] = [
          { slug: 'trial_1d', name: '1-Day Trial',   price_sol: 0.05, price_usd: 5,   price_stars: 219,  duration_hours: 24,  features: ['All analytics', 'Whale alerts', 'AI risk scores', 'Trade journal'] },
          { slug: 'trial_3d', name: '3-Day Access',  price_sol: 0.1,  price_usd: 10,  price_stars: 437,  duration_hours: 72,  features: ['Everything in Trial', 'Trend engine', 'Coin ideas', 'X trend signals'] },
          { slug: 'monthly',  name: 'Monthly PRO',   price_sol: 1.0,  price_usd: 100, price_stars: 4367, duration_hours: 720, features: ['All features', 'Auto-buy bot', 'Portfolio', 'Futures', 'Token launch'] },
        ];
        setPlans(fallback);
        setSelected(fallback[0]);
      });
  }, []);

  const connectMetaMask = useCallback(async () => {
    const eth = (window as any).ethereum;
    if (!eth) {
      setError('MetaMask or Trust Wallet not detected. Please install MetaMask extension or open in Trust Wallet browser.');
      return;
    }
    setStep('connecting');
    setError('');
    try {
      const accounts: string[] = await eth.request({ method: 'eth_requestAccounts' });
      setEvmAddr(accounts[0] ?? '');
      setStep('idle');
    } catch (e: any) {
      setError(e?.message ?? 'Wallet connection cancelled.');
      setStep('idle');
    }
  }, []);

  const disconnectWallet = useCallback(() => {
    setEvmAddr('');
    setStep('idle');
    setTxHash('');
    setError('');
  }, []);

  const payUsdt = useCallback(async () => {
    if (!evmAddr || !selected || !tgId) return;
    const eth = (window as any).ethereum;
    if (!eth) { setError('MetaMask not found.'); return; }
    setError('');

    try {
      // Switch to BSC network
      setStep('switching');
      await ensureBscNetwork(eth);

      // Send USDT transfer
      setStep('sending');
      const data = encodeUsdtTransfer(TREASURY_EVM, selected.price_usd);
      const hash: string = await eth.request({
        method: 'eth_sendTransaction',
        params: [{
          from:    evmAddr,
          to:      USDT_BSC,
          data,
          chainId: BSC_CHAIN_ID,
        }],
      });
      setTxHash(hash);

      // Poll for confirmation
      setStep('confirming');
      const rpc = 'https://bsc-dataseed1.binance.org';
      const deadline = Date.now() + 120_000;
      let confirmed = false;
      while (Date.now() < deadline) {
        await new Promise(r => setTimeout(r, 4000));
        try {
          const resp = await fetch(rpc, {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ jsonrpc: '2.0', method: 'eth_getTransactionReceipt', params: [hash], id: 1 }),
          });
          const { result } = await resp.json();
          if (result?.status === '0x1') { confirmed = true; break; }
          if (result?.status === '0x0') throw new Error('Transaction reverted on BSC.');
        } catch (pollErr: any) {
          if (pollErr.message?.includes('reverted')) throw pollErr;
        }
      }
      if (!confirmed) setError('Confirmation timeout. Verifying anyway…');

      // Verify with API
      setStep('verifying');
      const verifyRes = await fetch(`${API_URL}/subscription/verify-usdt`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ tx_hash: hash, tg_user_id: tgId, plan_slug: selected.slug }),
      });
      const verifyData = await verifyRes.json();
      if (!verifyRes.ok) throw new Error(verifyData.error ?? 'Verification failed');

      // Notify TG user
      await fetch(`${API_URL}/tg/notify-payment`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ telegram_id: tgId, plan_slug: selected.slug, expires_at: verifyData.subscription?.expires_at }),
      }).catch(() => {});

      setStep('done');
    } catch (e: any) {
      setError(e?.message ?? 'Payment failed. Please try again.');
      setStep('error');
    }
  }, [evmAddr, selected, tgId]);

  if (!mounted) return null;

  const isProcessing = ['connecting','switching','sending','confirming','verifying'].includes(step);
  const stepLabels: Record<Step, string> = {
    idle:       '',
    connecting: 'Connecting wallet…',
    switching:  'Switching to BSC network…',
    sending:    'Sending USDT…',
    confirming: 'Confirming on BSC…',
    verifying:  'Verifying payment…',
    done:       '✅ Payment confirmed!',
    error:      '❌ Error',
  };

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #050508; color: #e0e0f0; font-family: system-ui, -apple-system, sans-serif; min-height: 100vh; }
        .page { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px 16px; }
        .card { background: #0d0d18; border: 2px solid #1e1e30; padding: 40px 32px; max-width: 560px; width: 100%; }
        .logo { font-family: 'Press Start 2P', monospace; font-size: 11px; color: #14F195; margin-bottom: 8px; letter-spacing: 2px; }
        .logo span { color: #9945FF; }
        .title { font-family: 'Press Start 2P', monospace; font-size: 16px; color: #fff; margin-bottom: 8px; }
        .subtitle { font-size: 14px; color: #555570; margin-bottom: 28px; line-height: 1.6; }
        .plan-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; margin-bottom: 24px; }
        .plan { padding: 16px 12px; border: 2px solid #1e1e30; cursor: pointer; transition: all .15s; text-align: center; }
        .plan:hover { border-color: #9945FF55; }
        .plan.selected { border-color: #14F195; background: #14F19508; }
        .plan-icon { font-size: 22px; margin-bottom: 6px; }
        .plan-name { font-family: 'Press Start 2P', monospace; font-size: 7px; color: #888; margin-bottom: 5px; }
        .plan-price-usd { font-family: 'Press Start 2P', monospace; font-size: 20px; color: #14F195; margin-bottom: 2px; }
        .plan-dur { font-size: 11px; color: #555570; margin-bottom: 6px; }
        .plan-stars { font-size: 10px; color: #FFD700; margin-bottom: 8px; }
        .plan-feats { list-style: none; text-align: left; }
        .plan-feats li { font-size: 10px; color: #555570; padding: 2px 0; display: flex; gap: 5px; }
        .plan-feats li::before { content: '✓'; color: #14F195; flex-shrink: 0; }
        .section-label { font-size: 11px; color: #555570; margin-bottom: 10px; letter-spacing: 1px; text-transform: uppercase; }
        .input-row { display: flex; gap: 10px; margin-bottom: 20px; align-items: stretch; }
        .input { background: #080812; border: 2px solid #1e1e30; color: #e0e0f0; padding: 12px 14px; font-size: 13px; flex: 1; font-family: monospace; outline: none; }
        .input:focus { border-color: #9945FF55; }
        .input::placeholder { color: #333348; }
        .wallet-box { border: 2px solid #1e1e30; padding: 14px 16px; margin-bottom: 20px; display: flex; align-items: center; justify-content: space-between; gap: 12px; }
        .wallet-addr { font-family: monospace; font-size: 12px; color: #14F195; word-break: break-all; }
        .btn { font-family: 'Press Start 2P', monospace; font-size: 10px; padding: 14px 18px; cursor: pointer; border: none; transition: all .15s; display: inline-block; text-align: center; white-space: nowrap; }
        .btn-primary { background: #9945FF; color: #fff; border: 2px solid #14F195; width: 100%; }
        .btn-primary:hover:not(:disabled) { background: #14F195; color: #050508; }
        .btn-primary:disabled { opacity: .5; cursor: not-allowed; }
        .btn-outline { background: transparent; color: #9945FF; border: 2px solid #9945FF; }
        .btn-outline:hover { background: #9945FF15; }
        .btn-ghost { background: transparent; color: #555570; border: 2px solid #1e1e30; font-size: 9px; padding: 8px 12px; }
        .btn-ghost:hover { border-color: #555570; }
        .btn-stars { background: #1a1a2e; color: #FFD700; border: 2px solid #FFD70044; width: 100%; margin-top: 10px; }
        .btn-stars:hover { border-color: #FFD700; background: #FFD70010; }
        .status-bar { padding: 12px 16px; border: 2px solid #1e1e30; margin-bottom: 20px; font-size: 13px; }
        .status-bar.processing { border-color: #9945FF55; color: #9945FF; }
        .status-bar.done { border-color: #14F195; color: #14F195; }
        .status-bar.error { border-color: #FF444455; color: #FF4444; }
        .tx-link { font-family: monospace; font-size: 11px; color: #555570; word-break: break-all; margin-top: 8px; }
        .tx-link a { color: #14F195; text-decoration: none; }
        .success-box { text-align: center; padding: 32px 0; }
        .success-icon { font-size: 64px; margin-bottom: 16px; }
        .success-title { font-family: 'Press Start 2P', monospace; font-size: 14px; color: #14F195; margin-bottom: 12px; }
        .success-sub { font-size: 14px; color: #555570; line-height: 1.7; margin-bottom: 24px; }
        .tg-btn { display: inline-block; padding: 14px 24px; background: #2AABEE; color: #fff; text-decoration: none; font-family: 'Press Start 2P', monospace; font-size: 10px; border: none; cursor: pointer; }
        .tg-btn:hover { background: #1e96d4; }
        .divider { border: none; border-top: 1px solid #1e1e30; margin: 20px 0; }
        .notice { font-size: 11px; color: #555570; line-height: 1.6; margin-top: 20px; padding-top: 20px; border-top: 1px solid #1e1e30; }
        .notice a { color: #9945FF; text-decoration: none; }
        .addr-hint { font-size: 11px; color: #333348; margin-bottom: 16px; font-family: monospace; word-break: break-all; }
        .spinner { display: inline-block; width: 12px; height: 12px; border: 2px solid currentColor; border-top-color: transparent; border-radius: 50%; animation: spin .7s linear infinite; margin-right: 8px; vertical-align: middle; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 520px) { .plan-grid { grid-template-columns: 1fr; } .card { padding: 24px 14px; } }
      `}</style>

      <div className="page">
        <div className="card">
          <div className="logo">GAD<span>AI</span> TERMINAL</div>
          <h1 className="title">Get Access</h1>
          <p className="subtitle">
            Pay with USDT (BNB Smart Chain) or Telegram Stars.
            {tgId && <> TG ID: <code style={{ color: '#9945FF' }}>{tgId}</code></>}
          </p>

          {step === 'done' ? (
            <div className="success-box">
              <div className="success-icon">🚀</div>
              <div className="success-title">SUBSCRIPTION ACTIVE</div>
              <p className="success-sub">
                Return to Telegram and send /status to confirm your access.
              </p>
              <a href="https://t.me/gadai_sol_bot" className="tg-btn">▶ Open @gadai_sol_bot</a>
              {txHash && (
                <p className="tx-link" style={{ marginTop: 20 }}>
                  Tx: <a href={`https://bscscan.com/tx/${txHash}`} target="_blank" rel="noopener noreferrer">
                    {txHash.slice(0, 24)}…
                  </a>
                </p>
              )}
            </div>
          ) : (
            <>
              {/* ── Plan selector ── */}
              <p className="section-label">Choose Plan</p>
              <div className="plan-grid">
                {plans.map(p => (
                  <div
                    key={p.slug}
                    className={`plan${selected?.slug === p.slug ? ' selected' : ''}`}
                    onClick={() => !isProcessing && setSelected(p)}
                  >
                    <div className="plan-icon">{planIcon(p.slug)}</div>
                    <div className="plan-name">{p.name}</div>
                    <div className="plan-price-usd">${p.price_usd}</div>
                    <div className="plan-dur">{planDuration(p.duration_hours)}</div>
                    {p.price_stars > 0 && <div className="plan-stars">⭐ {p.price_stars.toLocaleString()} Stars</div>}
                    <ul className="plan-feats">
                      {(p.features ?? []).slice(0, 3).map(f => (
                        <li key={f}>{f.replace(/_/g, ' ')}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* ── Telegram ID ── */}
              <p className="section-label">Your Telegram ID</p>
              <div className="input-row" style={{ marginBottom: 20 }}>
                <input
                  className="input"
                  type="text"
                  placeholder="Your Telegram user ID (e.g. 123456789)"
                  value={tgId}
                  onChange={e => setTgId(e.target.value.replace(/\D/g, ''))}
                  disabled={isProcessing}
                />
              </div>
              {!tgId && (
                <p style={{ fontSize: 11, color: '#FF9944', marginBottom: 16 }}>
                  ⚠ Enter your Telegram ID. In @gadai_sol_bot send /start — your ID appears on the subscription prompt.
                </p>
              )}

              <hr className="divider" />

              {/* ── METHOD 1: USDT on BSC ── */}
              <p className="section-label">Method 1 — USDT on BNB Smart Chain</p>
              <p className="addr-hint">Treasury: {TREASURY_EVM}</p>

              {evmAddr ? (
                <div className="wallet-box">
                  <span className="wallet-addr">{evmAddr.slice(0, 10)}…{evmAddr.slice(-6)}</span>
                  <button className="btn btn-ghost" onClick={disconnectWallet} disabled={isProcessing}>Disconnect</button>
                </div>
              ) : (
                <div style={{ marginBottom: 20 }}>
                  <button
                    className="btn btn-outline"
                    style={{ width: '100%' }}
                    onClick={connectMetaMask}
                    disabled={isProcessing}
                  >
                    Connect MetaMask / Trust Wallet
                  </button>
                </div>
              )}

              {(isProcessing || step === 'error') && (
                <div className={`status-bar ${step === 'error' ? 'error' : 'processing'}`} style={{ marginBottom: 16 }}>
                  {isProcessing && <span className="spinner" />}
                  {stepLabels[step]}
                  {txHash && (
                    <p className="tx-link">
                      Tx: <a href={`https://bscscan.com/tx/${txHash}`} target="_blank" rel="noopener noreferrer">
                        {txHash.slice(0, 20)}…
                      </a>
                    </p>
                  )}
                </div>
              )}

              {error && (
                <div className="status-bar error" style={{ marginBottom: 16 }}>{error}</div>
              )}

              <button
                className="btn btn-primary"
                onClick={payUsdt}
                disabled={!evmAddr || !selected || isProcessing || !tgId}
                style={{ marginBottom: 8 }}
              >
                {isProcessing
                  ? <><span className="spinner" />{stepLabels[step]}</>
                  : selected
                    ? `Pay $${selected.price_usd} USDT — ${selected.name}`
                    : 'Select a plan'}
              </button>

              <hr className="divider" />

              {/* ── METHOD 2: Telegram Stars ── */}
              <p className="section-label">Method 2 — Telegram Stars (in-bot)</p>
              <p style={{ fontSize: 12, color: '#555570', marginBottom: 14, lineHeight: 1.6 }}>
                Send /subscribe in @gadai_sol_bot and choose "Pay with Stars".
                Stars: {selected?.price_stars?.toLocaleString() ?? '?'} ⭐ for {selected?.name}.
              </p>
              <a
                href={`https://t.me/gadai_sol_bot?start=subscribe`}
                className="btn btn-stars"
                rel="noopener noreferrer"
                target="_blank"
                style={{ display: 'block', textAlign: 'center', textDecoration: 'none', padding: '14px' }}
              >
                ⭐ Pay with Stars in @gadai_sol_bot
              </a>

              <p className="notice">
                USDT is sent directly to treasury on BNB Smart Chain and verified on-chain.
                Stars go to @gadai_sol_bot and activate your account automatically.
                Questions? {' '}<a href="https://t.me/gadfamilytg" rel="noopener noreferrer">@gadfamilytg</a>
              </p>
            </>
          )}
        </div>
      </div>
    </>
  );
}
