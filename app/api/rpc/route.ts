import { NextRequest, NextResponse } from 'next/server';

// Server-side Solana RPC proxy — keeps the Helius API key secret.
// Pay page calls /api/rpc instead of hitting mainnet-beta.solana.com (which returns 403).
const HELIUS_KEY = process.env.HELIUS_API_KEY || '';
const RPC_URL    = HELIUS_KEY
  ? `https://mainnet.helius-rpc.com/?api-key=${HELIUS_KEY}`
  : 'https://rpc.ankr.com/solana'; // public fallback that doesn't 403

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const res  = await fetch(RPC_URL, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    });
    const data = await res.text();
    return new NextResponse(data, {
      status:  res.status,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 502 });
  }
}
