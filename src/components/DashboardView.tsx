import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, Users, ShoppingBag, Heart, BarChart3, 
  ShieldCheck, AlertCircle, Database, PhoneCall, Check, 
  Trash2, Award, ArrowUpRight, Lock, Key, Settings
} from 'lucide-react';
import { dbService, isSupabaseConfigured } from '../lib/supabase';
import { WeddingRSVP, ConsultationRequest } from '../types/database';

export default function DashboardView() {
  const [rsvps, setRsvps] = useState<WeddingRSVP[]>([]);
  const [consultations, setConsultations] = useState<ConsultationRequest[]>([]);
  const [role, setRole] = useState<'Super Admin' | 'Admin' | 'Editor'>('Super Admin');
  const [isAuthenticated, setIsAuthenticated] = useState(true); // default true for immediate preview availability, can toggle
  const [username, setUsername] = useState('muhLuthfi.23');
  const [password, setPassword] = useState('password');

  useEffect(() => {
    async function loadData() {
      const r = await dbService.getRSVPs();
      const c = await dbService.getConsultations();
      setRsvps(r);
      setConsultations(c);
    }
    loadData();
  }, []);

  const handleStatusChange = async (id: string, status: 'pending' | 'contacted' | 'completed') => {
    const success = await dbService.updateConsultationStatus(id, status);
    if (success) {
      const refreshed = await dbService.getConsultations();
      setConsultations(refreshed);
    }
  };

  const totalGuests = rsvps
    .filter(r => r.attendance === 'hadir')
    .reduce((sum, r) => sum + r.guestsCount, 0);

  const pendingConsultations = consultations.filter(c => c.status === 'pending').length;

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 liquid-glass rounded-3xl border border-white/80 shadow-lg text-slate-800">
        <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4 text-emerald-600">
          <Lock className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-center mb-1">Akses Dashboard Keamanan</h2>
        <p className="text-xs text-slate-400 text-center mb-6">Masuk menggunakan kredensial administrator terdaftar.</p>
        
        <form onSubmit={(e) => { e.preventDefault(); setIsAuthenticated(true); }} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Username / Email</label>
            <input 
              type="text" 
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
              value={username} 
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Password</label>
            <input 
              type="password" 
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button 
            type="submit" 
            className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg cursor-pointer"
          >
            Masuk ke Dashboard Sistem
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="relative pb-24 pattern-dots pt-4 text-slate-800">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        
        {/* UPPER STATUS DASHBOARD */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-bold text-emerald-700 uppercase tracking-widest flex items-center gap-1.5">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
              <span>Educita Control Panel</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Ringkasan Analitik & Integrasi</h1>
          </div>
          
          {/* User/Role switch widget */}
          <div className="flex items-center gap-3 bg-white p-2 border border-slate-200 rounded-xl shadow-sm text-xs">
            <span className="font-semibold text-slate-500 uppercase text-[9px] tracking-wider pl-2">ROLE AKTIF:</span>
            <select 
              className="bg-slate-50 border border-slate-200 rounded-lg py-1 px-2.5 font-bold text-[11px] text-emerald-800 focus:outline-none"
              value={role}
              onChange={(e) => setRole(e.target.value as any)}
            >
              <option value="Super Admin">Super Admin (Luthfi)</option>
              <option value="Admin">Administrator Utama</option>
              <option value="Editor">Konten Editor</option>
            </select>
            <button 
              onClick={() => setIsAuthenticated(false)}
              className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-[10px] uppercase"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* SUPABASE CONNECTION NOTIFIER WIDGET */}
        <div className={`p-4 rounded-2xl mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border ${
          isSupabaseConfigured 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-950' 
            : 'bg-amber-50 border-amber-200 text-amber-950'
        }`}>
          <div className="flex items-start sm:items-center gap-3">
            <Database className={`w-5 h-5 shrink-0 mt-0.5 sm:mt-0 ${isSupabaseConfigured ? 'text-emerald-600' : 'text-amber-600'}`} />
            <div>
              <h3 className="text-xs font-bold">
                {isSupabaseConfigured ? 'Supabase Database Terkoneksi (Production)' : 'Simulator Mode: Berjalan dengan Local Storage Engine (Sandbox)'}
              </h3>
              <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">
                {isSupabaseConfigured 
                  ? 'Kunci API valid ditemukan. Mutasi data tersimpan langsung pada cluster cloud PostgreSQL Supabase.' 
                  : 'Sempurna untuk peninjauan langsung! Semua modifikasi konten di Admin Panel tersimpan aman di peramban Anda. DDL SQL Schema siap disalin di menu CMS.'
                }
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-widest rounded-full ${
              isSupabaseConfigured ? 'bg-emerald-200 text-emerald-800' : 'bg-amber-200 text-amber-800'
            }`}>
              {isSupabaseConfigured ? 'CLOUD' : 'LOCAL ENGINE'}
            </span>
          </div>
        </div>

        {/* FOUR STATS CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {[
            { label: 'Sekolah Menghubungi', value: consultations.length, change: `+${pendingConsultations} Pending`, icon: <PhoneCall className="w-5 h-5 text-emerald-600" /> },
            { label: 'Estimasi Kursi Wedding', value: `${totalGuests} Kursi`, change: `${rsvps.length} Konfirmasi`, icon: <Heart className="w-5 h-5 text-pink-600 fill-pink-100" /> },
            { label: 'Modul Digital', value: '11 Terpasang', change: 'Aman 100%', icon: <ShoppingBag className="w-5 h-5 text-teal-600" /> },
            { label: 'Lighthouse Score', value: '98/100', change: 'Sangat Cepat', icon: <TrendingUp className="w-5 h-5 text-amber-600" /> }
          ].map((stat, i) => (
            <div key={i} className="liquid-glass p-5 rounded-2xl border border-white/60 relative">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{stat.label}</span>
                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100">
                  {stat.icon}
                </div>
              </div>
              <div className="text-xl sm:text-2xl font-black mt-3 text-slate-950 font-mono">{stat.value}</div>
              <div className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full w-fit mt-2">{stat.change}</div>
            </div>
          ))}
        </div>

        {/* TWO-COLUMN CHARTS & RECENT SIGNUPS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
          
          {/* ANALYTICS PLOTS CHANGER (SVG ACCURACY) */}
          <div className="lg:col-span-7 liquid-glass p-6 md:p-8 rounded-3xl border border-white/60">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-2 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-600" />
              <span>Grafik Pertumbuhan Digitalisasi Sekolah</span>
            </h3>
            <p className="text-[11px] text-slate-400 mb-6">Akumulasi instansi mitra sekolah dasar & menengah yang didigitalisasi oleh sistem Educita periode 2023 - 2026.</p>

            {/* Custom high fidelity SVG chart */}
            <div className="h-64 relative bg-slate-50/50 rounded-2xl p-4 border border-slate-100 flex flex-col justify-between">
              {/* SVG Map of lines */}
              <svg className="absolute inset-0 w-full h-full p-4" viewBox="0 0 400 200" preserveAspectRatio="none">
                {/* Horizontal Gridlines */}
                <line x1="0" y1="50" x2="400" y2="50" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4" />
                <line x1="0" y1="100" x2="400" y2="100" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4" />
                <line x1="0" y1="150" x2="400" y2="150" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4" />
                
                {/* Emerald Gradient Glow fill */}
                <path 
                  d="M 10 190 Q 100 130 200 90 T 390 30 L 390 190 Z" 
                  fill="url(#emeraldGrad)" 
                  opacity="0.15"
                />

                {/* Main Curve */}
                <path 
                  d="M 10 190 Q 100 130 200 90 T 390 30" 
                  fill="none" 
                  stroke="#10b981" 
                  strokeWidth="3.5" 
                  strokeLinecap="round"
                />

                {/* Dots along paths */}
                <circle cx="10" cy="190" r="5" fill="#047857" border="2px solid white" />
                <circle cx="130" cy="120" r="5" fill="#047857" />
                <circle cx="260" cy="80" r="5" fill="#047857" />
                <circle cx="390" cy="30" r="5" fill="#047857" />

                {/* Helper definitions */}
                <defs>
                  <linearGradient id="emeraldGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#ffffff" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Grid Y Axis values */}
              <div className="absolute left-6 top-8 text-[9px] font-bold text-slate-400 uppercase">60 Sekolah</div>
              <div className="absolute left-6 top-32 text-[9px] font-bold text-slate-400 uppercase">30 Sekolah</div>
              <div className="absolute left-6 bottom-8 text-[9px] font-bold text-slate-400 uppercase">0</div>

              {/* Grid X Axis markers */}
              <div className="mt-auto flex justify-between px-6 text-[10px] font-bold text-slate-400 pt-4 z-10">
                <span>Tahun 2023 (Riset)</span>
                <span>Tahun 2024</span>
                <span>Tahun 2025</span>
                <span>Tahun 2026 (Kini)</span>
              </div>
            </div>
          </div>

          {/* WEDDING RSVP CONDENSED LOGS */}
          <div className="lg:col-span-5 liquid-glass p-6 rounded-3xl border border-white/60">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-1.5 text-pink-700">
              <Heart className="w-4 h-4 fill-pink-500 text-pink-500" />
              <span>RSVP Konfirmasi Tamu</span>
            </h3>

            {rsvps.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">Belum ada RSVP terisi.</p>
            ) : (
              <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                {rsvps.map((rv, idx) => (
                  <div key={idx} className="p-3 bg-white hover:bg-slate-50 border border-slate-100 rounded-xl flex items-start justify-between text-xs transition-all">
                    <div>
                      <div className="font-bold text-slate-800">{rv.name}</div>
                      <p className="text-[10px] text-slate-400 mb-1">Status: <span className="font-semibold text-emerald-700">{rv.attendance}</span></p>
                      {rv.wishes && <p className="text-[10px] italic text-slate-500 leading-relaxed">"{rv.wishes}"</p>}
                    </div>
                    <span className="px-2 py-0.5 bg-slate-100 font-mono text-[10px] font-bold text-slate-600 rounded">
                      {rv.guestsCount} Pax
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* CONSULTATION ENQUIRIES TABLE & ADMIN ACTIONS */}
        <div className="liquid-glass p-6 md:p-8 rounded-3xl border border-white/60">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-base font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-600" />
                <span>Pengaduan & Permohonan Survei Digitalisasi</span>
              </h3>
              <p className="text-[11px] text-slate-400 mt-1">Status data pengajuan konsultasi sekolah yang dikirimkan via form landing page.</p>
            </div>
            
            <div className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-100 px-3.5 py-1.5 rounded-full w-fit">
              {pendingConsultations} Pengajuan Menunggu Follow-Up
            </div>
          </div>

          {consultations.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-xs">
              Belum ada permohonan konsultasi masuk dari sekolah.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-2">Asal Sekolah</th>
                    <th className="py-3 px-2">Nama Penghubung</th>
                    <th className="py-3 px-2">No. WhatsApp</th>
                    <th className="py-3 px-2">Kebutuhan Utama</th>
                    <th className="py-3 px-2">Status</th>
                    <th className="py-3 px-2 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {consultations.map((con) => (
                    <tr key={con.id} className="hover:bg-white/50 transition-colors">
                      <td className="py-3 px-2 font-bold text-slate-900">{con.schoolName}</td>
                      <td className="py-3 px-2 font-medium text-slate-700">{con.contactName}</td>
                      <td className="py-3 px-2 font-mono text-slate-600">{con.phone}</td>
                      <td className="py-3 px-2 text-slate-600 font-semibold">{con.serviceNeeded}</td>
                      <td className="py-3 px-2">
                        <span className={`px-2 py-0.5 rounded font-extrabold text-[9px] uppercase tracking-wider ${
                          con.status === 'pending' ? 'bg-amber-100 text-amber-700' : 
                          con.status === 'contacted' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {con.status}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-right space-x-1.5">
                        {con.status === 'pending' && (
                          <button 
                            onClick={() => handleStatusChange(con.id, 'contacted')}
                            className="px-2.5 py-1 bg-blue-50 text-blue-700 font-bold rounded hover:bg-blue-100 text-[10px] cursor-pointer"
                          >
                            Tandai Menghubungi
                          </button>
                        )}
                        {con.status !== 'completed' && (
                          <button 
                            onClick={() => handleStatusChange(con.id, 'completed')}
                            className="px-2.5 py-1 bg-emerald-50 text-emerald-750 font-bold rounded hover:bg-emerald-100 text-[10px] cursor-pointer"
                          >
                            Tandai Selesai SURVEI
                          </button>
                        )}
                        {con.status === 'completed' && (
                          <span className="text-[10px] font-bold text-emerald-600 flex items-center justify-end gap-1">
                            <Check className="w-3.5 h-3.5" />
                            <span>Done!</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
