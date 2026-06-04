import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Sliders, Layout, Users, MessageSquare, Gift, 
  ToggleLeft, ToggleRight, ArrowUp, ArrowDown, HelpCircle, 
  Check, Save, RefreshCw, Trash2, ShieldCheck, Heart, Sparkles, 
  MapPin, CheckCircle, Clock, Search, Palette, User, Volume2, Film, QrCode
} from 'lucide-react';
import { 
  weddingDb, WeddingSectionType, WeddingSettingsType, 
  WeddingGuestbookMessage, WeddingRSVPTicket, SouvenirRewardType 
} from '../lib/weddingDb';

export default function AdminWeddingView() {
  const [activeTab, setActiveTab] = useState<'sections' | 'theme' | 'rsvp' | 'guestbook' | 'souvenirs' | 'checkin'>('sections');
  const [sections, setSections] = useState<WeddingSectionType[]>([]);
  const [settings, setSettings] = useState<WeddingSettingsType | null>(null);
  const [guestBook, setGuestBook] = useState<WeddingGuestbookMessage[]>([]);
  const [tickets, setTickets] = useState<WeddingRSVPTicket[]>([]);
  const [rewards, setRewards] = useState<SouvenirRewardType[]>([]);
  const [drawHistory, setDrawHistory] = useState<any[]>([]);
  
  // Notice Banner & Success Messages
  const [flashMessage, setFlashMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Search Filter states
  const [rsvpSearch, setRsvpSearch] = useState('');
  const [guestbookSearch, setGuestbookSearch] = useState('');
  
  // Checkin Code inputs
  const [checkInCode, setCheckInCode] = useState('');
  const [checkInResult, setCheckInResult] = useState<{ success: boolean; message: string; ticket?: WeddingRSVPTicket } | null>(null);

  // Active editable section
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = () => {
    const slug = 'hanum-luthfi';
    setSections(weddingDb.getSections(slug).sort((a, b) => a.order - b.order));
    setSettings(weddingDb.getSettings(slug));
    setGuestBook(weddingDb.getGuestbook(slug));
    setTickets(weddingDb.getTickets(slug));
    setRewards(weddingDb.getRewards(slug));
    setDrawHistory(weddingDb.getDrawHistory(slug));
  };

  const showFlash = (text: string, type: 'success' | 'error' = 'success') => {
    setFlashMessage({ text, type });
    setTimeout(() => setFlashMessage(null), 4000);
  };

  // 1. SECTION BUILDER OPERATIONS
  const handleToggleSection = (id: string, currentVal: boolean) => {
    const updated = sections.map(s => s.id === id ? { ...s, isEnabled: !currentVal } : s);
    setSections(updated);
    weddingDb.saveSections(updated);
    showFlash('Perubahan status modul disimpan otomatis!');
  };

  const handleMoveSection = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === sections.length - 1) return;

    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    const reordered = [...sections];

    // Swap ordering numbers
    const tempOrder = reordered[index].order;
    reordered[index].order = reordered[targetIdx].order;
    reordered[targetIdx].order = tempOrder;

    // Swap index positions
    const tempObj = reordered[index];
    reordered[index] = reordered[targetIdx];
    reordered[targetIdx] = tempObj;

    setSections(reordered);
    weddingDb.saveSections(reordered);
    showFlash('Urutan layout modul bioskop berhasil ditukar!');
  };

  const handleUpdateSectionContent = (id: string, fields: Partial<WeddingSectionType>) => {
    const updated = sections.map(s => s.id === id ? { ...s, ...fields } as WeddingSectionType : s);
    setSections(updated);
    weddingDb.saveSections(updated);
    showFlash('Perubahan konten modul berhasil disimpan!');
  };

  // 2. THEME OPERATIONS
  const handleSaveThemeSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    weddingDb.saveSettings(settings);
    showFlash('Konfigurasi visual & musik latar pengantin sukses diperbarui!');
  };

  // Preset quick themes config
  const applyThemePreset = (preset: 'luxury_glass' | 'emerald_gold' | 'classic_wood' | 'minimal_white' | 'royal_magenta') => {
    if (!settings) return;
    let primary = '#8a1c14';
    let secondary = '#121212';
    let accent = '#dfb76c';

    if (preset === 'emerald_gold') {
      primary = '#065f46';
      secondary = '#0f172a';
      accent = '#f59e0b';
    } else if (preset === 'classic_wood') {
      primary = '#78350f';
      secondary = '#1e1b4b';
      accent = '#fcd34d';
    } else if (preset === 'minimal_white') {
      primary = '#1e293b';
      secondary = '#f8fafc';
      accent = '#0f172a';
    } else if (preset === 'royal_magenta') {
      primary = '#831843';
      secondary = '#030712';
      accent = '#ec4899';
    }

    setSettings({
      ...settings,
      themePreset: preset,
      primaryColor: primary,
      secondaryColor: secondary,
      accentColor: accent
    });
    showFlash(`Tema Preset "${preset}" diaplikasikan. Klik simpan untuk mempermanenkan.`);
  };

  // 3. GUESTBOOK MODERATION & AI CO-HOST REPLIES
  const handleDeleteGuestMessage = (id: string) => {
    if (!window.confirm('Yakin ingin menghapus ucapan restu tamu ini?')) return;
    const filtered = guestBook.filter(g => g.id !== id);
    setGuestBook(filtered);
    localStorage.setItem('wedding_guestbook_hanum-luthfi', JSON.stringify(filtered));
    showFlash('Ucapan tamu berhasil dihapus dari Memory Wall.');
  };

  const handleUpdateAiReply = (id: string, text: string) => {
    const updated = guestBook.map(g => g.id === id ? { ...g, aiReply: text } : g);
    setGuestBook(updated);
    localStorage.setItem('wedding_guestbook_hanum-luthfi', JSON.stringify(updated));
    showFlash('Balasan AI Co-Host berhasil disunting.');
  };

  const handleRegenerateAiReply = async (id: string, name: string, prayer: string) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/wedding/ai-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, message: prayer })
      });
      if (response.ok) {
        const data = await response.json();
        const updated = guestBook.map(g => g.id === id ? { ...g, aiReply: data.reply } : g);
        setGuestBook(updated);
        localStorage.setItem('wedding_guestbook_hanum-luthfi', JSON.stringify(updated));
        showFlash('Kecerdasan Buatan (Gemini) berhasil melahirkan balasan baru!');
      } else {
        showFlash('Gagal terhubung dengan server AI.', 'error');
      }
    } catch {
      showFlash('Kesalahan sistem penyusunan kalimat AI.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 4. SOUVENIR STOCK MANAGEMENT
  const handleUpdateRewardProperty = (id: string, fields: Partial<SouvenirRewardType>) => {
    const updated = rewards.map(r => r.id === id ? { ...r, ...fields } as SouvenirRewardType : r);
    setRewards(updated);
    weddingDb.saveRewards(updated);
    showFlash('Parameter souvenir berhasil diupdate!');
  };

  // 5. QR CODE ADMISSIONS CHECKIN ENGINE
  const handleCheckInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkInCode) return;
    const res = weddingDb.checkInTicket(checkInCode);
    setCheckInResult(res);
    if (res.success) {
      showFlash(`Check-in tervalidasi: ${res.ticket?.guestName}`);
      loadAllData(); // reload statistics and list status
    } else {
      showFlash(res.message, 'error');
    }
    setCheckInCode('');
  };

  // Filter lists
  const filteredTickets = tickets.filter(t => 
    t.guestName.toLowerCase().includes(rsvpSearch.toLowerCase()) ||
    t.ticketNumber.toLowerCase().includes(rsvpSearch.toLowerCase()) ||
    t.seatNumber.toLowerCase().includes(rsvpSearch.toLowerCase())
  );

  const filteredGuestbook = guestBook.filter(g => 
    g.name.toLowerCase().includes(guestbookSearch.toLowerCase()) ||
    g.message.toLowerCase().includes(guestbookSearch.toLowerCase()) ||
    g.prayer.toLowerCase().includes(guestbookSearch.toLowerCase())
  );

  return (
    <div className="bg-slate-900 min-h-screen text-slate-100 font-sans pb-16">
      
      {/* Top Header Panel */}
      <div className="bg-slate-950 border-b border-slate-800 py-6 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => window.location.hash = '#/admin'}
              className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full font-black font-mono uppercase tracking-widest border border-emerald-500/20">CINEMA BUILDER CMS</span>
                <span className="text-[10px] bg-[#dfb76c]/10 text-[#dfb76c] px-2 py-0.5 rounded-full font-black font-mono border border-[#dfb76c]/25">EDUCITA</span>
              </div>
              <h1 className="text-xl font-extrabold text-white mt-1 flex items-center gap-2">
                <span>Advanced Wedding CMS Customizer</span>
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">Sunting, kelola rute AI, RSVP, souvenir Gacha & cek kartu ticket tamu secara live.</p>
            </div>
          </div>

          <div className="flex gap-2 shrink-0">
            <a 
              href="#/wedding/hanum-luthfi" 
              className="px-4 py-2 bg-[#dfb76c]/10 border border-[#dfb76c]/30 text-[#dfb76c] text-xs font-bold rounded-lg hover:bg-[#dfb76c]/20 transition flex items-center gap-1.5"
            >
              <Film className="w-4 h-4" />
              <span>Lihat Halaman Utama Undangan</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Navigation Sidebar Panel */}
        <div className="lg:col-span-3 space-y-2">
          
          {/* Quick Stats Widget */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3.5 mb-4">
            <h4 className="text-[10px] font-mono text-slate-500 font-extrabold uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-800/80 pb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-[#dfb76c]" />
              <span>WEDDING GENERAL METRICS</span>
            </h4>
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800/50">
                <span className="text-[10px] text-slate-500 block uppercase font-bold font-mono">RSVP Booked</span>
                <span className="text-lg font-black text-white block mt-0.5">{tickets.length} Pax</span>
              </div>
              <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800/50">
                <span className="text-[10px] text-slate-500 block uppercase font-bold font-mono">Check-In</span>
                <span className="text-lg font-black text-emerald-400 block mt-0.5">
                  {tickets.filter(t => t.checkInStatus === 'sudah_hadir').length} Pax
                </span>
              </div>
              <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800/50">
                <span className="text-[10px] text-slate-500 block uppercase font-bold font-mono">Guest Prayers</span>
                <span className="text-lg font-black text-[#dfb76c] block mt-0.5">{guestBook.length} Doa</span>
              </div>
              <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800/50">
                <span className="text-[10px] text-slate-500 block uppercase font-bold font-mono">Souvenirs Dropped</span>
                <span className="text-lg font-black text-indigo-400 block mt-0.5">{drawHistory.length} Prize</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex flex-col gap-1.5">
            <button 
              onClick={() => setActiveTab('sections')}
              className={`p-3 text-left font-bold text-xs rounded-xl flex items-center gap-2.5 transition cursor-pointer ${activeTab === 'sections' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-900 hover:text-white'}`}
            >
              <Layout className="w-4 h-4" />
              <span>Layout & Section Builder</span>
            </button>

            <button 
              onClick={() => setActiveTab('theme')}
              className={`p-3 text-left font-bold text-xs rounded-xl flex items-center gap-2.5 transition cursor-pointer ${activeTab === 'theme' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-900 hover:text-white'}`}
            >
              <Palette className="w-4 h-4" />
              <span>Tampilan Tema & Musik</span>
            </button>

            <button 
              onClick={() => setActiveTab('rsvp')}
              className={`p-3 text-left font-bold text-xs rounded-xl flex items-center gap-2.5 transition cursor-pointer ${activeTab === 'rsvp' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-900 hover:text-white'}`}
            >
              <Users className="w-4 h-4" />
              <span>Data Reservasi RSVP</span>
            </button>

            <button 
              onClick={() => setActiveTab('guestbook')}
              className={`p-3 text-left font-bold text-xs rounded-xl flex items-center gap-2.5 transition cursor-pointer ${activeTab === 'guestbook' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-900 hover:text-white'}`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Story Ucapan & AI Replies</span>
            </button>

            <button 
              onClick={() => setActiveTab('souvenirs')}
              className={`p-3 text-left font-bold text-xs rounded-xl flex items-center gap-2.5 transition cursor-pointer ${activeTab === 'souvenirs' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-900 hover:text-white'}`}
            >
              <Gift className="w-4 h-4" />
              <span>Inventory Gacha Souvenir</span>
            </button>

            <button 
              onClick={() => setActiveTab('checkin')}
              className={`p-3 text-left font-bold text-xs rounded-xl flex items-center gap-2.5 transition cursor-pointer ${activeTab === 'checkin' ? 'bg-[#dfb76c]/10 text-[#dfb76c] border border-[#dfb76c]/20' : 'text-slate-400 hover:bg-slate-900 hover:text-white'}`}
            >
              <QrCode className="w-4 h-4 text-[#dfb76c]" />
              <span className="font-extrabold uppercase tracking-widest text-[10px]">QR ADMISSIONS GATE</span>
            </button>
          </div>
        </div>

        {/* Content Workspace */}
        <div className="lg:col-span-9 space-y-6">

          {/* Alert / Notice Display banner */}
          {flashMessage && (
            <div className={`p-4 rounded-xl border font-bold text-xs flex items-center gap-3 animate-pulse ${flashMessage.type === 'success' ? 'bg-emerald-950/80 border-emerald-500/30 text-emerald-300' : 'bg-rose-950/80 border-rose-500/30 text-rose-300'}`}>
              <CheckCircle className="w-5 h-5 shrink-0" />
              <span>{flashMessage.text}</span>
            </div>
          )}

          {/* TAB A: SECTIONS & BEDSIDE BUILDER */}
          {activeTab === 'sections' && (
            <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-6">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded font-black font-mono">Framer/Elementor-Style</span>
                </div>
                <h2 className="text-lg font-black text-white mt-1 flex items-center gap-2">
                  <Layout className="w-5 h-5 text-[#dfb76c]" />
                  <span>Cinematic Section Builder</span>
                </h2>
                <p className="text-xs text-slate-400 leading-relaxed mt-0.5">Toggle status keaktifan, atur bobot urutan film per scrolling, dan kustomisasi konten text maupun media secara individu.</p>
              </div>

              <div className="space-y-4">
                {sections.map((sec, idx) => (
                  <div 
                    key={sec.id} 
                    className={`border rounded-2xl transition duration-150 overflow-hidden ${sec.isEnabled ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-950/40 border-slate-900 opacity-60'}`}
                  >
                    
                    {/* Header line of item */}
                    <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/30 border-b border-slate-800/40">
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-mono font-bold bg-slate-800 px-2 py-1 rounded text-slate-400">
                          Order {sec.order}
                        </span>
                        <div>
                          <h4 className="text-sm font-extrabold text-white flex items-center gap-2">
                            <span>{sec.title}</span>
                            <span className="text-[9px] bg-[#dfb76c]/10 text-[#dfb76c] font-black font-mono px-1.5 py-0.5 rounded uppercase">{sec.type}</span>
                          </h4>
                          <span className="text-[10px] text-slate-4s0 truncate block max-w-[200px] sm:max-w-md">{sec.subtitle || 'Modul Konten Aktif'}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {/* Status Switch Toggle Button */}
                        <button 
                          onClick={() => handleToggleSection(sec.id, sec.isEnabled)}
                          className="p-1 px-2.5 bg-slate-850 hover:bg-slate-800 rounded-lg text-xs font-bold text-slate-300 border border-slate-800 flex items-center gap-1.5 transition cursor-pointer"
                        >
                          {sec.isEnabled ? (
                            <>
                              <ToggleRight className="w-5 h-5 text-emerald-400" />
                              <span className="text-emerald-400">Active</span>
                            </>
                          ) : (
                            <>
                              <ToggleLeft className="w-5 h-5 text-slate-500" />
                              <span className="text-slate-500">Disabled</span>
                            </>
                          )}
                        </button>

                        <button 
                          onClick={() => handleMoveSection(idx, 'up')}
                          disabled={idx === 0}
                          className="p-1.5 bg-slate-850 rounded-lg text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition"
                          title="Geser Naik"
                        >
                          <ArrowUp className="w-4 h-4" />
                        </button>

                        <button 
                          onClick={() => handleMoveSection(idx, 'down')}
                          disabled={idx === sections.length - 1}
                          className="p-1.5 bg-slate-850 rounded-lg text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition"
                          title="Geser Turun"
                        >
                          <ArrowDown className="w-4 h-4" />
                        </button>

                        <button 
                          onClick={() => setEditingSectionId(editingSectionId === sec.id ? null : sec.id)}
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 hover:text-[#dfb76c] rounded-lg text-xs font-bold transition flex items-center gap-1"
                        >
                          <span>{editingSectionId === sec.id ? 'Tutup' : 'Edit Konten'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Edit Form Accordion Drawer */}
                    {editingSectionId === sec.id && (
                      <div className="p-5 bg-slate-950 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs animate-[fadeIn_0.2s_ease-out]">
                        
                        <div className="space-y-3.5">
                          <div>
                            <label className="block text-slate-400 font-bold mb-1">Judul Utama Seksi ({sec.type})</label>
                            <input 
                              type="text" 
                              className="w-full bg-slate-900 border border-slate-800 px-3 py-2 rounded-xl text-white font-extrabold focus:outline-none focus:border-[#dfb76c]"
                              value={sec.title}
                              onChange={(e) => handleUpdateSectionContent(sec.id, { title: e.target.value })}
                            />
                          </div>

                          <div>
                            <label className="block text-slate-400 font-bold mb-1">Sub-Tagline Latar</label>
                            <input 
                              type="text" 
                              className="w-full bg-slate-900 border border-slate-800 px-3 py-2 rounded-xl text-white focus:outline-none focus:border-[#dfb76c]"
                              value={sec.subtitle || ''}
                              placeholder="Ketik sub-judul moduler"
                              onChange={(e) => handleUpdateSectionContent(sec.id, { subtitle: e.target.value })}
                            />
                          </div>

                          <div>
                            <label className="block text-slate-400 font-bold mb-1">Deskripsi & Kutipan Cerita</label>
                            <textarea 
                              rows={4}
                              className="w-full bg-slate-900 border border-slate-800 px-3 py-2 rounded-xl text-white focus:outline-none focus:border-[#dfb76c]"
                              value={sec.description || ''}
                              placeholder="Masukkan detail rincian atau sapaan puitis..."
                              onChange={(e) => handleUpdateSectionContent(sec.id, { description: e.target.value })}
                            />
                          </div>
                        </div>

                        <div className="space-y-3.5">
                          {/* Image Media asset configuration */}
                          <div>
                            <label className="block text-slate-400 font-bold mb-1">URL Media Foto Utama (Unsplash / Cloudinary)</label>
                            <input 
                              type="text" 
                              className="w-full bg-slate-900 border border-slate-800 px-3 py-2 rounded-xl text-slate-200 focus:outline-none focus:border-[#dfb76c] font-mono text-[11px]"
                              value={sec.mediaUrl || ''}
                              placeholder="https://images.unsplash.com/..."
                              onChange={(e) => handleUpdateSectionContent(sec.id, { mediaUrl: e.target.value })}
                            />
                            {sec.mediaUrl && (
                              <div className="mt-2 text-[10px] text-slate-500 font-mono flex items-center gap-1.5">
                                <span className="bg-[#dfb76c]/10 text-[#dfb76c] px-1 py-0.5 rounded font-bold uppercase">Image Preview Asset</span>
                                <a href={sec.mediaUrl} target="_blank" rel="noreferrer" className="underline hover:text-white">Review URL asli</a>
                              </div>
                            )}
                          </div>

                          {/* Video source media (for chapters/movie poster trailer) */}
                          {(sec.type === 'movie_poster' || sec.type === 'story' || sec.type === 'cover') && (
                            <div>
                              <label className="block text-slate-400 font-bold mb-1">URL Trailer Video (Direct MP4 / Youtube Link)</label>
                              <input 
                                type="text" 
                                className="w-full bg-slate-900 border border-slate-800 px-3 py-2 rounded-xl text-slate-200 focus:outline-none focus:border-[#dfb76c] font-mono text-[11px]"
                                value={sec.videoUrl || ''}
                                placeholder="https://www.w3schools.com/html/mov_bbb.mp4"
                                onChange={(e) => handleUpdateSectionContent(sec.id, { videoUrl: e.target.value })}
                              />
                            </div>
                          )}

                          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800/80 space-y-1 mt-4">
                            <span className="text-[10px] text-[#dfb76c] font-bold font-mono block uppercase">📋 SECTION SEED IDENTIFIER</span>
                            <p className="text-[10px] text-slate-500 leading-relaxed font-sans">
                              Seksi ini merupakan unit modular orisinal dengan type identitas <code className="text-[#dfb76c]">{sec.type}</code>. Menghapus atau mendisable seksi ini tidak akan merusak struktur data RSVP, gacha, maupun sound system di halaman depan.
                            </p>
                          </div>
                        </div>

                      </div>
                    )}

                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB B: COLOR PRESET & SETTINGS */}
          {activeTab === 'theme' && settings && (
            <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-6">
              <div>
                <span className="text-[10px] bg-indigo-500/10 text-indigo-400 px-2.5 py-0.5 rounded font-black font-mono">STYLE CUSTOMIZATION</span>
                <h2 className="text-lg font-black text-white mt-1 flex items-center gap-2">
                  <Palette className="w-5 h-5 text-[#dfb76c]" />
                  <span>Cinematic Visuals & Background Tracks</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">Ubah skema layout, warna aksen gradien, teks nama display utama, serta lagu instrumental romantis.</p>
              </div>

              {/* Theme Preset click boards */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Aplikasi Instan Tema Preset (Fast Styling)</label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  <button 
                    onClick={() => applyThemePreset('luxury_glass')}
                    className={`p-3.5 rounded-xl border text-[10px] font-black uppercase tracking-widest text-center transition flex flex-col items-center gap-1.5 cursor-pointer ${settings.themePreset === 'luxury_glass' ? 'bg-[#dfb76c]/10 border-[#dfb76c] text-[#dfb76c]' : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'}`}
                  >
                    <span className="w-4 h-4 rounded-full bg-[#8a1c14] border border-[#dfb76c]"></span>
                    <span>Luxury Glass</span>
                  </button>

                  <button 
                    onClick={() => applyThemePreset('emerald_gold')}
                    className={`p-3.5 rounded-xl border text-[10px] font-black uppercase tracking-widest text-center transition flex flex-col items-center gap-1.5 cursor-pointer ${settings.themePreset === 'emerald_gold' ? 'bg-amber-500/10 border-amber-500 text-amber-500' : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'}`}
                  >
                    <span className="w-4 h-4 rounded-full bg-[#065f46] border border-[#f59e0b]"></span>
                    <span>Emerald Gold</span>
                  </button>

                  <button 
                    onClick={() => applyThemePreset('royal_magenta')}
                    className={`p-3.5 rounded-xl border text-[10px] font-black uppercase tracking-widest text-center transition flex flex-col items-center gap-1.5 cursor-pointer ${settings.themePreset === 'royal_magenta' ? 'bg-pink-500/10 border-pink-500 text-pink-500' : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'}`}
                  >
                    <span className="w-4 h-4 rounded-full bg-[#831843] border border-[#ec4899]"></span>
                    <span>Royal Magenta</span>
                  </button>

                  <button 
                    onClick={() => applyThemePreset('classic_wood')}
                    className={`p-3.5 rounded-xl border text-[10px] font-black uppercase tracking-widest text-center transition flex flex-col items-center gap-1.5 cursor-pointer ${settings.themePreset === 'classic_wood' ? 'bg-amber-300/10 border-amber-300 text-amber-300' : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'}`}
                  >
                    <span className="w-4 h-4 rounded-full bg-[#78350f] border border-[#fcd34d]"></span>
                    <span>Classic Wood</span>
                  </button>

                  <button 
                    onClick={() => applyThemePreset('minimal_white')}
                    className={`p-3.5 rounded-xl border text-[10px] font-black uppercase tracking-widest text-center transition flex flex-col items-center gap-1.5 cursor-pointer ${settings.themePreset === 'minimal_white' ? 'bg-slate-100/15 border-white text-slate-200' : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'}`}
                  >
                    <span className="w-4 h-4 rounded-full bg-[#1e293b] border border-white"></span>
                    <span>Minimal White</span>
                  </button>
                </div>
              </div>

              {/* Theme Settings detailed forms */}
              <form onSubmit={handleSaveThemeSettings} className="space-y-4 text-xs text-slate-300 pt-4 border-t border-slate-800">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-slate-400 font-bold mb-1">Nama Utama Display (Cover Panel & Title)</label>
                    <input 
                      type="text" 
                      className="w-full bg-slate-900 border border-slate-800 px-3 py-2 rounded-xl text-white focus:outline-none focus:border-[#dfb76c] font-bold"
                      value={settings.coupleDisplayTitle}
                      onChange={(e) => setSettings({ ...settings, coupleDisplayTitle: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 font-bold mb-1">Tanggal Akad & Resepsi (YYYY-MM-DD)</label>
                    <input 
                      type="date" 
                      className="w-full bg-slate-900 border border-slate-800 px-3 py-2 rounded-xl text-white focus:outline-none focus:border-[#dfb76c]"
                      value={settings.eventDate}
                      onChange={(e) => setSettings({ ...settings, eventDate: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 font-bold mb-1">Total Limit Kursi RSVP (Seat Tracker)</label>
                    <input 
                      type="number" 
                      className="w-full bg-slate-900 border border-slate-800 px-3 py-2 rounded-xl text-white focus:outline-none focus:border-[#dfb76c] font-mono font-bold"
                      value={settings.seatCount}
                      onChange={(e) => setSettings({ ...settings, seatCount: Number(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-slate-400 font-bold mb-1">Primary Color (Hex)</label>
                    <div className="flex gap-2">
                      <input 
                        type="color" 
                        className="w-8 h-8 rounded border-none bg-transparent cursor-pointer shrink-0" 
                        value={settings.primaryColor}
                        onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                      />
                      <input 
                        type="text" 
                        className="w-full bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-white font-mono"
                        value={settings.primaryColor}
                        onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-400 font-bold mb-1">Secondary Color (Hex)</label>
                    <div className="flex gap-2">
                      <input 
                        type="color" 
                        className="w-8 h-8 rounded border-none bg-transparent cursor-pointer shrink-0" 
                        value={settings.secondaryColor}
                        onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })}
                      />
                      <input 
                        type="text" 
                        className="w-full bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-white font-mono"
                        value={settings.secondaryColor}
                        onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-400 font-bold mb-1">Accent Gold Color (Hex)</label>
                    <div className="flex gap-2">
                      <input 
                        type="color" 
                        className="w-8 h-8 rounded border-none bg-transparent cursor-pointer shrink-0" 
                        value={settings.accentColor}
                        onChange={(e) => setSettings({ ...settings, accentColor: e.target.value })}
                      />
                      <input 
                        type="text" 
                        className="w-full bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-white font-mono"
                        value={settings.accentColor}
                        onChange={(e) => setSettings({ ...settings, accentColor: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">Lagu Pengiring Instrumental Pernikahan (Audio URL / Link YouTube)</label>
                  <div className="flex gap-2">
                    <div className="w-8 h-8 bg-slate-900 flex items-center justify-center rounded-xl border border-slate-800 text-slate-400">
                      <Volume2 className="w-4 h-4" />
                    </div>
                    <input 
                      type="text" 
                      className="w-full bg-slate-900 border border-slate-800 px-3 py-2 rounded-xl text-white focus:outline-none focus:border-[#dfb76c] font-mono text-[11px]"
                      value={settings.backgroundMusicUrl}
                      onChange={(e) => setSettings({ ...settings, backgroundMusicUrl: e.target.value })}
                      placeholder="Masukkan Link Video YouTube atau Link File Audio .mp3"
                    />
                  </div>
                  <span className="block text-[10px] text-zinc-500 mt-1">✓ Mendukung tautan video YouTube (misalnya https://www.youtube.com/watch?v=...) atau direct link berkas sound .mp3</span>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input 
                    type="checkbox" 
                    id="musicAuto"
                    className="w-4 h-4 rounded dark:bg-slate-900 dark:border-slate-800 text-[#dfb76c]"
                    checked={settings.hasMusicAutoPlay}
                    onChange={(e) => setSettings({ ...settings, hasMusicAutoPlay: e.target.checked })}
                  />
                  <label htmlFor="musicAuto" className="text-slate-400 font-bold">Autoplay lagu otomatis ketika tamu klik "Masuk Premium Cinema Premiere"</label>
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#dfb76c] hover:bg-[#cf9c52]/90 text-slate-950 font-black tracking-widest uppercase rounded-xl shadow-lg transition cursor-pointer flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>SIMPAN PENGATURAN TEMA & MUSIC</span>
                </button>
              </form>
            </div>
          )}

          {/* TAB C: RSVPS & TICKETING SEATING DATA */}
          {activeTab === 'rsvp' && (
            <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] bg-indigo-500/10 text-indigo-400 px-2.5 py-0.5 rounded font-black font-mono">SEAT MAP DATABASE</span>
                  <h2 className="text-lg font-black text-white mt-1 flex items-center gap-2">
                    <Users className="w-5 h-5 text-[#dfb76c]" />
                    <span>Active RSVP Cinema Bookings</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">Daftar booking kursi berbarcode yang didaftarkan tamu kluarga, rekan kerja guru, dan kerabat.</p>
                </div>
                
                {/* Search box input */}
                <div className="relative max-w-xs w-full">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input 
                    type="text" 
                    className="w-full bg-slate-900 border border-slate-800 px-3 pl-10 py-1.5 rounded-xl text-white text-xs focus:outline-none focus:border-[#dfb76c]"
                    placeholder="Cari nama atau nomor tiket..."
                    value={rsvpSearch}
                    onChange={(e) => setRsvpSearch(e.target.value)}
                  />
                </div>
              </div>

              {/* Data Table */}
              <div className="relative overflow-x-auto border border-slate-850 rounded-2xl">
                <table className="w-full text-left text-slate-300 text-xs text-nowrap">
                  <thead className="bg-slate-900/60 uppercase font-mono font-bold text-slate-400 border-b border-slate-800/85">
                    <tr>
                      <th scope="col" className="px-5 py-3">No. Tiket Booking</th>
                      <th scope="col" className="px-5 py-3">Nama Tamu</th>
                      <th scope="col" className="px-5 py-3">Konfirmasi Sesi Pas</th>
                      <th scope="col" className="px-5 py-3 text-center">Jumlah Pax</th>
                      <th scope="col" className="px-5 py-3">Nomor Kursi</th>
                      <th scope="col" className="px-5 py-3">Status Check-in</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTickets.length > 0 ? (
                      filteredTickets.map((tc) => (
                        <tr key={tc.id} className="border-b border-slate-850 hover:bg-slate-900/40">
                          <td className="px-5 py-4 font-mono font-extrabold text-[#dfb76c]">{tc.ticketNumber}</td>
                          <td className="px-5 py-4 font-bold text-white flex items-center gap-1.5">
                            <span className="text-lg bg-slate-800 p-0.5 rounded">{tc.avatar || '🎟️'}</span>
                            <span>{tc.guestName}</span>
                          </td>
                          <td className="px-5 py-4">{tc.session}</td>
                          <td className="px-5 py-4 text-center font-bold">{tc.guestsCount} Pax</td>
                          <td className="px-5 py-4 font-mono font-bold">{tc.seatNumber}</td>
                          <td className="px-5 py-4">
                            {tc.checkInStatus === 'sudah_hadir' ? (
                              <div className="flex items-center gap-1.5 text-emerald-400 font-extrabold font-mono text-[10px]">
                                <CheckCircle className="w-3.5 h-3.5" />
                                <span>SUDAH CHECK-IN ({tc.checkInTime ? new Date(tc.checkInTime).toLocaleTimeString('id-ID') : ''})</span>
                              </div>
                            ) : (
                              <span className="text-slate-500 font-bold font-mono text-[10px]">● Belum Hadir</span>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-5 py-12 text-center text-slate-500 font-mono">
                          Tidak ditemukan reservasi RSVP aktif untuk kriteria pencarian Anda.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB D: GUESTBOOK MODERATION & AI */}
          {activeTab === 'guestbook' && (
            <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2.5 py-0.5 rounded font-black font-mono border border-emerald-500/20">MODERATOR GATE</span>
                  <h2 className="text-lg font-black text-white mt-1 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-[#dfb76c]" />
                    <span>Story Prayer Board & AI Co-Host</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">Saring kiriman ucapan tulus, edit teks balasan otomatis, atau gunakan kecerdasan buatan Gemini untuk melahirkan sapaan restu balasan puitis.</p>
                </div>

                <div className="relative max-w-xs w-full">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input 
                    type="text" 
                    className="w-full bg-slate-900 border border-slate-800 px-3 pl-10 py-1.5 rounded-xl text-white text-xs focus:outline-none focus:border-[#dfb76c]"
                    placeholder="Cari doa atau nama teman..."
                    value={guestbookSearch}
                    onChange={(e) => setGuestbookSearch(e.target.value)}
                  />
                </div>
              </div>

              {/* Ucapan list cards */}
              <div className="space-y-4">
                {filteredGuestbook.length > 0 ? (
                  filteredGuestbook.map((gm) => (
                    <div key={gm.id} className="p-5 bg-slate-900/50 rounded-2xl border border-slate-800 space-y-4 text-xs">
                      
                      {/* Top Message user header */}
                      <div className="flex items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-full bg-slate-950 border border-[#dfb76c]/30 overflow-hidden flex items-center justify-center text-lg select-none">
                            {gm.avatar && gm.avatar.startsWith('http') ? (
                              <img src={gm.avatar} className="w-full h-full object-cover" alt="Guest" />
                            ) : (
                              gm.avatar || '👤'
                            )}
                          </div>
                          <div>
                            <h4 className="font-extrabold text-[#dfb76c]">{gm.name}</h4>
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{gm.relation}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="text-[9px] text-slate-500 font-mono mr-1.5">{new Date(gm.createdAt).toLocaleDateString('id-ID')}</span>
                          <button 
                            onClick={() => handleDeleteGuestMessage(gm.id)}
                            className="p-1 px-2.5 bg-rose-500/10 hover:bg-rose-500 hover:text-white border border-rose-500/25 rounded-lg text-[10px] font-bold text-rose-400 transition cursor-pointer flex items-center gap-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Hapus</span>
                          </button>
                        </div>
                      </div>

                      {/* Ucapan text info */}
                      <div className="space-y-1">
                        <div className="text-white font-extrabold font-serif text-[13px] leading-relaxed">
                          "{gm.message}"
                        </div>
                        <p className="text-slate-400 italic leading-relaxed">
                          "{gm.prayer}"
                        </p>
                      </div>

                      {/* Co Host AI Reply Sunting space */}
                      <div className="bg-gradient-to-r from-emerald-950/70 to-slate-950/70 p-4 rounded-xl border border-emerald-500/20 space-y-2.5">
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-[9px] text-emerald-400 font-black tracking-widest font-mono uppercase flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>AI WEDDING CO-HOST AUTO-REPLY</span>
                          </span>
                          
                          <button 
                            onClick={() => handleRegenerateAiReply(gm.id, gm.name, gm.prayer)}
                            disabled={isSubmitting}
                            className="px-2 py-0.5 bg-emerald-500 text-slate-950 hover:bg-emerald-400 rounded-md text-[9px] font-black uppercase tracking-widest font-mono transition flex items-center gap-1 disabled:opacity-30"
                          >
                            <RefreshCw className="w-3 h-3" />
                            <span>Regenerate AI</span>
                          </button>
                        </div>

                        <textarea 
                          rows={2}
                          className="w-full bg-slate-900 border border-slate-800/80 p-2 text-xs rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500 font-mono leading-relaxed"
                          value={gm.aiReply || ''}
                          onChange={(e) => handleUpdateAiReply(gm.id, e.target.value)}
                        />
                      </div>

                    </div>
                  ))
                ) : (
                  <div className="p-12 text-center text-slate-500 font-mono">
                    Belum ditemukan restu ucapan tamu digital aktif.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB E: SOUVENIR DROPS & GACHA METRICS */}
          {activeTab === 'souvenirs' && (
            <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-6">
              <div>
                <span className="text-[10px] bg-purple-500/10 text-purple-400 px-2.5 py-0.5 rounded font-black font-mono">LOOTBOX MANAGER</span>
                <h2 className="text-lg font-black text-white mt-1 flex items-center gap-2">
                  <Gift className="w-5 h-5 text-[#dfb76c]" />
                  <span>Interactive Souvenir Gacha Rewards</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">Edit parameter persentase kemunculan (probability), ubah jumlah stok hadiah orisinal, serta tinjau rekam drop log historis.</p>
              </div>

              {/* Edit Rewards Inventory */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {rewards.map((rw) => (
                  <div key={rw.id} className="p-4 bg-slate-900/60 rounded-2xl border border-slate-850 space-y-3.5 text-xs text-slate-300">
                    <div className="flex items-center justify-between gap-3 border-b border-slate-800/80 pb-2">
                      <h4 className="font-extrabold text-white">{rw.title}</h4>
                      <span className="text-[9px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-mono font-bold uppercase">{rw.id}</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                      <div className="p-1.5 bg-slate-850 rounded-lg">
                        <span className="text-slate-500 font-mono block">Probability %</span>
                        <input 
                          type="number"
                          className="w-12 bg-transparent text-center text-white font-black font-mono mt-1 border-b border-slate-700 h-6 shrink-0 focus:outline-none"
                          value={rw.probability}
                          onChange={(e) => handleUpdateRewardProperty(rw.id, { probability: Number(e.target.value) })}
                        />
                      </div>
                      <div className="p-1.5 bg-slate-850 rounded-lg">
                        <span className="text-slate-500 font-mono block">Stok Awal</span>
                        <input 
                          type="number"
                          className="w-12 bg-transparent text-center text-white font-black font-mono mt-1 border-b border-slate-700 h-6 shrink-0 focus:outline-none"
                          value={rw.quantity}
                          onChange={(e) => handleUpdateRewardProperty(rw.id, { quantity: Number(e.target.value) })}
                        />
                      </div>
                      <div className="p-1.5 bg-slate-850 rounded-lg">
                        <span className="text-slate-500 font-mono block">Tersisa</span>
                        <input 
                          type="number"
                          className="w-12 bg-transparent text-center text-emerald-400 font-black font-mono mt-1 border-b border-slate-705 h-6 shrink-0 focus:outline-none"
                          value={rw.remaining}
                          onChange={(e) => handleUpdateRewardProperty(rw.id, { remaining: Number(e.target.value) })}
                        />
                      </div>
                    </div>

                    <p className="text-[10px] text-slate-400 font-sans leading-relaxed">{rw.description}</p>
                  </div>
                ))}
              </div>

              {/* History Rewards log */}
              <div className="border-t border-slate-800/80 pt-5 space-y-3.5">
                <span className="text-[10px] text-[#dfb76c] font-black uppercase tracking-widest font-mono block">
                  ⌛ HISTORIS PENARIKAN HADIAH SOUVENIR TAMU:
                </span>
                <div className="relative overflow-x-auto border border-slate-850 rounded-2xl max-h-48 overflow-y-auto">
                  <table className="w-full text-left text-slate-300 text-xs">
                    <thead className="bg-slate-900 border-b border-slate-800 font-mono font-bold text-slate-400 uppercase">
                      <tr>
                        <th scope="col" className="px-4 py-2">Nama Tamu</th>
                        <th scope="col" className="px-4 py-2">Hadiah Souvenir Yang Didapat</th>
                        <th scope="col" className="px-4 py-2">Waktu Penarikan Drop</th>
                      </tr>
                    </thead>
                    <tbody>
                      {drawHistory.length > 0 ? (
                        drawHistory.map((h, i) => (
                          <tr key={h.id || i} className="border-b border-slate-850 hover:bg-slate-900/60 font-mono">
                            <td className="px-4 py-2 text-white font-sans font-bold">{h.guestName}</td>
                            <td className="px-4 py-2 font-black text-indigo-400">{h.rewardTitle}</td>
                            <td className="px-4 py-2 text-[10px] text-slate-500">{new Date(h.drawnAt).toLocaleString('id-ID')}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={3} className="px-4 py-6 text-center text-slate-500 font-mono">
                            Belum ada rekam data penarikan hadiah gacha souvenir.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB F: QR CHECKIN ADMISSIONS GATE SIMULATION */}
          {activeTab === 'checkin' && (
            <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-6">
              <div>
                <span className="text-[10px] bg-[#dfb76c]/10 text-[#dfb76c] px-2.5 py-0.5 rounded font-black font-mono border border-[#dfb76c]/20">PUBLIC INGRESS PROTOCOL</span>
                <h2 className="text-lg font-black text-white mt-1 flex items-center gap-2">
                  <QrCode className="w-5 h-5 text-emerald-400" />
                  <span>Check-In Gate Admissions Scanner</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">Input atau simulasikan pemindaian kode tiket digital (VIP bar code) di pintu resepsi untuk mencatat kehadiran serta jatah e-seating secara real-time.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                
                {/* Scanner SIM card */}
                <form onSubmit={handleCheckInSubmit} className="md:col-span-5 bg-slate-900/50 p-5 rounded-2xl border border-slate-850 space-y-4 text-xs">
                  <span className="text-[9px] text-[#dfb76c] font-bold uppercase tracking-widest font-mono">CODE ADMISSIONS SELECTOR</span>
                  
                  <div>
                    <label className="block text-slate-400 mb-1 font-bold">Masukkan Kode Tiket VIP (Simulasi Scanner)</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Contoh: VIP-2026-0913-001"
                      className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-white font-mono font-black text-sm tracking-widest focus:outline-none focus:border-emerald-500"
                      value={checkInCode}
                      onChange={(e) => setCheckInCode(e.target.value)}
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold uppercase tracking-widest rounded-xl shadow-lg transition cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <QrCode className="w-4 h-4" />
                    <span>PROSES CHECK-IN LIVE</span>
                  </button>

                  <div className="border-t border-slate-800/80 pt-3 text-[10px] text-slate-500 leading-relaxed space-y-1.5">
                    <span className="font-bold uppercase tracking-wider block">Quick Codes list:</span>
                    {tickets.slice(0, 3).map((t) => (
                      <button 
                        type="button"
                        key={t.id}
                        onClick={() => setCheckInCode(t.ticketNumber)}
                        className="block text-[#dfb76c] font-mono hover:underline font-bold text-left cursor-pointer"
                      >
                        🎟️ {t.guestName} : {t.ticketNumber} ({t.checkInStatus === 'sudah_hadir' ? 'Hadir' : 'Belum Hadir'})
                      </button>
                    ))}
                  </div>
                </form>

                {/* Displaying Live result card */}
                <div className="md:col-span-7 bg-slate-900/70 p-5 rounded-2xl border border-slate-850 min-h-[220px] flex flex-col justify-center text-center">
                  {checkInResult ? (
                    <div className="space-y-4 animate-[fadeIn_0.3s_ease-out]">
                      <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center ${checkInResult.success ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'}`}>
                        {checkInResult.success ? <Check className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
                      </div>

                      <div className="space-y-1.5">
                        <h4 className="text-sm font-black text-white uppercase tracking-wider">{checkInResult.message}</h4>
                        {checkInResult.ticket && (
                          <div className="text-xs text-slate-400 leading-relaxed font-mono space-y-1 mt-2 p-3 bg-slate-950/60 rounded-xl border border-slate-800 inline-block text-left">
                            <div className="text-slate-350"><span className="text-slate-500">Nama Tamu  :</span> <b className="text-white font-sans font-bold">{checkInResult.ticket.guestName}</b></div>
                            <div className="text-[#dfb76c]"><span className="text-slate-500">Sesi Resepsi:</span> <b>{checkInResult.ticket.session}</b></div>
                            <div className="text-indigo-400"><span className="text-slate-500">Nomor Kursi :</span> <b>{checkInResult.ticket.seatNumber}</b></div>
                            <div className="text-slate-400"><span className="text-slate-500">Total Tamu  :</span> <b>{checkInResult.ticket.guestsCount} Pax</b></div>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-slate-500 space-y-2">
                      <QrCode className="w-8 h-8 text-slate-700 mx-auto animate-pulse" />
                      <p className="font-mono text-[10px] uppercase font-bold tracking-widest leading-none">AWAITING QR CODE SCAN TRIGGER</p>
                      <p className="text-[10px] text-slate-600 font-sans max-w-sm mx-auto">Input salah satu kode Quick Codes di sebelah kiri untuk menguji jalannya validasi barcode gate sekolah.</p>
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
