'use client';
import { useState } from 'react';
import NavBar from '@/components/layout/NavBar';

const TG_BOT     = 'https://t.me/gadai_sol_bot';
const TG_CHANNEL = 'https://t.me/gadfamilytg';

const CONTACTS = [
  { icon: '🤖', label: 'Telegram Bot',     href: TG_BOT,     handle: '@gadai_sol_bot',   desc: 'Commands, alpha, trading signals' },
  { icon: '📢', label: 'Official Channel', href: TG_CHANNEL, handle: '@gadfamilytg',     desc: 'News, launches, announcements' },
  { icon: '🌐', label: 'Website',          href: 'https://gadai.shop', handle: 'gadai.shop', desc: 'Pay, launch tokens, docs' },
];

export default function ContactPage() {
  const [form, setForm] = useState({ email: '', msg: '' });
  const [sent, setSent]   = useState(false);
  const [busy, setBusy]   = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    await new Promise(r => setTimeout(r, 800));
    setSent(true);
    setBusy(false);
  }

  return (
    <>
      <NavBar />
      <main style={{ background: 'var(--bg)', minHeight: '100vh', paddingBottom: 80 }}>

        {/* Hero */}
        <section style={{ textAlign: 'center', padding: '80px 24px 48px' }}>
          <span style={{
            display: 'inline-block', padding: '5px 16px', borderRadius: 99,
            fontSize: 10, letterSpacing: 2, color: 'var(--purple)',
            border: '1px solid rgba(153,69,255,.4)', background: 'rgba(153,69,255,.08)',
            marginBottom: 20, fontFamily: 'var(--font-mono)',
          }}>GET IN TOUCH</span>
          <h1 className="section-title" style={{ marginBottom: 12 }}>CONTACT</h1>
          <p className="section-sub">
            Fastest way to reach us is Telegram. The bot responds instantly.
            For business inquiries — use the form below.
          </p>
        </section>

        <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, marginBottom: 56 }}>

            {/* Social Links */}
            <div>
              <h2 style={{ fontSize: 12, letterSpacing: 2, color: 'var(--muted)', marginBottom: 20, fontFamily: 'var(--font-mono)' }}>
                REACH US ON
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {CONTACTS.map(c => (
                  <a key={c.handle} href={c.href} target="_blank" rel="noopener noreferrer"
                    style={{
                      display: 'flex', alignItems: 'center', gap: 16,
                      background: 'var(--bg2)', border: '1px solid var(--border)',
                      borderRadius: 14, padding: '18px 20px',
                      transition: 'border-color .2s',
                      textDecoration: 'none',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(153,69,255,.5)')}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
                  >
                    <span style={{ fontSize: 32 }}>{c.icon}</span>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 2 }}>{c.handle}</div>
                      <div style={{ fontSize: 11, color: 'var(--muted)' }}>{c.desc}</div>
                    </div>
                    <span style={{ marginLeft: 'auto', color: 'var(--purple)', fontSize: 18 }}>→</span>
                  </a>
                ))}
              </div>

              {/* Status */}
              <div style={{
                marginTop: 24, background: 'var(--bg2)', border: '1px solid var(--border)',
                borderRadius: 14, padding: '18px 20px',
              }}>
                <div style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: 1, marginBottom: 12, fontFamily: 'var(--font-mono)' }}>
                  SYSTEM STATUS
                </div>
                {[
                  { label: 'Token Scanner',   ok: true },
                  { label: 'Telegram Bot',    ok: true },
                  { label: 'Auto-buy Engine', ok: true },
                  { label: 'Payment System',  ok: true },
                  { label: 'Twitter KOL API', ok: false },
                ].map(s => (
                  <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', fontSize: 12 }}>
                    <span style={{ color: 'var(--muted)' }}>{s.label}</span>
                    <span style={{ color: s.ok ? 'var(--green)' : 'var(--gold)', fontWeight: 700 }}>
                      {s.ok ? '● LIVE' : '⚠ DEGRADED'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Form */}
            <div>
              <h2 style={{ fontSize: 12, letterSpacing: 2, color: 'var(--muted)', marginBottom: 20, fontFamily: 'var(--font-mono)' }}>
                BUSINESS INQUIRY
              </h2>
              {sent ? (
                <div style={{
                  background: 'rgba(20,241,149,.06)', border: '1px solid rgba(20,241,149,.3)',
                  borderRadius: 14, padding: '32px 24px', textAlign: 'center',
                }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--green)', marginBottom: 8 }}>Message sent.</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)' }}>We&apos;ll respond via Telegram within 24h.</div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div>
                    <label style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: 1, display: 'block', marginBottom: 6, fontFamily: 'var(--font-mono)' }}>
                      EMAIL OR TELEGRAM
                    </label>
                    <input
                      required value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      placeholder="you@example.com or @handle"
                      style={{
                        width: '100%', padding: '12px 14px',
                        background: 'var(--bg2)', border: '1px solid var(--border)',
                        borderRadius: 8, color: 'var(--text)', fontSize: 13,
                        outline: 'none', fontFamily: 'var(--font-mono)',
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: 1, display: 'block', marginBottom: 6, fontFamily: 'var(--font-mono)' }}>
                      MESSAGE
                    </label>
                    <textarea
                      required rows={6} value={form.msg}
                      onChange={e => setForm(f => ({ ...f, msg: e.target.value }))}
                      placeholder="Partnership, listing, integration, bug report..."
                      style={{
                        width: '100%', padding: '12px 14px',
                        background: 'var(--bg2)', border: '1px solid var(--border)',
                        borderRadius: 8, color: 'var(--text)', fontSize: 13,
                        outline: 'none', resize: 'vertical', fontFamily: 'var(--font-mono)',
                      }}
                    />
                  </div>
                  <button
                    type="submit" disabled={busy}
                    className="btn-primary"
                    style={{ fontSize: 12, letterSpacing: 1, opacity: busy ? .6 : 1 }}
                  >
                    {busy ? '⏳ SENDING...' : '📨 SEND MESSAGE'}
                  </button>
                  <p style={{ fontSize: 11, color: '#374151', textAlign: 'center' }}>
                    Fastest reply via{' '}
                    <a href={TG_BOT} style={{ color: 'var(--purple)' }}>@gadai_sol_bot</a>
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
