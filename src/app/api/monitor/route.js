import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const TARGETS = [
  {
    id: 'duo-chaos',
    name: 'Duo Chaos',
    provider: 'Vercel',
    url: 'https://duo-chaos-six.vercel.app',
    type: 'Frontend Web',
    region: 'Vercel Edge (sin1)'
  },
  {
    id: 'kost-track',
    name: 'Kost Track',
    provider: 'Render',
    url: 'https://kost-track.onrender.com',
    type: 'Web Application',
    region: 'Render Cloud'
  },
   {
    id: 'montera-app',
    name: 'Montera App',
    provider: 'Vercel',
    url: 'https://montera-app.vercel.app',
    type: 'Web Application',
    region: 'Vercel Cloud'
  }
];

// Helper Mengirim Pesan Telegram
async function sendTelegramAlert(message) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML'
      })
    });
  } catch (err) {
    console.error('Gagal mengirim notifikasi Telegram:', err);
  }
}

async function checkTarget(target) {
  const startTime = Date.now();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(target.url, {
      method: 'GET',
      headers: { 'User-Agent': 'NextJS-Uptime-Monitor/2.0', 'Cache-Control': 'no-cache' },
      cache: 'no-store',
      signal: controller.signal
    });

    clearTimeout(timeoutId);
    const latency = Date.now() - startTime;
    const isOk = response.ok;

    let errorReason = null;
    if (!isOk) {
      if (response.status === 404) errorReason = 'Halaman tidak ditemukan (404 Not Found).';
      else if (response.status === 500) errorReason = 'Internal Server Error (500).';
      else errorReason = `Server merespons kode error ${response.status}.`;

      // Kirim alert ke Telegram saat DOWN
      await sendTelegramAlert(
        `🚨 <b>ALERT: SYSTEM DOWN!</b>\n\n<b>Target:</b> ${target.name}\n<b>URL:</b> ${target.url}\n<b>HTTP Code:</b> ${response.status}\n<b>Alasan:</b> ${errorReason}\n<b>Waktu:</b> ${new Date().toLocaleTimeString('id-ID')} WIB`
      );
    }

    return {
      ...target,
      status: isOk ? 'UP' : 'DOWN',
      statusCode: response.status,
      statusText: response.statusText || (isOk ? 'OK' : 'Error'),
      errorReason,
      ping: latency,
      sslValid: target.url.startsWith('https://'),
      lastChecked: new Date().toLocaleTimeString('id-ID'),
      history: [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1, isOk ? 1 : 0]
    };
  } catch (error) {
    clearTimeout(timeoutId);
    const latency = Date.now() - startTime;
    const isTimeout = error.name === 'AbortError';
    const reason = isTimeout ? 'Connection Timeout (>8 detik).' : 'Network Failure / Offline.';

    // Kirim alert ke Telegram saat Offline / Timeout
    await sendTelegramAlert(
      `⚠️ <b>CRITICAL ALERT: SERVER UNREACHABLE!</b>\n\n<b>Target:</b> ${target.name}\n<b>URL:</b> ${target.url}\n<b>Error:</b> ${reason}\n<b>Waktu:</b> ${new Date().toLocaleTimeString('id-ID')} WIB`
    );

    return {
      ...target,
      status: 'DOWN',
      statusCode: isTimeout ? 504 : 500,
      statusText: isTimeout ? 'Gateway Timeout' : 'Network Error',
      errorReason: reason,
      ping: latency,
      sslValid: target.url.startsWith('https://'),
      lastChecked: new Date().toLocaleTimeString('id-ID'),
      history: [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1, 0]
    };
  }
}

export async function GET() {
  const results = await Promise.all(TARGETS.map(checkTarget));
  const total = results.length;
  const upCount = results.filter(r => r.status === 'UP').length;
  const downCount = total - upCount;
  const avgLatency = Math.round(results.reduce((acc, curr) => acc + curr.ping, 0) / total);

  const logs = results.map(r => ({
    id: `${r.id}-${Date.now()}`,
    time: r.lastChecked,
    target: r.name,
    url: r.url,
    status: `${r.statusCode} ${r.statusText}`,
    errorReason: r.errorReason,
    latency: `${r.ping} ms`,
    isOk: r.status === 'UP'
  }));

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    summary: { total, up: upCount, down: downCount, avgLatency, uptimePercentage: ((upCount / total) * 100).toFixed(1) },
    services: results,
    logs
  }, { headers: { 'Cache-Control': 'no-store' } });
}