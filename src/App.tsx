import React, { useState, useEffect } from 'react';
import { 
  Globe, GraduationCap, Monitor, PhoneCall, Gift, 
  UserCheck, ShieldAlert, Laptop, Menu, X, Landmark, 
  ArrowRight, ShieldCheck, Heart, Info, Lock, Link, AlertTriangle
} from 'lucide-react';
import { dbService } from './lib/supabase';
import { weddingDb } from './lib/weddingDb';

// Importing page views
import HomeView from './components/HomeView';
import ProfileView from './components/ProfileView';
import ShopView from './components/ShopView';
import WeddingView from './components/WeddingView';
import DashboardView from './components/DashboardView';
import AdminView from './components/AdminView';
import AdminWeddingView from './components/AdminWeddingView';
import WeddingEditorView from './components/WeddingEditorView';

export default function App() {
  // Sync page state with window.location.hash
  const [currentPath, setCurrentPath] = useState<string>('/');
  const [guestName, setGuestName] = useState<string>('Tamu Undangan');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [consultationOpen, setConsultationOpen] = useState(false);
  const [activeShopSlug, setActiveShopSlug] = useState<string | null>(null);

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('educita_theme_dark') === 'true';
    }
    return false;
  });

  useEffect(() => {
    localStorage.setItem('educita_theme_dark', String(isDarkMode));
  }, [isDarkMode]);

  useEffect(() => {
    weddingDb.initialize().catch(err => console.error('[App] Failed database initialization:', err));
  }, []);

  // Form state for floating general consultation
  const [isBookingSuccess, setIsBookingSuccess] = useState(false);
  const [generalConsultationForm, setGeneralConsultationForm] = useState({
    schoolName: '',
    contactName: '',
    phone: '',
    serviceNeeded: 'Website Sekolah Modern',
    message: ''
  });

  useEffect(() => {
    // Parse initial route on load
    const handleHashChange = () => {
      const hash = window.location.hash || '#/';
      let path = hash.replace(/^#/, '');
      
      // Parse query params if any
      const queryIdx = path.indexOf('?');
      let cleanPath = path;
      if (queryIdx !== -1) {
        cleanPath = path.substring(0, queryIdx);
        const queryStr = path.substring(queryIdx + 1);
        const urlParams = new URLSearchParams(queryStr);
        const toVal = urlParams.get('to');
        if (toVal) {
          setGuestName(toVal);
        }
      } else {
        // Fallback check standard search params
        const urlParams = new URLSearchParams(window.location.search);
        const toVal = urlParams.get('to');
        if (toVal) {
          setGuestName(toVal);
        } else {
          setGuestName('Tamu Undangan');
        }
      }

      // Handle shop deep nested path Simulation
      if (cleanPath.startsWith('/shop/')) {
        const slug = cleanPath.replace('/shop/', '');
        setActiveShopSlug(slug);
        setCurrentPath('/shop');
      } else {
        setCurrentPath(cleanPath);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // trigger initial

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (path: string, params?: { [key: string]: string }) => {
    let targetHash = `#${path}`;
    if (params) {
      const query = new URLSearchParams(params).toString();
      targetHash += `?${query}`;
    }
    window.location.hash = targetHash;
    setMobileMenuOpen(false);
  };

  const handleGeneralConsultationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!generalConsultationForm.schoolName || !generalConsultationForm.contactName || !generalConsultationForm.phone) {
      alert('Mohon isi nama sekolah, nama kontak, dan nomor WhatsApp Anda.');
      return;
    }
    await dbService.addConsultation(generalConsultationForm);
    setIsBookingSuccess(true);
    setTimeout(() => {
      setIsBookingSuccess(false);
      setConsultationOpen(false);
      setGeneralConsultationForm({
        schoolName: '',
        contactName: '',
        phone: '',
        serviceNeeded: 'Website Sekolah Modern',
        message: ''
      });
    }, 4500);
  };

  // Helper list of routes for the smart simulator select options
  const previewRoutes = [
    { label: 'Landing Page Portal (Educita.id)', path: '/' },
    { label: 'Founder Bio Profile (/profile/luthfi)', path: '/profile/luthfi' },
    { label: 'Digital Store Catalog (/shop)', path: '/shop' },
    { label: 'Wedding Invitation (/wedding/hanum-luthfi)', path: '/wedding/hanum-luthfi', hasGuest: true },
    { label: 'Wedding Editor (/wedding/.../editor)', path: '/wedding/hanum-luthfi/editor' },
    { label: 'Admin Metrics Analytics (/dashboard)', path: '/dashboard' },
    { label: 'CMS Content Panel (/admin)', path: '/admin' }
  ];

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-[#F4F7F6] text-slate-800'} flex flex-col relative antialiased transition-colors duration-300`}>
      
      {/* ==========================================
          A. SMART APPLE-LEVEL VIRTUAL BROWSER FRAME
          ========================================== */}
      <div className="bg-slate-900 text-slate-200 px-4 py-2.5 flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-slate-950 text-xs shadow-md relative z-40">
        
        {/* Browser Mac Dots & Logo indicator */}
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5 shrink-0">
            <span className="w-3 h-3 rounded-full bg-rose-500 block"></span>
            <span className="w-3 h-3 rounded-full bg-amber-500 block"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-500 block"></span>
          </div>
          <div className="h-4 w-[1px] bg-slate-700 hidden sm:block"></div>
          <span className="font-bold text-[10px] tracking-widest text-emerald-400 hidden sm:inline uppercase">V1.0 PRODUCTION SERVER</span>
        </div>

        {/* Dynamic Glass URL Bar */}
        <div className="flex-1 max-w-lg w-full bg-slate-950/70 border border-slate-800 rounded-lg px-3 py-1.5 flex items-center justify-between text-slate-400 font-mono text-[11px]">
          <div className="flex items-center gap-2 truncate">
            <Lock className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span className="text-slate-500">https://</span>
            <span className="text-emerald-400 font-bold shrink-0">educita.id</span>
            <span className="text-slate-200">
              {currentPath}
              {currentPath === '/shop' && activeShopSlug ? `/${activeShopSlug}` : ''}
              {currentPath === '/wedding/hanum-luthfi' ? `?to=${encodeURIComponent(guestName).replace(/%20/g, '+')}` : ''}
            </span>
          </div>
          
          <span className="text-[10px] bg-emerald-950 text-emerald-400 font-extrabold px-1.5 py-0.5 rounded uppercase tracking-widest shrink-0 ml-1.5">
            SECURE
          </span>
        </div>

        {/* Shortcut Quick Switch Selector Dropdown */}
        <div className="flex items-center gap-2 text-slate-300">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest hidden lg:inline">Aksi Cepat:</span>
          <select 
            className="bg-slate-800 border-none rounded-md px-3 py-1.5 font-bold text-[10px] text-white focus:outline-none cursor-pointer"
            value={currentPath}
            onChange={(e) => {
              const selectedPath = e.target.value;
              if (selectedPath === '/wedding/hanum-luthfi') {
                navigateTo(selectedPath, { to: 'Bapak Drs. Hermawan, M.Pd.' });
              } else {
                navigateTo(selectedPath);
              }
            }}
          >
            {previewRoutes.map((r, i) => (
              <option key={i} value={r.path}>{r.label}</option>
            ))}
          </select>

          {/* Quick wedding modifier parameter text input */}
          {currentPath === '/wedding/hanum-luthfi' && (
            <div className="flex items-center gap-1.5 pl-2 border-l border-slate-700 bg-slate-800 rounded px-2 py-1">
              <span className="text-[9px] text-slate-400 font-bold">Ubah Nama:</span>
              <input 
                type="text" 
                className="bg-slate-900 text-white font-bold text-[10px] border-none px-1 rounded max-w-[110px] focus:outline-none"
                placeholder="Luthfi"
                value={guestName}
                onChange={(e) => {
                  setGuestName(e.target.value);
                  navigateTo('/wedding/hanum-luthfi', { to: e.target.value });
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* ==========================================
          B. PRIMARY HEADER SITE NAVIGATION
          ========================================== */}
      {!currentPath.includes('wedding') && (
        <nav className={`sticky top-0 z-30 ${isDarkMode ? 'bg-slate-900/60 border-b border-slate-850 text-white' : 'bg-white/30 border-b border-white/50 text-[#1E293B]'} backdrop-blur-md shadow-xs px-6 sm:px-12 py-5 flex items-center justify-between transition-colors duration-300`}>
        <div className="flex items-center gap-8">
          {/* Logo brand with geometric nested structure */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigateTo('/')}>
            <div className="w-10 h-10 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200/20 transition duration-350">
              <div className="w-5 h-5 bg-white rounded-sm rotate-45 flex items-center justify-center text-emerald-600 font-black text-xs">E</div>
            </div>
            <div>
              <span className={`text-xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'} leading-none block`}>EDUCITA<span className="text-emerald-500 font-extrabold">.id</span></span>
              <span className="text-[9px] font-mono text-slate-400 tracking-widest uppercase block leading-none mt-0.5">School Digitalization</span>
            </div>
          </div>

          {/* Desktop links navigation with Geometric Balance */}
          {currentPath !== '/wedding/hanum-luthfi' && (
            <div className="hidden md:flex items-center gap-6">
              {[
                { label: 'Beranda Portal', path: '/' },
                { label: 'Katalog SKU Toko', path: '/shop' },
                { label: 'Profil Luthfi', path: '/profile/luthfi' },
                { label: 'Administrasi', path: '/dashboard' },
                { label: 'CMS Control', path: '/admin' }
              ].map((lnk, idx) => (
                <button 
                  key={idx}
                  onClick={() => {
                    setActiveShopSlug(null);
                    navigateTo(lnk.path);
                  }}
                  className={`text-[13px] font-semibold transition duration-200 cursor-pointer ${
                    currentPath === lnk.path 
                      ? `${isDarkMode ? 'text-emerald-400 bg-slate-805/70 border border-slate-750 rounded-full px-4 py-1.5 shadow-sm font-bold' : 'text-emerald-600 bg-white/70 border border-white rounded-full px-4 py-1.5 shadow-xs font-bold'}` 
                      : `${isDarkMode ? 'text-slate-350 hover:text-emerald-450' : 'text-slate-600 hover:text-emerald-600'}`
                  }`}
                >
                  {lnk.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right CTA with Geometric elements */}
        <div className="flex items-center gap-3">
          {currentPath === '/wedding/hanum-luthfi' ? (
            <div className="flex items-center gap-1 text-[10px] font-bold text-pink-700 bg-pink-50 border border-pink-100 px-3 py-1.5 rounded-full shadow-sm uppercase tracking-wider">
              <Heart className="w-3.5 h-3.5 fill-pink-600 text-pink-600 animate-pulse" />
              <span>Wedding Mode Active</span>
            </div>
          ) : (
            <>
              {/* Sun & Moon Theme Toggle Pill */}
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                  isDarkMode 
                    ? 'bg-slate-800 border border-slate-700 text-amber-405 hover:bg-slate-700' 
                    : 'bg-white border border-slate-200 text-slate-800 hover:bg-slate-50 shadow-2xs'
                } cursor-pointer`}
                title={isDarkMode ? "Ganti ke Mode Terang" : "Ganti ke Mode Gelap"}
              >
                {isDarkMode ? (
                  <svg className="w-4 h-4 fill-amber-400 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>
                ) : (
                  <svg className="w-4 h-4 fill-slate-850 text-slate-850" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
                )}
              </button>

              <button 
                id="btn-nav-whatsapp"
                onClick={() => setConsultationOpen(true)}
                className="hidden sm:flex px-6 py-2.5 bg-emerald-600 text-white text-xs font-bold rounded-full shadow-lg shadow-emerald-200/30 hover:bg-emerald-700 hover:scale-102 transform transition-all items-center gap-1.5 cursor-pointer"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Konsultasi Gratis</span>
              </button>
              
              {/* Reset simulator database cache */}
              <button 
                onClick={() => {
                  if (confirm('Atur ulang seluruh simulator database lokal ke data bawaan pabrik?')) {
                    localStorage.clear();
                    window.location.reload();
                  }
                }}
                className={`hidden lg:flex px-4 py-2.5 rounded-full border ${isDarkMode ? 'border-slate-800 bg-slate-900 text-slate-400 hover:bg-slate-850' : 'border-slate-300 bg-white/30 text-slate-600 hover:bg-white'} backdrop-blur font-bold text-[10px] uppercase shadow-xs cursor-pointer transition`}
                title="Reset local storage"
              >
                Reset DB Sandbox
              </button>
            </>
          )}

          {/* Toggle Mobile menu button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`md:hidden w-9 h-9 border ${isDarkMode ? 'border-slate-800 text-slate-300 bg-slate-900' : 'border-slate-200 text-slate-600 bg-white'} rounded-lg flex items-center justify-center hover:bg-slate-50 cursor-pointer text-xs`}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>
      )}

      {/* ==========================================
          C. MOBILE HIDDEN NAVIGATION PANEL
          ========================================== */}
      {mobileMenuOpen && !currentPath.includes('wedding') && (
        <div className="md:hidden bg-white border-b border-slate-200 px-6 py-6 space-y-4 absolute top-[110px] left-0 right-0 z-30 shadow-lg text-slate-800">
          <div className="flex flex-col gap-3">
            {[
              { label: 'Portal Utama (Educita.id)', path: '/' },
              { label: 'Katalog SKU Toko & Servis', path: '/shop' },
              { label: 'Profil Luthfi (Founder)', path: '/profile/luthfi' },
              { label: 'Undangan Pernikahan Hanum-Luthfi', path: '/wedding/hanum-luthfi', params: { to: 'Bapak Drs. Hermawan, M.Pd.' } },
              { label: 'Dashboard Analitik', path: '/dashboard' },
              { label: 'CMS Pengelolaan Konten', path: '/admin' }
            ].map((lnk, idx) => (
              <button 
                key={idx}
                onClick={() => {
                  setActiveShopSlug(null);
                  navigateTo(lnk.path, lnk.params);
                }}
                className={`py-3.5 text-sm font-bold text-left border-b border-slate-50 ${
                  currentPath === lnk.path ? 'text-emerald-700 font-extrabold pl-2 border-l-2 border-emerald-500' : 'text-slate-600'
                }`}
              >
                {lnk.label}
              </button>
            ))}
          </div>

          <button 
            onClick={() => { setMobileMenuOpen(false); setConsultationOpen(true); }}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs cursor-pointer flex items-center justify-center gap-2"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Konsultasi Gratis</span>
          </button>
        </div>
      )}

      {/* ==========================================
          D. CENTRAL ROUTING VIEW DECIDER
          ========================================== */}
      <main className="flex-1">
        {currentPath === '/' && (
          <HomeView 
            onNavigate={(route) => navigateTo(route)} 
            onOpenConsultation={() => setConsultationOpen(true)}
            onServiceSelect={(srvName) => {
              navigateTo('/shop');
              // Pre-fill query input or go directly to shop
            }}
            isDarkMode={isDarkMode}
          />
        )}
        {currentPath === '/profile/luthfi' && <ProfileView />}
        {currentPath === '/shop' && (
          <ShopView 
            selectedSlug={activeShopSlug || undefined} 
            onSelectSlug={(slug) => {
              setActiveShopSlug(slug);
              if (slug) {
                navigateTo(`/shop/${slug}`);
              } else {
                navigateTo('/shop');
              }
            }} 
          />
        )}
        {currentPath === '/wedding/hanum-luthfi' && (
          <WeddingView toGuest={guestName} />
        )}
        {currentPath === '/wedding/hanum-luthfi/editor' && (
          <WeddingEditorView />
        )}
        {currentPath.startsWith('/admin/wedding') && (
          <AdminWeddingView />
        )}
        {currentPath === '/dashboard' && <DashboardView />}
        {currentPath === '/admin' && <AdminView />}
      </main>

      {/* ==========================================
          E. SITE FOOTER SECTION
          ========================================== */}
      {!currentPath.includes('wedding') && (
        <footer className="bg-slate-900 text-slate-400 pt-16 pb-12 border-t border-slate-950 px-4 sm:px-8 mt-auto">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 mb-12">
            
            {/* Column 1 info */}
            <div className="md:col-span-5 space-y-4">
              <div className="flex items-center gap-2 text-white font-bold">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white text-base font-black">E</div>
                <span className="text-base tracking-tight font-extrabold">Educita<span className="text-emerald-500">.id</span></span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Educita adalah digital transformation partner terintegrasi untuk sekolah-sekolah di Indonesia. Menyediakan ekosistem digital hardware & software terlengkap demi kesiapan mutu pendidikan masa kini.
              </p>
              <div className="text-xs text-slate-400">
                Email: <span className="text-slate-300 font-semibold">muhLuthfi.23@gmail.com</span><br />
                Hotline WA: <span className="text-emerald-500 font-bold font-mono">0812-3456-7890</span>
              </div>
            </div>

            {/* Column 2 links */}
            <div className="md:col-span-3">
              <h4 className="text-white text-xs font-bold tracking-widest uppercase mb-4">Solusi Sekolah</h4>
              <ul className="space-y-2 text-xs">
                <li><button onClick={() => navigateTo('/')} className="hover:text-white hover:underline cursor-pointer text-left">Website & PPDB Sekolah</button></li>
                <li><button onClick={() => navigateTo('/')} className="hover:text-white hover:underline cursor-pointer text-left">Sistem Kelulusan Online (SKL)</button></li>
                <li><button onClick={() => navigateTo('/')} className="hover:text-white hover:underline cursor-pointer text-left">E-Office Surat Menyurat</button></li>
                <li><button onClick={() => navigateTo('/')} className="hover:text-white hover:underline cursor-pointer text-left">Instalasi Laboratorium & Server</button></li>
              </ul>
            </div>

            {/* Column 3 compliance info */}
            <div className="md:col-span-4 space-y-4 border-l border-slate-800 pl-0 md:pl-8">
              <h4 className="text-white text-xs font-bold tracking-widest uppercase mb-4">Kompilasi BOS ARKAS</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Seluruh pengurusan dokumen kelengkapan administrasi Educita (Kuitansi digital, lembar disposisi penawaran bupati, NPWP legalitas, juknis BOS) sepenuhnya tervalidasi ramah pelaporan ARKAS Kementerian Pendidikan.
              </p>
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-300 bg-slate-950 px-3.5 py-1.5 rounded-lg border border-slate-800">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>100% Legal & Bergaransi</span>
              </div>
            </div>

          </div>

          <div className="max-w-6xl mx-auto border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
            <div>
              &copy; 2026 <span className="text-slate-400 font-bold">Educita.id</span>. All rights reserved.
            </div>
            <div className="flex gap-4">
              <span className="hover:text-slate-300 cursor-pointer">Syarat & Ketentuan</span>
              <span>&bull;</span>
              <span className="hover:text-slate-300 cursor-pointer">Kebijakan Privasi</span>
              <span>&bull;</span>
              <button onClick={() => navigateTo('/dashboard')} className="hover:text-emerald-400 cursor-pointer text-xs font-bold font-mono">Secured Admin Login</button>
            </div>
          </div>
        </footer>
      )}

      {/* ==========================================
          F. REUSABLE FLOATING CONSULTATION MODAL
          ========================================== */}
      {consultationOpen && (
        <div className="fixed inset-0 bg-[#0c1411]/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[32px] p-6 sm:p-8 max-w-md w-full shadow-2xl relative text-slate-800 border border-white/40">
            
            {/* Close button */}
            <button 
              onClick={() => setConsultationOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center hover:bg-slate-200 cursor-pointer text-xs font-bold text-slate-500"
            >
              ✕
            </button>

            {isBookingSuccess ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShieldCheck className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold">Permohonan Dikirim!</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Terima kasih! Pemesanan jadwal survei atau permohonan konsultasi penawaran BOS Anda telah didelegasikan ke tim internal. Kami akan segera menghubungi perwakilan sekolah dalam waktu dekat.
                </p>
              </div>
            ) : (
              <form onSubmit={handleGeneralConsultationSubmit} className="space-y-4">
                <h3 className="text-xl font-black text-slate-950 tracking-tight">Konsultasi & Survei Gratis</h3>
                <p className="text-[11px] text-slate-500 leading-relaxed font-medium">Tim insinyur Educita siap merancang pelaporan anggaran IT dan pemetaan server sekolah Anda tanpa biaya.</p>
                
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-0.5">Nama Instansi / Sekolah</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    placeholder="Contoh: SMAN 5 Bandung"
                    value={generalConsultationForm.schoolName}
                    onChange={(e) => setGeneralConsultationForm({...generalConsultationForm, schoolName: e.target.value})}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-0.5">Perwakilan Kontak</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                      placeholder="Nama & Gelar"
                      value={generalConsultationForm.contactName}
                      onChange={(e) => setGeneralConsultationForm({...generalConsultationForm, contactName: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-0.5">WhatsApp Aktif</label>
                    <input 
                      type="tel" 
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                      placeholder="0812xxxxxx"
                      value={generalConsultationForm.phone}
                      onChange={(e) => setGeneralConsultationForm({...generalConsultationForm, phone: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-0.5">Layanan IT Fokus Utama</label>
                  <select 
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none bg-white font-medium"
                    value={generalConsultationForm.serviceNeeded}
                    onChange={(e) => setGeneralConsultationForm({...generalConsultationForm, serviceNeeded: e.target.value})}
                  >
                    <option>Website Sekolah Modern</option>
                    <option>Sistem Kelulusan Digital (SKL)</option>
                    <option>Sistem Surat Menyurat / Digital Signature</option>
                    <option>Sistem Rapor Digital & Administrasi</option>
                    <option>Pemasangan CCTV & Laboratorium</option>
                    <option>Optimasi Jaringan MikroTik / Wifi Sekolah</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-0.5">Deskripsi Pesan (Opsional)</label>
                  <textarea 
                    rows={2} 
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                    placeholder="Sebutkan hambatan teknologi utama di sekolah saat ini..."
                    value={generalConsultationForm.message}
                    onChange={(e) => setGeneralConsultationForm({...generalConsultationForm, message: e.target.value})}
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full py-3 rounded-full bg-emerald-600 text-white font-extrabold text-xs cursor-pointer shadow-lg shadow-emerald-200/50 hover:bg-emerald-700 transform transition-all duration-300"
                >
                  Daftarkan Sesi Konsultasi Saya
                </button>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
