'use client';

import { useState, useRef } from 'react';
import NavBar from '@/components/layout/NavBar';

const API_BASE = '/api/proxy';
const TG_BOT   = 'https://t.me/gadai_sol_bot';

interface LaunchForm {
  name:        string;
  ticker:      string;
  description: string;
  devBuySol:   string;
  w2BuySol:    string;
  w3BuySol:    string;
}

const PRINCIPLES = [
  { icon: '🤖', text: 'GAD AI admin reviews & launches within minutes' },
  { icon: '📌', text: 'Logo uploaded to Pinata IPFS — permanent & decentralized' },
  { icon: '⛓️',  text: 'Token deployed on pump.fun via official SDK' },
  { icon: '🐋', text: 'Staggered 3-wallet buy: organic & undetectable' },
  { icon: '📡', text: 'Telegram notification on launch confirmation' },
  { icon: '✅', text: 'No fake volume. No coordinated insider buys.' },
];

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
  const [form, setForm] = useState<LaunchForm>({
    name: '', ticker: '', description: '',
    devBuySol: '0.10', w2BuySol: '0.05', w3BuySol: '0.03',
  });
  const [image, setImage]               = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [status, setStatus]             = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError]               = useState('');
  const [submitId, setSubmitId]         = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

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
            <div style={{ fontSize: 72, marginBottom: 20, lineHeight: 1 }}>🚀</div>
            <h1 style={{ fontSize: 28, fontWeight: 900, color: 'var(--green)', fontFamily: 'var(--font-mono)', letterSpacing: 2, marginBottom: 16 }}>QUEUED</h1>
            <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.9, marginBottom: 24 }}>
              Your token idea has been submitted. GAD AI team reviews and launches within minutes.{' '}
              Watch <a href={TG_BOT} style={{ color: 'var(--purple)' }}>@gadai_sol_bot</a> for the launch TX.
            </p>
            {submitId && (
              <p style={{ fontSize: 10, color: 'var(--border)', fontFamily: 'var(--font-mono)', marginBottom: 28, letterSpacing: 1 }}>
                SUBMISSION ID: {submitId}
              </p>
            )}
            <button
              onClick={() => {
                setStatus('idle'); setImage(null); setImagePreview(null);
                setForm({ name: '', ticker: '', description: '', devBuySol: '0.10', w2BuySol: '0.05', w3BuySol: '0.03' });
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

  const totalSol = (Number(form.devBuySol) + Number(form.w2BuySol) + Number(form.w3BuySol)).toFixed(2);

  return (
    <>
      <NavBar />
      <main style={{ background: 'var(--bg)', minHeight: '100vh', paddingBottom: 80 }}>

        {/* Hero */}
        <section style={{ textAlign: 'center', padding: '80px 24px 56px', position: 'relative', overflow: 'hidden' }}>
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(153,69,255,.18) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />
          <span style={{
            display: 'inline-block', padding: '5px 18px', borderRadius: 99,
            fontSize: 10, letterSpacing: 2, color: 'var(--purple)',
            border: '1px solid rgba(153,69,255,.5)', background: 'rgba(153,69,255,.1)',
            marginBottom: 24, fontFamily: 'var(--font-mono)',
          }}>PUMP.FUN LAUNCHER</span>
          <h1 className="section-title" style={{ marginBottom: 16 }}>🚀 LAUNCH YOUR TOKEN</h1>
          <p className="section-sub" style={{ maxWidth: 560, margin: '0 auto' }}>
            Create your Solana meme token on pump.fun in minutes.
            Fill the form — GAD AI handles IPFS upload, deploy, and 3-wallet staggered buy.
          </p>
        </section>

        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 40 }}>

            {/* ─── Form ─── */}
            <div>
              <p style={{ ...lbl, marginBottom: 24, fontSize: 11 }}>TOKEN DETAILS</p>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

                {/* Name */}
                <div>
                  <label style={lbl}>Token Name * <span style={{ opacity: .4 }}>(max 30)</span></label>
                  <input
                    type="text" maxLength={30} value={form.name}
                    onChange={e => handleField('name', e.target.value)}
                    placeholder="e.g. Moon Dog"
                    style={inp}
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
                      style={{ ...inp, paddingLeft: 28 }}
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label style={lbl}>Description * <span style={{ opacity: .4 }}>(max 500)</span></label>
                  <textarea
                    rows={4} maxLength={500} value={form.description}
                    onChange={e => handleField('description', e.target.value)}
                    placeholder="The meme behind the next moonshot. Dogs going to the moon..."
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
                      border: '2px dashed var(--border)', borderRadius: 12, padding: '28px 20px',
                      textAlign: 'center', cursor: 'pointer', transition: 'border-color .2s, background .2s',
                      background: 'var(--bg2)',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = 'var(--purple)';
                      e.currentTarget.style.background = 'rgba(153,69,255,.05)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = 'var(--border)';
                      e.currentTarget.style.background = 'var(--bg2)';
                    }}
                  >
                    {imagePreview ? (
                      <div>
                        <img src={imagePreview} alt="preview" style={{ height: 80, width: 80, objectFit: 'cover', borderRadius: 10, margin: '0 auto 8px' }} />
                        <p style={{ fontSize: 11, color: 'var(--green)', fontFamily: 'var(--font-mono)' }}>✓ {image?.name}</p>
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
                  <label style={lbl}>Dev Buy Strategy <span style={{ opacity: .4 }}>(SOL per wallet)</span></label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                    {([
                      { label: 'W1 DEV', key: 'devBuySol' as const, hint: 'instant' },
                      { label: 'W2 +12MIN', key: 'w2BuySol' as const, hint: 'organic' },
                      { label: 'W3 +28MIN', key: 'w3BuySol' as const, hint: 'organic' },
                    ] as const).map(({ label: lbl2, key, hint }) => (
                      <div key={key}>
                        <p style={{ ...lbl, marginBottom: 5 }}>{lbl2}</p>
                        <input
                          type="number" step="0.01" min="0" max="10"
                          value={form[key]}
                          onChange={e => handleField(key, e.target.value)}
                          style={{ ...inp, padding: '10px 10px' }}
                        />
                        <p style={{ fontSize: 10, color: 'var(--muted)', marginTop: 3, opacity: .4 }}>{hint}</p>
                      </div>
                    ))}
                  </div>
                  <div style={{
                    marginTop: 10, padding: '8px 12px', background: 'rgba(153,69,255,.06)',
                    border: '1px solid rgba(153,69,255,.2)', borderRadius: 6,
                  }}>
                    <p style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>
                      TOTAL COMMITMENT: <span style={{ color: 'var(--purple)', fontWeight: 700 }}>~{totalSol} SOL</span>
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
                    background: status === 'loading' ? 'var(--bg2)' : 'linear-gradient(135deg, var(--purple), #7b2ff7)',
                    color: '#fff', fontSize: 12, fontWeight: 900, letterSpacing: 2,
                    cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                    fontFamily: 'var(--font-mono)', opacity: status === 'loading' ? .5 : 1,
                    transition: 'opacity .2s, transform .1s',
                    boxShadow: status !== 'loading' ? '0 0 20px rgba(153,69,255,.3)' : 'none',
                  }}
                >
                  {status === 'loading' ? '⏳ SUBMITTING...' : '🚀 SUBMIT FOR LAUNCH'}
                </button>
                <p style={{ textAlign: 'center', fontSize: 11, color: 'var(--muted)', opacity: .4, lineHeight: 1.6 }}>
                  Team reviews in minutes and launches on pump.fun.<br />Telegram notification on launch.
                </p>
              </form>
            </div>

            {/* ─── Info ─── */}
            <div>
              <p style={{ ...lbl, marginBottom: 24, fontSize: 11 }}>HOW IT WORKS</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 36 }}>
                {[
                  { n: '01', t: 'Fill the form', d: 'Name, ticker (max 8), description, logo. Choose dev buy amounts across 3 wallets for organic chart.' },
                  { n: '02', t: 'Submit to queue', d: 'Your idea queues for review. GAD AI uploads logo to Pinata IPFS, creates metadata JSON.' },
                  { n: '03', t: 'Auto-Launch on pump.fun', d: 'Token deployed via pumpdotfun-sdk. W1 buys instantly, W2 +12min, W3 +28min — staggered timing.' },
                  { n: '04', t: 'Track & Sell', d: 'Monitor via /mycoins in @gadai_sol_bot. Sell your dev position when ready with /exitcoin TICKER.' },
                ].map(s => (
                  <div key={s.n} style={{
                    background: 'var(--bg2)', border: '1px solid var(--border)',
                    borderRadius: 12, padding: '16px 18px', display: 'flex', gap: 16, alignItems: 'flex-start',
                    transition: 'border-color .2s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(153,69,255,.4)')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
                  >
                    <span style={{
                      fontSize: 22, fontWeight: 900, fontFamily: 'var(--font-mono)',
                      color: 'var(--purple)', flexShrink: 0, lineHeight: 1.1,
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
                {PRINCIPLES.map((p, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 14,
                    padding: '13px 20px',
                    borderBottom: i < PRINCIPLES.length - 1 ? '1px solid rgba(255,255,255,.04)' : 'none',
                  }}>
                    <span style={{ fontSize: 18, flexShrink: 0 }}>{p.icon}</span>
                    <p style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.5 }}>{p.text}</p>
                  </div>
                ))}
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
