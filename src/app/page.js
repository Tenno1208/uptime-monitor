'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  Activity, 
  Server, 
  Globe, 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  Clock, 
  Zap,
  ExternalLink,
  AlertOctagon,
  Download,
  Printer,
  ShieldCheck
} from 'lucide-react';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMonitorData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/monitor', { cache: 'no-store' });
      const result = await res.json();
      setData(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMonitorData();
    const interval = setInterval(fetchMonitorData, 15000);
    return () => clearInterval(interval);
  }, [fetchMonitorData]);

  // Fitur Export CSV
  const handleExportCSV = () => {
    if (!data) return;
    let csvContent = "data:text/csv;charset=utf-8,Waktu,Target Web,URL,Status Code,Latensi,Penyebab Error\n";
    
    data.logs.forEach(log => {
      const reason = log.errorReason ? log.errorReason.replace(/,/g, ' ') : 'OK';
      csvContent += `${log.time},${log.target},${log.url},"${log.status}",${log.latency},"${reason}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Uptime_Report_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const allOperational = data?.summary?.down === 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-3">
              <Activity className="w-8 h-8 text-blue-500 animate-pulse" />
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">System Monitor Center</h1>
            </div>
            <p className="text-slate-400 text-sm mt-1">
              Live Health Check & Latency Monitor untuk Duo Chaos (Vercel) & Kost Track (Render).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-medium px-3 py-2 rounded-lg transition-all flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-blue-400" /> Export CSV
            </button>

            <button
              onClick={() => window.print()}
              className="bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-medium px-3 py-2 rounded-lg transition-all flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5 text-emerald-400" /> Cetak PDF
            </button>

            <button
              onClick={fetchMonitorData}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              Cek Sekarang
            </button>
          </div>
        </div>

        {/* Global Status Banner */}
        {data && (
          <div className={`p-5 rounded-2xl border flex items-center justify-between gap-4 ${
            allOperational ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300' : 'bg-rose-950/30 border-rose-500/30 text-rose-300'
          }`}>
            <div className="flex items-center gap-4">
              {allOperational ? <CheckCircle2 className="w-8 h-8 text-emerald-400 shrink-0" /> : <XCircle className="w-8 h-8 text-rose-400 shrink-0" />}
              <div>
                <h2 className="text-base font-bold">
                  {allOperational ? 'Semua Website Beroperasi Normal' : 'Terdeteksi Gangguan pada Website'}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  {allOperational ? `Seluruh (${data.summary.total}) website merespons dengan status 200 OK.` : `${data.summary.down} website sedang bermasalah.`}
                </p>
              </div>
            </div>
            
            <a href="/status" target="_blank" className="text-xs text-blue-400 hover:underline flex items-center gap-1">
              Buka Halaman Status Publik <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}

        {/* Cards Website */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-5">
            {data?.services?.map((item) => {
              const isUp = item.status === 'UP';
              return (
                <div key={item.id} className={`border rounded-2xl p-6 space-y-4 ${isUp ? 'bg-slate-900/40 border-slate-800' : 'bg-rose-950/20 border-rose-500/40'}`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="p-3.5 rounded-xl border bg-slate-800/80 border-slate-700/50 text-blue-400">
                        <Globe className="w-7 h-7" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-lg font-bold text-slate-100">{item.name}</h4>
                          <span className="text-[10px] font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">{item.provider}</span>
                        </div>
                        <p className="text-xs text-slate-400 font-mono mt-0.5">{item.url}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <a href={item.url} target="_blank" rel="noreferrer" className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-3.5 py-2 rounded-xl flex items-center gap-1.5">
                        Kunjungi Web <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                      <div className={`px-3.5 py-2 rounded-xl border text-xs font-bold flex items-center gap-2 ${isUp ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-rose-500/10 border-rose-500/30 text-rose-400'}`}>
                        <div className={`w-2.5 h-2.5 rounded-full ${isUp ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                        {item.status} ({item.statusCode})
                      </div>
                    </div>
                  </div>

                  {!isUp && (
                    <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-500/50 text-rose-200 text-xs space-y-1">
                      <div className="flex items-center gap-2 font-bold text-rose-300">
                        <AlertOctagon className="w-4 h-4 text-rose-400" /> Penyebab Error:
                      </div>
                      <p className="pl-6 font-mono text-rose-200/90">{item.errorReason}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2 border-t border-slate-800/80 text-xs text-slate-400">
                    <div className="bg-slate-950/50 p-2.5 rounded-lg border border-slate-800/60">
                      <span className="text-slate-500 block text-[10px]">Response Time</span>
                      <span className="font-mono font-bold text-slate-200 flex items-center gap-1 mt-0.5">
                        <Zap className="w-3.5 h-3.5 text-amber-400" /> {item.ping} ms
                      </span>
                    </div>
                    <div className="bg-slate-950/50 p-2.5 rounded-lg border border-slate-800/60">
                      <span className="text-slate-500 block text-[10px]">HTTP Status</span>
                      <span className={`font-mono font-bold mt-0.5 ${isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {item.statusCode} {item.statusText}
                      </span>
                    </div>
                    <div className="bg-slate-950/50 p-2.5 rounded-lg border border-slate-800/60">
                      <span className="text-slate-500 block text-[10px]">Enkripsi SSL</span>
                      <span className="font-mono font-bold text-indigo-400 flex items-center gap-1 mt-0.5">
                        <ShieldCheck className="w-3.5 h-3.5" /> HTTPS Valid
                      </span>
                    </div>
                    <div className="bg-slate-950/50 p-2.5 rounded-lg border border-slate-800/60">
                      <span className="text-slate-500 block text-[10px]">Region</span>
                      <span className="font-mono font-bold text-slate-300 mt-0.5 block truncate">{item.region}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}