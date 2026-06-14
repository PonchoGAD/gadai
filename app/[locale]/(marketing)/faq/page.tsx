'use client';
import { useState } from 'react';
import NavBar from '@/components/layout/NavBar';

const TG_BOT = 'https://t.me/gadai_sol_bot';

const FAQS = [
  {
    q: 'What is GAD AI Terminal?',
    a: 'A real-time Solana memecoin intelligence platform in Telegram. It scans 14K+ tokens every 30 seconds, tracks whale wallets, detects rug pulls with 9 risk flags, scores tokens 0-100 with AI, and monitors market regime (BULL/BEAR/FEAR/EUPHORIA) to help you ape smarter.',
  },
  {
    q: 'How do I get access?',
    a: 'Open @gadai_sol_bot in Telegram → use /start → pay with Phantom or Solflare on gadai.shop/pay. On-chain SOL transfer, verified automatically within seconds. No accounts, no email, no KYC.',
  },
  {
    q: 'What\'s the difference between the plans?',
    a: 'Trial 1D (0.05 SOL) gives full scanner access for 24h. Alpha 3D (0.1 SOL) adds the Alpha Engine — Opportunity Engine, Alpha Memory, Wallet Reputation, and X Trend signals for 72h. PRO (1 SOL/month) includes everything plus auto-buy via Jupiter DEX and HOT bonding curve sniper.',
  },
  {
    q: 'Is auto-buy safe? What are the risks?',
    a: 'Auto-buy executes real transactions on Solana with your wallet keys held on the VPS. It uses strict filters: liquidity range, market regime gating, momentum checks, and stop-loss. In EXTREME FEAR (F&G < 13) all buys pause automatically. Still — memecoin trading is high risk. DYOR.',
  },
  {
    q: 'What is the Alpha Memory feature?',
    a: 'It compares every new token to a database of historical 100x winners using cosine similarity across 12 metrics. Example output: "82% similar to BONK at launch stage." Helps identify tokens with similar early patterns to previous moonshots.',
  },
  {
    q: 'What is the Market Regime Engine?',
    a: 'Uses Fear & Greed Index (alternative.me) updated every 30 minutes. Regimes: EXTREME_FEAR (F&G<13) → pause buys, FEAR (13-45) → contrarian buy zone with tight filters, NEUTRAL (45-60) → standard mode, BULL (60-80) → higher targets, EUPHORIA (>80) → caution. TP targets adjust per regime.',
  },
  {
    q: 'Why did my payment not go through?',
    a: 'Transaction verification retries up to 6 times (1-16 seconds). If it still fails: (1) Check Solscan that the TX is confirmed, (2) Wait 30s and try again, (3) Make sure you\'re sending to the correct treasury wallet, (4) The RPC might be congested — retry in 1-2 minutes.',
  },
  {
    q: 'What is the X Trend Pipeline?',
    a: 'Every 15 minutes, the social-monitor scans Twitter/X trends (or falls back to GDELT news clusters if Twitter API is unavailable). It detects crypto narratives (AI_AGENT, DOG, PEPE, ANIME, TRUMP, etc.) and finds a matching Solana coin on DexScreener. Alert sent to admin Telegram.',
  },
  {
    q: 'Can I launch my own token?',
    a: 'Yes! Use gadai.shop/launcher — fill in name, ticker, description, logo. Submit to queue → GAD AI admin reviews within minutes → token deployed on pump.fun with staggered 3-wallet buy for organic chart. No Phantom needed from your side.',
  },
  {
    q: 'What wallets are supported for payment?',
    a: 'Phantom and Solflare (browser extensions). The payment page detects them automatically. No hardware wallets at the moment.',
  },
  {
    q: 'How do I link my wallet to Telegram?',
    a: 'Two ways: (1) Use /link <wallet_address> in the bot, or (2) Pay via gadai.shop/pay?tg_id=<your_id> — it auto-links on successful payment. Find your Telegram ID via @userinfobot.',
  },
  {
    q: 'Is there a free tier?',
    a: 'The bot has a free mode — you get basic scanner output, 3 whale alerts/day, and AI risk scores. No Alpha Engine, no regime gating, no lifecycle tracker. Start with /start in @gadai_sol_bot.',
  },
];

export default function FAQPage() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <>
      <NavBar />
      <main style={{ background: 'var(--bg)', minHeight: '100vh', paddingBottom: 80 }}>

        {/* Hero */}
        <section style={{ textAlign: 'center', padding: '80px 24px 56px', position: 'relative' }}>
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse 50% 40% at 50% 0%, rgba(20,241,149,.1) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />
          <span style={{
            display: 'inline-block', padding: '5px 16px', borderRadius: 99,
            fontSize: 10, letterSpacing: 2, color: 'var(--green)',
            border: '1px solid rgba(20,241,149,.4)', background: 'rgba(20,241,149,.08)',
            marginBottom: 20, fontFamily: 'var(--font-mono)',
          }}>FREQUENTLY ASKED</span>
          <h1 className="section-title" style={{ marginBottom: 12 }}>
            FAQ / RTFM
          </h1>
          <p className="section-sub">
            Everything you need to know. If it&apos;s not here — ask in{' '}
            <a href={TG_BOT} style={{ color: 'var(--purple)' }}>@gadai_sol_bot</a>.
          </p>
        </section>

        {/* FAQ Accordion */}
        <div style={{ maxWidth: 780, margin: '0 auto', padding: '0 24px' }}>
          {FAQS.map((item, i) => (
            <div key={i} style={{
              borderBottom: '1px solid var(--border)',
              overflow: 'hidden',
            }}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                style={{
                  width: '100%', display: 'flex', justifyContent: 'space-between',
                  alignItems: 'center', padding: '20px 0', background: 'none', border: 'none',
                  cursor: 'pointer', textAlign: 'left', gap: 16,
                  fontFamily: 'var(--font-mono)',
                }}
              >
                <span style={{ fontSize: 13, fontWeight: 700, color: open === i ? 'var(--green)' : 'var(--text)', lineHeight: 1.4 }}>
                  <span style={{ color: 'var(--purple)', marginRight: 10, fontWeight: 900 }}>{String(i + 1).padStart(2, '0')}.</span>
                  {item.q}
                </span>
                <span style={{
                  color: open === i ? 'var(--green)' : 'var(--muted)',
                  fontSize: 20, flexShrink: 0, transition: 'transform .2s',
                  transform: open === i ? 'rotate(45deg)' : 'none',
                }}>+</span>
              </button>
              {open === i && (
                <div style={{
                  padding: '0 0 20px 32px',
                  fontSize: 13, color: 'var(--muted)', lineHeight: 1.8,
                  borderLeft: '2px solid rgba(20,241,149,.3)',
                  marginLeft: 2,
                }}>
                  {item.a}
                </div>
              )}
            </div>
          ))}

          {/* Bottom CTA */}
          <div style={{ marginTop: 56, textAlign: 'center' }}>
            <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 24 }}>
              Still confused? Just open the bot. It explains itself.
            </p>
            <a href={TG_BOT} target="_blank" rel="noopener noreferrer" className="btn-primary">
              🤖 OPEN @gadai_sol_bot
            </a>
          </div>
        </div>
      </main>
    </>
  );
}
