'use client';
import NavBar from '@/components/layout/NavBar';

const TG_BOT = 'https://t.me/gadai_sol_bot';

const PLANS = [
  {
    slug: 'trial_1d',
    tier: 'DEGEN TRIAL',
    price: '0.05 SOL',
    period: '24 hours',
    icon: '🧪',
    color: '#9945FF',
    features: [
      'Full scanner access',
      'Whale alerts (unlimited)',
      'AI risk scores 0-100',
      'GAD Score + narrative',
      'Rug detector (9 flags)',
      'Market regime engine',
      'Lifecycle tracker',
    ],
    locked: ['Auto-buy (Jupiter)', 'Alpha Memory', 'X trend signals'],
    cta: '/pay?plan=trial_1d',
    badge: null,
  },
  {
    slug: 'trial_3d',
    tier: 'ALPHA TRIAL',
    price: '0.1 SOL',
    period: '72 hours',
    icon: '⚡',
    color: '#14F195',
    features: [
      'Everything in Degen Trial',
      'Alpha Engine (all 6 modules)',
      'Opportunity Engine',
      'Alpha Memory (100x similarity)',
      'Wallet Reputation system',
      'X Trend Pipeline signals',
      'Social monitor (KOL tracking)',
    ],
    locked: ['Auto-buy (Jupiter)'],
    cta: '/pay?plan=trial_3d',
    badge: 'TRY ALPHA',
  },
  {
    slug: 'monthly',
    tier: 'PRO CHAD',
    price: '1.0 SOL',
    period: '30 days',
    icon: '👑',
    color: '#FFD700',
    features: [
      'Everything in Alpha Trial',
      'Auto-buy via Jupiter DEX',
      'Bonding curve HOT sniper',
      'Portfolio P&L tracking',
      'Custom alert thresholds',
      'Priority alpha channel',
      'Real-time scanner (30s)',
      'Direct on-chain payment',
    ],
    locked: [],
    cta: '/pay?plan=monthly',
    badge: '🔥 MOST BASED',
  },
];

const COMPARE = [
  { label: 'Token Scanner',        trial: '✓', alpha: '✓', pro: '✓' },
  { label: 'Whale Alerts',         trial: '✓', alpha: '✓', pro: '✓' },
  { label: 'AI Risk Score 0-100',  trial: '✓', alpha: '✓', pro: '✓' },
  { label: 'Rug Detector',         trial: '✓', alpha: '✓', pro: '✓' },
  { label: 'Market Regime Engine', trial: '✓', alpha: '✓', pro: '✓' },
  { label: 'Lifecycle Tracker',    trial: '✓', alpha: '✓', pro: '✓' },
  { label: 'Opportunity Engine',   trial: '✗', alpha: '✓', pro: '✓' },
  { label: 'Alpha Memory (100x)',  trial: '✗', alpha: '✓', pro: '✓' },
  { label: 'Wallet Reputation',    trial: '✗', alpha: '✓', pro: '✓' },
  { label: 'X Trend Pipeline',     trial: '✗', alpha: '✓', pro: '✓' },
  { label: 'Auto-buy (Jupiter)',   trial: '✗', alpha: '✗', pro: '✓' },
  { label: 'HOT Sniper',          trial: '✗', alpha: '✗', pro: '✓' },
  { label: 'Portfolio P&L',        trial: '✗', alpha: '✗', pro: '✓' },
];

export default function PricingPage() {
  return (
    <>
      <NavBar />
      <main style={{ background: 'var(--bg)', minHeight: '100vh', paddingBottom: 80 }}>

        {/* Hero */}
        <section style={{ textAlign: 'center', padding: '80px 24px 56px', position: 'relative' }}>
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(153,69,255,.15) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />
          <span style={{
            display: 'inline-block', padding: '5px 16px', borderRadius: 99,
            fontSize: 10, letterSpacing: 2, color: 'var(--green)',
            border: '1px solid rgba(20,241,149,.4)', background: 'rgba(20,241,149,.08)',
            marginBottom: 20, fontFamily: 'var(--font-mono)',
          }}>PAID IN SOL · ON-CHAIN · NO KYC</span>
          <h1 className="section-title" style={{ marginBottom: 12 }}>CHOOSE YOUR TIER</h1>
          <p className="section-sub">
            Three access levels. Pay with Phantom or Solflare.
            Verified on-chain in seconds. No accounts. No subscriptions. Pure degen.
          </p>
        </section>

        {/* Plan Cards */}
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20, marginBottom: 64 }}>
            {PLANS.map(plan => (
              <div key={plan.slug} style={{
                background: 'var(--bg2)', border: `1px solid ${plan.slug === 'monthly' ? 'rgba(255,215,0,.4)' : 'var(--border)'}`,
                borderRadius: 20, padding: '32px 28px', display: 'flex',
                flexDirection: 'column', gap: 0, position: 'relative',
                boxShadow: plan.slug === 'monthly' ? '0 0 40px rgba(255,215,0,.1)' : 'none',
              }}>
                {plan.badge && (
                  <div style={{
                    position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)',
                    background: plan.slug === 'trial_3d' ? 'var(--green)' : 'linear-gradient(135deg, var(--purple), var(--gold))',
                    color: '#000', fontSize: 10, fontWeight: 900,
                    padding: '4px 16px', borderRadius: 99, letterSpacing: 1,
                    whiteSpace: 'nowrap', fontFamily: 'var(--font-mono)',
                  }}>{plan.badge}</div>
                )}
                <div style={{ fontSize: 40, marginBottom: 12 }}>{plan.icon}</div>
                <div style={{ fontSize: 11, color: plan.color, letterSpacing: 3, fontWeight: 700, marginBottom: 8, fontFamily: 'var(--font-mono)' }}>
                  {plan.tier}
                </div>
                <div style={{ fontSize: 38, fontWeight: 900, color: plan.color, lineHeight: 1, marginBottom: 4, fontFamily: 'var(--font-mono)' }}>
                  {plan.price}
                </div>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 24 }}>/ {plan.period}</div>

                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16, flex: 1 }}>
                  {plan.features.map(f => (
                    <li key={f} style={{ fontSize: 13, color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ color: 'var(--green)', fontWeight: 700, flexShrink: 0 }}>✓</span>{f}
                    </li>
                  ))}
                  {plan.locked.map(f => (
                    <li key={f} style={{ fontSize: 13, color: '#374151', display: 'flex', alignItems: 'center', gap: 8, opacity: .5 }}>
                      <span style={{ flexShrink: 0 }}>✗</span>{f}
                    </li>
                  ))}
                </ul>

                <a href={plan.cta} style={{
                  display: 'block', textAlign: 'center', padding: '14px',
                  background: plan.slug === 'monthly' ? 'linear-gradient(135deg, var(--purple), var(--gold))' :
                              plan.slug === 'trial_3d' ? 'var(--green)' : 'transparent',
                  border: plan.slug === 'trial_1d' ? '1px solid var(--border)' : 'none',
                  borderRadius: 10, fontSize: 12, fontWeight: 700, letterSpacing: 1,
                  color: plan.slug === 'trial_1d' ? 'var(--muted)' : '#000',
                  transition: 'opacity .2s', fontFamily: 'var(--font-mono)',
                }}>
                  {plan.slug === 'trial_1d' ? 'START FREE TRIAL →' :
                   plan.slug === 'trial_3d' ? 'TRY ALPHA 72H →' : 'GO PRO 🚀'}
                </a>
              </div>
            ))}
          </div>

          {/* Comparison Table */}
          <h2 className="section-title" style={{ marginBottom: 32 }}>FULL COMPARISON</h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-mono)', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <th style={{ textAlign: 'left', padding: '12px 16px', color: 'var(--muted)', fontWeight: 400, fontSize: 11, letterSpacing: 1 }}>FEATURE</th>
                  {['TRIAL 1D', 'ALPHA 3D', 'PRO 30D'].map((h, i) => (
                    <th key={h} style={{ padding: '12px 16px', color: ['var(--purple)', 'var(--green)', 'var(--gold)'][i], fontSize: 11, letterSpacing: 1 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARE.map((row, i) => (
                  <tr key={row.label} style={{ borderBottom: '1px solid rgba(42,42,53,.5)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,.015)' }}>
                    <td style={{ padding: '11px 16px', color: 'var(--muted)' }}>{row.label}</td>
                    {[row.trial, row.alpha, row.pro].map((v, j) => (
                      <td key={j} style={{ padding: '11px 16px', textAlign: 'center',
                        color: v === '✓' ? 'var(--green)' : '#374151', fontWeight: v === '✓' ? 700 : 400,
                      }}>{v}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Payment note */}
          <div style={{
            marginTop: 48, textAlign: 'center',
            background: 'rgba(153,69,255,.06)', border: '1px solid rgba(153,69,255,.2)',
            borderRadius: 16, padding: '28px 24px',
          }}>
            <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.8 }}>
              💳 Payment accepted via <strong style={{ color: 'var(--text)' }}>Phantom</strong> or{' '}
              <strong style={{ color: 'var(--text)' }}>Solflare</strong> wallet · On-chain SOL transfer ·
              Auto-verified in seconds · No accounts, no email, no KYC
            </p>
            <p style={{ fontSize: 11, color: '#374151', marginTop: 12 }}>
              Not financial advice. Degen responsibly.{' '}
              <a href={TG_BOT} style={{ color: 'var(--purple)' }}>@gadai_sol_bot</a>
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
