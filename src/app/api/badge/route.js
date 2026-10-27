import { NextResponse } from 'next/server';

const TARGETS = {
  'duo-chaos': { name: 'Duo Chaos', url: 'https://duo-chaos-six.vercel.app' },
  'kost-track': { name: 'Kost Track', url: 'https://kost-track.onrender.com' }
};

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  // Pilih target berdasarkan ID, default ke duo-chaos jika ID tidak ditemukan
  const target = TARGETS[id] || TARGETS['duo-chaos'];

  let statusText = 'DOWN';
  let badgeColor = '#e05d44'; // Merah

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(target.url, {
      method: 'GET',
      headers: { 'Cache-Control': 'no-cache' },
      cache: 'no-store',
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (res.ok) {
      statusText = 'UP';
      badgeColor = '#4c1'; // Hijau
    }
  } catch (err) {
    statusText = 'DOWN';
    badgeColor = '#e05d44';
  }

  // Template Vektor SVG (Style Shields.io)
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="120" height="20">
      <linearGradient id="b" x2="0" y2="100%">
        <stop offset="0" stop-color="#bbb" stop-opacity=".1"/>
        <stop offset="1" stop-opacity=".1"/>
      </linearGradient>
      <mask id="a">
        <rect width="120" height="20" rx="3" fill="#fff"/>
      </mask>
      <g mask="url(#a)">
        <path fill="#555" d="M0 0h75v20H0z"/>
        <path fill="${badgeColor}" d="M75 0h45v20H75z"/>
        <path fill="url(#b)" d="M0 0h120v20H0z"/>
      </g>
      <g fill="#fff" text-anchor="middle" font-family="DejaVu Sans,Verdana,Geneva,sans-serif" font-size="11">
        <text x="37.5" y="15" fill="#010101" fill-opacity=".3">${target.name}</text>
        <text x="37.5" y="14">${target.name}</text>
        <text x="96.5" y="15" fill="#010101" fill-opacity=".3">${statusText}</text>
        <text x="96.5" y="14">${statusText}</text>
      </g>
    </svg>
  `.trim();

  // Kembalikan Response berupa file gambar SVG asli
  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    }
  });
}