'use client';

import { useEffect, useState, useRef, lazy, Suspense } from 'react';
const LiveDashboard = lazy(() => import('./components/LiveDashboard'));

const TG_BOT     = 'https://t.me/gadai_sol_bot';
const TG_CHANNEL = 'https://t.me/gadfamilytg';

const TERMINAL_LINES = [
  '> Scanning 14,293 tokens across Solana / Base / BSC / TON...',
  '> [REGIME] SIDEWAYS — wait for breakouts 📊',
  '> [WHALE] BONK: wallet 7xKp bought $420K 🐳',
  '> [BASE] PEPE/ETH → +38%/1h liq $24K — buying 0.001 ETH ⚡',
  '> [BSC] MOON/BNB → +51%/1h score:76 — entry 0.003 BNB 🟡',
  '> [TON] DOGS/TON → +53%/1h via STON.fi — entry 5 TON 💎',
  '> [RAYDIUM] $MOON — early window, score 87/100 🎯',
  '> [COPY] @whale_7xKp bought 0.5 SOL of $PEPE — mirroring...',
  '> [ALPHA] 82% similar to 5 previous 50x winners 🧠',
  '> [RUG] ALERT dev wallet moving — caution ⚠️',
  '> [REPUTATION] Buyer: LEGEND wallet (72% win rate) 👑',
  '> [BASE] UniV2 buy confirmed → entry $0.000142 ✅',
  '> [BSC] Pancake scan: DOGE/BNB tax:3%/3% safe:81 — PASS',
  '> [TON] STON.fi scan: 156 Jettons · 4 passed all filters',
  '> AI analysis: BULLISH signal detected',
  '> Portfolio P&L today: +69% 📈',
];

const TICKER = [
  '🔥 BONK +420%', '💎 WIF +69%', '🌙 PEPE +1337%',
  '🚀 MOON +228%', '🔵 BASE +38%', '🟡 BSC +51%',
  '💎 TON +53%', '⚓ DOGS/TON via STON.fi',
  '📊 AI SCAN LIVE', '⚡ SOLANA SPEED', '🎯 NGMI → WAGMI',
  '🔫 RUG DETECTED', '🌡️ REGIME: SIDEWAYS', '🧠 ALPHA MEMORY',
  '🔄 COPY-TRADE ON', '👑 LEGEND WALLET', '📡 KOL SIGNAL',
  '4 CHAINS · 1 BOT',
];

const FEATURES = [
  { icon: '📡', title: 'REAL-TIME SCANNER', desc: 'Scans 14K+ tokens every 30s across Solana, Base, and BSC. Know about new gems before CT does.' },
  { icon: '🐋', title: 'WHALE TRACKER',     desc: 'Big wallets move, you know instantly. Ape alongside the smart money. $5K+ moves tracked live.' },
  { icon: '🤖', title: 'AI RISK SCORE',     desc: 'GAD Score 0–100. 6 weighted factors: momentum, liquidity, rug risk, narrative, social, survival.' },
  { icon: '🔄', title: 'COPY TRADING',      desc: 'Mirror top Solana wallets automatically. Helius polls every 5s — copies buys via Jupiter. 1.30x→3x TP.' },
  { icon: '📊', title: 'MULTI-CHAIN PnL',   desc: 'Track Solana, Base ETH, and BSC BNB positions in one terminal. See your gains. Accept your losses.' },
  { icon: '🚨', title: 'INSTANT ALERTS',    desc: 'Price pumps, whale buys, rug signals straight to Telegram. Sub-second delivery, zero delay.' },
];

const ALPHA_FEATURES = [
  {
    icon: '🌡️',
    title: 'MARKET REGIME ENGINE',
    desc: 'Auto-detects BULL / BEAR / SIDEWAYS / EUPHORIA / PANIC from CoinGecko + Fear&Greed. In FEAR mode it buys the dip — contrarian edge.',
    tag: 'LIVE',
  },
  {
    icon: '🔄',
    title: 'MEME LIFECYCLE TRACKER',
    desc: 'Every token has a lifecycle: BIRTH → ACCUMULATION → BREAKOUT → HYPE → DISTRIBUTION → DEATH. Know exactly where a coin is.',
    tag: 'LIVE',
  },
  {
    icon: '🎯',
    title: 'OPPORTUNITY ENGINE',
    desc: 'Finds tokens BEFORE they move. Narrative momentum + pre-breakout volume + whale accumulation = early alpha window.',
    tag: 'LIVE',
  },
  {
    icon: '🧠',
    title: 'ALPHA MEMORY',
    desc: 'Compares every new token to historical 100x winners using cosine similarity. "This token is 82% similar to 5 previous 50x gems."',
    tag: 'LIVE',
  },
  {
    icon: '👑',
    title: 'WALLET REPUTATION',
    desc: 'Classifies wallets as LEGEND / SMART / AVERAGE / TOURIST / EXIT_LIQUIDITY. Know if whales buying are actually smart money.',
    tag: 'LIVE',
  },
  {
    icon: '📡',
    title: 'SOCIAL MONITOR',
    desc: 'Real-time KOL tracking on Twitter/X + Telegram channels. Detects when influencers mention tokens before the herd arrives.',
    tag: 'LIVE',
  },
];

const BOT_NETWORKS = [
  {
    icon: '🟣',
    chain: 'SOLANA',
    color: '#9945FF',
    label: 'Auto-buy via Jupiter',
    desc: 'Raydium DexScreener scanner. Market-regime-aware entries. MOVERS bonding curve scalper. Copy-trading via Helius. 5 TP tiers.',
    stats: ['Raydium scanner', 'MOVERS scalper', 'Copy-trader', 'Jupiter DEX'],
  },
  {
    icon: '🔵',
    chain: 'BASE',
    color: '#0052ff',
    label: 'Auto-buy via Uniswap V2/V3',
    desc: 'Scans meme tokens on Uniswap V2 + V3 + Aerodrome. Safety score, honeypot check. Trailing stop + 2-stage TP. 0.001 ETH per trade.',
    stats: ['Uniswap V2/V3', 'Aerodrome V2', 'Safety score', 'Auto-sell'],
  },
  {
    icon: '🟡',
    chain: 'BSC',
    color: '#f0b90b',
    label: 'Auto-buy via PancakeSwap',
    desc: 'BSC meme scanner via PancakeSwap. Tax-aware stop-loss (buy+sell tax in formula). Honeypot check. Anti-dump B/S ratio filter.',
    stats: ['PancakeSwap V2', 'Tax-aware stops', 'Honeypot check', 'Auto-sell'],
  },
  {
    icon: '💎',
    chain: 'TON',
    color: '#0098ea',
    label: 'Auto-buy via STON.fi',
    desc: 'TON Network Jetton scanner via GeckoTerminal + DexScreener. Buys/sells via STON.fi v1 router. tonapi.io safety checks. 5-stage TP levels.',
    stats: ['STON.fi v1', 'tonapi.io safety', 'WalletV4', 'Auto-sell'],
  },
];

const STEPS = [
  { num: '01', title: 'OPEN THE BOT',      desc: 'Hit /start in @gadai_sol_bot. Takes 10 seconds. Less time than your last rug.' },
  { num: '02', title: 'LINK YOUR WALLET',  desc: 'Use /link to connect your Solana wallet. Unlock subscription and wallet reputation tracking.' },
  { num: '03', title: 'PROFIT (hopefully)', desc: 'Get regime-aware alerts, copy whale trades, track lifecycle stages, scan 3 chains. WAGMI.' },
];

const STATS = [
  { value: '4',       label: 'Chains Scanned' },
  { value: '14,293',  label: 'Tokens Tracked' },
  { value: '847',     label: 'Rugs Avoided' },
  { value: '7',       label: 'Alpha Engines' },
];

function seededRand(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function MatrixBg() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className="matrix-bg" aria-hidden>
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="matrix-col"
          style={{
            left: `${i * 5 + 2}%`,
            animationDuration: `${6 + (i % 7)}s`,
            animationDelay: `${(i * 0.7) % 5}s`,
          }}
        >
          {Array.from({ length: 30 }).map((_, j) => (
            <div key={j}>{seededRand(i * 30 + j) > 0.5 ? '1' : '0'}</div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default function HomePage() {
  const [termLines, setTermLines] = useState([TERMINAL_LINES[0]]);
  const termRef = useRef<HTMLDivElement>(null);
  const idxRef  = useRef(0);

  useEffect(() => {
    const t = setInterval(() => {
      idxRef.current = (idxRef.current + 1) % TERMINAL_LINES.length;
      setTermLines(prev => [...prev, TERMINAL_LINES[idxRef.current]].slice(-8));
    }, 1200);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (termRef.current) termRef.current.scrollTop = termRef.current.scrollHeight;
  }, [termLines]);

  const tickerDouble = [...TICKER, ...TICKER];

  return (
    <>
      <MatrixBg />

      {/* NAV */}
      <nav className="nav">
        <div className="nav-logo">GAD<span>AI</span> TERMINAL</div>
        <div className="nav-links">
          <a href="#features" className="nav-link">FEATURES</a>
          <a href="#bots"     className="nav-link">BOT NETWORKS</a>
          <a href="#alpha"    className="nav-link">ALPHA ENGINE</a>
          <a href="#launch"   className="nav-link" style={{ color: '#14F195' }}>LAUNCH</a>
          <a href="#pricing"  className="nav-link">PRICING</a>
        </div>
        <a href={TG_BOT} target="_blank" rel="noopener noreferrer" className="nav-cta">
          ▶ OPEN BOT
        </a>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div className="hero-badge">⚡ LIVE ON SOLANA · BASE · BSC · TON — 4 CHAINS, 1 BOT</div>
          <div className="pixel-bot">🤖</div>
          <h1 className="hero-title">
            THE <span className="accent">MULTI-CHAIN</span><br />
            DEGEN <span className="accent2">TERMINAL</span>
          </h1>
          <p className="hero-sub">
            Scan meme coins on <strong>Solana, Base, BSC &amp; TON</strong>. Track whale wallets.<br />
            Copy-trade top wallets. Get AI risk scores. Detect rugs.<br />
            <strong>All in your Telegram. All for free to start.</strong>
          </p>
          <div className="hero-btns">
            <a href={TG_BOT}     target="_blank" rel="noopener noreferrer" className="btn-primary">
              🚀 OPEN @gadai_sol_bot
            </a>
            <a href={TG_CHANNEL} target="_blank" rel="noopener noreferrer" className="btn-secondary">
              📢 JOIN CHANNEL
            </a>
            <a href="/launcher" className="btn-secondary" style={{ borderColor: '#14F195', color: '#14F195' }}>
              🪙 LAUNCH TOKEN
            </a>
          </div>

          {/* TERMINAL DEMO */}
          <div className="terminal-wrap">
            <div className="terminal-bar">
              <div className="t-dot t-red" /><div className="t-dot t-yellow" /><div className="t-dot t-green" />
              <span style={{ marginLeft: 8 }}>gadai_sol_bot — 3-chain scanner live</span>
            </div>
            <div className="terminal" ref={termRef}>
              {termLines.map((line, i) => <div key={i} className="t-line">{line}</div>)}
              <div className="t-line"><span className="t-cursor" /></div>
            </div>
          </div>
        </div>
      </section>

      {/* TICKER */}
      <div className="ticker-wrap">
        <div className="ticker-track">
          {tickerDouble.map((item, i) => <span key={i} className="ticker-item">{item}</span>)}
        </div>
      </div>

      {/* LIVE DASHBOARD */}
      <Suspense fallback={null}>
        <LiveDashboard />
      </Suspense>

      {/* CORE FEATURES */}
      <section className="section" id="features" style={{ background: 'rgba(153,69,255,.03)' }}>
        <div className="container">
          <h2 className="section-title">WHAT THE BOT DOES</h2>
          <p className="section-sub">
            Six core tools that would have saved your bags last bull run. Not financial advice. Just vibes and algorithms.
          </p>
          <div className="features-grid">
            {FEATURES.map(f => (
              <div key={f.title} className="feature-card">
                <span className="feature-icon">{f.icon}</span>
                <div className="feature-title">{f.title}</div>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            {STATS.map(s => (
              <div key={s.label} className="stat-box">
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BOT NETWORKS — new section */}
      <section className="section" id="bots" style={{ background: 'rgba(20,241,149,.02)' }}>
        <div className="container">
          <h2 className="section-title">BOT NETWORKS</h2>
          <p className="section-sub">
            Three independent auto-traders scanning different chains 24/7. One bot, one Telegram, three opportunities.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginTop: 32 }}>
            {BOT_NETWORKS.map(n => (
              <div key={n.chain} style={{
                background: '#0d0d18',
                border: `1px solid ${n.color}33`,
                borderTop: `3px solid ${n.color}`,
                padding: '24px 20px',
                borderRadius: 2,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <span style={{ fontSize: 24 }}>{n.icon}</span>
                  <div>
                    <div style={{ fontFamily: 'var(--font-pixel)', fontSize: 11, color: n.color, letterSpacing: 2 }}>{n.chain}</div>
                    <div style={{ fontSize: 11, color: '#555570', marginTop: 2 }}>{n.label}</div>
                  </div>
                </div>
                <p style={{ fontSize: 12, color: '#888', lineHeight: 1.7, marginBottom: 16 }}>{n.desc}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {n.stats.map(s => (
                    <span key={s} style={{
                      fontSize: 10, padding: '3px 8px',
                      border: `1px solid ${n.color}44`,
                      color: n.color, borderRadius: 2,
                    }}>{s}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <p style={{ textAlign: 'center', marginTop: 24, fontSize: 11, color: '#555570' }}>
            All bots run 24/7 on VPS · Telegram commands: /basestatus /bscstatus /tonstatus /bot /copywallets
          </p>
        </div>
      </section>

      {/* ALPHA ENGINE */}
      <section className="section" id="alpha" style={{ background: 'rgba(153,69,255,.03)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 8 }}>
            <span style={{
              display: 'inline-block',
              background: 'rgba(20,241,149,0.15)',
              color: 'var(--green)',
              border: '1px solid var(--green)',
              borderRadius: 4,
              padding: '4px 12px',
              fontSize: 10,
              fontFamily: 'var(--font-pixel)',
              letterSpacing: 2,
            }}>ALPHA ENGINE v2 — LIVE</span>
          </div>
          <h2 className="section-title">THE ALPHA ENGINE</h2>
          <p className="section-sub">
            Six intelligence modules. The same tools hedge funds use. Now in your Telegram.
          </p>
          <div className="features-grid">
            {ALPHA_FEATURES.map(f => (
              <div key={f.title} className="feature-card" style={{ border: '1px solid rgba(20,241,149,0.3)', position: 'relative' }}>
                <span style={{
                  position: 'absolute', top: 12, right: 12,
                  background: 'var(--green)', color: '#000',
                  fontSize: 9, padding: '2px 6px', borderRadius: 3,
                  fontFamily: 'var(--font-pixel)',
                }}>{f.tag}</span>
                <span className="feature-icon">{f.icon}</span>
                <div className="feature-title">{f.title}</div>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section" id="how">
        <div className="container">
          <h2 className="section-title">HOW IT WORKS</h2>
          <p className="section-sub">
            Three steps. Less effort than explaining to your parents what a meme coin is.
          </p>
          <div className="steps">
            {STEPS.map(s => (
              <div key={s.num} className="step">
                <div className="step-num">{s.num}</div>
                <div>
                  <div className="step-title">{s.title}</div>
                  <p className="step-desc">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LAUNCH */}
      <section className="section" id="launch" style={{ background: 'rgba(20,241,149,.02)' }}>
        <div className="container">
          <h2 className="section-title">LAUNCH YOUR TOKEN</h2>
          <p className="section-sub">
            Deploy meme coins on 3 chains in minutes. GAD AI handles IPFS, deploy, and staggered 3-wallet buy.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginTop: 36 }}>
            {[
              {
                icon: '🟣', chain: 'SOLANA', color: '#9945FF',
                platform: 'pump.fun', platformUrl: 'https://pump.fun',
                unit: 'SOL', badge: 'FULLY AUTOMATED',
                desc: 'Full automation via pumpdotfun-sdk. Pinata IPFS metadata. 3-wallet staggered buy (instant / +12min / +28min). Sub-minute launch.',
                features: ['Pinata IPFS', 'pumpdotfun-sdk', '3-wallet buy', 'Raydium graduation'],
              },
              {
                icon: '🟡', chain: 'BSC', color: '#F0B90B',
                platform: '4meme.fun', platformUrl: 'https://4meme.fun',
                unit: 'BNB', badge: '4MEME LAUNCH',
                desc: 'Submit your token idea — GAD AI launches on 4meme.fun bonding curve. Dev buy sets the first candle. PancakeSwap on graduation.',
                features: ['4meme.fun', 'Dev buy', 'PancakeSwap', 'BSC chain'],
              },
              {
                icon: '🔵', chain: 'BASE', color: '#0052FF',
                platform: 'clank.fun', platformUrl: 'https://clank.fun',
                unit: 'ETH', badge: 'BASE LAUNCH',
                desc: 'Submit your token idea — GAD AI launches on clank.fun bonding curve on Base. Dev buy creates organic first candle. Uniswap V2 on graduation.',
                features: ['clank.fun', 'Dev buy', 'Uniswap V2', 'Base chain'],
              },
              {
                icon: '💎', chain: 'TON', color: '#0098EA',
                platform: 'tonco.io', platformUrl: 'https://tonco.io',
                unit: 'TON', badge: 'TON LAUNCH',
                desc: 'Submit your token idea — GAD AI deploys Jetton on TON Network. Liquidity seeded on STON.fi. Dev buy creates the first candle on TON explorer.',
                features: ['TON Jetton', 'STON.fi LP', 'Dev buy', 'tonapi.io check'],
              },
            ].map(n => (
              <div key={n.chain} style={{
                background: '#0d0d18',
                border: `1px solid ${n.color}33`,
                borderTop: `3px solid ${n.color}`,
                padding: '24px 20px',
                borderRadius: 2,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <span style={{ fontSize: 24 }}>{n.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'var(--font-pixel)', fontSize: 11, color: n.color, letterSpacing: 2 }}>{n.chain}</div>
                    <div style={{ fontSize: 10, color: '#555570', marginTop: 2 }}>via {n.platform}</div>
                  </div>
                  <span style={{
                    fontSize: 9, padding: '2px 7px',
                    background: `${n.color}22`, color: n.color,
                    border: `1px solid ${n.color}44`, borderRadius: 3,
                    fontFamily: 'var(--font-pixel)',
                  }}>{n.badge}</span>
                </div>
                <p style={{ fontSize: 12, color: '#888', lineHeight: 1.7, marginBottom: 14 }}>{n.desc}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 18 }}>
                  {n.features.map(f => (
                    <span key={f} style={{
                      fontSize: 10, padding: '3px 8px',
                      border: `1px solid ${n.color}44`,
                      color: n.color, borderRadius: 2,
                    }}>{f}</span>
                  ))}
                </div>
                <a
                  href={`/launcher?chain=${n.chain}`}
                  style={{
                    display: 'block', textAlign: 'center',
                    padding: '10px', borderRadius: 6,
                    background: `${n.color}22`,
                    border: `1px solid ${n.color}55`,
                    color: n.color, fontSize: 11,
                    fontFamily: 'var(--font-pixel)',
                    letterSpacing: 1, textDecoration: 'none',
                  }}
                >
                  🚀 LAUNCH ON {n.chain}
                </a>
              </div>
            ))}
          </div>
          <p style={{ textAlign: 'center', marginTop: 28, fontSize: 12, color: '#555570' }}>
            Submit via the form — GAD AI team handles launch within minutes.
            Track via <a href="https://t.me/gadai_sol_bot" style={{ color: '#14F195' }}>@gadai_sol_bot</a>
          </p>
        </div>
      </section>

      {/* PRICING */}
      <section className="section" id="pricing" style={{ background: 'rgba(153,69,255,.03)' }}>
        <div className="container">
          <h2 className="section-title">PRICING</h2>
          <p className="section-sub">Paid in SOL, on-chain, no middleman. Cancel anytime by just not renewing.</p>
          <div className="pricing-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', maxWidth: 1000, margin: '0 auto' }}>

            {/* FREE */}
            <div className="price-card">
              <div className="price-tier">FREE DEGEN</div>
              <div className="price-amount">0 SOL</div>
              <p className="price-period">forever (we&apos;re not monsters)</p>
              <ul className="price-features">
                <li><span className="check">✓</span> Basic token scanner</li>
                <li><span className="check">✓</span> 3 whale alerts/day</li>
                <li><span className="check">✓</span> AI risk scores</li>
                <li><span className="check">✓</span> GAD Score 0–100</li>
                <li style={{ opacity: .4 }}><span>✗</span> Alpha Engine</li>
                <li style={{ opacity: .4 }}><span>✗</span> Base/BSC bots</li>
                <li style={{ opacity: .4 }}><span>✗</span> Copy Trading</li>
              </ul>
              <a href={TG_BOT} target="_blank" rel="noopener noreferrer" className="price-btn secondary">
                START FREE
              </a>
            </div>

            {/* TRIAL 1D */}
            <div className="price-card">
              <div className="price-badge" style={{ background: 'rgba(20,241,149,0.15)', color: 'var(--green)', border: '1px solid var(--green)' }}>🧪 TRY FIRST</div>
              <div className="price-tier">1-DAY TRIAL</div>
              <div className="price-amount">0.05 SOL</div>
              <p className="price-period">/ 24 hours · full access</p>
              <ul className="price-features">
                <li><span className="check">✓</span> Everything in Free</li>
                <li><span className="check">✓</span> 🌡️ Market Regime Engine</li>
                <li><span className="check">✓</span> 🔄 Meme Lifecycle Tracker</li>
                <li><span className="check">✓</span> 🎯 Opportunity Engine</li>
                <li><span className="check">✓</span> 🧠 Alpha Memory</li>
                <li><span className="check">✓</span> 👑 Wallet Reputation</li>
                <li><span className="check">✓</span> Unlimited whale alerts</li>
              </ul>
              <a href="/pay?plan=trial_1d" className="price-btn secondary" style={{ borderColor: 'var(--green)', color: 'var(--green)' }}>
                TRY FOR 0.05 SOL
              </a>
            </div>

            {/* TRIAL 3D */}
            <div className="price-card" style={{ border: '1px solid rgba(20,241,149,0.4)' }}>
              <div className="price-badge" style={{ background: 'rgba(20,241,149,0.2)', color: 'var(--green)', border: '1px solid var(--green)' }}>🔥 POPULAR</div>
              <div className="price-tier">3-DAY ACCESS</div>
              <div className="price-amount">0.1 SOL</div>
              <p className="price-period">/ 72 hours · alpha included</p>
              <ul className="price-features">
                <li><span className="check">✓</span> Everything in 1-Day</li>
                <li><span className="check">✓</span> 🔵 Base Network Bot</li>
                <li><span className="check">✓</span> 🟡 BSC Bot</li>
                <li><span className="check">✓</span> 🔄 Copy Trading</li>
                <li><span className="check">✓</span> Portfolio P&amp;L</li>
                <li><span className="check">✓</span> Smart money signals</li>
                <li><span className="check">✓</span> X Trend signals</li>
              </ul>
              <a href="/pay?plan=trial_3d" className="price-btn secondary" style={{ borderColor: 'var(--green)', color: 'var(--green)' }}>
                GET 3 DAYS 0.1 SOL
              </a>
            </div>

            {/* PRO */}
            <div className="price-card featured">
              <div className="price-badge">👑 MOST BASED</div>
              <div className="price-tier">PRO CHAD</div>
              <div className="price-amount">1.0 SOL</div>
              <p className="price-period">/ 30 days · paid on-chain</p>
              <ul className="price-features">
                <li><span className="check">✓</span> Everything in 3-Day</li>
                <li><span className="check">✓</span> Auto-buy via Jupiter DEX</li>
                <li><span className="check">✓</span> Copy-trade top wallets</li>
                <li><span className="check">✓</span> Custom alert thresholds</li>
                <li><span className="check">✓</span> Priority alpha channel</li>
                <li><span className="check">✓</span> Real-time scanner (30s)</li>
                <li><span className="check">✓</span> Direct on-chain payment</li>
              </ul>
              <a href="/pay?plan=monthly" className="price-btn">
                GO PRO 🚀
              </a>
            </div>

          </div>
          <p style={{ textAlign: 'center', marginTop: 32, fontSize: 11, color: 'var(--muted)' }}>
            💳 Payment via Phantom / Solflare wallet. On-chain verification. No accounts, no KYC.
          </p>
        </div>
      </section>

      {/* LAUNCH TOKEN */}
      <section className="section" id="launcher" style={{ background: 'rgba(20,241,149,.04)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <span style={{
            display: 'inline-block',
            background: 'rgba(20,241,149,0.15)', color: '#14F195',
            border: '1px solid #14F195', borderRadius: 4,
            padding: '4px 12px', fontSize: 10, letterSpacing: 2, marginBottom: 16,
          }}>PUMP.FUN LAUNCHER</span>
          <h2 className="section-title">🪙 LAUNCH YOUR OWN TOKEN</h2>
          <p className="section-sub" style={{ maxWidth: 600, margin: '0 auto 32px' }}>
            Submit your token idea — GAD AI handles everything else.
            Pinata IPFS upload, pump.fun deploy, 3-wallet staggered buy for organic chart.
          </p>
          <div style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 32 }}>
            {[
              { icon: '🖼️', t: 'Upload Logo' },
              { icon: '📌', t: 'IPFS Pinned' },
              { icon: '⛓️', t: 'pump.fun Deploy' },
              { icon: '🐋', t: '3-Wallet Buy' },
              { icon: '📡', t: 'TG Notification' },
            ].map(s => (
              <div key={s.t} style={{
                background: '#18181f', border: '1px solid rgba(20,241,149,0.2)',
                borderRadius: 12, padding: '16px 20px', minWidth: 100,
              }}>
                <div style={{ fontSize: 28, marginBottom: 6 }}>{s.icon}</div>
                <div style={{ fontSize: 11, color: '#94a3b8' }}>{s.t}</div>
              </div>
            ))}
          </div>
          <a href="/launcher" className="btn-primary" style={{ background: '#14F195', color: '#0a0a0f', display: 'inline-block' }}>
            🚀 Launch Your Token →
          </a>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="cta-section">
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: 64, marginBottom: 24, display: 'block', animation: 'float 3s ease-in-out infinite' }}>🚀</div>
          <h2 className="cta-title">
            STOP MISSING <span className="accent">GEMS</span><br />
            ON 4 CHAINS
          </h2>
          <p className="cta-sub">
            Solana. Base. BSC. TON. One bot scans them all, copies the best wallets, and notifies you in Telegram.<br />
            <strong>Alpha Engine v2 is live. Copy-trader is live. 4 chains online.</strong>
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href={TG_BOT}     target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ fontSize: 13 }}>
              ⚡ OPEN BOT NOW — IT&apos;S FREE
            </a>
            <a href={TG_CHANNEL} target="_blank" rel="noopener noreferrer" className="btn-secondary">
              📢 JOIN CHANNEL
            </a>
          </div>
          <p className="cta-disclaimer">
            Not financial advice. Past performance ≠ future results. DYOR. We are all gonna make it (statistically unlikely but emotionally necessary).
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-logo">GAD AI TERMINAL</div>
        <div className="footer-links">
          <a href={TG_BOT}     target="_blank" rel="noopener noreferrer" className="footer-link">Telegram Bot</a>
          <a href={TG_CHANNEL} target="_blank" rel="noopener noreferrer" className="footer-link">Channel</a>
          <a href="#features"  className="footer-link">Features</a>
          <a href="#bots"      className="footer-link">Bot Networks</a>
          <a href="#alpha"     className="footer-link">Alpha Engine</a>
          <a href="#pricing"   className="footer-link">Pricing</a>
          <a href="/pay"       className="footer-link">Subscribe</a>
          <a href="/launcher"  className="footer-link">Launch Token</a>
        </div>
        <div className="footer-copy" suppressHydrationWarning>
          © {new Date().getFullYear()} GAD AI · Solana · Base · BSC · TON · WAGMI
        </div>
      </footer>
    </>
  );
}
