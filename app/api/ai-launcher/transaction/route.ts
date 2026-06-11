import { NextRequest, NextResponse } from 'next/server';

const PUMPPORTAL_IPFS  = 'https://pumpportal.fun/api/ipfs';
const PUMPPORTAL_TRADE = 'https://pumpportal.fun/api/trade-local';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const name        = String(formData.get('name') ?? '');
    const symbol      = String(formData.get('symbol') ?? '');
    const description = String(formData.get('description') ?? '');
    const twitter     = String(formData.get('twitter') ?? '');
    const website     = String(formData.get('website') ?? 'https://gadai.shop');
    const publicKey   = String(formData.get('publicKey') ?? '');
    const solAmount   = Number(formData.get('solAmount') ?? 0.05);
    const imageFile   = formData.get('image') as File | null;

    if (!name || !symbol || !publicKey) {
      return NextResponse.json({ error: 'name, symbol, publicKey required' }, { status: 400 });
    }
    if (solAmount < 0.01 || solAmount > 10) {
      return NextResponse.json({ error: 'solAmount must be 0.01–10 SOL' }, { status: 400 });
    }

    // ── Step 1: Upload metadata to IPFS via PumpPortal ─────────────────────────
    const ipfsForm = new FormData();
    ipfsForm.append('name', name);
    ipfsForm.append('symbol', symbol);
    ipfsForm.append('description', description);
    ipfsForm.append('twitter', twitter);
    ipfsForm.append('website', website);
    ipfsForm.append('showName', 'true');

    if (imageFile && imageFile.size > 0) {
      ipfsForm.append('file', imageFile, imageFile.name);
    } else {
      // Generate placeholder SVG as image
      const svg = generateTokenSVG(symbol);
      const blob = new Blob([svg], { type: 'image/svg+xml' });
      ipfsForm.append('file', blob, `${symbol.toLowerCase()}.svg`);
    }

    const ipfsResp = await fetch(PUMPPORTAL_IPFS, {
      method: 'POST',
      body: ipfsForm,
    });
    if (!ipfsResp.ok) {
      const errText = await ipfsResp.text();
      return NextResponse.json({ error: `IPFS upload failed: ${errText.slice(0, 200)}` }, { status: 502 });
    }
    const ipfsData = await ipfsResp.json();
    const metadataUri: string = ipfsData?.metadataUri;
    if (!metadataUri) {
      return NextResponse.json({ error: 'No metadataUri from IPFS' }, { status: 502 });
    }

    // ── Step 2: Create token transaction via PumpPortal ────────────────────────
    const tradeResp = await fetch(PUMPPORTAL_TRADE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        publicKey,
        action: 'create',
        tokenMetadata: { name, symbol, uri: metadataUri },
        denominatedInSol: 'true',
        amount: solAmount,
        slippage: 15,
        priorityFee: 0.005,
        pool: 'pump',
      }),
    });

    if (!tradeResp.ok) {
      const errText = await tradeResp.text();
      return NextResponse.json({ error: `Transaction creation failed: ${errText.slice(0, 200)}` }, { status: 502 });
    }

    // Return raw transaction bytes as base64 for frontend to sign
    const txBuffer = Buffer.from(await tradeResp.arrayBuffer());
    return NextResponse.json({
      txBase64: txBuffer.toString('base64'),
      metadataUri,
      name,
      symbol,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? 'Unknown error' }, { status: 500 });
  }
}

function generateTokenSVG(symbol: string): string {
  const colors = ['#9945FF', '#14F195', '#FF6B6B', '#FFD700', '#00C0FF', '#FF4D94'];
  const color1 = colors[symbol.charCodeAt(0) % colors.length];
  const color2 = colors[(symbol.charCodeAt(symbol.length - 1) + 2) % colors.length];
  const initials = symbol.slice(0, 3);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <defs>
    <radialGradient id="bg" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${color1}"/>
      <stop offset="100%" stop-color="${color2}"/>
    </radialGradient>
  </defs>
  <rect width="512" height="512" rx="256" fill="url(#bg)"/>
  <text x="256" y="310" font-family="Arial Black,sans-serif" font-size="160" font-weight="900"
    fill="white" text-anchor="middle" dominant-baseline="auto" filter="drop-shadow(0 4px 8px rgba(0,0,0,0.5))">
    ${initials}
  </text>
</svg>`;
}
