'use client';

import { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import NavBar from '@/components/layout/NavBar';

const API_BASE = '/api/proxy';
const TG_BOT   = 'https://t.me/gadai_sol_bot';

type Chain = 'SOLANA' | 'BSC' | 'BASE';

interface LaunchForm {
  name:        string;
  ticker:      string;
  description: string;
  devBuySol:   string;
  w2BuySol:    string;
  w3BuySol:    string;
  chain:       Chain;
}

const CHAIN_META: Record<Chain, {
  icon: string; color: string; accent: string;
  platform: string; platformUrl: string;
  unit: string; unitSymbol: string;
  badge: string;
  principles: { icon: string; text: string }[];
}> = {
  SOLANA: {
    icon: '🟣', color: '#9945FF', accent: 'rgba(153,69,255,0.15)',
    platform: 'pump.fun', platformUrl: 'https://pump.fun',
    unit: 'SOL', unitSymbol: '◎',
    badge: 'PUMP.FUN LAUNCHER',
    principles: [
      { icon: '🤖', text: 'GAD AI admin reviews & launches within minutes' },
      { icon: '📌', text: 'Logo uploaded to Pinata IPFS — permanent & decentralized' },
      { icon: '⛓️',  text: 'Token deployed on pump.fun via official SDK' },
      { icon: '🐋', text: 'Staggered 3-wallet buy: organic & undetectable' },
      { icon: '📡', text: 'Telegram notification on launch confirmation' },
      { icon: '✅', text: 'No fake volume. No coordinated insider buys.' },
    ],
  },
  BSC: {
    icon: '🟡', color: '#F0B90B', accent: 'rgba(240,185,11,0.12)',
    platform: '4meme.fun', platformUrl: 'https://4meme.fun',
    unit: 'BNB', unitSymbol: 'BNB',
    badge: '4MEME.FUN LAUNCHER',
    principles: [
      { icon: '🤖', text: 'GAD AI admin creates token on 4meme.fun for you' },
      { icon: '📌', text: 'Logo uploaded to IPFS — permanent link in metadata' },
      { icon: '🟡', text: 'Token launched on BSC via 4meme.fun bonding curve' },
      { icon: '🐋', text: 'Dev buy on launch — organic entry point' },
      { icon: '📡', text: 'Telegram notification when token is live on BSC' },
      { icon: '🔒', text: 'PancakeSwap listing once bonding curve fills' },
    ],
  },
  BASE: {
    icon: '🔵', color: '#0052FF', accent: 'rgba(0,82,255,0.12)',
    platform: 'clank.fun', platformUrl: 'https://clank.fun',
    unit: 'ETH', unitSymbol: 'Ξ',
    badge: 'CLANK.FUN LAUNCHER',
    principles: [
      { icon: '🤖', text: 'GAD AI admin creates token on clank.fun for you' },
      { icon: '📌', text: 'Logo uploaded to IPFS — permanent & decentralized' },
      { icon: '🔵', text: 'Token launched on Base via clank.fun bonding curve' },
      { icon: '🐋', text: 'Dev buy on launch — organic Base chart entry' },
      { icon: '📡', text: 'Telegram notification when Base token is live' },
      { icon: '🦄', text: 'Uniswap V2 listing once bonding curve fills' },
    ],
  },
};

const inp: React.CSSProperties = {
  width: '100%',
  padding: '12px 14px',
  background: 'var(--bg2)',
  border: '1px solid var(--border)',
  borderRadius: 8,
  color: 'var(--text)',
  fontSize: 13,
  outline: 'none',
  fontFamily: 'var(--font-mono)',
  boxSizing: 'border-box' as const,
};

const lbl: React.CSSProperties = {
  display: 'block',
  fontSize: 10,
  color: 'var(--muted)',
  letterSpacing: 2,
  marginBottom: 6,
  fontFamily: 'var(--font-mono)',
  textTransform: 'uppercase' as const,
};

export default function LauncherPage() {
  const searchParams = useSearchParams();
  const [chain, setChain]     = useState<Chain>(() => {
    const q = searchParams.get('chain');
    return (q === 'BSC' || q === 'BASE' || q === 'SOLANA') ? q : 'SOLANA';
  });
  const [form, setForm]       = useState<LaunchForm>({
    name: '', ticker: '', description: '',
    devBuySol: '0.10', w2BuySol: '0.05', w3BuySol: '0.03',
    chain: 'SOLANA',
  });
  const [image, setImage]               = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [status, setStatus]             = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError]               = useState('');
  const [submitId, setSubmitId]         = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const meta = CHAIN_META[chain];

  function selectChain(c: Chain) {
    setChain(c);
    setForm(f => ({
      ...f,
      chain: c,
      devBuySol: c === 'SOLANA' ? '0.10' : c === 'BSC' ? '0.05' : '0.002',
      w2BuySol:  c === 'SOLANA' ? '0.05' : c === 'BSC' ? '0.02' : '0.001',
      w3BuySol:  c === 'SOLANA' ? '0.03' : c === 'BSC' ? '0.01' : '0.0005',
    }));
    setStatus('idle');
    setError('');
  }

  function handleField(k: keyof LaunchForm, v: string) {
    if (k === 'ticker') v = v.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8);
    setForm(f => ({ ...f, [k]: v }));
  }

  function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { setError('Image must be under 2MB'); return; }
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
    setError('');
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { setError('Only image files allowed'); return; }
    if (file.size > 2 * 1024 * 1024) { setError('Image must be under 2MB'); return; }
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
    setError('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.ticker || !form.description) {
      setError('Name, ticker, and description are required.'); return;
    }
    if (!image) { setError('Please upload a logo image.'); return; }

    setStatus('loading');
    setError('');

    try {
      const imgB64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload  = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(image);
      });

      const res = await fetch(`${API_BASE}/launcher/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          imageName: image.name,
          imageType: image.type,
          imageB64:  imgB64,
          devBuySol: Number(form.devBuySol),
          w2BuySol:  Number(form.w2BuySol),
          w3BuySol:  Number(form.w3BuySol),
          chain,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Submission failed');
      setStatus('success');
      setSubmitId(data.id ?? '');
    } catch (err: any) {
      setStatus('error');
      setError(err.message);
    }
  }

  if (status === 'success') {
    return (
      <>
        <NavBar />
        <main style={{ background: 'var(--bg)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 24px' }}>
          <div style={{ maxWidth: 480, textAlign: 'center' }}>
            <div style={{ fontSize: 72, marginBottom: 20, lineHeight: 1 }}>{meta.icon}</div>
            <h1 style={{ fontSize: 28, fontWeight: 900, color: meta.color, fontFamily: 'var(--font-mono)', letterSpacing: 2, marginBottom: 16 }}>
              QUEUED FOR {chain}
            </h1>
            <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.9, marginBottom: 24 }}>
              Your {chain} token idea has been submitted. GAD AI team reviews and launches on{' '}
              <a href={meta.platformUrl} target="_blank" rel="noopener noreferrer" style={{ color: meta.color }}>
                {meta.platform}
              </a>{' '}
              within minutes. Watch <a href={TG_BOT} style={{ color: 'var(--purple)' }}>@gadai_sol_bot</a> for the launch TX.
            </p>
            {submitId && (
              <p style={{ fontSize: 10, color: 'var(--border)', fontFamily: 'var(--font-mono)', marginBottom: 28, letterSpacing: 1 }}>
                SUBMISSION ID: {submitId}
              </p>
            )}
            <button
              onClick={() => {
                setStatus('idle'); setImage(null); setImagePreview(null);
                setForm({ name: '', ticker: '', description: '', devBuySol: '0.10', w2BuySol: '0.05', w3BuySol: '0.03', chain });
              }}
              style={{
                padding: '12px 28px', background: 'transparent',
                border: '1px solid var(--border)', borderRadius: 8,
                color: 'var(--muted)', fontSize: 11, fontFamily: 'var(--font-mono)',
                cursor: 'pointer', letterSpacing: 2,
              }}
            >
              SUBMIT ANOTHER
            </button>
          </div>
        </main>
      </>
    );
  }

  const totalSol = (Number(form.devBuySol) + Number(form.w2BuySol) + Number(form.w3BuySol)).toFixed(
    chain === 'BASE' ? 4 : 2
  );

  return (
    <>
      <NavBar />
      <main style={{ background: 'var(--bg)', minHeight: '100vh', paddingBottom: 80 }}>

        {/* Hero */}
        <section style={{ textAlign: 'center', padding: '80px 24px 48px', position: 'relative', overflow: 'hidden' }}>
          <div style={{
            position: 'absolute', inset: 0,
            background: `radial-gradient(ellipse 70% 50% at 50% 0%, ${meta.accent} 0%, transparent 70%)`,
            pointerEvents: 'none',
            transition: 'background 0.3s',
          }} />
          <span style={{
            display: 'inline-block', padding: '5px 18px', borderRadius: 99,
            fontSize: 10, letterSpacing: 2, color: meta.color,
            border: `1px solid ${meta.color}88`, background: meta.accent,
            marginBottom: 24, fontFamily: 'var(--font-mono)',
          }}>{meta.badge}</span>
          <h1 className="section-title" style={{ marginBottom: 16 }}>🚀 LAUNCH YOUR TOKEN</h1>
          <p className="section-sub" style={{ maxWidth: 580, margin: '0 auto 32px' }}>
            Create your meme token on{' '}
            <a href={meta.platformUrl} target="_blank" rel="noopener noreferrer" style={{ color: meta.color }}>
              {meta.platform}
            </a>{' '}
            in minutes. Fill the form — GAD AI handles IPFS upload, deploy, and staggered buy.
          </p>

          {/* Chain Selector */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
            {(['SOLANA', 'BSC', 'BASE'] as Chain[]).map(c => {
              const m = CHAIN_META[c];
              const active = c === chain;
              return (
                <button
                  key={c}
                  onClick={() => selectChain(c)}
                  style={{
                    padding: '10px 24px',
                    borderRadius: 8,
                    border: `2px solid ${active ? m.color : 'var(--border)'}`,
                    background: active ? m.accent : 'transparent',
                    color: active ? m.color : 'var(--muted)',
                    fontSize: 12,
                    fontWeight: 700,
                    fontFamily: 'var(--font-mono)',
                    letterSpacing: 2,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    transition: 'all 0.2s',
                  }}
                >
                  <span style={{ fontSize: 16 }}>{m.icon}</span>
                  {c}
                  <span style={{ fontSize: 9, opacity: 0.6 }}>{m.platform}</span>
                </button>
              );
            })}
          </div>
        </section>

        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 40 }}>

            {/* ─── Form ─── */}
            <div>
              {/* Chain info bar */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28,
                padding: '12px 16px',
                background: meta.accent,
                border: `1px solid ${meta.color}44`,
                borderRadius: 8,
              }}>
                <span style={{ fontSize: 22 }}>{meta.icon}</span>
                <div>
                  <div style={{ fontSize: 11, color: meta.color, fontFamily: 'var(--font-mono)', letterSpacing: 1 }}>
                    {chain} — via {meta.platform}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
                    Buy amounts in {meta.unit} · GAD AI launches for you
                  </div>
                </div>
                <a
                  href={meta.platformUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    marginLeft: 'auto', fontSize: 10, color: meta.color,
                    border: `1px solid ${meta.color}55`, borderRadius: 4,
                    padding: '4px 8px', fontFamily: 'var(--font-mono)',
                    textDecoration: 'none', flexShrink: 0,
                  }}
                >
                  ↗ {meta.platform}
                </a>
              </div>

              <p style={{ ...lbl, marginBottom: 24, fontSize: 11 }}>TOKEN DETAILS</p>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

                {/* Name */}
                <div>
                  <label style={lbl}>Token Name * <span style={{ opacity: .4 }}>(max 30)</span></label>
                  <input
                    type="text" maxLength={30} value={form.name}
                    onChange={e => handleField('name', e.target.value)}
                    placeholder="e.g. Moon Dog"
                    style={{ ...inp, borderColor: form.name ? `${meta.color}66` : undefined }}
                  />
                </div>

                {/* Ticker */}
                <div>
                  <label style={lbl}>Ticker * <span style={{ opacity: .4 }}>(max 8 chars)</span></label>
                  <div style={{ position: 'relative' }}>
                    <span style={{
                      position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                      color: 'var(--muted)', fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 700,
                    }}>$</span>
                    <input
                      type="text" maxLength={8} value={form.ticker}
                      onChange={e => handleField('ticker', e.target.value)}
                      placeholder="MOON"
                      style={{ ...inp, paddingLeft: 28, borderColor: form.ticker ? `${meta.color}66` : undefined }}
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label style={lbl}>Description * <span style={{ opacity: .4 }}>(max 500)</span></label>
                  <textarea
                    rows={4} maxLength={500} value={form.description}
                    onChange={e => handleField('description', e.target.value)}
                    placeholder={chain === 'BSC' ? 'The next BNB memecoin. Dogs on BSC going to the moon...' : chain === 'BASE' ? 'Base is for builders. And degens. This is both...' : 'The meme behind the next moonshot. Dogs going to the moon...'}
                    style={{ ...inp, resize: 'vertical' as const, lineHeight: 1.7 }}
                  />
                  <p style={{ fontSize: 10, color: 'var(--muted)', marginTop: 4, opacity: .4, fontFamily: 'var(--font-mono)' }}>
                    {form.description.length}/500
                  </p>
                </div>

                {/* Logo */}
                <div>
                  <label style={lbl}>Logo Image * <span style={{ opacity: .4 }}>(PNG/JPG, max 2MB)</span></label>
                  <div
                    onClick={() => fileRef.current?.click()}
                    onDrop={handleDrop}
                    onDragOver={e => e.preventDefault()}
                    style={{
                      border: `2px dashed var(--border)`, borderRadius: 12, padding: '28px 20px',
                      textAlign: 'center', cursor: 'pointer', transition: 'border-color .2s, background .2s',
                      background: 'var(--bg2)',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = meta.color;
                      e.currentTarget.style.background = meta.accent;
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = 'var(--border)';
                      e.currentTarget.style.background = 'var(--bg2)';
                    }}
                  >
                    {imagePreview ? (
                      <div>
                        <img src={imagePreview} alt="preview" style={{ height: 80, width: 80, objectFit: 'cover', borderRadius: 10, margin: '0 auto 8px' }} />
                        <p style={{ fontSize: 11, color: meta.color, fontFamily: 'var(--font-mono)' }}>✓ {image?.name}</p>
                      </div>
                    ) : (
                      <>
                        <div style={{ fontSize: 32, marginBottom: 8, opacity: .6 }}>🖼️</div>
                        <p style={{ fontSize: 12, color: 'var(--muted)' }}>Click or drag & drop logo</p>
                        <p style={{ fontSize: 10, color: 'var(--muted)', opacity: .4, marginTop: 4 }}>PNG / JPG / GIF — max 2MB</p>
                      </>
                    )}
                    <input ref={fileRef} type="file" accept="image/*" onChange={handleImage} style={{ display: 'none' }} />
                  </div>
                </div>

                {/* Buy strategy */}
                <div>
                  <label style={lbl}>Dev Buy Strategy <span style={{ opacity: .4 }}>({meta.unit} per wallet)</span></label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                    {([
                      { label: 'W1 DEV', key: 'devBuySol' as const, hint: 'instant' },
                      { label: 'W2 +12MIN', key: 'w2BuySol' as const, hint: 'organic' },
                      { label: 'W3 +28MIN', key: 'w3BuySol' as const, hint: 'organic' },
                    ] as const).map(({ label: lbl2, key, hint }) => (
                      <div key={key}>
                        <p style={{ ...lbl, marginBottom: 5 }}>{lbl2}</p>
                        <input
                          type="number"
                          step={chain === 'BASE' ? '0.0001' : '0.01'}
                          min="0" max={chain === 'BASE' ? '1' : '10'}
                          value={form[key]}
                          onChange={e => handleField(key, e.target.value)}
                          style={{ ...inp, padding: '10px 10px' }}
                        />
                        <p style={{ fontSize: 10, color: 'var(--muted)', marginTop: 3, opacity: .4 }}>{hint}</p>
                      </div>
                    ))}
                  </div>
                  <div style={{
                    marginTop: 10, padding: '8px 12px', background: meta.accent,
                    border: `1px solid ${meta.color}33`, borderRadius: 6,
                  }}>
                    <p style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>
                      TOTAL COMMITMENT: <span style={{ color: meta.color, fontWeight: 700 }}>~{totalSol} {meta.unit}</span>
                    </p>
                  </div>
                </div>

                {/* Error */}
                {(status === 'error' || error) && (
                  <div style={{
                    padding: '12px 16px', borderRadius: 8,
                    background: 'rgba(239,68,68,.1)', border: '1px solid rgba(239,68,68,.3)',
                    color: '#f87171', fontSize: 13, fontFamily: 'var(--font-mono)',
                  }}>
                    ✗ {error}
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  style={{
                    padding: '15px', borderRadius: 10, border: 'none',
                    background: status === 'loading'
                      ? 'var(--bg2)'
                      : `linear-gradient(135deg, ${meta.color}, ${meta.color}cc)`,
                    color: chain === 'BSC' ? '#000' : '#fff',
                    fontSize: 12, fontWeight: 900, letterSpacing: 2,
                    cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                    fontFamily: 'var(--font-mono)', opacity: status === 'loading' ? .5 : 1,
                    transition: 'opacity .2s, transform .1s',
                    boxShadow: status !== 'loading' ? `0 0 20px ${meta.color}44` : 'none',
                  }}
                >
                  {status === 'loading' ? '⏳ SUBMITTING...' : `🚀 LAUNCH ON ${meta.platform.toUpperCase()}`}
                </button>
                <p style={{ textAlign: 'center', fontSize: 11, color: 'var(--muted)', opacity: .4, lineHeight: 1.6 }}>
                  Team reviews in minutes and launches on {meta.platform}.<br />Telegram notification on launch.
                </p>
              </form>
            </div>

            {/* ─── Info ─── */}
            <div>
              <p style={{ ...lbl, marginBottom: 24, fontSize: 11 }}>HOW IT WORKS</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 36 }}>
                {[
                  { n: '01', t: 'Fill the form', d: `Name, ticker (max 8), description, logo. Choose dev buy amounts in ${meta.unit} across 3 wallets.` },
                  { n: '02', t: 'Submit to queue', d: `Your idea queues for review. GAD AI uploads logo to Pinata IPFS, creates metadata JSON.` },
                  { n: '03', t: `Auto-Launch on ${meta.platform}`, d: chain === 'SOLANA'
                    ? 'Token deployed via pumpdotfun-sdk. W1 buys instantly, W2 +12min, W3 +28min — staggered timing.'
                    : chain === 'BSC'
                    ? 'Token launched on 4meme.fun bonding curve. Dev buy sets the first green candle. PancakeSwap listing on graduation.'
                    : 'Token launched on clank.fun bonding curve on Base. Dev buy creates organic first candle. Uniswap V2 listing on graduation.' },
                  { n: '04', t: 'Track & Sell', d: `Monitor via /mycoins in @gadai_sol_bot. Exit your dev position when ready.` },
                ].map(s => (
                  <div key={s.n} style={{
                    background: 'var(--bg2)', border: '1px solid var(--border)',
                    borderRadius: 12, padding: '16px 18px', display: 'flex', gap: 16, alignItems: 'flex-start',
                    transition: 'border-color .2s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = `${meta.color}55`)}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
                  >
                    <span style={{
                      fontSize: 22, fontWeight: 900, fontFamily: 'var(--font-mono)',
                      color: meta.color, flexShrink: 0, lineHeight: 1.1,
                    }}>{s.n}</span>
                    <div>
                      <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>{s.t}</h3>
                      <p style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.7 }}>{s.d}</p>
                    </div>
                  </div>
                ))}
              </div>

              <p style={{ ...lbl, marginBottom: 16, fontSize: 11 }}>WHAT YOU GET</p>
              <div style={{
                background: 'var(--bg2)', border: '1px solid var(--border)',
                borderRadius: 14, overflow: 'hidden',
              }}>
                {meta.principles.map((p, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 14,
                    padding: '13px 20px',
                    borderBottom: i < meta.principles.length - 1 ? '1px solid rgba(255,255,255,.04)' : 'none',
                  }}>
                    <span style={{ fontSize: 18, flexShrink: 0 }}>{p.icon}</span>
                    <p style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.5 }}>{p.text}</p>
                  </div>
                ))}
              </div>

              {/* Platform links */}
              <div style={{ marginTop: 20, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                {(['SOLANA', 'BSC', 'BASE'] as Chain[]).map(c => {
                  const m = CHAIN_META[c];
                  const active = c === chain;
                  return (
                    <a
                      key={c}
                      href={m.platformUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'block', padding: '10px 8px', textAlign: 'center',
                        background: active ? m.accent : 'var(--bg2)',
                        border: `1px solid ${active ? m.color : 'var(--border)'}`,
                        borderRadius: 8, textDecoration: 'none',
                        transition: 'all 0.2s',
                      }}
                    >
                      <div style={{ fontSize: 18, marginBottom: 4 }}>{m.icon}</div>
                      <div style={{ fontSize: 9, color: m.color, fontFamily: 'var(--font-mono)', letterSpacing: 1 }}>{c}</div>
                      <div style={{ fontSize: 9, color: 'var(--muted)', marginTop: 2 }}>{m.platform}</div>
                    </a>
                  );
                })}
              </div>

              <div style={{
                marginTop: 16, background: 'rgba(20,241,149,.04)',
                border: '1px solid rgba(20,241,149,.2)', borderRadius: 10, padding: '14px 18px',
              }}>
                <p style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.8 }}>
                  📱 Track via{' '}
                  <a href={TG_BOT} style={{ color: 'var(--green)' }}>@gadai_sol_bot</a>:&nbsp;
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--green)' }}>/mycoins</span>
                  {' '}·{' '}
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--green)' }}>/exitcoin TICKER</span>
                </p>
              </div>
            </div>

          </div>
        </div>
      </main>
    </>
  );
}
