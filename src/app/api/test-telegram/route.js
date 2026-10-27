import { NextResponse } from 'next/server';

export async function GET() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return NextResponse.json({ 
      error: 'TELEGRAM_BOT_TOKEN atau TELEGRAM_CHAT_ID belum diisi di .env.local atau Netlify Environment Variables!' 
    }, { status: 400 });
  }

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: '🧪 <b>TES BOT TELEGRAM SUCCESS!</b>\n\nIntegrasi notifikasi Uptime Monitor kamu berjalan lancar.',
        parse_mode: 'HTML'
      })
    });

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}