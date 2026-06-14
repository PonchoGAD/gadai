'use client';
const TG_BOT = 'https://t.me/gadai_sol_bot';

export default function NavBar() {
  return (
    <nav className="nav">
      <a href="/en" className="nav-logo">GAD<span>AI</span></a>
      <div className="nav-links">
        <a href="/en#features"  className="nav-link">FEATURES</a>
        <a href="/en#alpha"     className="nav-link">ALPHA</a>
        <a href="/en/pricing"   className="nav-link">PRICING</a>
        <a href="/en/launcher"  className="nav-link" style={{ color: '#14F195' }}>LAUNCH</a>
        <a href="/en/faq"       className="nav-link">FAQ</a>
      </div>
      <a href={TG_BOT} target="_blank" rel="noopener noreferrer" className="nav-cta">▶ OPEN BOT</a>
    </nav>
  );
}
