'use client';

import { useState, useRef, useEffect } from 'react';

type Step = 'idea' | 'preview' | 'launch' | 'success';

interface TokenMeta {
  name: string;
  symbol: string;
  description: string;
  twitter_text: string;
}

declare global {
  interface Window {
    solana?: {
      isPhantom?: boolean;
      connect: () => Promise<{ publicKey: { toString: () => string } }>;
      signAndSendTransaction: (tx: any) => Promise<{ signature: string }>;
    };
  }
}

export default function LauncherPage() {
  const [step, setStep] = useState<Step>('idea');
  const [idea, setIdea] = useState('');
  const [solAmount, setSolAmount] = useState(0.1);
  const [meta, setMeta] = useState<TokenMeta | null>(null);
  const [editMeta, setEditMeta] = useState<TokenMeta | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [walletAddress, setWalletAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [txSignature, setTxSignature] = useState('');
  const [mintAddress, setMintAddress] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  // Connect Phantom
  async function connectWallet() {
    if (!window.solana?.isPhantom) {
      alert('Phantom wallet not found. Install from phantom.app');
      return;
    }
    const resp = await window.solana.connect();
    setWalletAddress(resp.publicKey.toString());
  }

  async function generateMeta() {
    if (idea.trim().length < 5) { setError('Describe your idea (min 5 chars)'); return; }
    setLoading(true); setError('');
    try {
      const r = await fetch('/api/ai-launcher/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error ?? 'Generation failed');
      setMeta(data);
      setEditMeta(data);
      setStep('preview');
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  async function launchToken() {
    if (!walletAddress) { await connectWallet(); return; }
    if (!editMeta) return;
    setLoading(true); setError('');
    try {
      const form = new FormData();
      form.append('name', editMeta.name);
      form.append('symbol', editMeta.symbol);
      form.append('description', editMeta.description);
      form.append('twitter', editMeta.twitter_text.slice(0, 200));
      form.append('website', 'https://gadai.shop');
      form.append('publicKey', walletAddress);
      form.append('solAmount', String(solAmount));
      if (imageFile) form.append('image', imageFile);

      const r = await fetch('/api/ai-launcher/transaction', { method: 'POST', body: form });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error ?? 'Transaction creation failed');

      // Deserialize and sign with Phantom
      const { VersionedTransaction } = await import('@solana/web3.js');
      const txBytes = new Uint8Array(Buffer.from(data.txBase64, 'base64'));
      const tx = VersionedTransaction.deserialize(txBytes);

      if (!window.solana) throw new Error('Phantom not connected');
      const result = await window.solana.signAndSendTransaction(tx);

      setTxSignature(result.signature);
      // Derive mint from transaction (PumpPortal includes it in instruction)
      setMintAddress(data.mintAddress ?? '');
      setStep('success');
    } catch (e: any) {
      setError(e.message ?? 'Launch failed');
    } finally {
      setLoading(false);
    }
  }

  const svgPlaceholder = editMeta
    ? `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120"><rect width="120" height="120" rx="60" fill="%239945FF"/><text x="60" y="78" font-family="Arial Black" font-size="38" font-weight="900" fill="white" text-anchor="middle">${editMeta.symbol.slice(0,3)}</text></svg>`
    : '';

  return (
    <main style={{ minHeight: '100vh', background: '#0a0a0f', color: '#e2e8f0', fontFamily: 'monospace', padding: '24px 16px' }}>
      <div style={{ maxWidth: 560, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>🚀</div>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: '#9945FF', margin: 0, letterSpacing: 2 }}>AI TOKEN LAUNCHER</h1>
          <p style={{ color: '#64748b', marginTop: 8, fontSize: 14 }}>
            Describe your idea → AI generates metadata → Launch on pump.fun
          </p>
        </div>

        {/* Steps */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24, justifyContent: 'center' }}>
          {(['idea', 'preview', 'launch', 'success'] as Step[]).map((s, i) => (
            <div key={s} style={{
              padding: '4px 12px', borderRadius: 4, fontSize: 12,
              background: step === s ? '#9945FF' : '#1a1a2e',
              color: step === s ? 'white' : '#64748b',
              border: '1px solid ' + (step === s ? '#9945FF' : '#2d2d4a'),
            }}>
              {i + 1}. {s.toUpperCase()}
            </div>
          ))}
        </div>

        {error && (
          <div style={{ background: '#2d1515', border: '1px solid #ff4d4d', borderRadius: 8, padding: 12, marginBottom: 16, color: '#ff8080', fontSize: 13 }}>
            ⚠️ {error}
          </div>
        )}

        {/* ── STEP 1: IDEA ── */}
        {step === 'idea' && (
          <div style={{ background: '#0f0f1a', border: '1px solid #2d2d4a', borderRadius: 12, padding: 24 }}>
            <label style={{ display: 'block', marginBottom: 8, color: '#9945FF', fontSize: 13, fontWeight: 700 }}>
              DESCRIBE YOUR TOKEN IDEA
            </label>
            <textarea
              value={idea}
              onChange={e => setIdea(e.target.value)}
              placeholder="e.g. A pizza-obsessed dog who wants to rule the internet. Very degen. Much wow."
              rows={4}
              style={{
                width: '100%', background: '#0a0a0f', border: '1px solid #3d3d5a',
                borderRadius: 8, padding: 12, color: '#e2e8f0', fontSize: 14,
                resize: 'vertical', outline: 'none', boxSizing: 'border-box',
              }}
            />
            <div style={{ marginTop: 16, display: 'flex', gap: 12, alignItems: 'center' }}>
              <div>
                <label style={{ fontSize: 12, color: '#64748b' }}>INITIAL BUY (SOL)</label>
                <input
                  type="number"
                  value={solAmount}
                  onChange={e => setSolAmount(Number(e.target.value))}
                  min={0.01} max={10} step={0.01}
                  style={{
                    display: 'block', marginTop: 4, width: 100,
                    background: '#0a0a0f', border: '1px solid #3d3d5a',
                    borderRadius: 6, padding: '6px 10px', color: '#e2e8f0',
                    fontSize: 14, outline: 'none',
                  }}
                />
              </div>
              <button
                onClick={generateMeta}
                disabled={loading}
                style={{
                  flex: 1, marginTop: 20, padding: '12px 24px',
                  background: loading ? '#3d3d5a' : 'linear-gradient(135deg, #9945FF, #14F195)',
                  border: 'none', borderRadius: 8, color: 'white',
                  fontSize: 15, fontWeight: 700, cursor: loading ? 'wait' : 'pointer',
                  letterSpacing: 1,
                }}
              >
                {loading ? '⚡ GENERATING...' : '🤖 GENERATE WITH AI'}
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 2: PREVIEW ── */}
        {step === 'preview' && editMeta && (
          <div style={{ background: '#0f0f1a', border: '1px solid #2d2d4a', borderRadius: 12, padding: 24 }}>
            <div style={{ display: 'flex', gap: 16, marginBottom: 20, alignItems: 'flex-start' }}>
              <div
                style={{ width: 80, height: 80, borderRadius: '50%', overflow: 'hidden', border: '2px solid #9945FF', flexShrink: 0, cursor: 'pointer' }}
                onClick={() => fileRef.current?.click()}
                title="Click to upload image"
              >
                <img src={imagePreview || svgPlaceholder} alt="token" width={80} height={80} style={{ objectFit: 'cover' }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ color: '#64748b', fontSize: 11, marginBottom: 4 }}>click image to change ↑</div>
                <div style={{ color: '#9945FF', fontWeight: 900, fontSize: 22 }}>${editMeta.symbol}</div>
                <div style={{ color: '#e2e8f0', fontWeight: 700, fontSize: 16 }}>{editMeta.name}</div>
              </div>
            </div>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />

            {/* Editable fields */}
            <Field label="TOKEN NAME" value={editMeta.name} onChange={v => setEditMeta({ ...editMeta, name: v })} max={30} />
            <Field label="SYMBOL" value={editMeta.symbol} onChange={v => setEditMeta({ ...editMeta, symbol: v.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6) })} max={6} />
            <Field label="DESCRIPTION" value={editMeta.description} onChange={v => setEditMeta({ ...editMeta, description: v })} max={100} textarea />
            <Field label="LAUNCH TWEET" value={editMeta.twitter_text} onChange={v => setEditMeta({ ...editMeta, twitter_text: v })} max={280} textarea />

            <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
              <button onClick={() => setStep('idea')} style={{ padding: '10px 20px', background: '#1a1a2e', border: '1px solid #3d3d5a', borderRadius: 8, color: '#64748b', cursor: 'pointer' }}>
                ← BACK
              </button>
              <button
                onClick={() => setStep('launch')}
                style={{ flex: 1, padding: '12px 24px', background: 'linear-gradient(135deg, #9945FF, #14F195)', border: 'none', borderRadius: 8, color: 'white', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}
              >
                LOOKS GOOD → LAUNCH
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3: LAUNCH ── */}
        {step === 'launch' && editMeta && (
          <div style={{ background: '#0f0f1a', border: '1px solid #2d2d4a', borderRadius: 12, padding: 24 }}>
            <h2 style={{ margin: '0 0 20px', color: '#9945FF', fontSize: 18 }}>READY TO LAUNCH ${editMeta.symbol}</h2>

            <div style={{ background: '#0a0a0f', borderRadius: 8, padding: 16, marginBottom: 20, fontSize: 13 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ color: '#64748b' }}>Token</span>
                <span style={{ color: '#14F195', fontWeight: 700 }}>${editMeta.symbol} — {editMeta.name}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ color: '#64748b' }}>Initial buy</span>
                <span style={{ color: '#FFD700', fontWeight: 700 }}>{solAmount} SOL</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Network fee</span>
                <span style={{ color: '#e2e8f0' }}>~0.005 SOL</span>
              </div>
            </div>

            {walletAddress ? (
              <div style={{ background: '#0d1f0d', border: '1px solid #14F195', borderRadius: 8, padding: 10, marginBottom: 16, fontSize: 12, color: '#14F195' }}>
                ✅ Wallet: {walletAddress.slice(0, 8)}...{walletAddress.slice(-6)}
              </div>
            ) : (
              <button
                onClick={connectWallet}
                style={{ width: '100%', padding: 12, marginBottom: 16, background: '#1a1a2e', border: '1px solid #9945FF', borderRadius: 8, color: '#9945FF', fontSize: 14, cursor: 'pointer', fontWeight: 700 }}
              >
                🔗 CONNECT PHANTOM WALLET
              </button>
            )}

            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => setStep('preview')} style={{ padding: '10px 20px', background: '#1a1a2e', border: '1px solid #3d3d5a', borderRadius: 8, color: '#64748b', cursor: 'pointer' }}>
                ← BACK
              </button>
              <button
                onClick={launchToken}
                disabled={loading || !walletAddress}
                style={{
                  flex: 1, padding: '14px 24px',
                  background: loading ? '#3d3d5a' : 'linear-gradient(135deg, #FF6B6B, #9945FF)',
                  border: 'none', borderRadius: 8, color: 'white',
                  fontSize: 16, fontWeight: 900, cursor: loading ? 'wait' : 'pointer',
                  letterSpacing: 1,
                }}
              >
                {loading ? '🚀 LAUNCHING...' : '🔥 LAUNCH ON PUMP.FUN'}
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 4: SUCCESS ── */}
        {step === 'success' && (
          <div style={{ background: '#0d1f0d', border: '2px solid #14F195', borderRadius: 12, padding: 32, textAlign: 'center' }}>
            <div style={{ fontSize: 60, marginBottom: 16 }}>🎉</div>
            <h2 style={{ color: '#14F195', fontSize: 24, fontWeight: 900, margin: '0 0 8px' }}>TOKEN LAUNCHED!</h2>
            <p style={{ color: '#86efac', marginBottom: 24 }}>Your token is live on pump.fun</p>

            {txSignature && (
              <a href={`https://solscan.io/tx/${txSignature}`} target="_blank" rel="noopener noreferrer"
                style={{ display: 'block', color: '#9945FF', textDecoration: 'none', marginBottom: 12, fontSize: 13 }}>
                🔗 View transaction on Solscan →
              </a>
            )}
            {mintAddress && (
              <a href={`https://pump.fun/coin/${mintAddress}`} target="_blank" rel="noopener noreferrer"
                style={{ display: 'block', padding: '12px 24px', background: '#14F195', borderRadius: 8, color: '#0a0a0f', fontWeight: 900, textDecoration: 'none', marginBottom: 16 }}>
                🚀 View on pump.fun
              </a>
            )}
            <button
              onClick={() => { setStep('idea'); setIdea(''); setMeta(null); setEditMeta(null); setImageFile(null); setImagePreview(''); setTxSignature(''); setMintAddress(''); }}
              style={{ padding: '10px 24px', background: '#1a1a2e', border: '1px solid #3d3d5a', borderRadius: 8, color: '#64748b', cursor: 'pointer' }}
            >
              Launch another token
            </button>
          </div>
        )}

        {/* Info box */}
        <div style={{ marginTop: 24, background: '#0f0f1a', border: '1px solid #2d2d4a', borderRadius: 8, padding: 16, fontSize: 12, color: '#64748b' }}>
          <div style={{ fontWeight: 700, color: '#475569', marginBottom: 8 }}>HOW IT WORKS</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span>1. Describe your token idea in plain text</span>
            <span>2. Claude AI generates name, ticker, description</span>
            <span>3. Review and edit the generated metadata</span>
            <span>4. Connect Phantom and launch on pump.fun</span>
          </div>
          <div style={{ marginTop: 12, color: '#374151' }}>
            ⚠️ We charge a 0.005 SOL service fee per launch. Budget goes to liquidity.
          </div>
        </div>
      </div>
    </main>
  );
}

function Field({ label, value, onChange, max, textarea }: {
  label: string; value: string; onChange: (v: string) => void; max?: number; textarea?: boolean;
}) {
  const common = {
    width: '100%', background: '#0a0a0f', border: '1px solid #3d3d5a',
    borderRadius: 6, padding: '8px 10px', color: '#e2e8f0',
    fontSize: 13, outline: 'none', boxSizing: 'border-box' as const, marginTop: 4,
  };
  return (
    <div style={{ marginBottom: 12 }}>
      <label style={{ fontSize: 11, color: '#64748b', fontWeight: 700 }}>{label} <span style={{ color: '#374151' }}>({value.length}/{max})</span></label>
      {textarea
        ? <textarea value={value} onChange={e => onChange(e.target.value)} rows={2} maxLength={max} style={{ ...common, resize: 'vertical' }} />
        : <input value={value} onChange={e => onChange(e.target.value)} maxLength={max} style={common} />
      }
    </div>
  );
}
