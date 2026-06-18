'use client';

import { useState, useEffect, useRef } from 'react';

const CHAINS = [
  { id: 'all',    label: 'ALL CHAINS', color: '#7c3aed', bg: 'rgba(124,58,237,0.15)' },
  { id: 'solana', label: 'SOLANA',     color: '#9945FF', bg: 'rgba(153,69,255,0.12)', unit: 'SOL' },
  { id: 'base',   label: 'BASE',       color: '#0052FF', bg: 'rgba(0,82,255,0.12)',   unit: 'ETH' },
  { id: 'bsc',    label: 'BSC',        color: '#F0B90B', bg: 'rgba(240,185,11,0.12)', unit: 'BNB' },
  { id: 'ton',    label: 'TON',        color: '#0098EA', bg: 'rgba(0,152,234,0.12)',  unit: 'TON' },
];

type Position = {
  id: number; chain: string; symbol: string;
  entry: number; current: number; size: number; unit: string;
  pnl: number; age: string; score: number;
};

type LiveEvent = { id: number; chain: string; color: string; event: string; detail: string };

const BASE_POSITIONS: Position[] = [
  { id: 1, chain: 'solana', symbol: 'BONK',    entry: 0.0000142, current: 0.0000198, size: 0.02,  unit: 'SOL', pnl: 39.4,  age: '14m', score: 87 },
  { id: 2, chain: 'solana', symbol: 'WIF',     entry: 0.002850,  current: 0.003120,  size: 0.02,  unit: 'SOL', pnl: 9.5,   age: '2h',  score: 74 },
  { id: 3, chain: 'base',   symbol: 'TOSHI',   entry: 0.0000310, current: 0.0000485, size: 0.001, unit: 'ETH', pnl: 56.4,  age: '2h',  score: 91 },
  { id: 4, chain: 'bsc',    symbol: 'FLOKI',   entry: 0.0000821, current: 0.0000742, size: 0.003, unit: 'BNB', pnl: -9.6,  age: '45m', score: 63 },
  { id: 5, chain: 'ton',    symbol: 'DOGS',    entry: 0.001420,  current: 0.002180,  size: 5.0,   unit: 'TON', pnl: 53.5,  age: '1h',  score: 82 },
  { id: 6, chain: 'ton',    symbol: 'HAMSTER', entry: 0.000321,  current: 0.000298,  size: 10.0,  unit: 'TON', pnl: -7.2,  age: '30m', score: 71 },
];

const EVENT_POOL = [
  { chain: 'SOLANA', color: '#9945FF', event: 'BUY',    detail: 'Bought $MOON via Jupiter · score 87 · 0.02 SOL' },
  { chain: 'BASE',   color: '#0052FF', event: 'TP HIT', detail: '$TOSHI TP1 +56% · sold 50% via Uniswap V3 ✅' },
  { chain: 'BSC',    color: '#F0B90B', event: 'SCAN',   detail: 'PancakeSwap: 412 new pairs · tax-check passed' },
  { chain: 'TON',    color: '#0098EA', event: 'BUY',    detail: 'Bought $DOGS via STON.fi · 5 TON · score 82' },
  { chain: 'SOLANA', color: '#9945FF', event: 'WHALE',  detail: 'Wallet 7xKp bought 420K $BONK 🐳' },
  { chain: 'SOLANA', color: '#9945FF', event: 'ALPHA',  detail: '$PEPECOIN 82% similar to 5 historical 5x gems 🧠' },
  { chain: 'BASE',   color: '#0052FF', event: 'SCAN',   detail: 'Aerodrome scan · 28 tokens · 3 passed filters' },
  { chain: 'BSC',    color: '#F0B90B', event: 'TP HIT', detail: '$NEIRO TP2 +2.3x · exiting via PancakeSwap' },
  { chain: 'TON',    color: '#0098EA', event: 'STOP',   detail: '$HAMSTER stop-loss hit · sold at -8% ⚠️' },
  { chain: 'SOLANA', color: '#9945FF', event: 'REGIME', detail: 'F&G 28 → FEAR zone · contrarian buys ENABLED 📊' },
  { chain: 'BASE',   color: '#0052FF', event: 'BUY',    detail: 'Bought $BRETT via Uniswap V3 · 0.001 ETH' },
  { chain: 'BSC',    color: '#F0B90B', event: 'BUY',    detail: 'Bought $SHIB via PancakeSwap · score 79' },
  { chain: 'TON',    color: '#0098EA', event: 'SCAN',   detail: 'STON.fi scan · 156 Jettons · 4 new candidates' },
  { chain: 'SOLANA', color: '#9945FF', event: 'RUG',    detail: '$FAKEMOON dev wallet moving · SKIP ⛔' },
  { chain: 'BASE',   color: '#0052FF', event: 'COPY',   detail: 'Mirroring whale 0xAb3 · bought $BASE · 0.005 ETH' },
];

let evtId = 0;

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 80 ? '#14F195' : score >= 60 ? '#FFD700' : '#ff4d6d';
  return (
    <span style={{
      fontSize: 10, padding: '2px 7px', borderRadius: 4,
      background: `${color}22`, color, border: `1px solid ${color}44`,
      fontFamily: 'var(--font-mono)', fontWeight: 700, letterSpacing: 1,
    }}>
      {score}
    </span>
  );
}

function PnlBadge({ pnl }: { pnl: number }) {
  const pos = pnl >= 0;
  const color = pos ? '#14F195' : '#ff4d6d';
  return (
    <span style={{
      fontSize: 13, fontWeight: 900, color,
      textShadow: pos ? '0 0 10px rgba(20,241,149,0.4)' : '0 0 10px rgba(255,77,109,0.3)',
      fontFamily: 'var(--font-mono)',
      transition: 'color 0.3s, text-shadow 0.3s',
    }}>
      {pos ? '+' : ''}{pnl.toFixed(1)}%
    </span>
  );
}

function EventBadge({ event, color }: { event: string; color: string }) {
  const labels: Record<string, string> = {
    'BUY': '▲ BUY', 'TP HIT': '✓ TP', 'SCAN': '◎ SCAN',
    'WHALE': '🐳 WHALE', 'ALPHA': '⚡ ALPHA', 'REGIME': '📊 REGIME',
    'STOP': '⚠ STOP', 'COPY': '🔄 COPY', 'RUG': '⛔ RUG',
  };
  return (
    <span style={{
      fontSize: 9, padding: '2px 6px', borderRadius: 3, whiteSpace: 'nowrap',
      background: `${color}20`, color, border: `1px solid ${color}40`,
      fontFamily: 'var(--font-mono)', fontWeight: 700, letterSpacing: 0.5,
    }}>
      {labels[event] ?? event}
    </span>
  );
}

export default function LiveDashboard() {
  const [activeChain, setActiveChain] = useState('all');
  const [positions, setPositions] = useState<Position[]>(BASE_POSITIONS);
  const [events, setEvents] = useState<LiveEvent[]>([]);
  const feedRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  // Price simulation — throttled at 2s
  useEffect(() => {
    if (!mounted) return;
    const t = setInterval(() => {
      setPositions(prev => prev.map(p => ({
        ...p,
        pnl: Math.max(-18, Math.min(180, p.pnl + (Math.random() - 0.46) * 2.5)),
      })));
    }, 2000);
    return () => clearInterval(t);
  }, [mounted]);

  // Live event feed — new event every 3.2s
  useEffect(() => {
    if (!mounted) return;
    const add = () => {
      const tmpl = EVENT_POOL[Math.floor(Math.random() * EVENT_POOL.length)];
      setEvents(prev => [{ id: ++evtId, ...tmpl }, ...prev].slice(0, 12));
    };
    add();
    const t = setInterval(add, 3200);
    return () => clearInterval(t);
  }, [mounted]);

  const chainMeta = CHAINS.find(c => c.id === activeChain)!;
  const filtered = activeChain === 'all'
    ? positions
    : positions.filter(p => p.chain === activeChain);

  const avgPnl  = positions.reduce((s, p) => s + p.pnl, 0) / positions.length;
  const winning = positions.filter(p => p.pnl > 0).length;

  if (!mounted) return null;

  return (
    <section id="dashboard" style={{
      position: 'relative', zIndex: 1, padding: '80px 24px',
      background: 'linear-gradient(180deg, rgba(10,10,15,0) 0%, rgba(15,15,26,0.6) 100%)',
      borderTop: '1px solid rgba(42,42,53,0.6)',
    }}>
      {/* Header */}
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 12 }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(20,241,149,0.1)', border: '1px solid rgba(20,241,149,0.35)',
            borderRadius: 99, padding: '5px 14px', fontSize: 10,
            color: '#14F195', letterSpacing: 2, fontFamily: 'var(--font-mono)',
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: '50%', background: '#14F195',
              boxShadow: '0 0 6px #14F195',
              animation: 'livePulse 1.5s ease-in-out infinite',
            }} />
            LIVE DEMO — SIMULATED DATA
          </span>
        </div>
        <h2 style={{
          textAlign: 'center', fontSize: 'clamp(22px, 4vw, 36px)', fontWeight: 900,
          letterSpacing: 3, marginBottom: 8, color: '#e2e8f0',
          fontFamily: 'var(--font-mono)',
        }}>
          UNIFIED PORTFOLIO
        </h2>
        <p style={{
          textAlign: 'center', color: '#64748b', fontSize: 14,
          maxWidth: 520, margin: '0 auto 40px', lineHeight: 1.7,
        }}>
          Track positions across Solana, Base, BSC and TON in one terminal.
          One bot, four chains, live P&amp;L.
        </p>

        {/* Summary Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: 16, marginBottom: 32,
          background: 'rgba(15,15,26,0.8)',
          border: '1px solid rgba(42,42,53,0.8)',
          borderRadius: 16, padding: '20px 24px',
          backdropFilter: 'blur(8px)',
        }}>
          {[
            { label: 'AVG P&L', value: `${avgPnl >= 0 ? '+' : ''}${avgPnl.toFixed(1)}%`, color: avgPnl >= 0 ? '#14F195' : '#ff4d6d' },
            { label: 'POSITIONS', value: `${positions.length}`, color: '#e2e8f0' },
            { label: 'WINNING', value: `${winning}/${positions.length}`, color: '#14F195' },
            { label: 'CHAINS', value: '4', color: '#9945FF' },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 'clamp(20px,3vw,28px)', fontWeight: 900, color: s.color, fontFamily: 'var(--font-mono)' }}>
                {s.value}
              </div>
              <div style={{ fontSize: 10, color: '#64748b', letterSpacing: 2, marginTop: 4, fontFamily: 'var(--font-mono)' }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Chain Filter Tabs */}
        <div style={{
          display: 'flex', gap: 8, flexWrap: 'wrap',
          marginBottom: 24, justifyContent: 'center',
        }}>
          {CHAINS.map(c => (
            <button
              key={c.id}
              onClick={() => setActiveChain(c.id)}
              aria-pressed={activeChain === c.id}
              style={{
                padding: '8px 20px', borderRadius: 8, cursor: 'pointer',
                fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700,
                letterSpacing: 2, transition: 'all 0.2s',
                border: activeChain === c.id ? `1px solid ${c.color}` : '1px solid rgba(42,42,53,0.8)',
                background: activeChain === c.id ? c.bg : 'rgba(15,15,26,0.6)',
                color: activeChain === c.id ? c.color : '#64748b',
                boxShadow: activeChain === c.id ? `0 0 16px ${c.color}30` : 'none',
                transform: activeChain === c.id ? 'scale(1.02)' : 'scale(1)',
              }}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Main Grid: Positions + Feed */}
        <div className="dashboard-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) 340px',
          gap: 20, alignItems: 'start',
        }}>
          {/* Position Cards */}
          <div>
            {filtered.length === 0 ? (
              <div style={{
                textAlign: 'center', padding: '48px 24px',
                color: '#64748b', fontSize: 13, fontFamily: 'var(--font-mono)',
                background: 'rgba(15,15,26,0.6)', borderRadius: 16,
                border: '1px solid rgba(42,42,53,0.6)',
              }}>
                No active positions on this chain
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {filtered.map(p => {
                  const chain = CHAINS.find(c => c.id === p.chain)!;
                  const isWin = p.pnl >= 0;
                  return (
                    <div
                      key={p.id}
                      style={{
                        background: 'rgba(15,15,26,0.85)',
                        border: `1px solid ${chain.color}30`,
                        borderLeft: `3px solid ${chain.color}`,
                        borderRadius: 12, padding: '16px 20px',
                        transition: 'border-color 0.3s, box-shadow 0.3s',
                        backdropFilter: 'blur(4px)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <span style={{
                            fontSize: 10, padding: '2px 8px', borderRadius: 4,
                            background: `${chain.color}20`, color: chain.color,
                            border: `1px solid ${chain.color}40`,
                            fontFamily: 'var(--font-mono)', fontWeight: 700, letterSpacing: 1,
                          }}>{chain.label}</span>
                          <span style={{ fontSize: 16, fontWeight: 900, color: '#e2e8f0', fontFamily: 'var(--font-mono)' }}>
                            ${p.symbol}
                          </span>
                          <ScoreBadge score={p.score} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <PnlBadge pnl={p.pnl} />
                          <span style={{ fontSize: 11, color: '#64748b', fontFamily: 'var(--font-mono)' }}>{p.age}</span>
                        </div>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
                        {[
                          { label: 'ENTRY',   value: p.entry.toFixed(p.entry < 0.001 ? 7 : 5) },
                          { label: 'CURRENT', value: p.current.toFixed(p.current < 0.001 ? 7 : 5) },
                          { label: 'SIZE',    value: `${p.size} ${p.unit}` },
                        ].map(f => (
                          <div key={f.label} style={{
                            background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: '8px 10px',
                          }}>
                            <div style={{ fontSize: 9, color: '#64748b', letterSpacing: 1, marginBottom: 3, fontFamily: 'var(--font-mono)' }}>{f.label}</div>
                            <div style={{ fontSize: 12, color: '#e2e8f0', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{f.value}</div>
                          </div>
                        ))}
                      </div>
                      {/* P&L Bar */}
                      <div style={{ marginTop: 10, height: 3, borderRadius: 2, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                        <div style={{
                          height: '100%', borderRadius: 2,
                          width: `${Math.min(100, Math.abs(p.pnl))}%`,
                          background: isWin
                            ? 'linear-gradient(90deg, #14F195, #22c55e)'
                            : 'linear-gradient(90deg, #ff4d6d, #ef4444)',
                          transition: 'width 0.5s ease',
                          boxShadow: isWin ? '0 0 6px rgba(20,241,149,0.5)' : '0 0 6px rgba(255,77,109,0.4)',
                        }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Live Feed */}
          <div style={{
            background: 'rgba(15,15,26,0.85)', border: '1px solid rgba(42,42,53,0.8)',
            borderRadius: 16, overflow: 'hidden',
            backdropFilter: 'blur(8px)',
          }}>
            <div style={{
              padding: '12px 16px', borderBottom: '1px solid rgba(42,42,53,0.8)',
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'rgba(255,255,255,0.02)',
            }}>
              <span style={{
                width: 7, height: 7, borderRadius: '50%', background: '#14F195',
                boxShadow: '0 0 8px #14F195',
                animation: 'livePulse 1.5s ease-in-out infinite',
                flexShrink: 0,
              }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: '#64748b', letterSpacing: 2, fontFamily: 'var(--font-mono)' }}>
                LIVE ACTIVITY
              </span>
            </div>
            <div ref={feedRef} style={{
              padding: '12px', display: 'flex', flexDirection: 'column', gap: 8,
              maxHeight: 420, overflowY: 'auto',
            }}>
              {events.map(ev => (
                <div key={ev.id} style={{
                  background: 'rgba(255,255,255,0.02)', border: `1px solid ${ev.color}20`,
                  borderRadius: 8, padding: '10px 12px',
                  animation: 'slideIn 0.25s ease-out',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <span style={{ fontSize: 9, color: ev.color, fontFamily: 'var(--font-mono)', fontWeight: 700, letterSpacing: 1 }}>
                      {ev.chain}
                    </span>
                    <EventBadge event={ev.event} color={ev.color} />
                  </div>
                  <p style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.5, fontFamily: 'var(--font-mono)' }}>
                    {ev.detail}
                  </p>
                </div>
              ))}
              {events.length === 0 && (
                <p style={{ color: '#64748b', fontSize: 12, textAlign: 'center', padding: '24px 0', fontFamily: 'var(--font-mono)' }}>
                  Connecting...
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <p style={{
          textAlign: 'center', marginTop: 24, fontSize: 11, color: '#374151',
          fontFamily: 'var(--font-mono)',
        }}>
          * Simulated data for demonstration. Real positions visible in Telegram bot via /portfolio /basestatus /tonstatus
        </p>
      </div>

    </section>
  );
}
