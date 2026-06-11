import { NextRequest, NextResponse } from 'next/server';

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY ?? '';

interface GenerateBody {
  idea: string;
}

export async function POST(req: NextRequest) {
  try {
    const { idea }: GenerateBody = await req.json();
    if (!idea || idea.trim().length < 5) {
      return NextResponse.json({ error: 'Idea too short' }, { status: 400 });
    }

    if (!ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: 'ANTHROPIC_API_KEY not configured' }, { status: 500 });
    }

    const prompt = `You are a pump.fun memecoin expert. Based on the user's idea, create a viral Solana memecoin.

User idea: "${idea.slice(0, 300)}"

Return ONLY valid JSON (no markdown, no explanation):
{
  "name": "Token Name (2-4 words, catchy, max 30 chars)",
  "symbol": "TICKER (2-6 uppercase letters)",
  "description": "One fun sentence about the token vibe + what it represents. Max 100 chars. Include a relevant emoji.",
  "twitter_text": "Short tweet to announce the token. Under 200 chars. Include ticker. Fun and viral."
}

Rules:
- Name must be MEMORABLE and VIRAL (like PEPE, BONK, WIF, DOGE)
- Symbol must be SHORT (3-5 chars ideal)
- Description must be PUNCHY, not corporate
- NO words: "token", "coin", "project", "official", "safe", "legit"`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 256,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return NextResponse.json({ error: `Claude error: ${err.slice(0, 200)}` }, { status: 502 });
    }

    const data = await response.json();
    const text = data?.content?.[0]?.text ?? '';

    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: 'Failed to parse Claude response' }, { status: 502 });
    }

    const parsed = JSON.parse(jsonMatch[0]);
    return NextResponse.json({
      name: String(parsed.name ?? '').slice(0, 30),
      symbol: String(parsed.symbol ?? '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6),
      description: String(parsed.description ?? '').slice(0, 100),
      twitter_text: String(parsed.twitter_text ?? '').slice(0, 280),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? 'Unknown error' }, { status: 500 });
  }
}
