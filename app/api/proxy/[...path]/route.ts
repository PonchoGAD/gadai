import { NextRequest, NextResponse } from 'next/server';

const BACKEND = process.env.BACKEND_API_URL || 'http://65.21.159.255:4000';

async function handler(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;

  // Forward query params to the backend
  const searchParams = req.nextUrl.searchParams.toString();
  const url = `${BACKEND}/${path.join('/')}${searchParams ? `?${searchParams}` : ''}`;

  const headers: Record<string, string> = { 'Content-Type': 'application/json' };

  let body: string | undefined;
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    body = await req.text();
  }

  try {
    const res  = await fetch(url, { method: req.method, headers, body });
    const data = await res.text();
    return new NextResponse(data, {
      status:  res.status,
      headers: { 'Content-Type': res.headers.get('Content-Type') || 'application/json' },
    });
  } catch (e: any) {
    // Network error (connection refused, timeout) — return 502
    return NextResponse.json(
      { error: `Backend unreachable: ${e.message}` },
      { status: 502 }
    );
  }
}

export const GET    = handler;
export const POST   = handler;
export const PUT    = handler;
export const DELETE = handler;
