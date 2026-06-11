import { isSupabaseConfigured, supabase } from './supabase';

export interface CinematicChapterType {
  title: string;
  subtitle: string;
  genre: string;
  image: string;
  quote: string;
  videoUrl: string;
}

export interface WeddingSectionType {
  id: string;
  type: 'cover' | 'movie_poster' | 'bride' | 'groom' | 'story' | 'gallery' | 'timeline' | 'rsvp' | 'gift' | 'guestbook';
  title: string;
  subtitle?: string;
  description?: string;
  mediaUrl?: string;
  videoUrl?: string;
  isEnabled: boolean;
  order: number;
  images?: string[];
  chapters?: CinematicChapterType[];
}

export interface WeddingWalletType {
  id: string;
  bankName: 'BCA' | 'BRI' | 'Mandiri' | 'Bank Jateng' | 'Bank Jago' | 'SeaBank' | 'Krom Bank' | 'Gopay' | 'Shopeepay';
  accountNumber: string;
  accountHolder: string;
}

export interface WeddingSettingsType {
  slug: string;
  themePreset: 'luxury_glass' | 'emerald_gold' | 'classic_wood' | 'minimal_white' | 'royal_magenta';
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundMusicUrl: string;
  hasMusicAutoPlay: boolean;
  coupleDisplayTitle: string;
  eventDate: string;
  seatCount: number;
  giftAddress?: string;
  wallets?: WeddingWalletType[];
}

export interface WeddingGuestbookMessage {
  id: string;
  name: string;
  avatar: string;
  relation: string;
  message: string;
  prayer: string;
  createdAt: string;
  aiReply?: string;
  weddingSlug: string;
  isHidden?: boolean;
}

export interface WeddingRSVPTicket {
  id: string;
  guestName: string;
  attendance: 'hadir' | 'tidak_hadir';
  guestsCount: number;
  session: string;
  scheduleTime: string;
  ticketNumber: string;
  seatNumber: string;
  qrCodeUrl: string;
  avatar: string;
  createdAt: string;
  checkInStatus: 'belum_hadir' | 'sudah_hadir';
  checkInTime?: string;
  weddingSlug: string;
}

export interface SouvenirRewardType {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  probability: number; // percentage
  quantity: number;
  remaining: number;
}

// Draw/Gacha History
export interface RewardDrawHistory {
  id: string;
  guestName: string;
  rewardTitle: string;
  drawnAt: string;
}

// DEFAULT INITIAL CONTENT SEEDS
const DEFAULT_SECTIONS: WeddingSectionType[] = [
  {
    id: 'sec-cover',
    type: 'cover',
    title: 'Hanum & Luthfi',
    subtitle: 'Kabar Bahagia Pernikahan',
    description: '"Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri agar kamu cenderung dan merasa tenteram kepadanya."',
    mediaUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200',
    isEnabled: true,
    order: 0
  },
  {
    id: 'sec-movie',
    type: 'movie_poster',
    title: 'Cinta Di Balik Rapor Rilis',
    subtitle: 'THE GRAND WEDDING CINEMA PRESENTATION',
    description: 'Sebuah kisah nyata kolaborasi penuh kehangatan antara pendidik berdedikasi tinggi dan pengembang sistem sekolah digital terpadu. Perjalanan melintasi barisan kode cinta yang berujung di pelaminan bahagia.',
    mediaUrl: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=1000',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    isEnabled: true,
    order: 1
  },
  {
    id: 'sec-bride',
    type: 'bride',
    title: 'Hanum Muftiani, S.Pd., Gr',
    subtitle: 'Hanum',
    description: 'Putri Keempat dari Bapak H. Sa\'dun Makhali & Ibu Hj. Ulil Faekoh (Jepara, Jawa Tengah)',
    mediaUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=350',
    isEnabled: true,
    order: 2
  },
  {
    id: 'sec-groom',
    type: 'groom',
    title: 'Muhammad Luthfi',
    subtitle: 'Luthfi',
    description: 'Putra Kedua dari Bapak dan Ibu (Jepara, Jawa Tengah)',
    mediaUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=350',
    isEnabled: true,
    order: 3
  },
  {
    id: 'sec-story',
    type: 'story',
    title: 'Kisah Kasih Digitalisasi',
    subtitle: 'Perjalanan Dua Hati',
    description: 'Kisah kami dimulai dari kolaborasi menyusun portal digitalisasi rapor online demi program unggulan Educita. Siapa sangka, barisan kode visual tersebut justru menyatukan rasa kami hingga ke gerbang sakinah.',
    isEnabled: true,
    order: 4
  },
  {
    id: 'sec-timeline',
    type: 'timeline',
    title: 'Informasi Akad & Resepsi',
    subtitle: 'Minggu, 13 September 2026',
    description: 'Masjid Agung Sukarela Mayong & Royal Bloom Pavilion (Jl. Raya Mayong No. 88, perbatasan Kudus - Jepara, Jawa Tengah)',
    mediaUrl: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800',
    isEnabled: true,
    order: 5
  },
  {
    id: 'sec-gallery',
    type: 'gallery',
    title: 'Galeri Momen Prewedding',
    subtitle: 'Visual Keberkahan',
    mediaUrl: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&q=80&w=600',
    isEnabled: true,
    order: 6
  },
  {
    id: 'sec-rsvp',
    type: 'rsvp',
    title: 'Pesan Tiket Kehadiran',
    subtitle: 'Smart Booking RSVP Seat',
    description: 'Konfirmasi kehadiran Anda dengan memesan slot tiket resepsi digital di bawah ini. Tiket Anda akan dilengkapi dengan e-seat, nomor booking, serta barcode katering khusus scan check-in pada area pendaftaran.',
    isEnabled: true,
    order: 7
  },
  {
    id: 'sec-gift',
    type: 'gift',
    title: 'Gacha Kotak Souvenir',
    subtitle: 'Digital Souvenir Drawing Drop',
    description: 'Terima kasih atas doa mulia Anda! Silakan putar tab roda souvenir digital untuk membawa pulang tanda terima kasih orisinal persembahan romantis Luthfi & Hanum.',
    isEnabled: true,
    order: 8
  },
  {
    id: 'sec-guestbook',
    type: 'guestbook',
    title: 'Story Ucapan Interaktif',
    subtitle: 'Instagram Story Guestbook',
    description: 'Selamat menyaksikan ucapan, restu barakah, serta doa indah dari kerabat dan tamu kehormatan kami berdua yang dipresentasikan bagai untaian insta-story modern.',
    isEnabled: true,
    order: 9
  }
];

const DEFAULT_WALLETS: WeddingWalletType[] = [
  { id: 'w-1', bankName: 'BCA', accountNumber: '8600123456', accountHolder: 'Hanum Muftiani' },
  { id: 'w-2', bankName: 'Mandiri', accountNumber: '1230004567890', accountHolder: 'Muhammad Luthfi' }
];

const DEFAULT_SETTINGS: WeddingSettingsType = {
  slug: 'hanum-luthfi',
  themePreset: 'luxury_glass',
  primaryColor: '#8a1c14', // Burgundy/Crimson
  secondaryColor: '#121212', // Obsidian black
  accentColor: '#dfb76c', // Royal soft ivory/gold
  backgroundMusicUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  hasMusicAutoPlay: true,
  coupleDisplayTitle: 'Muhammad Luthfi & Hanum Muftiani',
  eventDate: '2026-09-13',
  seatCount: 150,
  giftAddress: 'Dk. Mambak RT 04 / RW 01, Mambak, Pakis Aji, Jepara, Jawa Tengah',
  wallets: DEFAULT_WALLETS
};

const DEFAULT_REWARDS: SouvenirRewardType[] = [
  {
    id: 'rew-1',
    title: 'Luxury Couple Wallpaper',
    description: 'High-definition digital vertical prewedding screensaver wallpaper with customizable golden signatures from Hanum & Luthfi.',
    imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=500',
    probability: 30,
    quantity: 100,
    remaining: 82
  },
  {
    id: 'rew-2',
    title: 'E-Book IT & School Productivity Tips',
    description: 'An exclusive mini guidebook written by Luthfi & Hanum about digitalizing school classrooms, automating reports with spreadsheets, and security.',
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=500',
    probability: 25,
    quantity: 50,
    remaining: 39
  },
  {
    id: 'rew-3',
    title: 'High-Res Prewedding Art Pack',
    description: 'A beautiful cloud gallery bundlecontaining selected photo concepts with custom artistic background frames designed by Hanum.',
    imageUrl: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&q=80&w=500',
    probability: 20,
    quantity: 40,
    remaining: 28
  },
  {
    id: 'rew-4',
    title: 'Warm Couple Audio Message',
    description: 'Access link to a personal intimate vocal audio thank you recording with custom acoustic background guitar tracks from the newlywed couple.',
    imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=500',
    probability: 15,
    quantity: 30,
    remaining: 14
  },
  {
    id: 'rew-5',
    title: 'Special VIP Access Pass Voucher',
    description: 'Special coupon code for secondary access to future IT templates and school utility templates on Educita.id for free!',
    imageUrl: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=500',
    probability: 10,
    quantity: 10,
    remaining: 5
  }
];

const DEFAULT_GUESTBOOK_MESSAGES: WeddingGuestbookMessage[] = [
  {
    id: 'msg-1',
    name: 'Bapak Drs. Hermawan, M.Pd.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100',
    relation: 'Rekan Kerja Guru',
    message: 'Selamat berbahagia Hanum & Luthfi!',
    prayer: 'Semoga bahtera rumahtangga yang dibangun menjadi teladan mulia bagi para pendidik, selalu dinaungi berkah cinta sakinah mawaddah warahmah dari Allah SWT.',
    createdAt: '2026-06-01T10:00:00Z',
    aiReply: 'Aamiin ya rabbal alamin. Terima kasih banyak Bapak Drs. Hermawan atas doa restu, wejangan mulia, serta bimbingan tiada hentinya selama kami berkarya!',
    weddingSlug: 'hanum-luthfi'
  },
  {
    id: 'msg-2',
    name: 'Risa & Deni (Bandung)',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100',
    relation: 'Kerabat Dekat / Sahabat',
    message: 'Happy Wedding, Hanum my computer partner!',
    prayer: 'Lancar acaranya num, terharu banget liat jodohnya dapet pak guru keren. Bahagia terus ya kalian berdua, langgeng sampai kakek nenek!',
    createdAt: '2026-06-02T14:30:00Z',
    aiReply: 'Aamiin, makasih banyak Risa & Deni sayang! Seneng banget didoain sahabat deket, doakan juga semoga kami berdua senantiasa awet ya!',
    weddingSlug: 'hanum-luthfi'
  }
];

const DEFAULT_TICKETS: WeddingRSVPTicket[] = [
  {
    id: 'tix-1',
    guestName: 'Bapak Drs. Hermawan, M.Pd.',
    attendance: 'hadir',
    guestsCount: 2,
    session: 'Sesi 1 (Akad & Pembukaan)',
    scheduleTime: '10:00 - 12:00 WIB',
    ticketNumber: 'VIP-2026-0913-001',
    seatNumber: 'Seat A-11',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=VIP-2026-0913-001',
    avatar: '👩',
    createdAt: '2026-06-01T10:05:00Z',
    checkInStatus: 'belum_hadir',
    weddingSlug: 'hanum-luthfi'
  }
];

// LOCALPERSISTENCE & REMOTE HARMONIZED STORAGE ENGINE (V1 FULL STACK)
export const weddingDb = {
  // Sync state from server to local storage cache
  async initialize(slug: string = 'hanum-luthfi'): Promise<void> {
    try {
      const response = await fetch('/api/wedding-state');
      if (response.ok) {
        const state = await response.json();
        
        // Populate cache keys
        if (state.sections) localStorage.setItem(`wedding_sections_${slug}`, JSON.stringify(state.sections));
        if (state.settings) localStorage.setItem(`wedding_settings_${slug}`, JSON.stringify(state.settings));
        if (state.rewards) localStorage.setItem(`wedding_rewards_${slug}`, JSON.stringify(state.rewards));
        if (state.guestbook) localStorage.setItem(`wedding_guestbook_${slug}`, JSON.stringify(state.guestbook));
        if (state.tickets) localStorage.setItem(`wedding_tickets_${slug}`, JSON.stringify(state.tickets));
        if (state.drawHistory) localStorage.setItem(`wedding_draw_history_${slug}`, JSON.stringify(state.drawHistory));
        
        console.log('✅ [weddingDb] Central online database synced successfully!');
      }
    } catch (err) {
      console.warn('⚠️ [weddingDb] Server unsynced, running on local sandbox fallback:', err);
    }
  },

  getSections(slug: string = 'hanum-luthfi'): WeddingSectionType[] {
    const key = `wedding_sections_${slug}`;
    if (!localStorage.getItem(key)) {
       localStorage.setItem(key, JSON.stringify(DEFAULT_SECTIONS));
    }
    const secs = JSON.parse(localStorage.getItem(key)!) as WeddingSectionType[];
    
    // Ensure gallery has images
    const gal = secs.find(s => s.type === 'gallery');
    if (gal && !gal.images) {
      gal.images = [
        'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=600',
        'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=600',
        'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&q=80&w=600',
        'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=600',
        'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&q=80&w=600',
        'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&q=80&w=600',
        'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=600',
        'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=600',
        'https://images.unsplash.com/photo-1519225495810-7512c696505a?auto=format&fit=crop&q=80&w=600',
        'https://images.unsplash.com/photo-1502444330042-d1a1ddf9bb5b?auto=format&fit=crop&q=80&w=600',
        'https://images.unsplash.com/photo-1507504038482-76210061e0bb?auto=format&fit=crop&q=80&w=600',
        'https://images.unsplash.com/photo-1591604466107-ec97de577aff?auto=format&fit=crop&q=80&w=600'
      ];
      localStorage.setItem(key, JSON.stringify(secs));
    }

    // Ensure movie_poster has chapters
    const mov = secs.find(s => s.type === 'movie_poster');
    if (mov && !mov.chapters) {
      mov.chapters = [
        {
          title: "Detail Sakral",
          subtitle: "Rencana Pembuka",
          genre: "Dokumenter • Roman",
          image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=500",
          quote: "Langkah awal memulai perbincangan tentang arti kesungguhan.",
          videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4"
        },
        {
          title: "Kamu dan...",
          subtitle: "Rapat Pendampingan",
          genre: "Romansa • Kelas",
          image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=500",
          quote: "Di sela-sela pembahasan kode rapor rilis, tersimpan senyum yang tulus.",
          videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4"
        },
        {
          title: "Keberangkatan",
          subtitle: "Jangan Melamun Saat Hujan",
          genre: "Romansa • Drama",
          image: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=500",
          quote: "Perjalanan kereta yang mempertemukan dua insan dari kota pelabuhan menuju ketenangan.",
          videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4"
        },
        {
          title: "Memotret Keindahan",
          subtitle: "Sudut Lama Kota Lama",
          genre: "Romansa • Dokumenter",
          image: "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&q=80&w=500",
          quote: "Melalui lensa kamera, rasa kagum perlahan diabadikan dalam bingkai abadi.",
          videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4"
        },
        {
          title: "Pertumbuhan",
          subtitle: "Saling Belajar",
          genre: "Drama • Motivasi",
          image: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&q=80&w=500",
          quote: "Menemukan arti bersandar di kala lelah membimbing generasi penerus bangsa.",
          videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4"
        }
      ];
      localStorage.setItem(key, JSON.stringify(secs));
    }
    
    return secs;
  },

  saveSections(sections: WeddingSectionType[], slug: string = 'hanum-luthfi') {
    const key = `wedding_sections_${slug}`;
    localStorage.setItem(key, JSON.stringify(sections));

    // Dispatch async write to server
    fetch('/api/wedding-state/sections', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sections })
    }).catch(err => console.error('[weddingDb] Failed to sync sections to server:', err));
  },

  getSettings(slug: string = 'hanum-luthfi'): WeddingSettingsType {
    const key = `wedding_settings_${slug}`;
    if (!localStorage.getItem(key)) {
      localStorage.setItem(key, JSON.stringify(DEFAULT_SETTINGS));
    }
    const saved = JSON.parse(localStorage.getItem(key)!) as WeddingSettingsType;
    if (!saved.giftAddress) {
      saved.giftAddress = DEFAULT_SETTINGS.giftAddress;
    }
    if (!saved.wallets) {
      saved.wallets = DEFAULT_SETTINGS.wallets;
    }
    return saved;
  },

  saveSettings(settings: WeddingSettingsType, slug: string = 'hanum-luthfi') {
    const key = `wedding_settings_${slug}`;
    localStorage.setItem(key, JSON.stringify(settings));

    // Dispatch async write to server
    fetch('/api/wedding-state/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ settings })
    }).catch(err => console.error('[weddingDb] Failed to sync settings to server:', err));
  },

  getGuestbook(slug: string = 'hanum-luthfi'): WeddingGuestbookMessage[] {
    const key = `wedding_guestbook_${slug}`;
    if (!localStorage.getItem(key)) {
      localStorage.setItem(key, JSON.stringify(DEFAULT_GUESTBOOK_MESSAGES));
    }
    return JSON.parse(localStorage.getItem(key)!) as WeddingGuestbookMessage[];
  },

  saveGuestbook(guestbook: WeddingGuestbookMessage[], slug: string = 'hanum-luthfi') {
    const key = `wedding_guestbook_${slug}`;
    localStorage.setItem(key, JSON.stringify(guestbook));

    // Dispatch async write to server
    fetch('/api/wedding-state/guestbook-all', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ guestbook })
    }).catch(err => console.error('[weddingDb] Failed to sync guestbook to server:', err));
  },

  async addGuestbook(entry: Omit<WeddingGuestbookMessage, 'id' | 'createdAt'>, slug: string = 'hanum-luthfi'): Promise<WeddingGuestbookMessage> {
    const key = `wedding_guestbook_${slug}`;
    try {
      const response = await fetch('/api/wedding-state/guestbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry)
      });
      if (response.ok) {
        const newEntry = await response.json();
        const messages = this.getGuestbook(slug);
        messages.unshift(newEntry);
        localStorage.setItem(key, JSON.stringify(messages));
        return newEntry;
      }
    } catch (err) {
      console.warn('[weddingDb] Server error adding guestbook, falling back to local simulation:', err);
    }

    // Local sandbox simulation fallback
    const messages = this.getGuestbook(slug);
    const newEntry: WeddingGuestbookMessage = {
      ...entry,
      id: `msg-${Date.now()}`,
      createdAt: new Date().toISOString(),
      weddingSlug: slug
    };

    // Simulated AI response
    try {
      const response = await fetch('/api/wedding/ai-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: entry.name, message: `${entry.message} ${entry.prayer}` })
      });
      if (response.ok) {
        const data = await response.json();
        newEntry.aiReply = data.reply;
      }
    } catch (err) {
      newEntry.aiReply = `Aamiin ya rabbal alamin. Terima kasih banyak Kak ${entry.name} atas doa restu dan ucapan indahnya!`;
    }

    messages.unshift(newEntry);
    localStorage.setItem(key, JSON.stringify(messages));
    return newEntry;
  },

  getTickets(slug: string = 'hanum-luthfi'): WeddingRSVPTicket[] {
    const key = `wedding_tickets_${slug}`;
    if (!localStorage.getItem(key)) {
      localStorage.setItem(key, JSON.stringify(DEFAULT_TICKETS));
    }
    return JSON.parse(localStorage.getItem(key)!) as WeddingRSVPTicket[];
  },

  async addRSVPTicket(rsvp: Omit<WeddingRSVPTicket, 'id' | 'createdAt' | 'ticketNumber' | 'seatNumber' | 'qrCodeUrl' | 'checkInStatus'>, slug: string = 'hanum-luthfi'): Promise<WeddingRSVPTicket> {
    const key = `wedding_tickets_${slug}`;
    try {
      const response = await fetch('/api/wedding-state/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rsvp)
      });
      if (response.ok) {
        const newTicket = await response.json();
        const tickets = this.getTickets(slug);
        tickets.unshift(newTicket);
        localStorage.setItem(key, JSON.stringify(tickets));
        return newTicket;
      }
    } catch (err) {
      console.warn('[weddingDb] Server error saving RSVP, falling back to local simulation:', err);
    }

    // Local sandbox simulation fallback
    const tickets = this.getTickets(slug);
    const id = `tix-${Date.now()}`;
    const serial = Math.floor(100 + Math.random() * 900);
    const ticketNumber = `VIP-2026-0913-${serial}`;
    
    const row = ['A', 'B', 'C', 'D', 'E'][Math.floor(Math.random() * 5)];
    const num = Math.floor(1 + Math.random() * 30);
    const seatNumber = `Seat ${row}-${num}`;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(ticketNumber)}`;

    const newTicket: WeddingRSVPTicket = {
      ...rsvp,
      id,
      ticketNumber,
      seatNumber,
      qrCodeUrl,
      checkInStatus: 'belum_hadir',
      createdAt: new Date().toISOString(),
      weddingSlug: slug
    };

    tickets.unshift(newTicket);
    localStorage.setItem(key, JSON.stringify(tickets));
    return newTicket;
  },

  async checkInTicket(ticketNumber: string, slug: string = 'hanum-luthfi'): Promise<{ success: boolean; message: string; ticket?: WeddingRSVPTicket }> {
    const key = `wedding_tickets_${slug}`;
    try {
      const response = await fetch('/api/wedding-state/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticketNumber })
      });
      if (response.ok) {
        const res = await response.json();
        if (res.success && res.ticket) {
          const tickets = this.getTickets(slug);
          const tixIdx = tickets.findIndex(t => t.ticketNumber.trim().toUpperCase() === ticketNumber.trim().toUpperCase());
          if (tixIdx !== -1) {
            tickets[tixIdx] = res.ticket;
            localStorage.setItem(key, JSON.stringify(tickets));
          }
        }
        return res;
      }
    } catch (err) {
      console.warn('[weddingDb] Server error during check-in, falling back to local calculation:', err);
    }

    // Local logic fallback
    const tickets = this.getTickets(slug);
    const tixIdx = tickets.findIndex(t => t.ticketNumber.trim().toUpperCase() === ticketNumber.trim().toUpperCase());

    if (tixIdx === -1) {
      return { success: false, message: 'Tiket tidak ditemukan. Silakan periksa kembali kode tiket.' };
    }

    const ticket = tickets[tixIdx];
    if (ticket.checkInStatus === 'sudah_hadir') {
      return { 
        success: false, 
        message: `Tiket sudah check-in sebelumnya pada pukul ${new Date(ticket.checkInTime!).toLocaleTimeString('id-ID')}.`,
        ticket 
      };
    }

    ticket.checkInStatus = 'sudah_hadir';
    ticket.checkInTime = new Date().toISOString();
    tickets[tixIdx] = ticket;
    localStorage.setItem(key, JSON.stringify(tickets));

    return { 
      success: true, 
      message: `Check-in Berhasil! Selamat datang Kak ${ticket.guestName}.`, 
      ticket 
    };
  },

  getRewards(slug: string = 'hanum-luthfi'): SouvenirRewardType[] {
    const key = `wedding_rewards_${slug}`;
    if (!localStorage.getItem(key)) {
      localStorage.setItem(key, JSON.stringify(DEFAULT_REWARDS));
    }
    return JSON.parse(localStorage.getItem(key)!) as SouvenirRewardType[];
  },

  saveRewards(rewards: SouvenirRewardType[], slug: string = 'hanum-luthfi') {
    const key = `wedding_rewards_${slug}`;
    localStorage.setItem(key, JSON.stringify(rewards));

    // Dispatch async write to server
    fetch('/api/wedding-state/rewards', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rewards })
    }).catch(err => console.error('[weddingDb] Failed to sync rewards to server:', err));
  },

  getDrawHistory(slug: string = 'hanum-luthfi'): RewardDrawHistory[] {
    const key = `wedding_draw_history_${slug}`;
    return JSON.parse(localStorage.getItem(key) || '[]') as RewardDrawHistory[];
  },

  async drawSouvenirReward(guestName: string, slug: string = 'hanum-luthfi'): Promise<SouvenirRewardType | null> {
    const key = `wedding_rewards_${slug}`;
    try {
      const response = await fetch('/api/wedding-state/draw-souvenir', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guestName })
      });
      if (response.ok) {
        const reward = await response.json();
        
        // Refresh local cache representation of rewards
        const cacheResponse = await fetch('/api/wedding-state');
        if (cacheResponse.ok) {
          const state = await cacheResponse.json();
          if (state.rewards) localStorage.setItem(`wedding_rewards_${slug}`, JSON.stringify(state.rewards));
          if (state.drawHistory) localStorage.setItem(`wedding_draw_history_${slug}`, JSON.stringify(state.drawHistory));
        }

        return reward;
      }
    } catch (err) {
      console.warn('[weddingDb] Server error during souvenir draw, falling back to local simulation:', err);
    }

    // Local logic simulation fallback
    const rewards = this.getRewards(slug);
    const available = rewards.filter(r => r.remaining > 0);
    if (available.length === 0) return null;

    // Distribute by probability
    let selected: SouvenirRewardType | null = null;
    const totalProb = available.reduce((acc, r) => acc + r.probability, 0);
    let cumulative = 0;
    const itemRand = Math.random() * totalProb;

    for (const r of available) {
      cumulative += r.probability;
      if (itemRand <= cumulative) {
        selected = r;
        break;
      }
    }

    if (!selected && available.length > 0) {
      selected = available[0];
    }

    if (selected) {
      const fullIdx = rewards.findIndex(r => r.id === selected!.id);
      if (fullIdx !== -1) {
        rewards[fullIdx].remaining -= 1;
        this.saveRewards(rewards, slug);

        // Record draw history
        const histKey = `wedding_draw_history_${slug}`;
        const history = this.getDrawHistory(slug);
        history.push({
          id: `draw-${Date.now()}`,
          guestName,
          rewardTitle: selected.title,
          drawnAt: new Date().toISOString()
        });
        localStorage.setItem(histKey, JSON.stringify(history));
      }
    }

    return selected;
  }
};
