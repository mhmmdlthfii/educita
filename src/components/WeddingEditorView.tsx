import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Save, Sparkles, Image as ImageIcon, Shield, 
  Smartphone, Eye, Settings, FileCode, CheckCircle, Database, 
  Trash2, Edit2, Heart, Gift, MapPin, Calendar, HelpCircle, 
  User, Check, ChevronDown, ChevronUp, Music, Info, Award, RefreshCw, Undo, EyeOff, Upload
} from 'lucide-react';
import { weddingDb, WeddingSectionType, WeddingSettingsType, SouvenirRewardType } from '../lib/weddingDb';
import WeddingView from './WeddingView';

// Preset Unsplash images for easy visual picking
const IMAGE_PRESETS = {
  cover: [
    { url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1205', label: 'Golden Boho Floral' },
    { url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=1205', label: 'Ebenezer Forest Walk' },
    { url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=1205', label: 'Classic Luxury Hall' },
    { url: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=1205', label: 'Warm Sunrays Wedding' }
  ],
  bride: [
    { url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=350', label: 'Elegant Studio Bridal' },
    { url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=350', label: 'Soft Natural Lighting' },
    { url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=350', label: 'Bright Modern Portrait' }
  ],
  groom: [
    { url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=350', label: 'Classic Tuxedo Suit' },
    { url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=350', label: 'Warm Casual Elegance' },
    { url: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=350', label: 'Professional Groom Close' }
  ],
  gallery: [
    { url: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&q=80&w=600', label: 'Romantic Vintage Street' },
    { url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&q=80&w=600', label: 'Acoustic Lakeside Breath' },
    { url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&q=80&w=600', label: 'Candlelight Cozy Dinner' },
    { url: 'https://images.unsplash.com/photo-1482484310214-ebbfae13cc0f?auto=format&fit=crop&q=80&w=600', label: 'Soft Forest Silhouette' }
  ],
  music: [
    { url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', label: 'SoundHelix Acoustic Symphony 1' },
    { url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', label: 'Smooth Classical Piano Ballad' },
    { url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3', label: 'Light Cinematic Ambient Violin' }
  ]
};

export default function WeddingEditorView() {
  const slug = 'hanum-luthfi';
  
  // Data State
  const [sections, setSections] = useState<WeddingSectionType[]>([]);
  const [settings, setSettings] = useState<WeddingSettingsType | null>(null);
  const [rewards, setRewards] = useState<SouvenirRewardType[]>([]);
  
  // UI States
  const [activeSectionAccordion, setActiveSectionAccordion] = useState<string>('general');
  const [flash, setFlash] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);
  const [previewKey, setPreviewKey] = useState<number>(0);
  const [guestPreviewName, setGuestPreviewName] = useState<string>('Sahabat Baik Terhormat');
  const [isBackupExpanded, setIsBackupExpanded] = useState<boolean>(false);
  const [jsonImportString, setJsonImportString] = useState<string>('');
  const [isFullscreenPreview, setIsFullscreenPreview] = useState<boolean>(false);

  // Load configuration
  useEffect(() => {
    loadAllWeddingData();
  }, []);

  const loadAllWeddingData = () => {
    setSections(weddingDb.getSections(slug).sort((a, b) => a.order - b.order));
    setSettings(weddingDb.getSettings(slug));
    setRewards(weddingDb.getRewards(slug));
  };

  const showFlash = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setFlash({ text, type });
    setTimeout(() => setFlash(null), 4000);
  };

  // Quick state update helper functions
  const updateGeneralSetting = (key: keyof WeddingSettingsType, value: any) => {
    if (!settings) return;
    const nextSettings = { ...settings, [key]: value };
    setSettings(nextSettings);
  };

  // Wallet Editor Form State
  const [newBankName, setNewBankName] = useState<'BCA' | 'BRI' | 'Mandiri' | 'Bank Jateng' | 'Bank Jago' | 'SeaBank' | 'Krom Bank' | 'Gopay' | 'Shopeepay'>('BCA');
  const [newAccountNumber, setNewAccountNumber] = useState('');
  const [newAccountHolder, setNewAccountHolder] = useState('');

  const handleAddWallet = () => {
    if (!settings) return;
    if (!newAccountNumber || !newAccountHolder) {
      alert('Semua bidang rekening (nomor & penerima) wajib diisi.');
      return;
    }
    const currentWallets = settings.wallets || [];
    const newWallet = {
      id: `w-${Date.now()}`,
      bankName: newBankName,
      accountNumber: newAccountNumber.trim(),
      accountHolder: newAccountHolder.trim()
    };
    const nextSettings = {
      ...settings,
      wallets: [...currentWallets, newWallet]
    };
    setSettings(nextSettings);
    setNewAccountNumber('');
    setNewAccountHolder('');
    showFlash('Rekening / Wallet berhasil ditambahkan kedalam daftar!', 'info');
  };

  const handleRemoveWallet = (id: string) => {
    if (!settings) return;
    const currentWallets = settings.wallets || [];
    const nextSettings = {
      ...settings,
      wallets: currentWallets.filter(w => w.id !== id)
    };
    setSettings(nextSettings);
    showFlash('Rekening / Wallet berhasil dihapus dari daftar.', 'info');
  };

  const updateSectionField = (id: string, key: keyof WeddingSectionType, value: any) => {
    const nextSections = sections.map(sec => sec.id === id ? { ...sec, [key]: value } as WeddingSectionType : sec);
    setSections(nextSections);
  };

  const updateRewardField = (id: string, key: keyof SouvenirRewardType, value: any) => {
    const nextRewards = rewards.map(rew => rew.id === id ? { ...rew, [key]: value } as SouvenirRewardType : rew);
    setRewards(nextRewards);
  };

  // Perform full visual database sync
  const handleSaveAll = () => {
    if (!settings) return;
    try {
      // Validate total probability of souvenir rewards turns to be safe
      const totalProb = rewards.reduce((acc, r) => acc + (Number(r.probability) || 0), 0);
      if (Math.abs(totalProb - 100) > 0.01) {
        if (!window.confirm(`Peringatan: Total probabilitas hadiah souvenir ${totalProb}% sedangkan sistem menyarankan 100%. Lanjutkan menyimpan?`)) {
          return;
        }
      }

      weddingDb.saveSections(sections, slug);
      weddingDb.saveSettings(settings, slug);
      weddingDb.saveRewards(rewards, slug);

      // Force refresh of preview component
      setPreviewKey(prev => prev + 1);
      showFlash('🎉 Semua perubahan data undangan berhasil disimpan & diselaraskan ke Live Preview!', 'success');
    } catch (err) {
      console.error(err);
      showFlash('Gagal menyimpan data undangan', 'error');
    }
  };

  // Restore everything back to default seeds
  const handleRestoreDefaults = () => {
    if (window.confirm('Apakah Anda yakin ingin mengembalikan seluruh data undangan Hanum & Luthfi ke bawaan pabrik (Default)? Semua modifikasi Anda akan terhapus.')) {
      localStorage.removeItem(`wedding_sections_${slug}`);
      localStorage.removeItem(`wedding_settings_${slug}`);
      localStorage.removeItem(`wedding_rewards_${slug}`);
      loadAllWeddingData();
      setPreviewKey(prev => prev + 1);
      showFlash('Undangan berhasil di-reset ke data instan awal.', 'info');
    }
  };

  // JSON Import & Export functions
  const handleExportBackup = () => {
    const backupObj = {
      sections,
      settings,
      rewards,
      exportedAt: new Date().toISOString(),
      app: 'educita.id/wedding'
    };
    const str = JSON.stringify(backupObj, null, 2);
    navigator.clipboard.writeText(str);
    showFlash('📋 JSON Backup disalin ke clipboard! Simpan di notepad Anda.', 'success');
  };

  const handleImportBackup = () => {
    try {
      if (!jsonImportString.trim()) {
        showFlash('Silakan paste string JSON cadangan terlebih dahulu.', 'error');
        return;
      }
      const parsed = JSON.parse(jsonImportString);
      if (parsed.sections && parsed.settings && parsed.rewards) {
        setSections(parsed.sections);
        setSettings(parsed.settings);
        setRewards(parsed.rewards);
        
        // Save to browser instantly
        weddingDb.saveSections(parsed.sections, slug);
        weddingDb.saveSettings(parsed.settings, slug);
        weddingDb.saveRewards(parsed.rewards, slug);
        
        setPreviewKey(prev => prev + 1);
        setJsonImportString('');
        setIsBackupExpanded(false);
        showFlash('⚡ Berhasil me-restore backup JSON Anda!', 'success');
      } else {
        showFlash('Format JSON tidak sesuai standar replika Educita.', 'error');
      }
    } catch (err) {
      showFlash('Gagal mem-parse JSON. Cek kembali format tanda kurung.', 'error');
    }
  };

  // Web image library state
  const [uploadedImages, setUploadedImages] = useState<{ name: string; url: string }[]>([]);
  const [isImagesLoading, setIsImagesLoading] = useState<boolean>(false);
  const [imageSelectorOpen, setImageSelectorOpen] = useState<boolean>(false);
  const [imageSelectorTarget, setImageSelectorTarget] = useState<{
    id?: string;
    field: string;
    type: 'section' | 'settings' | 'reward';
  } | null>(null);

  useEffect(() => {
    fetchUploadedImages();
  }, [settings]);

  const fetchUploadedImages = async () => {
    try {
      const res = await fetch('/api/images');
      if (res.ok) {
        const data = await res.json();
        setUploadedImages(data.images || []);
      }
    } catch (err) {
      console.error('Failed to load images:', err);
    }
  };

  const handleFileUploadAndSave = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    if (file.size > 15 * 1024 * 1024) {
      alert('Peringatan: File gambar terlalu besar (Maksimal 15MB). Silakan gunakan file yang lebih kecil.');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64Data = event.target?.result as string;
      if (!base64Data) return;

      setIsImagesLoading(true);
      try {
        const res = await fetch('/api/images/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: file.name, data: base64Data })
        });
        
        if (res.ok) {
          const data = await res.json();
          showFlash(`🎉 Gambar "${file.name}" Berhasil Diunggah!`, 'success');
          await fetchUploadedImages();
          
          if (imageSelectorTarget) {
            handleSelectImageFromLibrary(data.url);
          }
        } else {
          const errData = await res.json();
          alert('Gagal mengunggah gambar: ' + (errData.error || 'Server error'));
        }
      } catch (err: any) {
        console.error('Upload failed:', err);
        alert('Gagal menyambung ke server unggah: ' + err.message);
      } finally {
        setIsImagesLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteImage = async (name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Hapus gambar ini dari penyimpanan website? Tindakan ini permanen.')) return;

    try {
      const res = await fetch(`/api/images/${name}`, { method: 'DELETE' });
      if (res.ok) {
        showFlash('Gambar berhasil dihapus dari server.', 'info');
        fetchUploadedImages();
      } else {
        alert('Gagal menghapus gambar.');
      }
    } catch (err) {
      console.error('Delete photo error:', err);
    }
  };

  const handleSelectImageFromLibrary = (url: string) => {
    if (!imageSelectorTarget) return;

    const { id, field, type } = imageSelectorTarget;
    if (type === 'section' && id) {
      updateSectionField(id, field as keyof WeddingSectionType, url);
    } else if (type === 'settings') {
      updateGeneralSetting(field as keyof WeddingSettingsType, url);
    } else if (type === 'reward' && id) {
      updateRewardField(id, field as keyof SouvenirRewardType, url);
    }
    setImageSelectorOpen(false);
    setImageSelectorTarget(null);
    showFlash('Gambar berhasil dipilih dari penyimpanan otomatis!', 'success');
  };

  const openImagePicker = (target: { id?: string; field: string; type: 'section' | 'settings' | 'reward' }) => {
    setImageSelectorTarget(target);
    setImageSelectorOpen(true);
  };

  if (!settings) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-mono text-stone-400">Loading editor workspace data...</p>
        </div>
      </div>
    );
  }

  // Find sections for quick access reference in HTML
  const sectionCover = sections.find(s => s.type === 'cover');
  const sectionMovie = sections.find(s => s.type === 'movie_poster');
  const sectionBride = sections.find(s => s.type === 'bride');
  const sectionGroom = sections.find(s => s.type === 'groom');
  const sectionStory = sections.find(s => s.type === 'story');
  const sectionTimeline = sections.find(s => s.type === 'timeline');

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans select-none pb-20">
      
      {/* Visual background atmospheric lights */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-red-950/20 rounded-full blur-[160px] pointer-events-none"></div>
      <div className="fixed bottom-10 right-1/4 w-96 h-96 bg-amber-950/15 rounded-full blur-[160px] pointer-events-none"></div>

      {/* Editor top hero Header */}
      <div className="bg-neutral-900 border-b border-neutral-800 px-6 py-5 sticky top-0 z-20 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => window.location.hash = '#/wedding/hanum-luthfi'}
              className="p-2 hover:bg-neutral-800 text-stone-400 hover:text-white rounded-full transition cursor-pointer"
              title="Kembali ke Undangan"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] bg-red-950 text-red-400 border border-red-900/40 px-2 py-0.5 rounded font-black tracking-widest uppercase font-mono">EDUCITA PLATINUM BUILDER</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[9px] text-stone-400 font-mono font-bold uppercase">LIVE SYNC</span>
              </div>
              <h1 className="text-xl font-bold font-serif text-white mt-0.5">Interactive Invitation Editor & Builder</h1>
              <p className="text-[11px] text-stone-400">Kelola informasi mempelai, foto, lagu latar, gacha souvenir berdua Hanum & Luthfi</p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button 
              onClick={handleRestoreDefaults}
              className="px-4 py-2 bg-neutral-950 hover:bg-neutral-800 border border-neutral-700 text-stone-300 font-bold text-xs rounded-full cursor-pointer flex items-center gap-1.5 transition"
              title="Reset ke setting mula"
            >
              <Undo className="w-3.5 h-3.5" />
              <span>Reset Data</span>
            </button>

            <button 
              onClick={handleSaveAll}
              className="px-6 py-2 bg-gradient-to-r from-red-800 to-amber-700 hover:from-red-700 hover:to-amber-600 text-white font-extrabold text-xs rounded-full shadow-lg shadow-red-900/30 cursor-pointer flex items-center gap-2 transition transform hover:scale-[1.02]"
            >
              <Save className="w-4 h-4 text-[#dfb76c]" />
              <span>Update Live Data</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary Workspace Dual Pane */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ========================================================
            PANEL LEFT: ACCORDION BASED FORM WORKSPACE (7 COLS)
            ======================================================== */}
        <div id="editor-workspace-forms" className="lg:col-span-7 space-y-6">
          
          {/* Flash Alert notification element */}
          {flash && (
            <div className={`p-4 rounded-2xl border text-xs flex items-center gap-3 animate-bounce shadow-xl ${
              flash.type === 'success' 
                ? 'bg-emerald-950/90 border-emerald-800 text-emerald-300' 
                : flash.type === 'info'
                ? 'bg-neutral-900/90 border-neutral-800 text-amber-400' 
                : 'bg-red-950/90 border-red-900 text-red-300'
            }`}>
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <div className="font-medium font-mono">{flash.text}</div>
            </div>
          )}

          {/* WORKSPACE ACCORDION SECTION 1: GENERAL WEDDING OPTIONS */}
          <div className="bg-neutral-900/90 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl">
            <button 
              onClick={() => setActiveSectionAccordion(activeSectionAccordion === 'general' ? '' : 'general')}
              className="w-full px-6 py-4 flex items-center justify-between bg-neutral-950/50 hover:bg-neutral-950 transition-all text-left border-b border-neutral-800"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500">
                  <Settings className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-wider font-mono">1. Informasi Umum Undangan</h3>
                  <p className="text-[10px] text-stone-400 mt-0.5">Judul, format tanggal akad, dan lagu sound-track background</p>
                </div>
              </div>
              {activeSectionAccordion === 'general' ? <ChevronUp className="w-4 h-4 text-stone-500" /> : <ChevronDown className="w-4 h-4 text-stone-500" />}
            </button>

            {activeSectionAccordion === 'general' && (
              <div className="p-6 space-y-4 text-xs">
                <div>
                  <label className="block text-[10px] uppercase font-mono font-bold text-stone-400 tracking-wider mb-1">Judul Utama Undangan</label>
                  <input 
                    type="text"
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-red-900 text-white font-bold p-3 rounded-xl focus:outline-none transition"
                    value={settings.coupleDisplayTitle}
                    onChange={(e) => updateGeneralSetting('coupleDisplayTitle', e.target.value)}
                    placeholder="Mempelai Title (cth: Luthfi & Hanum)"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase font-mono font-bold text-stone-400 tracking-wider mb-1">Tanggal Akad & Resepsi</label>
                    <div className="relative">
                      <Calendar className="absolute left-3.5 top-3.5 w-4 h-4 text-stone-500" />
                      <input 
                        type="date"
                        className="w-full bg-neutral-950 border border-neutral-800 text-white font-bold pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:border-red-900 cursor-pointer"
                        value={settings.eventDate}
                        onChange={(e) => updateGeneralSetting('eventDate', e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-mono font-bold text-stone-400 tracking-wider mb-1">Kapasitas Kursi (RSVP Limit)</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-3.5 w-4 h-4 text-stone-500" />
                      <input 
                        type="number"
                        className="w-full bg-neutral-950 border border-neutral-800 text-white font-bold pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:border-red-900"
                        value={settings.seatCount}
                        onChange={(e) => updateGeneralSetting('seatCount', Number(e.target.value))}
                        min={10}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-mono font-bold text-stone-400 tracking-wider mb-1">Pilih Presets Soundtrack / Paste URL Musik</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
                    {IMAGE_PRESETS.music.map((mus, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => updateGeneralSetting('backgroundMusicUrl', mus.url)}
                        className={`p-2.5 rounded-lg border text-left flex items-center gap-2 cursor-pointer transition ${
                          settings.backgroundMusicUrl === mus.url 
                            ? 'bg-red-950/20 border-red-500/50 text-red-400 font-bold' 
                            : 'bg-neutral-950 border-neutral-850 hover:bg-neutral-900 text-stone-400'
                        }`}
                      >
                        <Music className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate max-w-[170px] text-[10.5px]">{mus.label}</span>
                      </button>
                    ))}
                  </div>

                  <input 
                    type="text"
                    className="w-full bg-neutral-950 border border-neutral-800 text-stone-300 font-mono p-3 rounded-xl focus:outline-none focus:border-red-900 font-medium text-[11px]"
                    value={settings.backgroundMusicUrl}
                    onChange={(e) => updateGeneralSetting('backgroundMusicUrl', e.target.value)}
                    placeholder="Atau masukkan Link YouTube / URL MP3 background music"
                  />
                  <span className="block text-[9px] text-stone-500 mt-1 uppercase font-mono">✓ Mendukung link video YouTube atau link langsung file audio .mp3</span>
                </div>

                <div className="flex items-center justify-between p-3.5 bg-neutral-950 rounded-xl border border-neutral-850">
                  <div>
                    <span className="font-extrabold text-[#dfb76c] block">Auto-Play Audio Berkah</span>
                    <span className="text-[10px] text-stone-400 block mt-0.5">Putar musik otomatis begitu amplop undangan dibuka</span>
                  </div>
                  <button 
                    onClick={() => updateGeneralSetting('hasMusicAutoPlay', !settings.hasMusicAutoPlay)}
                    className={`w-12 h-6.5 rounded-full transition-all relative ${
                      settings.hasMusicAutoPlay ? 'bg-red-800' : 'bg-neutral-800'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full absolute top-0.75 transition-all ${
                      settings.hasMusicAutoPlay ? 'right-1' : 'left-1'
                    }`}></div>
                  </button>
                </div>

                {/* Shipping / Gift Address Editor */}
                <div className="pt-4 border-t border-neutral-800">
                  <label className="block text-[10px] uppercase font-mono font-bold text-stone-400 tracking-wider mb-1">
                    Alamat Pengiriman Kado Fisik (Alamat Rumah)
                  </label>
                  <textarea
                    rows={2}
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-red-900 text-stone-300 p-3 rounded-xl focus:outline-none transition text-xs font-sans"
                    value={settings.giftAddress || ''}
                    onChange={(e) => updateGeneralSetting('giftAddress', e.target.value)}
                    placeholder="Masukkan alamat lengkap rumah untuk pengiriman kado fisik..."
                  />
                  <span className="block text-[9px] text-stone-500 mt-1 uppercase font-mono">
                    ✓ Alamat ini akan muncul di bawah kartu tanda kasih halaman depan
                  </span>
                </div>

                {/* Wallets & Accounts Management Editor */}
                <div className="pt-4 border-t border-neutral-800 space-y-4">
                  <div>
                    <span className="font-extrabold text-[#dfb76c] block text-xs">Manajemen Rekening & E-Wallet</span>
                    <span className="text-[10px] text-stone-400 block mt-0.5">
                      Kelola daftar rekening bank atau akun e-wallet Anda. 2 Rekening teratas akan langsung ditampilkan di halaman depan, sisanya dapat dibuka tamu via popup modal.
                    </span>
                  </div>

                  {/* Add New Wallet Form */}
                  <div className="p-4 bg-neutral-950 rounded-xl border border-neutral-850 space-y-3">
                    <span className="block text-[9.5px] font-black uppercase text-[#dfb76c] tracking-widest font-mono">
                      + Tambah Bank / Wallet Baru
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[8.5px] uppercase font-mono text-stone-400 font-bold mb-0.5">PILIH BANK/APP</label>
                        <select
                          className="w-full bg-neutral-900 border border-neutral-800 text-stone-250 p-2.5 rounded-lg text-xs font-black cursor-pointer"
                          value={newBankName}
                          onChange={(e) => setNewBankName(e.target.value as any)}
                        >
                          <option value="BCA">BCA</option>
                          <option value="BRI">BRI</option>
                          <option value="Mandiri">Mandiri</option>
                          <option value="Bank Jateng">Bank Jateng</option>
                          <option value="Bank Jago">Bank Jago</option>
                          <option value="SeaBank">SeaBank</option>
                          <option value="Krom Bank">Krom Bank</option>
                          <option value="Gopay">Gopay</option>
                          <option value="Shopeepay">Shopeepay</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[8.5px] uppercase font-mono text-stone-400 font-bold mb-0.5">NOMOR REKENING</label>
                        <input
                          type="text"
                          className="w-full bg-neutral-900 border border-neutral-800 text-white p-2.5 text-xs rounded-lg font-mono font-medium"
                          placeholder="Nomor rekening / HP..."
                          value={newAccountNumber}
                          onChange={(e) => setNewAccountNumber(e.target.value)}
                        />
                      </div>

                      <div>
                        <label className="block text-[8.5px] uppercase font-mono text-stone-400 font-bold mb-0.5">NAMA PEMILIK</label>
                        <input
                          type="text"
                          className="w-full bg-neutral-900 border border-neutral-800 text-white p-2.5 text-xs rounded-lg font-sans"
                          placeholder="Atas nama..."
                          value={newAccountHolder}
                          onChange={(e) => setNewAccountHolder(e.target.value)}
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddWallet}
                      className="w-full py-2 bg-red-950 text-[#dfb76c] border border-red-900/30 font-bold text-[10.5px] uppercase tracking-wider rounded-lg cursor-pointer hover:bg-red-900 hover:text-white transition-all text-center"
                    >
                      Daftarkan Rekening / Wallet
                    </button>
                  </div>

                  {/* Existing Wallets List */}
                  <div className="space-y-2">
                    <label className="block text-[10px] uppercase font-mono font-bold text-[#dfb76c] tracking-wider mb-1">
                      Daftar Rekening Terdaftar ({settings.wallets?.length || 0})
                    </label>

                    {(settings.wallets || []).length === 0 ? (
                      <p className="text-[10px] text-stone-500 italic p-3 text-center bg-neutral-950 rounded-xl border border-neutral-850">
                        Belum ada rekening terdaftar. Silakan tambahkan satu di atas.
                      </p>
                    ) : (
                      <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                        {(settings.wallets || []).map((w, index) => (
                          <div
                            key={w.id}
                            className="flex justify-between items-center p-3 bg-neutral-950 border border-neutral-850 rounded-xl group/card"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <span className="text-[9px] font-black text-stone-500 font-mono w-4">
                                #{index + 1}
                              </span>
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-sm bg-neutral-900 text-red-400 border border-neutral-800">
                                    {w.bankName}
                                  </span>
                                  <span className="text-[11px] font-mono text-white font-medium truncate">
                                    {w.accountNumber}
                                  </span>
                                </div>
                                <p className="text-[10px] text-stone-400 font-sans truncate mt-0.5 font-bold uppercase">
                                  a.n. {w.accountHolder}
                                </p>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleRemoveWallet(w.id)}
                              className="p-1.5 bg-neutral-900 hover:bg-red-950/40 text-stone-500 hover:text-red-400 rounded-lg border border-neutral-850 hover:border-red-900/30 cursor-pointer transition text-center shrink-0"
                              title="Hapus Rekening"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* WORKSPACE ACCORDION SECTION 2: THE BRIDE & GROOM PROFILES */}
          <div className="bg-neutral-900/90 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl">
            <button 
              onClick={() => setActiveSectionAccordion(activeSectionAccordion === 'couple' ? '' : 'couple')}
              className="w-full px-6 py-4 flex items-center justify-between bg-neutral-950/50 hover:bg-neutral-950 transition-all text-left border-b border-neutral-800"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-500">
                  <Heart className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-wider font-mono">2. Profil Mempelai (Hanum & Luthfi)</h3>
                  <p className="text-[10px] text-stone-400 mt-0.5">Nama lengkap, gelar, silsilah orangtua dan avatar foto</p>
                </div>
              </div>
              {activeSectionAccordion === 'couple' ? <ChevronUp className="w-4 h-4 text-stone-500" /> : <ChevronDown className="w-4 h-4 text-stone-500" />}
            </button>

            {activeSectionAccordion === 'couple' && (
              <div className="p-6 space-y-6 text-xs border-b border-neutral-800">
                {/* Mempelai Wanita Profile details */}
                {sectionBride && (
                  <div className="space-y-4 pb-6 border-b border-neutral-850">
                    <span className="text-[10px] font-black text-red-400 block font-mono uppercase tracking-widest">👰 MEMPELAI WANITA (BRIDE)</span>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[9px] uppercase font-mono font-bold text-stone-400 mb-1">Nama Lengkap & Gelar</label>
                        <input 
                          type="text"
                          className="w-full bg-neutral-950 border border-neutral-800 text-white font-bold p-3 rounded-xl focus:outline-none focus:border-red-900"
                          value={sectionBride.title}
                          onChange={(e) => updateSectionField(sectionBride.id, 'title', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] uppercase font-mono font-bold text-stone-400 mb-1">Nama Panggilan Sapaan</label>
                        <input 
                          type="text"
                          className="w-full bg-neutral-950 border border-neutral-800 text-white font-bold p-3 rounded-xl focus:outline-none focus:border-red-900"
                          value={sectionBride.subtitle || ''}
                          onChange={(e) => updateSectionField(sectionBride.id, 'subtitle', e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[9px] uppercase font-mono font-bold text-stone-400 mb-1">Keterangan Nasab / Putra Orangtua</label>
                      <input 
                        type="text"
                        className="w-full bg-neutral-950 border border-neutral-800 text-white p-3 rounded-xl focus:outline-none focus:border-red-900 font-semibold"
                        value={sectionBride.description || ''}
                        onChange={(e) => updateSectionField(sectionBride.id, 'description', e.target.value)}
                        placeholder="Putri Pertama dari Bapak..."
                      />
                    </div>

                    {/* Image selector widget */}
                    <div>
                      <label className="block text-[9px] uppercase font-mono font-bold text-stone-400 mb-1">Foto Mempelai Wanita (Presets Unsplash / Paste URL)</label>
                      <div className="grid grid-cols-3 gap-2 mb-2">
                        {IMAGE_PRESETS.bride.map((br, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => updateSectionField(sectionBride.id, 'mediaUrl', br.url)}
                            className="relative aspect-square rounded-lg overflow-hidden border border-neutral-850 group hover:border-[#dfb76c] cursor-pointer transition"
                          >
                            <img src={br.url} alt="bride" className="w-full h-full object-cover" />
                            {sectionBride.mediaUrl === br.url && (
                              <div className="absolute inset-0 bg-red-950/70 flex items-center justify-center">
                                <Check className="w-5 h-5 text-[#dfb76c]" />
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <input 
                          type="text"
                          className="flex-1 bg-neutral-950 border border-neutral-800 text-stone-300 font-mono p-3 rounded-xl focus:outline-none focus:border-red-900 text-[11px]"
                          value={sectionBride.mediaUrl || ''}
                          onChange={(e) => updateSectionField(sectionBride.id, 'mediaUrl', e.target.value)}
                          placeholder="Or masukkan URL gambar eksternal di sini"
                        />
                        <button
                          type="button"
                          onClick={() => openImagePicker({ id: sectionBride.id, field: 'mediaUrl', type: 'section' })}
                          className="px-4 bg-neutral-900 hover:bg-neutral-850 hover:text-[#dfb76c] text-stone-300 rounded-xl text-[10px] font-bold uppercase transition flex items-center gap-1.5 shrink-0 border border-neutral-800 cursor-pointer"
                        >
                          <ImageIcon className="w-3.5 h-3.5 text-[#dfb76c]" />
                          <span>Pilih Media</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Mempelai Pria Profile details */}
                {sectionGroom && (
                  <div className="space-y-4">
                    <span className="text-[10px] font-black text-red-400 block font-mono uppercase tracking-widest">🤵 MEMPELAI PRIA (GROOM)</span>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[9px] uppercase font-mono font-bold text-stone-400 mb-1">Nama Lengkap & Gelar</label>
                        <input 
                          type="text"
                          className="w-full bg-neutral-950 border border-neutral-800 text-white font-bold p-3 rounded-xl focus:outline-none focus:border-red-900"
                          value={sectionGroom.title}
                          onChange={(e) => updateSectionField(sectionGroom.id, 'title', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] uppercase font-mono font-bold text-stone-400 mb-1">Nama Panggilan Sapaan</label>
                        <input 
                          type="text"
                          className="w-full bg-neutral-950 border border-neutral-800 text-white font-bold p-3 rounded-xl focus:outline-none focus:border-red-900"
                          value={sectionGroom.subtitle || ''}
                          onChange={(e) => updateSectionField(sectionGroom.id, 'subtitle', e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[9px] uppercase font-mono font-bold text-stone-400 mb-1">Keterangan Nasab / Putra Orangtua</label>
                      <input 
                        type="text"
                        className="w-full bg-neutral-950 border border-neutral-800 text-white p-3 rounded-xl focus:outline-none focus:border-red-900 font-semibold"
                        value={sectionGroom.description || ''}
                        onChange={(e) => updateSectionField(sectionGroom.id, 'description', e.target.value)}
                        placeholder="Putra Kedua dari Bapak..."
                      />
                    </div>

                    <div>
                      <label className="block text-[9px] uppercase font-mono font-bold text-stone-400 mb-1">Foto Mempelai Pria (Presets Unsplash / Paste URL)</label>
                      <div className="grid grid-cols-3 gap-2 mb-2">
                        {IMAGE_PRESETS.groom.map((gr, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => updateSectionField(sectionGroom.id, 'mediaUrl', gr.url)}
                            className="relative aspect-square rounded-lg overflow-hidden border border-neutral-850 group hover:border-[#dfb76c] cursor-pointer transition"
                          >
                            <img src={gr.url} alt="groom" className="w-full h-full object-cover" />
                            {sectionGroom.mediaUrl === gr.url && (
                              <div className="absolute inset-0 bg-red-950/70 flex items-center justify-center">
                                <Check className="w-5 h-5 text-[#dfb76c]" />
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <input 
                          type="text"
                          className="flex-1 bg-neutral-950 border border-neutral-800 text-stone-300 font-mono p-3 rounded-xl focus:outline-none focus:border-red-900 text-[11px]"
                          value={sectionGroom.mediaUrl || ''}
                          onChange={(e) => updateSectionField(sectionGroom.id, 'mediaUrl', e.target.value)}
                          placeholder="Or masukkan URL gambar eksternal di sini"
                        />
                        <button
                          type="button"
                          onClick={() => openImagePicker({ id: sectionGroom.id, field: 'mediaUrl', type: 'section' })}
                          className="px-4 bg-neutral-900 hover:bg-neutral-850 hover:text-[#dfb76c] text-stone-300 rounded-xl text-[10px] font-bold uppercase transition flex items-center gap-1.5 shrink-0 border border-neutral-800 cursor-pointer"
                        >
                          <ImageIcon className="w-3.5 h-3.5 text-[#dfb76c]" />
                          <span>Pilih Media</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* WORKSPACE ACCORDION SECTION 3: EDIT INVITATION SECTIONS TEXTS & TOGGLES */}
          <div className="bg-neutral-900/90 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl">
            <button 
              onClick={() => setActiveSectionAccordion(activeSectionAccordion === 'sections' ? '' : 'sections')}
              className="w-full px-6 py-4 flex items-center justify-between bg-neutral-950/50 hover:bg-neutral-950 transition-all text-left border-b border-neutral-800"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-500">
                  <Database className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-wider font-mono">3. Manajemen Modul & Bab Sinema</h3>
                  <p className="text-[10px] text-stone-400 mt-0.5">Toggle hidup/mati modul, edit judul bab dan paragraf deskripsi</p>
                </div>
              </div>
              {activeSectionAccordion === 'sections' ? <ChevronUp className="w-4 h-4 text-stone-500" /> : <ChevronDown className="w-4 h-4 text-stone-500" />}
            </button>

            {activeSectionAccordion === 'sections' && (
              <div className="p-6 space-y-6 text-xs">
                
                {/* Dynamic Mapping over sections inside editor */}
                {sections.map((sec) => (
                  <div key={sec.id} className="p-4 bg-neutral-950 rounded-2xl border border-neutral-850 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] bg-neutral-900 text-[#dfb76c] font-black px-2 py-0.5 rounded font-mono">
                          {sec.type.toUpperCase()}
                        </span>
                        <span className="font-bold text-white max-w-[150px] truncate">{sec.title}</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-bold font-mono text-stone-500">STATUS:</span>
                        <button 
                          onClick={() => updateSectionField(sec.id, 'isEnabled', !sec.isEnabled)}
                          className={`px-3 py-1.5 rounded-full font-black text-[9px] uppercase font-mono tracking-wider cursor-pointer ${
                            sec.isEnabled 
                              ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-900/40' 
                              : 'bg-stone-900/80 text-stone-500 border border-stone-850'
                          }`}
                        >
                          {sec.isEnabled ? '● AKTIF' : '⊝ NONAKTIF'}
                        </button>
                      </div>
                    </div>

                    {/* Sub fields edit area only if enabled */}
                    {sec.isEnabled && (
                      <div className="space-y-3 pt-2.5 border-t border-neutral-850/50">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[8px] uppercase font-mono text-stone-500 mb-1">Judul Bab Modul</label>
                            <input 
                              type="text"
                              className="w-full bg-neutral-900 border border-neutral-800 text-white font-bold p-2.5 rounded-lg text-[11px]"
                              value={sec.title}
                              onChange={(e) => updateSectionField(sec.id, 'title', e.target.value)}
                            />
                          </div>
                          {sec.subtitle !== undefined && (
                            <div>
                              <label className="block text-[8px] uppercase font-mono text-stone-500 mb-1">Sub Judul / Tagline</label>
                              <input 
                                type="text"
                                className="w-full bg-neutral-900 border border-neutral-800 text-white font-bold p-2.5 rounded-lg text-[11px]"
                                value={sec.subtitle}
                                onChange={(e) => updateSectionField(sec.id, 'subtitle', e.target.value)}
                              />
                            </div>
                          )}
                        </div>

                        {sec.description !== undefined && (
                          <div>
                            <label className="block text-[8px] uppercase font-mono text-stone-500 mb-1">Isi Paragraf Narasi / Kutipan</label>
                            <textarea 
                              rows={2}
                              className="w-full bg-neutral-900 border border-neutral-800 text-stone-300 p-2.5 rounded-lg text-[11.5px]"
                              value={sec.description}
                              onChange={(e) => updateSectionField(sec.id, 'description', e.target.value)}
                            />
                          </div>
                        )}

                        {sec.mediaUrl !== undefined && sec.type !== 'bride' && sec.type !== 'groom' && (
                          <div>
                            <label className="block text-[8px] uppercase font-mono text-stone-500 mb-1">URL Media Gambar (Cover / Poster / Galeri)</label>
                            
                            {/* Preset picker panel for generic images */}
                            <div className="grid grid-cols-4 gap-2 mb-2">
                              {IMAGE_PRESETS.gallery.map((g, idx) => (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={() => updateSectionField(sec.id, 'mediaUrl', g.url)}
                                  className="relative aspect-video rounded-md overflow-hidden bg-stone-900 border border-neutral-850 group hover:border-[#dfb76c] cursor-pointer transition"
                                >
                                  <img src={g.url} alt="g" className="w-full h-full object-cover" />
                                  {sec.mediaUrl === g.url && (
                                    <div className="absolute inset-0 bg-red-950/70 flex items-center justify-center">
                                      <Check className="w-3.5 h-3.5 text-[#dfb76c]" />
                                    </div>
                                  )}
                                </button>
                              ))}
                            </div>

                            <div className="flex gap-2">
                              <input 
                                type="text"
                                className="flex-1 bg-neutral-900 border border-neutral-800 text-stone-300 font-mono p-2.5 rounded-lg text-[10px]"
                                value={sec.mediaUrl}
                                onChange={(e) => updateSectionField(sec.id, 'mediaUrl', e.target.value)}
                              />
                              <button
                                type="button"
                                onClick={() => openImagePicker({ id: sec.id, field: 'mediaUrl', type: 'section' })}
                                className="px-3.5 bg-neutral-950 hover:bg-neutral-900 hover:text-[#dfb76c] text-stone-300 rounded-lg text-[10px] font-bold uppercase transition flex items-center gap-1.5 shrink-0 border border-neutral-800 cursor-pointer"
                              >
                                <ImageIcon className="w-3.5 h-3.5 text-[#dfb76c]" />
                                <span>Pilih Gambar</span>
                              </button>
                            </div>
                          </div>
                        )}

                        {sec.videoUrl !== undefined && (
                          <div>
                            <label className="block text-[8px] uppercase font-mono text-stone-500 mb-1">URL Video Trailer (MP4 direct link atau file audio-visual)</label>
                            <input 
                              type="text"
                              className="w-full bg-neutral-900 border border-neutral-800 text-[#dfb76c] font-mono p-2.5 rounded-lg text-[10.5px]"
                              value={sec.videoUrl}
                              onChange={(e) => updateSectionField(sec.id, 'videoUrl', e.target.value)}
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}

              </div>
            )}
          </div>

          {/* WORKSPACE ACCORDION SECTION 4: DIGITAL SOUVENIR GACHA REWARDS CUSTOMIZATION */}
          <div className="bg-neutral-900/90 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl">
            <button 
              onClick={() => setActiveSectionAccordion(activeSectionAccordion === 'souvenirs' ? '' : 'souvenirs')}
              className="w-full px-6 py-4 flex items-center justify-between bg-neutral-950/50 hover:bg-neutral-950 transition-all text-left border-b border-neutral-800"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-[#dfb76c]">
                  <Gift className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-wider font-mono">4. Konfigurasi Hadiah Souvenir Gacha</h3>
                  <p className="text-[10px] text-stone-400 mt-0.5">Ubah nama item kado, stok pcs, dan probabilitas menang (%)</p>
                </div>
              </div>
              {activeSectionAccordion === 'souvenirs' ? <ChevronUp className="w-4 h-4 text-stone-500" /> : <ChevronDown className="w-4 h-4 text-stone-500" />}
            </button>

            {activeSectionAccordion === 'souvenirs' && (
              <div className="p-6 space-y-6 text-xs">
                
                <div className="p-3 bg-neutral-950 border border-red-950/40 rounded-xl text-[11px] text-stone-400 flex items-start gap-2.5 font-sans leading-relaxed">
                  <Info className="w-4 h-4 text-[#dfb76c] shrink-0 mt-0.5" />
                  <div>
                    Sistem Souvenir Drawing diatur menggunakan **Probabilitas Sejati**. Total persentase kans menang wajib bernilai **100%**. Anda dapat memperbesar peluang menang untuk souvenir populer lantas memperkecil hadiah langka VIP.
                  </div>
                </div>

                {rewards.map((rew) => {
                  return (
                    <div key={rew.id} className="p-4 bg-neutral-950 rounded-2xl border border-neutral-850 space-y-3">
                      <div className="flex gap-4 items-center border-b border-neutral-900 pb-3">
                        <div className="w-12 h-12 rounded-lg bg-neutral-900 border border-neutral-800 overflow-hidden shrink-0">
                          <img src={rew.imageUrl} alt={rew.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-[7.5px] bg-red-950 text-red-400 border border-red-900/40 px-2 py-0.5 rounded font-black tracking-widest block w-fit font-mono mb-1">
                            PRIZE ELEMENT {rew.id.toUpperCase()}
                          </span>
                          <input 
                            type="text"
                            className="bg-transparent border-none focus:ring-0 p-0 text-white font-bold text-sm w-full focus:outline-none"
                            value={rew.title}
                            onChange={(e) => updateRewardField(rew.id, 'title', e.target.value)}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[8px] uppercase font-mono text-stone-500 mb-1">Deskripsi & Syarat Klaim Kado</label>
                        <input 
                          type="text"
                          className="w-full bg-neutral-900 border border-neutral-800 text-stone-300 p-2.5 rounded-lg text-[10.5px]"
                          value={rew.description}
                          onChange={(e) => updateRewardField(rew.id, 'description', e.target.value)}
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[8px] uppercase font-mono text-stone-500 mb-1">Kans Menang (%)</label>
                          <input 
                            type="number"
                            className="w-full bg-neutral-900 border border-neutral-800 text-white font-bold font-mono p-2.5 rounded-lg text-[11px]"
                            value={rew.probability}
                            onChange={(e) => updateRewardField(rew.id, 'probability', Number(e.target.value))}
                            min={0}
                            max={100}
                          />
                        </div>
                        <div>
                          <label className="block text-[8px] uppercase font-mono text-stone-500 mb-1">Stok Total (Pcs)</label>
                          <input 
                            type="number"
                            className="w-full bg-neutral-900 border border-neutral-800 text-white font-bold font-mono p-2.5 rounded-lg text-[11px]"
                            value={rew.quantity}
                            onChange={(e) => updateRewardField(rew.id, 'quantity', Number(e.target.value))}
                            min={0}
                          />
                        </div>
                        <div>
                          <label className="block text-[8px] uppercase font-mono text-stone-500 mb-1">Stok Sisa (Remaining)</label>
                          <input 
                            type="number"
                            className="w-full bg-neutral-900 border border-neutral-800 text-[#dfb76c] font-black font-mono p-2.5 rounded-lg text-[11px]"
                            value={rew.remaining}
                            onChange={(e) => updateRewardField(rew.id, 'remaining', Number(e.target.value))}
                            min={0}
                            max={rew.quantity}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}

              </div>
            )}
          </div>

          {/* WORKSPACE ACCORDION SECTION 5: INTERNAL WEB STORAGE DIRECT MANAGMENT */}
          <div className="bg-neutral-900/90 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl">
            <button 
              onClick={() => setActiveSectionAccordion(activeSectionAccordion === 'media' ? '' : 'media')}
              className="w-full px-6 py-4 flex items-center justify-between bg-neutral-950/50 hover:bg-neutral-950 transition-all text-left border-b border-neutral-800"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-wider font-mono">5. Penyimpanan Gambar Website (Drive Folder)</h3>
                  <p className="text-[10px] text-stone-400 mt-0.5 font-sans">Unggah foto prewedding, hapus file gambar, salin link aset instan Anda</p>
                </div>
              </div>
              {activeSectionAccordion === 'media' ? <ChevronUp className="w-4 h-4 text-stone-500" /> : <ChevronDown className="w-4 h-4 text-stone-500" />}
            </button>

            {activeSectionAccordion === 'media' && (
              <div className="p-6 space-y-6 text-xs">
                <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-2xl flex flex-col items-center justify-center text-center space-y-3 border-dashed relative group hover:border-[#dfb76c]/60 transition-all duration-300">
                  <input 
                    type="file"
                    accept="image/*"
                    onChange={handleFileUploadAndSave}
                    className="absolute inset-0 opacity-0 cursor-pointer z-10 w-full h-full"
                  />
                  <div className="w-10 h-10 rounded-full bg-neutral-900 flex items-center justify-center border border-neutral-800 text-stone-400 group-hover:scale-110 transition duration-300">
                    <Upload className="w-4.5 h-4.5 group-hover:text-[#dfb76c]" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">Unggah Gambar ke Drive Website</p>
                    <p className="text-[9.5px] text-stone-500 mt-0.5">Berkas tersimpan di server lokal dan siap dipakai kapan saja</p>
                  </div>
                </div>

                {isImagesLoading && (
                  <div className="py-6 text-center text-stone-500 font-mono text-[10px] flex justify-center items-center gap-2">
                    <RefreshCw className="w-4.5 h-4.5 animate-spin text-[#dfb76c]" />
                    <span>Sinkronisasi berkas penyimpanan...</span>
                  </div>
                )}

                {!isImagesLoading && (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center pb-2 border-b border-neutral-850">
                      <span className="text-[9px] uppercase tracking-wider font-mono font-bold text-stone-500">Berkas Tersimpan Anda ({uploadedImages.length} Gambar)</span>
                      <button 
                        type="button" 
                        onClick={fetchUploadedImages}
                        className="text-[9px] uppercase font-mono font-bold text-red-400 hover:text-white flex items-center gap-1 cursor-pointer"
                      >
                        <RefreshCw className="w-3 h-3" /> Segarkan
                      </button>
                    </div>

                    {uploadedImages.length === 0 ? (
                      <div className="p-8 text-center bg-neutral-950/40 rounded-xl border border-neutral-850/50 text-stone-500">
                        Belum ada gambar yang diupload ke server. Mulai dengan mengunggah gambar baru di atas!
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {uploadedImages.map((img, idx) => (
                          <div 
                            key={idx} 
                            className="group relative aspect-square bg-neutral-950 rounded-xl overflow-hidden border border-neutral-850 hover:border-[#dfb76c]/40 transition"
                          >
                            <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-neutral-950/90 opacity-0 group-hover:opacity-100 transition duration-200 flex flex-col justify-center items-center gap-1.5 p-1.5">
                              {/* Copy Link Action */}
                              <button
                                type="button"
                                onClick={() => {
                                  navigator.clipboard.writeText(img.url);
                                  showFlash('📋 Link gambar disalin ke clipboard!', 'success');
                                }}
                                className="w-full py-1 text-[8px] bg-neutral-900 border border-neutral-800 text-[#dfb76c] rounded font-mono font-bold hover:bg-neutral-800 transition text-center"
                              >
                                SALIN LINK
                              </button>

                              {/* Delete button */}
                              <button
                                type="button"
                                onClick={(e) => handleDeleteImage(img.name, e)}
                                className="w-full py-1 text-[8px] bg-[#821E1E]/20 border border-red-900/60 text-red-400 rounded font-mono font-bold hover:bg-[#821E1E]/80 hover:text-white transition text-center"
                              >
                                HAPUS
                              </button>
                            </div>

                            {/* Mini label indicator */}
                            <div className="absolute bottom-0 inset-x-0 bg-neutral-950/90 py-0.5 px-1 text-[6.5px] text-stone-500 truncate text-center">
                              {img.name.substring(img.name.indexOf('_') + 1)}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* BACKUP RESTORE SYSTEM TOOLBAR PANEL */}
          <div className="bg-neutral-900/90 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl">
            <button 
              onClick={() => setIsBackupExpanded(!isBackupExpanded)}
              className="w-full px-6 py-4 flex items-center justify-between bg-neutral-950/50 hover:bg-neutral-950 transition-all text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-center text-stone-400">
                  <FileCode className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-wider font-mono">6. Backup / Restore JSON Data</h3>
                  <p className="text-[10px] text-stone-400 mt-0.5">Ekspor konfigurasi atau masukkan backup data mentah</p>
                </div>
              </div>
              {isBackupExpanded ? <ChevronUp className="w-4 h-4 text-stone-500" /> : <ChevronDown className="w-4 h-4 text-stone-500" />}
            </button>

            {isBackupExpanded && (
              <div className="p-6 space-y-4 text-xs border-t border-neutral-800">
                <p className="text-stone-400 text-[11px] leading-relaxed">
                  Gunakan perkakas ini untuk memindahkan desain portal pernikahan digital ini ke akun teman, atau mencadangkan layout buatan Anda di komputer lokal.
                </p>

                <div className="flex gap-3">
                  <button 
                    onClick={handleExportBackup}
                    className="flex-1 py-3 bg-neutral-800 hover:bg-neutral-755 border border-neutral-700 text-white font-bold rounded-xl cursor-pointer transition text-center"
                  >
                    Salin Backup JSON Anda
                  </button>
                </div>

                <div className="space-y-2 pt-2">
                  <label className="block text-[8px] uppercase font-mono text-stone-500">Paste JSON String untuk Di-Restore</label>
                  <textarea 
                    rows={4}
                    className="w-full bg-neutral-950 border border-neutral-800 text-stone-300 font-mono p-3 rounded-xl text-[10px] focus:outline-none"
                    placeholder='{"sections": [...], "settings": {...}, "rewards": [...]}'
                    value={jsonImportString}
                    onChange={(e) => setJsonImportString(e.target.value)}
                  />
                  <button 
                    onClick={handleImportBackup}
                    className="w-full py-3 bg-red-900/40 hover:bg-red-800/60 border border-red-800/40 text-red-200 font-black rounded-xl cursor-pointer transition uppercase text-[10px] tracking-widest font-mono"
                  >
                    Restore Cadangan Sand-Box
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* ========================================================
            PANEL RIGHT: LIVE SMARTPHONE CONTAINER PREVIEW (5 COLS)
            ======================================================== */}
        <div id="live-smartphone-preview-panel" className="lg:col-span-5 space-y-4 sticky top-28">
          
          <div className="flex items-center justify-between bg-neutral-900 border border-neutral-800 p-4 rounded-3xl">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4.5 h-4.5 text-[#dfb76c]" />
              <span className="text-xs font-black text-white uppercase font-mono">Device Live Simulation</span>
            </div>
            
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[10px] font-bold font-mono text-neutral-400">WYSIWYG SCREEN</span>
            </div>
          </div>

          {/* Actual iPhone mock frame with notch and sound controller simulated */}
          <div className="relative mx-auto bg-black rounded-[48px] p-3.5 shadow-2xl border-4 border-neutral-800 max-w-[340px] items-center overflow-hidden">
            {/* Camera Speaker Notch */}
            <div className="absolute top-0.5 left-1/2 -translate-x-1/2 bg-black w-28 h-6 rounded-b-2xl z-45 flex items-center justify-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded-full bg-stone-900 border border-stone-800"></span>
              <span className="w-8 h-1 bg-stone-950 rounded-full"></span>
            </div>

            {/* Live interactive Frame Wrapper */}
            <div className="relative aspect-[9/19] w-full rounded-[38px] overflow-hidden bg-neutral-900 border border-neutral-900 flex flex-col">
              
              {/* Internal simulated web page scroll view */}
              <div className="flex-1 overflow-y-auto scrollbar-hide">
                <WeddingView 
                  key={previewKey} 
                  toGuest={guestPreviewName} 
                  slug="hanum-luthfi"
                />
              </div>

              {/* Home Indicator line */}
              <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-28 h-1 bg-stone-700/80 rounded-full z-45 pointer-events-none"></div>
            </div>
          </div>

          {/* Helper panel to modify guests inside simulator */}
          <div className="p-4 bg-neutral-900/80 border border-neutral-800 rounded-3xl space-y-3 max-w-[340px] mx-auto">
            <div>
              <label className="block text-[8.5px] uppercase font-mono font-black text-[#dfb76c] mb-1">Simulasi Tamu Penerima</label>
              <input 
                type="text"
                className="w-full bg-neutral-950 border border-neutral-850 text-white font-bold px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-red-950"
                value={guestPreviewName}
                onChange={(e) => setGuestPreviewName(e.target.value)}
                placeholder="Ganti nama tamu yang diundang..."
              />
            </div>

            <p className="text-[10px] text-stone-500 leading-normal font-sans italic">
              *Setelah mengedit, tekan tombol **"Update Live Data"** di bagian atas untuk menyinkronkan seluruh perubahan baru ke database undangan.
            </p>
          </div>

        </div>

      </div>

      {/* ────────────────────────────────────────────────────────
          UPLOADED IMAGE SELECTOR MODAL DIALOG
          ──────────────────────────────────────────────────────── */}
      {imageSelectorOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl animate-[fadeIn_0.2s_ease-out]">
            {/* Modal Header */}
            <div className="p-5 border-b border-neutral-800 flex justify-between items-center bg-neutral-950/70">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#dfb76c]/10 border border-[#dfb76c]/30 flex items-center justify-center text-[#dfb76c]">
                  <ImageIcon className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-wider font-mono">Penyimpanan & Pustaka Gambar Website</h3>
                  <p className="text-[10px] text-stone-400 mt-0.5">Pilih foto dari berkas drive unggahan Anda atau tambahkan berkas baru</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setImageSelectorOpen(false);
                  setImageSelectorTarget(null);
                }}
                className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-stone-400 hover:text-white transition cursor-pointer flex items-center justify-center text-xs font-bold"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* File Upload Slot Block */}
              <div className="p-6 bg-neutral-950 border border-neutral-800 rounded-2xl flex flex-col items-center justify-center text-center space-y-4 border-dashed relative group hover:border-[#dfb76c]/60 transition-all duration-300">
                <input 
                  type="file"
                  accept="image/*"
                  onChange={handleFileUploadAndSave}
                  className="absolute inset-0 opacity-0 cursor-pointer z-10 w-full h-full"
                />
                <div className="w-12 h-12 rounded-full bg-neutral-900 flex items-center justify-center border border-neutral-800 text-stone-400 group-hover:scale-110 transition duration-300">
                  <Upload className="w-5 h-5 group-hover:text-[#dfb76c]" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-white">Unggah Gambar Baru dari Komputer</p>
                  <p className="text-[10px] text-stone-500">Mendukung format PNG, JPG, JPEG, atau WEBP hingga 15MB</p>
                </div>
              </div>

              {/* Dynamic Loading check */}
              {isImagesLoading && (
                <div className="py-12 text-center text-stone-500 font-mono text-xs flex justify-center items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-[#dfb76c]" />
                  <span>Sedang memproses & menyinkronkan data berkas...</span>
                </div>
              )}

              {/* Grid of uploaded images */}
              {!isImagesLoading && (
                <div className="space-y-4">
                  <h4 className="text-[9px] uppercase font-mono text-stone-500 tracking-wider">Berkas Gambar Tersedia ({uploadedImages.length} Foto)</h4>
                  
                  {uploadedImages.length === 0 ? (
                    <div className="p-12 text-center bg-neutral-950/40 rounded-xl border border-neutral-850/80 text-stone-400 space-y-2">
                      <ImageIcon className="w-8 h-8 mx-auto text-neutral-600" />
                      <p className="text-xs">Belum ada gambar yang Anda unggah ke folder website.</p>
                      <p className="text-[10px] text-stone-500">Semua foto yang Anda unggah di sini akan masuk ke penyimpanan Cloud Run otomatis.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
                      {uploadedImages.map((img, idx) => (
                        <div
                          key={idx}
                          onClick={() => handleSelectImageFromLibrary(img.url)}
                          className="group relative aspect-square rounded-xl overflow-hidden bg-stone-900 border border-neutral-850 hover:border-[#dfb76c] cursor-pointer transition shadow-md"
                        >
                          <img src={img.url} alt={img.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" referrerPolicy="no-referrer" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition duration-200 flex items-center justify-center p-2">
                            <span className="text-[9px] font-black text-white bg-red-900 px-2 py-1 rounded shadow uppercase tracking-widest font-mono">PILIH FOTO</span>
                          </div>
                          
                          {/* Trash button */}
                          <button
                            type="button"
                            onClick={(e) => handleDeleteImage(img.name, e)}
                            className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-black/80 hover:bg-neutral-950 border border-neutral-800 text-stone-450 hover:text-red-400 flex items-center justify-center transition opacity-0 group-hover:opacity-100 shadow-lg cursor-pointer z-20"
                            title="Hapus Permanen"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>

                          {/* Image title flag at the very bottom */}
                          <div className="absolute bottom-0 inset-x-0 bg-neutral-950/95 py-1 px-1.5 border-t border-neutral-850/40 text-[7px] text-stone-450 font-mono truncate">
                            {img.name.substring(img.name.indexOf('_') + 1)}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-neutral-800 bg-neutral-950/40 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setImageSelectorOpen(false);
                  setImageSelectorTarget(null);
                }}
                className="px-5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-850 hover:text-white text-stone-400 text-xs font-bold transition uppercase tracking-wider cursor-pointer font-mono"
              >
                Kembali / Tutup
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
