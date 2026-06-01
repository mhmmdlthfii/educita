import React, { useState, useEffect } from 'react';
import { 
  Heart, Calendar, MapPin, Gift, BookOpen, Send, 
  Map, Copy, Check, Users, Users2, Clock, Sparkles, AlertCircle 
} from 'lucide-react';
import { dbService } from '../lib/supabase';
import { WeddingGuestbook, WeddingRSVP } from '../types/database';

interface WeddingViewProps {
  toGuest?: string;
}

export default function WeddingView({ toGuest }: WeddingViewProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [guestBook, setGuestBook] = useState<WeddingGuestbook[]>([]);
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);
  
  // RSVP Form state
  const [rsvpForm, setRsvpForm] = useState({ name: toGuest || '', attendance: 'hadir', guestsCount: 1, wishes: '' });
  const [rsvpSent, setRsvpSent] = useState(false);
  
  // Guestbook entry state
  const [newMessage, setNewMessage] = useState({ name: toGuest || '', relation: 'Sahabat', message: '' });
  const [messageSent, setMessageSent] = useState(false);

  useEffect(() => {
    async function getGuestbook() {
      const messages = await dbService.getWeddingGuestbook();
      setGuestBook(messages);
    }
    getGuestbook();
  }, [messageSent]);

  const guestName = toGuest || 'Tamu Undangan';

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAccount(label);
    setTimeout(() => setCopiedAccount(null), 2500);
  };

  const handleRSVPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rsvpForm.name) {
      alert('Mohon isi nama Anda.');
      return;
    }
    await dbService.addRSVP({
      name: rsvpForm.name,
      attendance: rsvpForm.attendance as any,
      guestsCount: Number(rsvpForm.guestsCount),
      wishes: rsvpForm.wishes
    });
    setRsvpSent(true);
    setTimeout(() => {
      setRsvpSent(false);
      setRsvpForm({ name: toGuest || '', attendance: 'hadir', guestsCount: 1, wishes: '' });
    }, 4000);
  };

  const handleMessageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.name || !newMessage.message) {
      alert('Mohon lengkapi Nama dan Ucapan Anda.');
      return;
    }
    await dbService.addGuestbookEntry({
      name: newMessage.name,
      relation: newMessage.relation,
      message: newMessage.message
    });
    setMessageSent(!messageSent); // trigger refresh
    setNewMessage({ name: toGuest || '', relation: 'Sahabat', message: '' });
  };

  // Cover Page
  if (!isOpen) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-900 flex flex-col items-center justify-center text-white px-4">
        {/* Immersive romantic background banner */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200')] bg-cover bg-center opacity-30"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-slate-950 pointer-events-none"></div>

        <div className="max-w-md w-full text-center relative z-10 space-y-6">
          <div className="text-xs font-bold uppercase tracking-widest text-[#dfb76c] flex items-center justify-center gap-2">
            <Heart className="w-4.5 h-4.5 text-pink-500 fill-pink-500 animate-pulse" />
            <span>The Wedding of</span>
          </div>

          <h1 className="wedding-font-serif text-4xl sm:text-5xl font-bold tracking-wide text-gold-gradient py-2">
            Hanum & Luthfi
          </h1>

          <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-[#dfb76c] to-transparent mx-auto"></div>

          <p className="text-xs text-slate-300 italic tracking-wider">
            "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri..." <br />
            <span className="text-[10px] font-bold text-slate-400 not-italic uppercase tracking-widest">(QS. Ar-Rum: 21)</span>
          </p>

          {/* Invitation recipient */}
          <div className="liquid-glass-gold p-6 rounded-2xl border border-white/20 backdrop-blur max-w-sm mx-auto">
            <div className="text-[10px] uppercase tracking-widest text-slate-400">Kepada Yth. Bapak/Ibu/Saudara/i:</div>
            <div className="text-lg font-bold text-slate-800 mt-2 tracking-tight">
              {guestName}
            </div>
            {toGuest && (
              <div className="text-[9px] text-[#816531] font-bold uppercase mt-1 tracking-wider bg-amber-100/60 w-fit px-2 py-0.5 rounded mx-auto">
                Spesial Undangan
              </div>
            )}
          </div>

          <button 
            id="btn-open-wedding-invitation"
            onClick={() => setIsOpen(true)}
            className="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#dfb76c] to-[#b89146] text-slate-950 font-bold hover:shadow-lg hover:shadow-yellow-500/10 hover:scale-105 transition-all duration-300 transform cursor-pointer text-xs uppercase tracking-widest flex items-center gap-2 mx-auto"
          >
            <BookOpen className="w-4 h-4" />
            <span>Buka Undangan</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative pb-24 px-4 bg-gradient-to-b from-[#fbfaf7] via-[#f7f4ec] to-[#fbfaf7] text-slate-800">
      <div className="max-w-3xl mx-auto space-y-16 py-12 relative">
        
        {/* Floating Heart Bubbles in BG */}
        <div className="absolute top-24 left-1/4 w-12 h-12 bg-pink-100/30 rounded-full blur-xl pointer-events-none"></div>
        <div className="absolute bottom-40 right-1/4 w-16 h-16 bg-yellow-100/30 rounded-full blur-xl pointer-events-none"></div>

        {/* 1. HEADER HERO */}
        <header className="text-center space-y-4">
          <div className="text-pink-500 flex justify-center gap-1.5 mb-2">
            <Heart className="w-4 h-4 fill-pink-500" />
            <Heart className="w-4 h-4 fill-pink-500 scale-110" />
            <Heart className="w-4 h-4 fill-pink-500" />
          </div>
          <p className="text-xs uppercase font-extrabold tracking-widest text-[#a17e3f]">Kabar Sukacita Pernikahan</p>
          <h1 className="wedding-font-serif text-5xl font-bold tracking-wide text-gold-gradient py-1">
            Hanum & Luthfi
          </h1>
          <div className="text-xs font-semibold text-slate-500 tracking-widest uppercase">
            MINGGU, 13 SEPTEMBER 2026
          </div>
        </header>

        {/* 2. BRIDE & GROOM PROFILE */}
        <section className="space-y-8">
          <div className="text-center max-w-lg mx-auto">
            <p className="text-xs italic leading-relaxed text-slate-500">
              Assalamu’alaikum Warahmatullahi Wabarakatuh. Dengan memohon rahmat Allah SWT, kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri resepsi pernikahan kami:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center pt-4">
            
            {/* The Groom */}
            <div className="liquid-glass-gold p-6 rounded-3xl text-center border border-white/80 shrink-0">
              <div className="w-24 h-24 rounded-full overflow-hidden mx-auto border-2 border-amber-300 shadow-md">
                <img 
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150" 
                  alt="Muhammad Luthfi" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <h3 className="wedding-font-serif text-xl font-bold text-[#906e2a] mt-4">Muhammad Luthfi, S.Pd.</h3>
              <p className="text-[11px] text-slate-400 mt-1 uppercase font-bold tracking-wider">Muhammad Luthfi</p>
              <p className="text-xs text-slate-500 mt-3 leading-relaxed">
                Putra Kedua dari keluarga <br />
                <strong>Bapak H. Abdurrahman</strong> & <br />
                <strong>Ibu Hj. Aminah</strong> <br />
                <span className="text-[10px] text-slate-400">(Bogor, Jawa Barat)</span>
              </p>
            </div>

            {/* The Bride */}
            <div className="liquid-glass-gold p-6 rounded-3xl text-center border border-white/80 shrink-0">
              <div className="w-24 h-24 rounded-full overflow-hidden mx-auto border-2 border-amber-300 shadow-md">
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150" 
                  alt="Siti Hanum Handayani" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <h3 className="wedding-font-serif text-xl font-bold text-[#906e2a] mt-4">Siti Hanum Handayani, S.Kom.</h3>
              <p className="text-[11px] text-slate-400 mt-1 uppercase font-bold tracking-wider">Hanum</p>
              <p className="text-xs text-slate-500 mt-3 leading-relaxed">
                Putri Pertama dari keluarga <br />
                <strong>Bapak H. Bambang Susilo</strong> & <br />
                <strong>Ibu Hj. Hartati</strong> <br />
                <span className="text-[10px] text-slate-400">(Bandung, Jawa Barat)</span>
              </p>
            </div>

          </div>
        </section>

        {/* 3. LOVE STORY TIMELINE */}
        <section className="space-y-8">
          <div className="text-center">
            <h2 className="wedding-font-serif text-2xl font-bold text-[#906e2a]">Perjalanan Cinta Kami</h2>
            <p className="text-[11px] text-slate-400 uppercase tracking-widest mt-1">Our Story Timeline</p>
          </div>

          <div className="space-y-6 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-amber-200">
            {[
              {
                time: 'September 2023 - Awal Berjumpa',
                title: 'Kolaborasi Media Pembelajaran',
                desc: 'Luthfi yang merupakan pendidik bertemu dengan Hanum, seorang developer IT, dalam projek pembuatan portal digitalisasi rapor. Diskusi pemrograman seketika berlanjut ke perkenalan pribadi.'
              },
              {
                time: 'Oktober 2024 - Merumuskan Masa Depan',
                title: 'Membangun Educita',
                desc: 'Keduanya bersepakat mendirikan brand teknologi "Educita" untuk mengabdi ke dunia pendidikan. Kolaborasi ini semakin mempererat komitmen dan penyatuan nilai-nilai kehidupan.'
              },
              {
                time: 'Mei 2025 - Pertemuan Keluarga',
                title: 'Khitbah Resmi',
                desc: 'Dengan restu penuh dari kedua belah orang tua, Luthfi memohon izin untuk mempersunting Hanum secara khidmat dan syar’i.'
              }
            ].map((story, i) => (
              <div key={i} className="relative pl-8">
                <div className="absolute left-1.5 top-1 w-5 h-5 rounded-full bg-[#fbfaf7] border-2 border-[#b89146] flex items-center justify-center">
                  <Heart className="w-2.5 h-2.5 text-pink-500 fill-pink-500" />
                </div>
                <div className="text-[10px] font-extrabold text-[#906e2a] uppercase tracking-wider">{story.time}</div>
                <h4 className="text-sm font-bold text-slate-800 mt-0.5">{story.title}</h4>
                <p className="text-xs text-slate-500 mt-1 lines-relaxed leading-relaxed">{story.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 4. EVENT INFORMATION & REAL MAP */}
        <section className="space-y-8">
          <div className="text-center">
            <h2 className="wedding-font-serif text-2xl font-bold text-[#906e2a]">Informasi Acara</h2>
            <p className="text-[11px] text-slate-400 uppercase tracking-widest mt-1">Akad & Resepsi Nikah</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Akad Nikah */}
            <div className="liquid-glass-gold p-6 rounded-3xl border border-white/60 relative">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 mb-4 mx-auto">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="wedding-font-serif text-lg font-bold text-center text-[#906e2a]">Akad Nikah</h3>
              
              <div className="space-y-3 mt-4 text-xs text-slate-600">
                <div className="flex items-center gap-2.5">
                  <Calendar className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Minggu, 13 September 2026</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Pukul 08:00 - 10:00 WIB</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>Masjid Agung Al-Fatih, Jl. Siliwangi No. 12, Bandung</span>
                </div>
              </div>
            </div>

            {/* Resepsi Nikah */}
            <div className="liquid-glass-gold p-6 rounded-3xl border border-white/60 relative">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 mb-4 mx-auto">
                <Users2 className="w-5 h-5" />
              </div>
              <h3 className="wedding-font-serif text-lg font-bold text-center text-[#906e2a]">Resepsi Nikah</h3>

              <div className="space-y-3 mt-4 text-xs text-slate-600">
                <div className="flex items-center gap-2.5">
                  <Calendar className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Minggu, 13 September 2026</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Pukul 11:00 - 16:00 WIB</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>Gedung Bale Pertiwi Indah, Raya Cipaganti, Bandung</span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Simulated Google Map */}
          <div className="liquid-glass rounded-3xl overflow-hidden border border-slate-200">
            <div className="bg-slate-100 p-4 border-b border-slate-200 flex items-center justify-between text-xs">
              <span className="font-bold flex items-center gap-1.5">
                <Map className="w-4 h-4 text-emerald-600" />
                <span>Navigasi Lokasi Peta</span>
              </span>
              <a 
                href="https://maps.google.com" 
                target="_blank" 
                rel="noreferrer"
                className="text-[10px] text-amber-800 font-extrabold uppercase hover:underline"
              >
                Buka G-Maps Asli
              </a>
            </div>
            
            <div className="h-64 bg-slate-200 flex flex-col items-center justify-center relative p-4 text-center">
              {/* Virtual map illustration overlay */}
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800')] bg-cover bg-center opacity-40"></div>
              
              <div className="relative z-10 glass-pill p-5 rounded-2xl max-w-sm border border-white/80">
                <h4 className="text-xs font-bold text-slate-800">Gedung Bale Pertiwi Indah, Bandung</h4>
                <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">Gedung berada di samping Taman Cipaganti. Parkir luas untuk kendaraan bermotor dan roda empat.</p>
                <div className="mt-3 flex items-center justify-center gap-2">
                  <a 
                    href="https://maps.google.com" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="px-3 py-1.5 bg-amber-600 text-white font-extrabold text-[10px] uppercase rounded-md shadow-sm block"
                  >
                    Petunjuk Arah
                  </a>
                  <button 
                    onClick={() => handleCopy('-6.8934, 107.6045', 'koordinat')}
                    className="px-3 py-1.5 bg-white text-slate-800 border border-slate-200 font-bold text-[10px] uppercase rounded-md shadow-sm"
                  >
                    {copiedAccount === 'koordinat' ? 'Tersalin!' : 'Copy GPS'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. GUEST RSVP FORM */}
        <section className="space-y-8">
          <div className="text-center">
            <h2 className="wedding-font-serif text-2xl font-bold text-[#906e2a]">Konfirmasi Kehadiran</h2>
            <p className="text-[11px] text-slate-400 uppercase tracking-widest mt-1">Wedding RSVP</p>
          </div>

          <div className="liquid-glass-gold p-6 sm:p-8 rounded-3xl border border-white/85 text-[#816531]">
            {rsvpSent ? (
              <div className="text-center py-6">
                <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Check className="w-6 h-6 text-pink-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">Kehadiran Berhasil Dikonfirmasi!</h3>
                <p className="text-xs text-slate-500 mt-1">Terima kasih atas konfirmasi Anda. Kehadiran Anda sangat berarti bagi kami berdua.</p>
              </div>
            ) : (
              <form onSubmit={handleRSVPSubmit} className="space-y-4 text-slate-700">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Nama Tamu Undangan</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 text-xs border border-[#cfbe9e] bg-white rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
                      value={rsvpForm.name}
                      onChange={(e) => setRsvpForm({...rsvpForm, name: e.target.value})}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Status Kehadiran</label>
                    <select 
                      className="w-full px-3 py-2 text-xs border border-[#cfbe9e] bg-white rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
                      value={rsvpForm.attendance}
                      onChange={(e) => setRsvpForm({...rsvpForm, attendance: e.target.value})}
                    >
                      <option value="hadir">Yth. Berkenan Hadir</option>
                      <option value="belum_pasti">Masih Belum Pasti</option>
                      <option value="tidak_hadir">Berhalangan Hadir</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Jumlah Tamu (Pax)</label>
                    <input 
                      type="number" 
                      min={1} 
                      max={4}
                      className="w-full px-3 py-2 text-xs border border-[#cfbe9e] bg-white rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
                      value={rsvpForm.guestsCount}
                      onChange={(e) => setRsvpForm({...rsvpForm, guestsCount: Number(e.target.value)})}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Doa / Ucapan Singkat</label>
                    <input 
                      type="text" 
                      placeholder="Tulis ucapan selamat..."
                      className="w-full px-3 py-2 text-xs border border-[#cfbe9e] bg-white rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
                      value={rsvpForm.wishes}
                      onChange={(e) => setRsvpForm({...rsvpForm, wishes: e.target.value})}
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#dfb76c] to-[#b89146] text-slate-950 font-black tracking-widest text-[10px] uppercase cursor-pointer transition transform hover:-translate-y-0.5"
                >
                  Konfirmasi Kehadiran Saya
                </button>
              </form>
            )}
          </div>
        </section>

        {/* 6. GIFT BOX / WEDDING CASHLESS */}
        <section className="space-y-8">
          <div className="text-center">
            <h2 className="wedding-font-serif text-2xl font-bold text-[#906e2a]">Wedding Gift</h2>
            <p className="text-[11px] text-slate-400 uppercase tracking-widest mt-1">Dompet Digital Berkah</p>
          </div>

          <div className="liquid-glass p-6 sm:p-8 rounded-3xl border border-white/60 text-center max-w-md mx-auto">
            <div className="w-10 h-10 bg-amber-50 text-[#906e2a] rounded-full flex items-center justify-center mx-auto mb-3">
              <Gift className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">Kirim Tanda Kasih Digital</h3>
            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
              Doa restu Anda adalah karunia terindah. Namun jika ingin memberikan kado digital cashless pelengkap rukun keluarga baru kami, silakan gunakan akun berikut:
            </p>

            <div className="mt-6 space-y-4">
              {/* Account 1 */}
              <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/40 relative text-left">
                <div className="text-[10px] uppercase tracking-wider font-extrabold text-amber-800">BANK MANDIRI</div>
                <div className="text-sm font-bold text-slate-800 mt-1">123-000-4567-890</div>
                <div className="text-[10px] text-slate-400">a.n. Muhammad Luthfi</div>
                
                <button 
                  onClick={() => handleCopy('1230004567890', 'mandiri')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 px-2.5 py-1.5 rounded bg-white border border-slate-200 text-[10px] font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-1 shadow-sm"
                >
                  {copiedAccount === 'mandiri' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedAccount === 'mandiri' ? 'Selesai' : 'Copy'}</span>
                </button>
              </div>

              {/* Account 2 */}
              <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/40 relative text-left">
                <div className="text-[10px] uppercase tracking-wider font-extrabold text-amber-800">BANK BCA</div>
                <div className="text-sm font-bold text-slate-800 mt-1">860-0123-456</div>
                <div className="text-[10px] text-slate-400">a.n. Siti Hanum Handayani</div>

                <button 
                  onClick={() => handleCopy('8600123456', 'bca')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 px-2.5 py-1.5 rounded bg-white border border-slate-200 text-[10px] font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-1 shadow-sm"
                >
                  {copiedAccount === 'bca' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedAccount === 'bca' ? 'Selesai' : 'Copy'}</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 7. LIVE INTERACTIVE GUEST BOOK */}
        <section className="space-y-8">
          <div className="text-center">
            <h2 className="wedding-font-serif text-2xl font-bold text-[#906e2a]">Buku Tamu Digital</h2>
            <p className="text-[11px] text-slate-400 uppercase tracking-widest mt-1">Doa, Keberkahan, & Ucapan</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Form writing */}
            <div className="md:col-span-5 liquid-glass-gold p-5 rounded-3xl border border-white/60 h-fit text-slate-700">
              <h3 className="text-xs font-black uppercase tracking-widest text-[#906e2a] mb-4">Kirim Doa Restu</h3>
              
              <form onSubmit={handleMessageSubmit} className="space-y-3">
                <div>
                  <input 
                    type="text" 
                    placeholder="Nama Anda" 
                    className="w-full px-3 py-2 text-xs border border-[#cfbe9e] bg-white rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
                    value={newMessage.name}
                    onChange={(e) => setNewMessage({...newMessage, name: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <select 
                    className="w-full px-3 py-2 text-xs border border-[#cfbe9e] bg-white rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
                    value={newMessage.relation}
                    onChange={(e) => setNewMessage({...newMessage, relation: e.target.value})}
                  >
                    <option value="Sahabat">Kerabat Dekat / Sahabat</option>
                    <option value="Keluarga">Keluarga Kandung/Besar</option>
                    <option value="Rekan Kerja">Rekan Kerja Sekolah</option>
                    <option value="Tamu">Tamu Terhormat</option>
                  </select>
                </div>

                <div>
                  <textarea 
                    rows={3} 
                    placeholder="Tuliskan barakah doa & restu Anda untuk Luthfi-Hanum..." 
                    className="w-full px-3 py-2 text-xs border border-[#cfbe9e] bg-white rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
                    value={newMessage.message}
                    onChange={(e) => setNewMessage({...newMessage, message: e.target.value})}
                    required
                  />
                </div>

                <button 
                  type="submit" 
                  className="w-full py-2 bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs rounded-lg cursor-pointer"
                >
                  Kirim Doa Berkah
                </button>
              </form>
            </div>

            {/* Read Message logs scrolling */}
            <div className="md:col-span-7 space-y-3 max-h-[380px] overflow-y-auto pr-2">
              {guestBook.map((gb) => (
                <div key={gb.id} className="bg-white/75 p-4 rounded-2xl border border-slate-200/50 shadow-sm flex gap-3 text-left">
                  <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center shrink-0 border border-amber-100 text-[#906e2a] font-bold text-xs">
                    {gb.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-800">{gb.name}</span>
                      <span className="text-[9px] bg-slate-100 text-slate-400 px-1.5 py-0.5 rounded-full font-semibold">{gb.relation}</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 italic font-medium leading-relaxed">
                      "{gb.message}"
                    </p>
                    <span className="text-[9px] text-slate-400 block mt-2">{new Date(gb.createdAt).toLocaleDateString('id-ID')}</span>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

      </div>
    </div>
  );
}
