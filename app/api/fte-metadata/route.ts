import { NextResponse } from 'next/server';

const METADATA = {
  name: 'First Trillionaire Ever',
  symbol: 'FTE',
  description:
    'Not everyone will become a trillionaire. But everyone will know who got there first.\n\nThe race to become the First Trillionaire has already begun.\nSome are building companies. Some are building rockets. Some are building AI.\nWe are building the meme.\n\n$FTE — the meme behind that race. The game has started.\n\nAmbition. Wealth. Legacy.',
  image: 'https://gadai.shop/api/fte-logo',
  showName: true,
  createdOn: 'https://pump.fun',
  website: 'https://gadai.shop',
  twitter: '',
  telegram: '',
};

export async function GET() {
  return NextResponse.json(METADATA, {
    headers: { 'Cache-Control': 'public, max-age=86400' },
  });
}
