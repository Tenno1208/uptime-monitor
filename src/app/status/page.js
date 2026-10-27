'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Globe, 
  ShieldCheck, 
  Activity, 
  Zap, 
  Clock, 
  ExternalLink, 
  RefreshCw,
  AlertTriangle,
  Server,
  ArrowUpRight
} from 'lucide-react';

export default function PublicStatusPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [countdown, setCountdown] = useState(15);

  const fetchStatus = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/monitor', { cache: 'no-store' });
      if (!res.ok) throw new Error('Gagal memuat status sistem.');
      const json = await res.json();
      setData(json);
      setError(null);
    } catch (err) {
      setError(err.message || 'Gagal terhubung ke engine pemantau.');
    } finally {
      setLoading(false);
      setCountdown(15);
    }
  }, []);

  // Fetch pertama kali & interval timer
  useEffect(() => {
    fetchStatus();
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          fetchStatus();
          return 15;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [fetchStatus]);

  const allOperational = data?.summary?.down === 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-500 selection:text-white p-4 sm:p-8 md:p-12">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Brand Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800/80 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                <Activity className="w-6 h-6 animate-pulse" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                System Status
              </h1>
            </div>
            <p className="text-slate-400 text-xs sm:text-sm pl-0 sm:pl-10">
              Pantauan performa & ketersediaan layanan web secara langsung.
            </p>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-center">
            <div className="text-xs text-slate-400 bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded-lg flex items-center gap-2 font-mono">
              <Clock className="w-3.5 h-3.5 text-blue-400" />
              Auto refresh: <span className="text-blue-400 font-bold">{countdown}s</span>
            </div>
            <button
              onClick={fetchStatus}
              disabled={loading}
              className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-all disabled:opacity-50"
              title="Refresh Sekarang"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-blue-400' : ''}`} />
            </button>
          </div>
        </header>

        {/* Global Hero Status Banner */}
        {error ? (
          <div className="p-6 rounded-2xl bg-rose-950/30 border border-rose-500/40 text-rose-300 flex items-center gap-4">
            <AlertTriangle className="w-8 h-8 text-rose-400 shrink-0" />
            <div>
              <h2 className="text-base font-bold">Gagal Mengambil Status Sistem</h2>
              <p className="text-xs text-rose-400/80 mt-0.5">{error}</p>
            </div>
          </div>
        ) : data ? (
          <div className={`relative overflow-hidden p-6 sm:p-8 rounded-3xl border transition-all shadow-2xl ${
            allOperational 
              ? 'bg-gradient-to-br from-emerald-950/40 via-slate-900/60 to-slate-950 border-emerald-500/30 text-emerald-300 shadow-emerald-950/20' 
              : 'bg-gradient-to-br from-rose-950/40 via-slate-900/60 to-slate-950 border-rose-500/30 text-rose-300 shadow-rose-950/20'
          }`}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
              <div className="flex items-center gap-5">
                {allOperational ? (
                  <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
                    <XCircle className="w-10 h-10" />
                  </div>
                )}
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                    {allOperational ? 'Semua Sistem Beroperasi Normal' : 'Sebagian Layanan Mengalami Kendala'}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">
                    {allOperational 
                      ? `Seluruh (${data.summary.total}) layanan terdaftar merespons dengan cepat dan lancar.` 
                      : `Terdeteksi ${data.summary.down} layanan yang mengalami penundaan respons atau offline.`}
                  </p>
                </div>
              </div>

              <div className="text-left sm:text-right border-t sm:border-t-0 border-slate-800/80 pt-4 sm:pt-0 w-full sm:w-auto">
                <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold block">Uptime Rate</span>
                <span className="text-2xl sm:text-3xl font-black font-mono text-emerald-400">
                  {data.summary.uptimePercentage}%
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8 rounded-3xl bg-slate-900/40 border border-slate-800 animate-pulse flex items-center justify-center text-slate-500 text-sm">
            Memuat data status sistem...
          </div>
        )}

        {/* Key Performance Indicators Grid */}
        {data && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-4 space-y-1">
              <span className="text-[11px] text-slate-500 font-medium uppercase tracking-wider">Total Service</span>
              <p className="text-xl sm:text-2xl font-bold text-slate-200">{data.summary.total} Web App</p>
            </div>
            <div className="bg-slate-900/50 border border-slate-800/80 rounded-xl p-4 space-y-1">
              <span className="text-[11px] text-slate-500 font-medium uppercase tracking-wider">Rata-rata Ping</span>
              <p className="text-xl sm:text-2xl font-bold font-mono text-cyan-400">{data.summary.avgLatency} ms</p>
            </div>
            <div className="bg-slate-900/50 border border-slate-800/80 rounded-xl p-4 space-y-1">
              <span className="text-[11px] text-slate-500 font-medium uppercase tracking-wider">Enkripsi</span>
              <p className="text-xl sm:text-2xl font-bold text-indigo-400 flex items-center gap-1.5">
                <ShieldCheck className="w-5 h-5" /> Active
              </p>
            </div>
            <div className="bg-slate-900/50 border border-slate-800/80 rounded-xl p-4 space-y-1">
              <span className="text-[11px] text-slate-500 font-medium uppercase tracking-wider">Pemeriksaan</span>
              <p className="text-xl sm:text-2xl font-bold font-mono text-slate-300">
                {new Date(data.timestamp).toLocaleTimeString('id-ID')}
              </p>
            </div>
          </div>
        )}

        {/* Services List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-slate-300 flex items-center gap-2">
              <Server className="w-4 h-4 text-blue-400" />
              Layanan Terdaftar
            </h3>
            <span className="text-xs text-slate-500">Pembaruan otomatis tiap 15s</span>
          </div>

          <div className="space-y-4">
            {data?.services?.map((svc) => {
              const isUp = svc.status === 'UP';
              return (
                <div 
                  key={svc.id} 
                  className={`bg-slate-900/40 border rounded-2xl p-5 sm:p-6 transition-all space-y-4 ${
                    isUp ? 'border-slate-800 hover:border-slate-700' : 'border-rose-500/40 bg-rose-950/10'
                  }`}
                >
                  {/* Top Bar Card */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/50 text-blue-400">
                        <Globe className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-100 text-base">{svc.name}</h4>
                          <span className="text-[10px] font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700/60">
                            {svc.provider}
                          </span>
                        </div>
                        <a 
                          href={svc.url} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="text-xs text-slate-400 hover:text-blue-400 font-mono flex items-center gap-1 mt-0.5 transition-colors"
                        >
                          {svc.url} <ArrowUpRight className="w-3 h-3" />
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center">
                      <a
                        href={svc.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-semibold text-blue-400 hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 px-3 py-1.5 rounded-lg transition-all flex items-center gap-1"
                      >
                        Kunjungi <ExternalLink className="w-3 h-3" />
                      </a>

                      <div className={`px-3.5 py-1.5 rounded-full border text-xs font-bold flex items-center gap-2 ${
                        isUp 
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                          : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                      }`}>
                        <div className={`w-2 h-2 rounded-full ${isUp ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
                        {isUp ? 'Operational' : 'Outage'}
                      </div>
                    </div>
                  </div>

                  {/* Latency & Status info */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-slate-400 pt-2 border-t border-slate-800/60">
                    <div className="flex items-center gap-1.5">
                      <Zap className={`w-3.5 h-3.5 ${svc.ping < 150 ? 'text-emerald-400' : 'text-amber-400'}`} />
                      <span>Response Time: <strong className="text-slate-200 font-mono">{svc.ping} ms</strong></span>
                    </div>
                    <div>
                      HTTP Status: <strong className={`font-mono ${isUp ? 'text-emerald-400' : 'text-rose-400'}`}>{svc.statusCode} {svc.statusText}</strong>
                    </div>
                    <div>
                      Region: <strong className="text-slate-300">{svc.region}</strong>
                    </div>
                  </div>

                  {/* Uptime Bar History */}
                  <div>
                    <div className="flex justify-between text-[10px] text-slate-500 mb-1.5 font-mono">
                      <span>24 Pengecekan Terakhir</span>
                      <span>100% Operational</span>
                    </div>
                    <div className="flex gap-1">
                      {svc.history.map((val, idx) => (
                        <div
                          key={idx}
                          title={`Log #${idx + 1}: ${val === 1 ? 'UP' : 'DOWN'}`}
                          className={`h-5 flex-1 rounded-sm transition-all hover:scale-110 ${
                            val === 1 ? 'bg-emerald-500/80 hover:bg-emerald-400' : 'bg-rose-500 hover:bg-rose-400'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Events / Incident Timeline */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-400" />
            Riwayat Kejadian & Pemeliharaan (Past Incidents)
          </h3>
          <div className="space-y-3">
            <div className="border-l-2 border-emerald-500 pl-4 py-1 space-y-1">
              <p className="text-xs font-bold text-slate-200">Seluruh Sistem Beroperasi Tanpa Gangguan</p>
              <p className="text-[11px] text-slate-400">
                Tidak ada laporan kendala jaringan atau kegagalan server yang terdeteksi dalam 24 jam terakhir.
              </p>
              <span className="text-[10px] text-slate-500 font-mono block pt-1">
                {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center text-xs text-slate-500 pt-6 border-t border-slate-900 flex flex-col sm:flex-row justify-between items-center gap-3">
          <span>Powered by Custom Next.js Uptime Engine</span>
          <div className="flex items-center gap-4">
            <a href="/" className="text-blue-400 hover:underline">Dashboard Admin</a>
            <span className="flex items-center gap-1 text-emerald-500/80">
              <ShieldCheck className="w-3.5 h-3.5" /> Enkripsi HTTPS Active
            </span>
          </div>
        </footer>

      </div>
    </div>
  );
}
