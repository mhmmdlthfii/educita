import React, { useState, useEffect } from 'react';
import { 
  Globe, GraduationCap, Mail, FileSpreadsheet, Camera, 
  Monitor, Wifi, Cpu, ArrowRight, CheckCircle2, Star, 
  Users, Layers, Clock, ShieldCheck, HeartHandshake, PhoneCall, Send, Sparkles 
} from 'lucide-react';
import { dbService } from '../lib/supabase';
import { SchoolService, ProjectShowcase, Testimonial } from '../types/database';

interface HomeViewProps {
  onNavigate: (route: string) => void;
  onOpenConsultation: () => void;
  onServiceSelect: (serviceName: string) => void;
  isDarkMode: boolean;
}

interface ServiceCardProps {
  key?: string | number;
  service: SchoolService;
  getIconComponent: (iconName: string) => React.ReactNode;
  onServiceSelect: (serviceName: string) => void;
  isDarkMode: boolean;
}

// 2. SUBCOMPONENT SERVICE CARD WITH MODAL TOGGLE / DROP COCKPIT
function ServiceCard({ service, getIconComponent, onServiceSelect, isDarkMode }: ServiceCardProps) {
  const [showFeatures, setShowFeatures] = useState(false);

  return (
    <div 
      className={`group relative ${isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white/70 border-white/80 text-slate-800'} backdrop-blur-md p-6 md:p-8 rounded-[36px] border shadow-xs transition-all duration-300 hover:shadow-xl hover:shadow-emerald-550/10 hover:-translate-y-1 flex flex-col justify-between overflow-hidden`}
    >
      {/* Highlight Glow Accent - Premium Green */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-emerald-500 opacity-90 group-hover:h-2.5 transition-all duration-300"></div>
      
      <div>
        <div className="flex justify-between items-start mb-6">
          <div className={`w-12 h-12 rounded-2xl ${isDarkMode ? 'bg-slate-950/50 text-emerald-400' : 'bg-gradient-to-tr from-emerald-500/10 to-teal-500/10'} flex items-center justify-center shadow-2xs`}>
            {getIconComponent(service.icon)}
          </div>
          {service.popular && (
            <span className="text-[9px] bg-emerald-600 text-white font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">
              POPULER
            </span>
          )}
        </div>
        
        <h3 className={`text-xl font-extrabold ${isDarkMode ? 'text-white' : 'text-slate-800'} tracking-tight mb-3`}>
          {service.name}
        </h3>
        <p className={`${isDarkMode ? 'text-slate-400' : 'text-slate-500'} text-xs sm:text-sm leading-relaxed mb-5`}>
          {service.description}
        </p>

        {/* Dynamic sliding features list - Modal toggle naik turun buat hide dan unhide */}
        <div className={`border-t ${isDarkMode ? 'border-slate-800/80' : 'border-slate-150'} pt-4 mb-5`}>
          <button 
            type="button"
            onClick={() => setShowFeatures(!showFeatures)}
            className={`w-full flex items-center justify-between text-xs font-bold ${isDarkMode ? 'text-slate-350 hover:text-white' : 'text-slate-700 hover:text-emerald-600'} transition focus:outline-none`}
          >
            <span className="uppercase tracking-wider">Poin Fitur Unggulan</span>
            <span className={`px-3 py-1 rounded-full text-[10px] ${isDarkMode ? 'bg-slate-800 text-emerald-400' : 'bg-emerald-50 text-emerald-650'} font-extrabold flex items-center gap-1 transition`}>
              {showFeatures ? 'Tutup Fitur ▲' : 'Buka Fitur ▼'}
            </span>
          </button>

          <div className={`overflow-hidden transition-all duration-300 ${showFeatures ? 'max-h-72 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
            <ul className="space-y-2.5">
              {service.details.map((detail, index) => (
                <li key={index} className="flex items-start gap-2 text-xs sm:text-sm">
                  <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 mt-0.5 shrink-0" />
                  <span className={isDarkMode ? 'text-slate-300' : 'text-slate-600'}>{detail}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className={`mt-auto pt-4 flex items-center justify-between border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-50'}`}>
        <div>
          <span className="block font-semibold uppercase tracking-wider text-[9px] text-slate-400">Estimasi Biaya</span>
          <span className={`font-extrabold ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'} text-xs sm:text-sm`}>{service.priceRange || 'Konsultasi Privat'}</span>
        </div>
        <button 
          onClick={() => onServiceSelect(service.name)}
          className="flex h-9 items-center gap-1.5 px-4 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-emerald-600 hover:text-white font-extrabold text-emerald-600 dark:text-slate-300 text-xs transition duration-300 shadow-2xs"
        >
          <span>Pesan</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

export default function HomeView({ onNavigate, onOpenConsultation, onServiceSelect, isDarkMode }: HomeViewProps) {
  const [services, setServices] = useState<SchoolService[]>([]);
  const [projects, setProjects] = useState<ProjectShowcase[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [contactForm, setContactForm] = useState({
    schoolName: '',
    contactName: '',
    phone: '',
    serviceNeeded: 'Website Sekolah Modern',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [activeCategory, setActiveCategory] = useState<'all' | 'software' | 'hardware' | 'infrastructure'>('all');

  useEffect(() => {
    async function loadData() {
      const s = await dbService.getServices();
      const p = await dbService.getProjects();
      const t = await dbService.getTestimonials();
      setServices(s);
      setProjects(p);
      setTestimonials(t);
    }
    loadData();
  }, []);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.schoolName || !contactForm.contactName || !contactForm.phone) {
      alert('Harap isi nama sekolah, nama kontak, dan nomor telepon Anda.');
      return;
    }
    await dbService.addConsultation(contactForm);
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setContactForm({
        schoolName: '',
        contactName: '',
        phone: '',
        serviceNeeded: 'Website Sekolah Modern',
        message: ''
      });
    }, 4500);
  };

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'Globe': return <Globe className="w-6 h-6 text-emerald-600" />;
      case 'GraduationCap': return <GraduationCap className="w-6 h-6 text-emerald-600" />;
      case 'Mail': return <Mail className="w-6 h-6 text-emerald-500" />;
      case 'FileSpreadsheet': return <FileSpreadsheet className="w-6 h-6 text-emerald-600" />;
      case 'Camera': return <Camera className="w-6 h-6 text-emerald-500" />;
      case 'Monitor': return <Monitor className="w-6 h-6 text-emerald-600" />;
      case 'Wifi': return <Wifi className="w-6 h-6 text-emerald-600" />;
      case 'Cpu': return <Cpu className="w-6 h-6 text-emerald-500" />;
      default: return <Sparkles className="w-6 h-6 text-emerald-600" />;
    }
  };

  const filteredServices = activeCategory === 'all' 
    ? services 
    : services.filter(s => s.category === activeCategory);

  return (
    <div className={`relative pb-16 pattern-dots transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-[#F4F7F6] text-slate-800'}`}>
      
      {/* 1. HERO SECTION WITH GEOMETRIC BALANCE */}
      <section className="relative pt-12 pb-24 md:pt-20 md:pb-32 overflow-hidden px-4 md:px-8 max-w-7xl mx-auto">
        {/* Background Ambient Liquid Blobs */}
        <div className={`absolute top-[-10%] right-[-10%] w-[600px] h-[600px] ${isDarkMode ? 'bg-emerald-500/15' : 'bg-emerald-100/60'} rounded-full blur-[120px] opacity-60 animate-blob-1 pointer-events-none`}></div>
        <div className={`absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] ${isDarkMode ? 'bg-emerald-500/10' : 'bg-emerald-100/50'} rounded-full blur-[100px] opacity-50 animate-blob-2 pointer-events-none`}></div>
        <div className={`absolute top-[20%] left-[40%] w-[300px] h-[300px] ${isDarkMode ? 'bg-emerald-500/8' : 'bg-emerald-100/30'} rounded-full blur-[80px] opacity-40 animate-blob-3 pointer-events-none`}></div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Heading, Badge, and CTA */}
          <div className="lg:col-span-7 flex flex-col gap-6 text-left">
            <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-emerald-500/5 border-emerald-500/10'} rounded-full w-fit shadow-xs border`}>
              <span className="w-2.5 h-2.5 bg-emerald-550 rounded-full animate-pulse"></span>
              <span className={`text-[10px] font-extrabold uppercase tracking-widest leading-none ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                Mitra Transformasi Sekolah
              </span>
            </div>

            <h1 className={`text-4xl sm:text-5xl lg:text-[64px] font-extrabold leading-[1.08] tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Digitalisasi Sekolah <br/>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-500 font-black">
                Dimulai dari Educita
              </span>
            </h1>

            <p className={`text-base sm:text-lg ${isDarkMode ? 'text-slate-300' : 'text-slate-600'} leading-relaxed max-w-[580px]`}>
              Platform modern terintegrasi untuk Sistem Informasi Sekolah, Website, Jaringan, dan Keamanan. Wujudkan ekosistem pendidikan cerdas masa depan hari ini.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
              <button 
                id="btn-hero-consultation"
                onClick={onOpenConsultation}
                className="px-8 py-4 bg-emerald-650 text-white rounded-2xl font-extrabold text-base flex items-center justify-center gap-2.5 hover:bg-emerald-700 shadow-lg shadow-emerald-500/20 hover:scale-[1.01] transform transition-all cursor-pointer"
              >
                <span>Konsultasi Gratis</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
              </button>
              <button 
                id="btn-hero-services"
                onClick={() => {
                  const element = document.getElementById('services-section');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`px-8 py-4 ${isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850' : 'bg-white/60 border-white text-slate-700 hover:bg-white'} backdrop-blur border rounded-2xl font-bold text-base transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-xs`}
              >
                <span>Lihat Layanan</span>
                <ArrowRight className="w-5 h-5 text-slate-450" />
              </button>
            </div>
          </div>

          {/* Right Column: Beautiful Glass UI Showcase Dashboard widget */}
          <div className="lg:col-span-5 relative mt-8 lg:mt-0">
            <div className={`w-full ${isDarkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white/40 border-white/60'} backdrop-blur-2xl rounded-[40px] border shadow-2xl p-8 relative overflow-hidden`}>
              <div className="flex flex-col gap-6">
                <div className="flex justify-between items-center">
                  <div className="flex flex-col text-left">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mb-1">DASHBOARD CENTRAL</span>
                    <span className={`text-xl font-extrabold ${isDarkMode ? 'text-white' : 'text-slate-800'} tracking-tight leading-none`}>Sistem Rapor Digital</span>
                  </div>
                  <div className={`w-11 h-11 rounded-full ${isDarkMode ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400' : 'bg-emerald-50 border-emerald-100 text-emerald-600'} flex items-center justify-center font-black text-xs shadow-sm`}>
                    98%
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className={`p-4 ${isDarkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white/60 border-white'} rounded-2xl border text-left shadow-2xs`}>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Siswa Aktif</span>
                    <span className="text-xl font-black text-emerald-600 leading-none">1,240</span>
                  </div>
                  <div className={`p-4 ${isDarkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white/60 border-white'} rounded-2xl border text-left shadow-2xs`}>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Guru & Staf</span>
                    <span className="text-xl font-black text-emerald-555 leading-none">84</span>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <div className={`h-2 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200/50'} rounded-full overflow-hidden`}>
                    <div className="h-full w-[70%] bg-emerald-500 rounded-full"></div>
                  </div>
                  <div className={`h-2 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200/50'} rounded-full overflow-hidden`}>
                    <div className="h-full w-[45%] bg-emerald-600 rounded-full"></div>
                  </div>
                  <div className={`h-2 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200/50'} rounded-full overflow-hidden`}>
                    <div className="h-full w-[90%] bg-emerald-400 rounded-full"></div>
                  </div>
                </div>

                <div className={`mt-4 flex items-center gap-3 p-3 ${isDarkMode ? 'bg-slate-950/60 border-slate-850' : 'bg-emerald-500/5 border-emerald-500/10'} rounded-xl border text-left`}>
                  <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center shadow-xs">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                  <span className={`text-xs font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>Educita Security Guard Verified</span>
                </div>
              </div>
            </div>

            {/* Floating geometric badges with drop shadow and border */}
            <div className={`absolute -top-6 -left-6 px-5 py-3.5 ${isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-white border-slate-100/80 text-slate-700'} rounded-2xl shadow-xl border flex items-center gap-2.5 transition`}>
              <div className="w-2.5 h-2.5 bg-emerald-550 rounded-full animate-pulse"></div>
              <span className="text-xs font-black tracking-tight">Website Sekolah v3.0</span>
            </div>
            <div className="absolute -bottom-6 -right-6 px-5 py-3.5 bg-emerald-600 text-white rounded-2xl shadow-xl border border-slate-950 flex items-center gap-2.5 transition">
              <span className="text-xs font-black tracking-tight">CCTV & Network Monitor</span>
            </div>
          </div>
        </div>

        {/* Metrics Overview Bar rendered underneath layout */}
        <div className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
          {[
            { label: 'Sekolah Digital', value: '50+' },
            { label: 'Sistem Mandiri', value: '12+' },
            { label: 'Layanan Terpadu', value: '24/7' },
            { label: 'Kepuasan Pendidik', value: '99%' }
          ].map((stat, i) => (
            <div key={i} className={`${isDarkMode ? 'bg-slate-900/50 border-slate-805/60 text-white' : 'bg-white/50 border-white/60 text-slate-800'} backdrop-blur-md p-5 rounded-3xl border text-center shadow-xs`}>
              <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">{stat.value}</div>
              <div className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. SERVICES SECTION */}
      <section id="services-section" className={`py-20 px-4 md:px-8 ${isDarkMode ? 'bg-slate-900/20 border-y border-slate-900' : 'bg-white/40 border-y border-white/50'} backdrop-blur-xs relative`}>
        <div className="max-w-6xl mx-auto">
          {/* Header with Geometric Balance */}
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className={`text-[10px] font-bold ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'} uppercase tracking-widest block mb-2`}>LAYANAN UTAMA</span>
            <h2 className={`text-3xl sm:text-4xl font-extrabold ${isDarkMode ? 'text-white' : 'text-[#1E293B]'} tracking-tight leading-tight`}>
              Solusi Teknologi Terbaik untuk Sekolah
            </h2>
            <p className={`mt-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-650'} text-sm sm:text-base leading-relaxed`}>
              Educita menyediakan portfolio terlengkap untuk mendigitalisasi sekolah Anda dari kesiapan sistem administrasi (Software) hingga kelengkapan perangkat keras (Hardware).
            </p>

            {/* Filter Tabs using rounded-full structural pills */}
            <div className={`mt-8 flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-full ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-200/50 border-white'} backdrop-blur-md max-w-lg mx-auto border`}>
              {[
                { id: 'all', label: 'Semua Layanan' },
                { id: 'software', label: 'Software' },
                { id: 'hardware', label: 'Hardware' },
                { id: 'infrastructure', label: 'Jaringan' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategory(tab.id as any)}
                  className={`px-5 py-2 text-xs font-bold rounded-full transition-all duration-300 cursor-pointer ${
                    activeCategory === tab.id 
                      ? 'bg-emerald-605 bg-emerald-600 text-white shadow-md shadow-emerald-500/15' 
                      : `${isDarkMode ? 'text-slate-350 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Service Cards Grid - Upgraded to Curved Double-Layer Panels & COLLAPSIBLE DETAILS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((service) => (
              <ServiceCard 
                key={service.id}
                service={service}
                getIconComponent={getIconComponent}
                onServiceSelect={onServiceSelect}
                isDarkMode={isDarkMode}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 3. WHY EDUCITA SECTION */}
      <section className={`py-20 px-4 md:px-8 transition-colors ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
            {/* Left Graphics */}
            <div className="md:col-span-5 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 blur-3xl pointer-events-none"></div>
              <div className={`${isDarkMode ? 'bg-slate-900 border-slate-800' : 'liquid-glass'} p-8 rounded-3xl border relative z-10 shadow-lg`}>
                <div className={`text-xs font-bold ${isDarkMode ? 'text-emerald-450' : 'text-emerald-600'} uppercase tracking-widest mb-2`}>EDUCITA VS VENDOR BIASA</div>
                <h3 className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'} mb-6 leading-tight`}>Mengapa Sekolah Memilih Kami?</h3>
                
                <div className="space-y-4">
                  {[
                    { value: 'Berpengalaman di Sekolah', desc: 'Kami memahami struktur kurikulum nasional, mekanisme BOS, hingga kesiapan literasi digital guru.' },
                    { value: 'All-in-One Vendor', desc: 'Tidak perlu mencari 3 vendor berbeda untuk website, CCTV, dan jaringan WiFi. Kami kerjakan semua.' },
                    { value: 'Pendampingan Intensif', desc: 'Kami membina operator sekolah & guru sampai mahir dengan modul pembelajaran sederhana.' }
                  ].map((item, idx) => (
                    <div key={idx} className="flex gap-3">
                      <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div>
                        <div className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{item.value}</div>
                        <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} mt-0.5`}>{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right List */}
            <div className="md:col-span-7">
              <span className={`text-xs font-bold ${isDarkMode ? 'text-emerald-450' : 'text-emerald-600'} uppercase tracking-widest block mb-1`}>KOMPETENSI UNGGULAN</span>
              <h2 className={`text-3xl font-extrabold ${isDarkMode ? 'text-white' : 'text-slate-900'} tracking-tight leading-tight`}>
                Dirancang khusus dengan Standar Pendidikan Modern
              </h2>
              <p className={`mt-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'} text-sm leading-relaxed`}>
                Kami tidak hanya melempar teknologi mentah ke sekolah. Educita meyakini digitalisasi sekolah haruslah hemat biaya, minim kerumitan, awet, dan langsung memberikan dampak nyata pada reputasi sekolah.
              </p>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  {
                    icon: <ShieldCheck className="w-5 h-5 text-emerald-600" />,
                    title: 'Sistem Keamanan Tinggi',
                    desc: 'Sistem SKL & Rapor terlindungi enkripsi modern agar aman dari modifikasi nilai.'
                  },
                  {
                    icon: <Clock className="w-5 h-5 text-emerald-500" />,
                    title: 'On-Time Delivery',
                    desc: 'Setiap penginstalan hardware & software memiliki kalender pengerjaan ketat.'
                  },
                  {
                    icon: <Users className="w-5 h-5 text-emerald-600" />,
                    title: 'Dukungan Berkelanjutan',
                    desc: 'Layanan purna jual prima dan konsultasi IT gratis selama masa kemitraan.'
                  },
                  {
                    icon: <HeartHandshake className="w-5 h-5 text-emerald-500" />,
                    title: 'Ramah Anggaran Dana BOS',
                    desc: 'Dokumen administrasi & penawaran lengkap sesuai syarat pelaporan ARKAS.'
                  }
                ].map((item, idx) => (
                  <div key={idx} className={`p-4 rounded-2xl ${isDarkMode ? 'hover:bg-slate-900/60' : 'hover:bg-white/50'} transition-colors`}>
                    <div className={`w-10 h-10 rounded-xl ${isDarkMode ? 'bg-slate-900' : 'bg-slate-100'} flex items-center justify-center mb-3`}>
                      {item.icon}
                    </div>
                    <h4 className={`text-base font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'} tracking-tight`}>{item.title}</h4>
                    <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} mt-1 leading-relaxed`}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FEATURED PROJECTS SHOWCASE */}
      <section className={`py-20 px-4 md:px-8 ${isDarkMode ? 'bg-slate-900/10' : 'bg-slate-50/50'}`}>
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
            <div>
              <span className={`text-xs font-bold ${isDarkMode ? 'text-emerald-450' : 'text-emerald-600'} uppercase tracking-widest block mb-1`}>PORTOFOLIO DIGITALISASI</span>
              <h2 className={`text-3xl font-extrabold ${isDarkMode ? 'text-white' : 'text-slate-900'} tracking-tight`}>Kisah Sukses Transformasi Sekolah</h2>
            </div>
            <button 
              onClick={() => onNavigate('/shop')} 
              className={`mt-4 sm:mt-0 inline-flex items-center gap-1.5 text-sm font-bold ${isDarkMode ? 'text-emerald-450 hover:text-white' : 'text-emerald-600 hover:text-emerald-500'} hover:underline cursor-pointer transition`}
            >
              <span>Jelajahi Produk Kami</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {projects.map((p) => (
              <div key={p.id} className={`${isDarkMode ? 'bg-slate-900 border-slate-800' : 'liquid-glass'} rounded-3xl overflow-hidden border shadow-md group transition duration-300`}>
                <div className="h-48 overflow-hidden relative">
                  <img 
                    src={p.imageUrl} 
                    alt={p.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3 px-3 py-1 bg-white/95 backdrop-blur rounded-full text-[10px] font-extrabold text-emerald-600 tracking-wider uppercase">
                    {p.category}
                  </div>
                </div>
                <div className="p-6">
                  <div className="text-xs font-bold text-emerald-500 mb-1">{p.schoolName}</div>
                  <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white group-hover:text-amber-400' : 'text-slate-800 group-hover:text-emerald-650'} leading-tight mb-2 transition-colors`}>
                    {p.title}
                  </h3>
                  <p className={`${isDarkMode ? 'text-slate-400' : 'text-slate-500'} text-xs leading-relaxed mb-4 line-clamp-3`}>
                    {p.description}
                  </p>
                  <div className={`pt-4 border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-100'} flex items-center justify-between`}>
                    <span className="text-[10px] font-bold text-slate-450 uppercase">DAMPAK UTAMA</span>
                    <span className={`text-xs font-bold ${isDarkMode ? 'text-amber-400 bg-slate-950/60' : 'text-slate-705 bg-slate-100'} px-2.5 py-1 rounded-md`}>{p.stats}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. TESTIMONIALS SECTION */}
      <section className="py-20 px-4 md:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <span className={`text-xs font-bold ${isDarkMode ? 'text-emerald-450' : 'text-emerald-600'} uppercase tracking-widest block mb-1`}>TESTIMONIALS</span>
          <h2 className={`text-3xl font-extrabold ${isDarkMode ? 'text-white' : 'text-slate-900'} tracking-tight mb-12`}>Apa Kata Mitra Sekolah Kami</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            {testimonials.map((t) => (
              <div key={t.id} className={`${isDarkMode ? 'bg-slate-900 border-slate-805 text-slate-350' : 'liquid-glass text-slate-750'} p-8 rounded-3xl border relative shadow-xs`}>
                <div className="flex items-center gap-1.5 text-amber-500 mb-4">
                  {Array.from({ length: t.rating }).map((_, idx) => (
                    <Star key={idx} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className={`text-sm italic leading-relaxed mb-6 ${isDarkMode ? 'text-slate-200' : 'text-slate-600'}`}>
                  "{t.content}"
                </p>
                <div className="flex items-center gap-4">
                  <img 
                    src={t.avatarUrl} 
                    alt={t.name} 
                    className="w-11 h-11 rounded-full object-cover border-2 border-emerald-500/20"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h4 className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{t.name}</h4>
                    <p className="text-xs text-slate-450">{t.role} — <span className={`${isDarkMode ? 'text-slate-300' : 'text-slate-600'} font-medium`}>{t.school}</span></p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 inline-flex flex-wrap items-center justify-center gap-2 text-xs font-semibold text-slate-400">
            <span>Ingin memberikan feedback sekolah Anda?</span>
            <span className="text-emerald-650 dark:text-emerald-400 hover:underline cursor-pointer font-bold transition" onClick={onOpenConsultation}>Hubungi Customer Success Team kami</span>
          </div>
        </div>
      </section>

      {/* 6. CTA / CONSULTATION INTERACTIVE BLOCK (GRADIENT ACTION) */}
      <section className="py-16 px-4 md:px-8">
        <div className="max-w-5xl mx-auto relative overflow-hidden rounded-[36px]">
          <div className="absolute inset-0 bg-emerald-650 -z-10 shadow-xl"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 p-8 md:p-12 items-center text-white relative z-10">
            {/* Left Info */}
            <div className="lg:col-span-6">
              <span className="text-amber-200 font-bold text-xs uppercase tracking-widest block mb-2">SIAP BERTRANSFORMASI DIGITAL?</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                Ayo Bangun Sekolah Digital Bersama Educita
              </h2>
              <p className="mt-4 text-[#effcf6] text-sm leading-relaxed text-slate-100">
                Isi form di samping untuk menjadwalkan konsultasi gratis dan survei lokasi langsung dari tim ahli programmer & teknisi jaringan kami.
              </p>

              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-200" />
                  </div>
                  <span className="text-xs text-slate-100 font-medium">Survei Laborat, CCTV, & Jaringan Gratis</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-200" />
                  </div>
                  <span className="text-xs text-slate-100 font-medium">Penyusunan RAB dan Dokumen Penawaran Terbuka</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-200" />
                  </div>
                  <span className="text-xs text-amber-200 font-bold">100% Sesuai Juknis BOS Kurikulum Merdeka</span>
                </div>
              </div>
            </div>

            {/* Right Form Card */}
            <div className={`lg:col-span-6 ${isDarkMode ? 'bg-slate-900 border-slate-805 text-slate-200' : 'bg-white text-slate-800'} rounded-2xl p-6 md:p-8 shadow-xl relative overflow-hidden`}>
              {isSubmitted ? (
                <div className="text-center py-10">
                  <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-bold">Permintaan Dikirim!</h3>
                  <p className="text-xs text-slate-450 mt-2">
                    Tim Educita akan segera menghubungi nomor WhatsApp Anda dalam kurun waktu 1x24 jam hari kerja.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <h3 className="text-lg font-bold text-center mb-1">Permohonan Jadwal Konsultasi</h3>
                  <p className="text-slate-400 text-[11px] text-center mb-4">Layanan konsultasi ini 100% Gratis dan tidak dipungut biaya apapun.</p>
                  
                  <div>
                    <label className="block text-xs font-semibold mb-1">Nama Sekolah</label>
                    <input 
                      type="text"
                      className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 ${isDarkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-800'}`}
                      placeholder="Contoh: SMAN 1 Jakarta"
                      value={contactForm.schoolName}
                      onChange={(e) => setContactForm({...contactForm, schoolName: e.target.value})}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold mb-1">Nama Kontak Perwakilan</label>
                      <input 
                        type="text"
                        className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 ${isDarkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-800'}`}
                        placeholder="Nama Lengkap & Gelar"
                        value={contactForm.contactName}
                        onChange={(e) => setContactForm({...contactForm, contactName: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1">No. WhatsApp Aktif</label>
                      <input 
                        type="tel"
                        className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 ${isDarkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-800'}`}
                        placeholder="Contoh: 08123456xxx"
                        value={contactForm.phone}
                        onChange={(e) => setContactForm({...contactForm, phone: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1">Layanan yang Dibutuhkan</label>
                    <select 
                      className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 ${isDarkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-850'}`}
                      value={contactForm.serviceNeeded}
                      onChange={(e) => setContactForm({...contactForm, serviceNeeded: e.target.value})}
                    >
                      <option>Website Sekolah Modern</option>
                      <option>Sistem Kelulusan Digital (SKL)</option>
                      <option>Sistem Surat Menyurat / Digital Signature</option>
                      <option>Sistem Rapor Digital & Administrasi</option>
                      <option>Pemasangan CCTV & Laboratorium</option>
                      <option>Optimasi Jaringan MikroTik / Wifi Sekolah</option>
                      <option>Servis Berkelanjutan Laptop & Komputer BOS</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1">Pesan / Catatan (Opsional)</label>
                    <textarea 
                      rows={2}
                      className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 ${isDarkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-800'}`}
                      placeholder="Jelaskan kebutuhan khusus atau kendala IT utama sekolah..."
                      value={contactForm.message}
                      onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-3 rounded-xl bg-emerald-600 text-white font-black cursor-pointer transition transform hover:-translate-y-0.5 shadow-md shadow-emerald-500/20"
                  >
                    Kirim Pengajuan Konsultasi
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
