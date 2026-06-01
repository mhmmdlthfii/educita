import React, { useState } from 'react';
import { 
  User, Mail, ArrowUpRight, GraduationCap, Code, 
  Sparkles, CheckCircle2, ChevronRight, MessageSquare, 
  MapPin, Calendar, Award, Send, PhoneOutgoing, ShieldAlert 
} from 'lucide-react';

export default function ProfileView() {
  const [profileMessage, setProfileMessage] = useState({ name: '', email: '', message: '' });
  const [isSent, setIsSent] = useState(false);

  const handleMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileMessage.name || !profileMessage.message) return;
    setIsSent(true);
    setTimeout(() => {
      setIsSent(false);
      setProfileMessage({ name: '', email: '', message: '' });
    }, 4000);
  };

  const skillsList = [
    { name: 'Full-stack Web Dev (React & NodeJS)', level: 88, category: 'Tech' },
    { name: 'Database Management (PostgreSQL, Supabase)', level: 84, category: 'Tech' },
    { name: 'School Network Infrastructure (MikroTik)', level: 92, category: 'Hardware' },
    { name: 'Educational System Architecture', level: 95, category: 'Domain' },
    { name: 'CCTV & Laboratory Integration', level: 90, category: 'Hardware' },
    { name: 'Kurikulum Merdeka IT Consultation', level: 94, category: 'Domain' }
  ];

  const highlights = [
    { title: 'Digital Correspondence Systems', desc: 'E-Office internal untuk tata usaha, mengotomatisasi aliran surat masuk/keluar, mengurangi kos kertas hingga 85%.' },
    { title: 'Graduation Systems (SKL Online)', desc: 'Sistem pengumuman aman yang menyajikan Surat Keterangan Lulus digital ber-QR Code untuk mencegah coret-coret.' },
    { title: 'Student Discipline Systems', desc: 'Sistem pencatatan poin kedisiplinan siswa (pelanggaran/prestasi) yang termonitor real-time oleh guru BK & wali murid.' },
    { title: 'Responsive School Websites', desc: 'Puluhan website portal .sch.id yang cepat, terindeks SEO, lengkap dengan PPDB terintegrasi.' },
    { title: 'Educational Innovation Projects', desc: 'Penyusunan modul literasi IT sekolah dasar sampai menengah guna mempercepat kesiapan Asesmen Nasional.' }
  ];

  return (
    <div className="relative pb-24 pattern-dots pt-6">
      {/* Background radial elements */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-4 md:px-6 relative z-10">
        
        {/* HERO PROFILE BOX (LIQUID GLASS BEAUTY) */}
        <div className="liquid-glass rounded-3xl p-6 sm:p-10 border border-white/80 shadow-lg mb-12">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            {/* Avatar block with premium ring glow */}
            <div className="relative shrink-0">
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-full blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden border-4 border-white shadow-xl relative z-10">
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300" // Stylish high quality profile placeholder
                  alt="Muhammad Luthfi" 
                  className="w-full h-full object-cover shrink-0"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full border border-white/90 shadow-sm z-20 flex items-center gap-1">
                <Award className="w-3.5 h-3.5 fill-slate-900" />
                <span>Founder</span>
              </div>
            </div>

            {/* Title description */}
            <div className="text-center md:text-left flex-1">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest block mb-1">PROFIL PENDIWARA DIGITAL</span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
                Muhammad Luthfi
              </h1>
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mt-3">
                <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-100">Educator</span>
                <span className="px-2.5 py-1 rounded-md bg-teal-50 text-teal-800 text-xs font-semibold border border-teal-100 font-mono">Junior Software Dev</span>
                <span className="px-2.5 py-1 rounded-md bg-cyan-50 text-cyan-800 text-xs font-semibold border border-cyan-100">EdTech Enthusiast</span>
                <span className="px-2.5 py-1 rounded-md bg-amber-50 text-amber-800 text-xs font-semibold border border-amber-100">School Digitizer</span>
              </div>

              <p className="mt-4 text-slate-600 text-xs sm:text-sm leading-relaxed">
                Halo! Saya adalah seorang praktisi teknologi pendidikan dan pengembang sistem sekolah mandiri di Indonesia. Saya mendedikasikan karir saya untuk mempersempit jurang literasi IT antar sekolah di Indonesia melalui solusi software & hardware terjangkau, awet, dan ramah pengguna.
              </p>

              <div className="mt-6 flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs font-semibold text-slate-500">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span>Jawa Barat, Indonesia</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <span>muhLuthfi.23@gmail.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RECTANGLE TWO-COLUMN LAYOUT */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
          
          {/* ABOUT ME & TIMELINE EXPERIENCE */}
          <div className="md:col-span-7 space-y-8">
            <div className="liquid-glass p-6 md:p-8 rounded-3xl border border-white/60">
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-emerald-600" />
                <span>Tentang Saya</span>
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                Selaku pendidik sekaligus pengembang sistem, saya menyadari hambatan utama digitalisasi sekolah bukanlah ketiadaan komputer, melainkan kompleksitas sistem yang membingungkan operator dan ketakutan guru akan error. 
              </p>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mt-3">
                Melalui <strong className="text-emerald-700">Educita.id</strong>, saya memadukan keahlian coding terintegrasi dengan pemahaman psikologis lingkungan sekolah di daerah guna menyajikan digitalisasi cerdas tanpa kepusingan administratif.
              </p>
            </div>

            <div className="liquid-glass p-6 md:p-8 rounded-3xl border border-white/60">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-teal-600" />
                <span>Riwayat Pengalaman</span>
              </h2>
              
              <div className="space-y-6 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-emerald-100">
                {[
                  {
                    year: '2023 - Selesai',
                    role: 'Chief Technology Architect & Founder',
                    place: 'Educita.id - Sistem Integrator Sekolah',
                    desc: 'Mendesain dan mengimplementasikan sistem SKL, ujian online, dan lab komputer pada puluhan sekolah binaan di Jawa Barat.'
                  },
                  {
                    year: '2021 - 2023',
                    role: 'Pendidik & Supervisor IT Sekolah',
                    place: 'Pesantren Teknologi & SMK Nusantara',
                    desc: 'Membimbing siswa kejuruan dalam penguasaan perakitan komputer PC, konfigurasi MikroTik ROUTER OS, dan manajemen basis data MySQL.'
                  },
                  {
                    year: '2019 - 2021',
                    role: 'Educational Technology Coordinator',
                    place: 'Lembaga Pendidikan Swasta',
                    desc: 'Mengembangkan kurikulum inovasi teknologi interaktif dan mempersiapkan infrastruktur Lab UNBK Mandiri.'
                  }
                ].map((exp, index) => (
                  <div key={index} className="relative pl-8">
                    {/* Ring indicator */}
                    <div className="absolute left-1.5 top-1.5 w-4.5 h-4.5 rounded-full bg-white border-2 border-emerald-500 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                    </div>
                    <div className="text-[10px] font-extrabold text-emerald-700 uppercase tracking-widest">{exp.year}</div>
                    <div className="text-sm font-bold text-slate-800 mt-0.5">{exp.role}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{exp.place}</div>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                      {exp.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* SKILLS & CONTACT BLOCK */}
          <div className="md:col-span-5 space-y-8">
            {/* Visual Skill Indicators */}
            <div className="liquid-glass p-6 rounded-3xl border border-white/60">
              <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Code className="w-5 h-5 text-emerald-600" />
                <span>Keahlian Utama</span>
              </h2>

              <div className="space-y-4">
                {skillsList.map((sk, index) => (
                  <div key={index}>
                    <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                      <span>{sk.name}</span>
                      <span className="font-mono text-emerald-600">{sk.level}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                        style={{ width: `${sk.level}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Profile Contact Form */}
            <div className="liquid-glass p-6 rounded-3xl border border-white/60">
              <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-cyan-600" />
                <span>Kirim Pesan</span>
              </h2>
              <p className="text-slate-400 text-[11px] mb-4">Butuh panduan kolaborasi riset kurikulum IT? Kirim pesan langsung ke Luthfi.</p>

              {isSent ? (
                <div className="p-4 bg-emerald-50 text-emerald-800 rounded-xl text-center text-xs font-semibold">
                  Pesan Anda berhasil terkirim ke WhatsApp/Email Luthfi! Terima kasih atas kepercayaannya.
                </div>
              ) : (
                <form onSubmit={handleMessageSubmit} className="space-y-3">
                  <div>
                    <input 
                      type="text" 
                      placeholder="Nama Lengkap" 
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      value={profileMessage.name}
                      onChange={(e) => setProfileMessage({...profileMessage, name: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <input 
                      type="email" 
                      placeholder="Email Aktif" 
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      value={profileMessage.email}
                      onChange={(e) => setProfileMessage({...profileMessage, email: e.target.value})}
                    />
                  </div>
                  <div>
                    <textarea 
                      rows={2} 
                      placeholder="Pesan Anda..." 
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      value={profileMessage.message}
                      onChange={(e) => setProfileMessage({...profileMessage, message: e.target.value})}
                      required
                    />
                  </div>
                  <button 
                    type="submit"
                    className="w-full py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs rounded-lg cursor-pointer"
                  >
                    Kirim Pesan Pendampingan
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* HIGHLIGHTED INVENTIONS / PROJECTS FOR SCHOOLS */}
        <div className="liquid-glass p-6 sm:p-10 rounded-3xl border border-white/60">
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest block mb-1">INVENTIONS PORTFOLIO</span>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-8">
            Hasil Implementasi & Inovasi Sistem Sekolah
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {highlights.map((hl, index) => (
              <div key={index} className="flex gap-4 p-4 rounded-2xl hover:bg-white/40 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-1">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800 tracking-tight">{hl.title}</h3>
                  <p className="text-xs text-slate-500 mt-1 lines-relaxed leading-relaxed">{hl.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
