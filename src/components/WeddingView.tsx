import React, { useState, useEffect, useRef } from 'react';
import { 
  Heart, Calendar, MapPin, Gift, BookOpen, Send, 
  Map, Copy, Check, Users, Users2, Clock, Sparkles, 
  AlertCircle, Play, Pause, Volume2, VolumeX, Ticket, 
  ChevronLeft, ChevronRight, HelpCircle, Film, Trophy, 
  Camera, User, Smile, Sparkle, Compass, X
} from 'lucide-react';
import { weddingDb, WeddingSectionType, WeddingSettingsType, WeddingGuestbookMessage, WeddingRSVPTicket, SouvenirRewardType } from '../lib/weddingDb';

const avatarAyahanda = new URL('../assets/images/avatar_ayahanda_1780529680659.png', import.meta.url).href;
const avatarIbunda = new URL('../assets/images/avatar_ibunda_1780529694688.png', import.meta.url).href;
const avatarKeluarga = new URL('../assets/images/avatar_keluarga_1780529708340.png', import.meta.url).href;
const avatarSman = new URL('../assets/images/avatar_sman_1780529721100.png', import.meta.url).href;
const avatarTeman = new URL('../assets/images/avatar_teman_1780529733153.png', import.meta.url).href;
const avatarVip = new URL('../assets/images/avatar_vip_1780529745684.png', import.meta.url).href;
const avatarGentleman = new URL('../assets/images/avatar_gentleman_1780529759238.png', import.meta.url).href;
const avatarLady = new URL('../assets/images/avatar_lady_1780529770987.png', import.meta.url).href;

interface WeddingViewProps {
  toGuest?: string;
  slug?: string;
  key?: any;
}

const getYouTubeId = (url: string): string | null => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

const PROFILE_TEMPLATES = [
  { id: 'ayahanda', name: 'Ayahanda', label: 'PRIA BIJAKSANA', char: avatarAyahanda, color: 'from-stone-800 to-stone-900 border-neutral-800' },
  { id: 'ibunda', name: 'Ibunda', label: 'WANITA PENYAYANG', char: avatarIbunda, color: 'from-zinc-800 to-stone-950 border-neutral-800' },
  { id: 'keluarga', name: 'Keluarga', label: 'PILAR UTAMA', char: avatarKeluarga, color: 'from-zinc-800 to-stone-950 border-neutral-800' },
  { id: 'kerabat-sman', name: 'Kerabat SMAN', label: 'TEMAN SEKOLAH', char: avatarSman, color: 'from-zinc-800 to-stone-950 border-neutral-800' },
  { id: 'teman-sejawat', name: 'Teman Sejawat', label: 'REKAN KERJA', char: avatarTeman, color: 'from-zinc-800 to-stone-950 border-neutral-800' },
  { id: 'vip', name: 'Tamu VIP', label: 'KEHORMATAN VIP', char: avatarVip, color: 'from-yellow-950/20 to-stone-950 border-neutral-800' },
  { id: 'gentleman', name: 'Gentleman', label: 'TAMU PRIA ELEGAN', char: avatarGentleman, color: 'from-slate-900 to-stone-950 border-neutral-800' },
  { id: 'lady', name: 'Elegant Lady', label: 'TAMU WANITA ANGGUN', char: avatarLady, color: 'from-rose-950/20 to-stone-950 border-neutral-800' },
];

const CINEMATIC_CHAPTERS = [
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

const FRIEND_STORIES = [
  {
    name: "Kak",
    fullName: "Kak Farida",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150",
    message: "Barakallah fikum Luthfi dan Hanum, semoga dilancarkan segala urusan akad nikahnya.",
    reply: "Ahad berkah penuh doa. Terima kasih banyak Kak Farida atas restu indahnya bagi kami.",
    rating: "5/5",
    time: "3 JAM LALU",
    views: 124
  },
  {
    name: "Yuhyi",
    fullName: "Yuhyi Mulia",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
    message: "Selamat ya neng Hanum, semoga menjadi keluarga sakinah mawaddah warahmah.",
    reply: "Terima kasih banyak Yuhyi sayang atas kedatangannya serta doanya yang indah.",
    rating: "5/5",
    time: "6 JAM LALU",
    views: 89
  },
  {
    name: "Diah",
    fullName: "Diah dan Suami",
    avatar: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&q=80&w=150",
    message: "Masya Allah selamat menjalankan ibadah terpanjang Tsamarah dan suami, semoga bahagia selalu dunia akhirat❤️",
    reply: "Kepada Diah dan Suami, terima kasih banyak atas doa tulus serta ucapan indahnya untuk kami berdua. Semoga kebahagiaan dan keberkahan yang sama juga senantiasa menyertai kehidupan rumah tangga kalian. — Luthfi & Hanum",
    rating: "5/5",
    time: "1 HARI LALU",
    views: 218
  },
  {
    name: "Mbak",
    fullName: "Mbak Ningrum",
    avatar: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&q=80&w=150",
    message: "Sangat ikut bahagia mendengarnya ffi, selamat menempuh hidup baru ya!",
    reply: "Matur nuwun Mbak Ningrum atas ucapan hangatnya, semoga sehat sekeluarga nggih.",
    rating: "5/5",
    time: "2 HARI LALU",
    views: 145
  },
  {
    name: "Pricilla",
    fullName: "dr. Pricilla",
    avatar: "https://images.unsplash.com/photo-1628890923662-2cb23c2e0cfe?auto=format&fit=crop&q=80&w=150",
    message: "Selamat menempuh gerbang ibadah mulia! Bahagia terus kalian.",
    reply: "Terima kasih dr. Pricilla, salam hangat dari kami sekeluarga.",
    rating: "5/5",
    time: "3 HARI LALU",
    views: 310
  }
];

export default function WeddingView({ toGuest, slug = 'hanum-luthfi' }: WeddingViewProps) {
  // Database States
  const [sections, setSections] = useState<WeddingSectionType[]>([]);
  const [settings, setSettings] = useState<WeddingSettingsType | null>(null);
  const [guestBook, setGuestBook] = useState<WeddingGuestbookMessage[]>([]);
  const [rewardsList, setRewardsList] = useState<SouvenirRewardType[]>([]);
  
  // UI States
  const [isOpen, setIsOpen] = useState(false);
  const [isMovieLoading, setIsMovieLoading] = useState(false);
  const [movieLoadingStep, setMovieLoadingStep] = useState(0);
  const [selectedAvatar, setSelectedAvatar] = useState<string>('https://images.unsplash.com/photo-1624561172888-ac93c696e10c?auto=format&fit=crop&q=80&w=150');
  const [customAvatarUrl, setCustomAvatarUrl] = useState<string>('');
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [activeStoryIdx, setActiveStoryIdx] = useState(0);
  const [storyProgress, setStoryProgress] = useState(0);
  const [coverStep, setCoverStep] = useState<number>(1);
  const [selectedProfileIdx, setSelectedProfileIdx] = useState<number>(0);
  const [selectedProfileName, setSelectedProfileName] = useState<string>('Ayahanda');
  const [giftDrawerOpen, setGiftDrawerOpen] = useState(false);
  const [loadingPct, setLoadingPct] = useState<number>(0);
  const [selectedReview, setSelectedReview] = useState<any | null>(null);
  const [carouselIdx, setCarouselIdx] = useState(2);
  const [isAllWalletsModalOpen, setIsAllWalletsModalOpen] = useState(false);

  // AI Route Assistant States
  const [routeStartLocation, setRouteStartLocation] = useState('');
  const [routePlanning, setRoutePlanning] = useState<any>(null);
  const [routeLoading, setRouteLoading] = useState(false);
  
  // RSVP Form States
  const [rsvpSent, setRsvpSent] = useState(false);
  const [myTicket, setMyTicket] = useState<WeddingRSVPTicket | null>(null);
  const [rsvpForm, setRsvpForm] = useState({
    attendance: 'hadir' as 'hadir' | 'tidak_hadir',
    guestsCount: 1,
    session: 'Sesi 1 (Akad & Opening VIP)',
    scheduleTime: '10:00 - 12:00 WIB',
  });

  // Souvenir Gacha States
  const [isSpinning, setIsSpinning] = useState(false);
  const [gachaReward, setGachaReward] = useState<SouvenirRewardType | null>(null);
  const [hasDrawn, setHasDrawn] = useState(false);

  // Guestbook submissions
  const [newMessage, setNewMessage] = useState({ message: '', prayer: '', relation: 'Sahabat' });
  const [isSubmittingMessage, setIsSubmittingMessage] = useState(false);

  // Audio elements
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Load configuration
  useEffect(() => {
    const loadedSections = weddingDb.getSections(slug);
    const loadedSettings = weddingDb.getSettings(slug);
    const loadedBook = weddingDb.getGuestbook(slug);
    const loadedRewards = weddingDb.getRewards(slug);

    setSections(loadedSections.sort((a, b) => a.order - b.order));
    setSettings(loadedSettings);
    setGuestBook(loadedBook);
    setRewardsList(loadedRewards);

    // Look for previous ticket booking if already rsvp
    const allTickets = weddingDb.getTickets(slug);
    const selfName = toGuest || 'Tamu Undangan';
    const found = allTickets.find(t => t.guestName.toLowerCase().trim() === selfName.toLowerCase().trim());
    if (found) {
      setMyTicket(found);
      setRsvpSent(true);
      if (found.avatar) {
        setSelectedAvatar(found.avatar);
      }
    }

    // Look for drawn rewards
    const drawHistory = weddingDb.getDrawHistory(slug);
    const drawn = drawHistory.find(h => h.guestName.toLowerCase().trim() === selfName.toLowerCase().trim());
    if (drawn) {
      const rewDetail = loadedRewards.find(r => r.title === drawn.rewardTitle);
      if (rewDetail) {
        setGachaReward(rewDetail);
        setHasDrawn(true);
      }
    }
  }, [slug, toGuest]);

  // Progressive Cinema Film Loading Effect
  useEffect(() => {
    let timer: any;
    if (isMovieLoading) {
      setLoadingPct(0);
      setMovieLoadingStep(0);
      timer = setInterval(() => {
        setLoadingPct(prev => {
          if (prev >= 100) {
            clearInterval(timer);
            setTimeout(() => {
              setIsMovieLoading(false);
              setIsOpen(true);
            }, 600);
            return 100;
          }
          const jump = Math.floor(Math.random() * 14) + 6;
          const nextVal = Math.min(100, prev + jump);
          setMovieLoadingStep(Math.floor(nextVal / 20));
          return nextVal;
        });
      }, 140);
    }
    return () => clearInterval(timer);
  }, [isMovieLoading]);

  // Autoplay slideshow for "Kisah Cinta Kami" (Requirement 5)
  useEffect(() => {
    if (videoPlaying) return;
    
    const interval = setInterval(() => {
      setCarouselIdx((prev) => (prev + 1) % CINEMATIC_CHAPTERS.length);
    }, 4500); // Transitions automatically every 4.5 seconds

    return () => clearInterval(interval);
  }, [videoPlaying]);

  // Audio Autoplay & Lifecycle
  useEffect(() => {
    if (settings?.backgroundMusicUrl && isOpen) {
      if (getYouTubeId(settings.backgroundMusicUrl)) {
        if (settings.hasMusicAutoPlay) {
          setIsMusicPlaying(true);
        }
        return;
      }
      const audio = new Audio(settings.backgroundMusicUrl);
      audio.loop = true;
      audioRef.current = audio;
      if (settings.hasMusicAutoPlay) {
        audio.play().then(() => {
          setIsMusicPlaying(true);
        }).catch(err => {
          console.log('Autoplay audio blocked by browser. Awaiting user interaction.');
        });
      }
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [isOpen, settings]);

  // Story Autoplay Carousel Timer
  useEffect(() => {
    if (!isOpen || guestBook.length === 0) return;
    
    setStoryProgress(0);
    const timer = setInterval(() => {
      setStoryProgress(prev => {
        if (prev >= 100) {
          // Move to next story
          setActiveStoryIdx(current => (current + 1) % guestBook.length);
          return 0;
        }
        return prev + 1;
      });
    }, 60); // approx 6s total per story

    return () => clearInterval(timer);
  }, [isOpen, activeStoryIdx, guestBook]);

  // Countdown timer calculation
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    if (!settings?.eventDate) return;

    const targetDate = new Date(`${settings.eventDate}T09:00:00`).getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [settings]);

  const toggleMusic = () => {
    const ytId = getYouTubeId(settings?.backgroundMusicUrl || '');
    if (ytId) {
      setIsMusicPlaying(!isMusicPlaying);
      return;
    }
    if (!audioRef.current && settings?.backgroundMusicUrl) {
      const audio = new Audio(settings.backgroundMusicUrl);
      audio.loop = true;
      audioRef.current = audio;
    }
    if (!audioRef.current) return;
    if (isMusicPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.log('Audio playback error', e));
    }
    setIsMusicPlaying(!isMusicPlaying);
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAccount(label);
    setTimeout(() => setCopiedAccount(null), 2500);
  };

  // Submit RSVP ticket booking
  const handleRSVPBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = toGuest || 'Tamu Undangan';
    const avatarToSave = customAvatarUrl ? customAvatarUrl : selectedAvatar;

    const ticketDetail = await weddingDb.addRSVPTicket({
      guestName: name,
      attendance: rsvpForm.attendance,
      guestsCount: rsvpForm.guestsCount,
      session: rsvpForm.session,
      scheduleTime: rsvpForm.session.includes('Sesi 1') ? '10:00 - 12:00 WIB' : '13:00 - 15:00 WIB',
      avatar: avatarToSave,
      weddingSlug: slug
    }, slug);

    setMyTicket(ticketDetail);
    setRsvpSent(true);
  };

  // Draw Gacha Souvenir
  const spinGacha = () => {
    if (isSpinning || hasDrawn) return;
    setIsSpinning(true);
    
    // Simulate spin wheels
    setTimeout(() => {
      const drawnReward = weddingDb.drawSouvenirReward(toGuest || 'Tamu Undangan', slug);
      setGachaReward(drawnReward);
      setIsSpinning(false);
      setHasDrawn(true);
      // Trigger inventory update
      setRewardsList(weddingDb.getRewards(slug));
    }, 2800);
  };

  // Send interactive Guest Message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.message || !newMessage.prayer) {
      alert('Mohon isi Ucapan Utama dan Doa Berkat terlebih dahulu.');
      return;
    }

    setIsSubmittingMessage(true);
    const senderName = toGuest || 'Tamu Undangan';
    const avatar = customAvatarUrl ? customAvatarUrl : selectedAvatar;

    await weddingDb.addGuestbook({
      name: senderName,
      avatar,
      relation: newMessage.relation,
      message: newMessage.message,
      prayer: newMessage.prayer,
      weddingSlug: slug
    }, slug);

    // Refresh guestbook logs
    setGuestBook(weddingDb.getGuestbook(slug));
    setNewMessage({ message: '', prayer: '', relation: 'Sahabat' });
    setIsSubmittingMessage(false);
    
    // Switch guestbook stories to page 0 to see immediate post
    setActiveStoryIdx(0);
    setStoryProgress(0);
  };

  const getAvatarView = (avatarText: string) => {
    if (avatarText && (avatarText.startsWith('http') || avatarText.includes('/') || avatarText.startsWith('data:'))) {
      return (
        <img 
          src={avatarText} 
          alt="Avatar" 
          className="w-full h-full object-cover rounded-full" 
          referrerPolicy="no-referrer"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150';
          }}
        />
      );
    }
    return <span className="text-xl">{avatarText || '👤'}</span>;
  };

  const renderYouTubePlayer = () => {
    const ytId = getYouTubeId(settings?.backgroundMusicUrl || '');
    if (isMusicPlaying && ytId) {
      return (
        <iframe
          src={`https://www.youtube.com/embed/${ytId}?autoplay=1&mute=0&loop=1&playlist=${ytId}&controls=0&disablekb=1&fs=0&modestbranding=1`}
          allow="autoplay"
          className="hidden pointer-events-none w-0 h-0 absolute opacity-0"
          id="youtube-bg-player"
          title="Background Music Player"
        />
      );
    }
    return null;
  };

  // Fallback loading settings
  if (!settings) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <div className="text-center space-y-3">
          <Sparkles className="w-8 h-8 text-emerald-400 animate-spin mx-auto" />
          <p className="text-xs font-bold tracking-widest text-slate-400">MEMUAT EXPERIENCE PERNIKAHAN...</p>
        </div>
      </div>
    );
  }
  // VIEW 1: PREMIUM CINEMA TICKET ENTRANCE
  // ==========================================
  if (isMovieLoading) {
    return (
      <div className="fixed inset-0 z-50 bg-[#070707] flex flex-col items-center justify-center text-white p-6 font-sans select-none overflow-hidden">
        {/* Subtle glowing dark red background blobs */}
        <div className="absolute inset-0 bg-radial-gradient from-red-950/20 via-transparent to-transparent opacity-60 z-0"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-900/10 rounded-full blur-3xl pointer-events-none z-0"></div>

        <div className="max-w-md w-full space-y-10 text-center relative z-10 flex flex-col items-center justify-center">
          
          {/* Vertical Movie Poster Card */}
          <div className="relative w-[210px] h-[300px] rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(130,13,13,0.45)] border border-neutral-900 bg-neutral-900 transition-all duration-300">
            <img 
              src="https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=600" 
              alt="Immersive Wedding Cinema Premiere Poster representation" 
              className="w-full h-full object-cover opacity-75"
              referrerPolicy="no-referrer"
            />
            {/* Cinematic Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-black/35"></div>
            
            <div className="absolute bottom-5 inset-x-4 text-center space-y-1">
              <span className="text-[7.5px] font-mono tracking-[0.3em] font-extrabold text-[#dfb76c] uppercase">NOW SHOWING</span>
              <h4 className="font-serif text-sm font-semibold text-white tracking-wide leading-tight">Cinta Di Balik Rapor Rilis</h4>
            </div>
          </div>

          {/* Loading Percentage display */}
          <div className="space-y-4 w-full max-w-[240px]">
            <div className="flex flex-col items-center justify-center">
              <span className="font-serif text-[56px] font-light leading-none tracking-tight text-white select-none">
                {loadingPct}
                <span className="text-red-650 text-2xl font-light align-baseline ml-0.5">%</span>
              </span>
            </div>

            {/* Flat Red Loading indicator bar */}
            <div className="w-full bg-neutral-900 h-1 rounded-full overflow-hidden border border-neutral-850">
              <div 
                className="h-full bg-red-650 transition-all duration-300" 
                style={{ width: `${loadingPct}%` }}
              />
            </div>

            {/* Rolling subtitles */}
            <span className="text-[10px] tracking-[0.25em] font-extrabold text-slate-400 uppercase font-mono block animate-pulse">
              MEMUTAR GULUNGAN KENANGAN
            </span>
          </div>

        </div>
      </div>
    );
  }

  if (!isOpen) {
    const guestNameLabel = toGuest || 'Tamu Undangan';

    if (coverStep === 1) {
      // SCREEN 1: THE PREMIERE COVER VIEW WITH COUNTDOWN
      return (
        <div className="fixed inset-0 z-50 bg-[#070707] flex flex-col justify-between items-center text-white px-6 overflow-y-auto py-8 select-none">
          {renderYouTubePlayer()}
          {/* Portrait Backdrop Image */}
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200')] bg-cover bg-center opacity-30 pointer-events-none z-0"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-black/55 to-[#0A0A0A] pointer-events-none z-0"></div>

          {/* Top Header Row */}
          <div className="w-full flex justify-between items-center z-10 max-w-2xl border-b border-white/5 pb-4">
            <span className="font-serif tracking-widest text-[#dfb76c] italic font-semibold text-lg hover:opacity-90 select-none">The Premiere</span>
            <span className="text-[9px] tracking-[0.25em] font-medium text-slate-400 font-mono uppercase">TAMU UNDANGAN</span>
          </div>

          {/* Centered Cover Contents */}
          <div className="flex-1 flex flex-col justify-center items-center py-8 text-center space-y-6 z-10 max-w-xl w-full">
            <span className="text-[9px] tracking-[0.3em] font-extrabold text-slate-400 uppercase font-mono block">🎬 A DIGITAL AUTEUR PRESENTATION</span>
            
            <div className="w-10 h-[1.5px] bg-red-650/80 mx-auto"></div>

            <div className="space-y-1">
              <span className="font-serif text-slate-350 italic text-base select-none block">
                The Wedding <span className="text-red-550 font-semibold italic text-xl ml-1">of</span>
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl font-semibold tracking-wide text-white leading-relaxed mt-1">
                Muhammad Luthfi, S.Pd.
              </h1>
              <div className="font-serif text-[#dfb76c] text-xl">&</div>
              <h1 className="font-serif text-3xl sm:text-4xl font-semibold tracking-wide text-white leading-relaxed">
                Hanum Muftiani, S.Kom.
              </h1>
            </div>

            <div className="text-[10px] tracking-[0.25em] font-bold text-slate-400 font-mono">07.06.2026</div>

            {/* Row of Countdown cards */}
            <div className="flex gap-2.5 justify-center items-center pt-4 select-none">
              {['HARI', 'JAM', 'MENIT', 'DETIK'].map((lbl, idx) => {
                const val = idx === 0 ? timeLeft.days : idx === 1 ? timeLeft.hours : idx === 2 ? timeLeft.minutes : timeLeft.seconds;
                return (
                  <div key={lbl} className="flex flex-col items-center">
                    <div className="w-14 h-14 rounded-xl bg-black/65 border border-neutral-850 flex items-center justify-center shadow-2xl">
                      <span className="text-xl font-bold font-mono text-white">{String(val).padStart(2, '0')}</span>
                    </div>
                    <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider mt-2 font-mono">{lbl}</span>
                  </div>
                );
              })}
            </div>

            {/* Custom Hello Guest Message (Requirement 2) */}
            <div className="pt-2 text-center">
              <h3 className="font-serif text-lg sm:text-xl font-bold tracking-wide mt-1.5 capitalize text-white">
                Hello, <span className="italic font-normal text-[#dfb76c]">{guestNameLabel}</span>
              </h3>
            </div>

            {/* Sparkle Red Check-In Pill Button */}
            <button 
              id="btn-open-check-in"
              onClick={() => {
                setCoverStep(2);
                if (settings?.backgroundMusicUrl && !getYouTubeId(settings.backgroundMusicUrl) && !audioRef.current) {
                  const audio = new Audio(settings.backgroundMusicUrl);
                  audio.loop = true;
                  audioRef.current = audio;
                }
              }}
              className="w-full max-w-[200px] mt-8 py-3.5 rounded-full bg-red-650 hover:bg-red-750 font-extrabold uppercase tracking-widest text-[11px] cursor-pointer shadow-lg shadow-red-950/40 border border-red-700/50 flex items-center justify-center gap-2 transform active:scale-95 transition-all duration-200"
            >
              <Sparkles className="w-4 h-4 text-[#dfb76c] fill-[#dfb76c]/40 animate-pulse" />
              <span>CHECK IN</span>
            </button>

            <span className="text-[8.5px] tracking-[0.18em] text-slate-500 font-medium font-mono uppercase block mt-3">
              DISEDIAKAN UNTUK TAMU UNDANGAN
            </span>
          </div>

          {/* Footer Chevron down indicators */}
          <div className="py-4 z-10 animate-bounce flex flex-col items-center justify-center">
            <ChevronLeft className="w-4 h-4 text-slate-600 transform rotate-270" />
          </div>
        </div>
      );
    } else {
      // SCREEN 2: PICK GUEST ACCESS PROFILE (AVATAR MULTI-PROFILE SELECTION)
      const prevIdx = (selectedProfileIdx - 1 + PROFILE_TEMPLATES.length) % PROFILE_TEMPLATES.length;
      const nextIdx = (selectedProfileIdx + 1) % PROFILE_TEMPLATES.length;
      const activeProfiler = PROFILE_TEMPLATES[selectedProfileIdx];

      return (
        <div className="fixed inset-0 z-50 bg-[#070707] flex flex-col justify-between items-center text-white px-6 overflow-y-auto py-8 select-none">
          {renderYouTubePlayer()}
          {/* Top Header */}
          <div className="w-full flex justify-between items-center z-10 max-w-2xl border-b border-white/5 pb-4">
            <span className="text-[9px] tracking-[0.25em] font-black text-red-550 font-mono uppercase">THE WEDDING PREMIERE</span>
            <span className="text-[9px] tracking-[0.2em] font-mono uppercase text-slate-400">SELECT ACCESS PROFILE</span>
          </div>

          {/* Central Carousel block */}
          <div className="flex-1 flex flex-col justify-center items-center py-6 text-center space-y-8 z-10 max-w-md w-full">
            <div className="space-y-4">
              <h2 className="font-serif text-2xl text-[#dfb76c] font-semibold">Pilih Profil Tamu Anda</h2>
              <p className="text-[11.5px] text-slate-450 max-w-xs mx-auto leading-relaxed">
                Selamat datang, <span className="text-red-500 font-bold italic">Tamu Undangan</span>! Geser untuk memilih profil yang paling mewakili Anda.
              </p>
            </div>

            {/* Slider Row */}
            <div className="flex items-center justify-center gap-1.5 sm:gap-6 my-2 w-full max-w-full overflow-hidden">
              {/* Left arrow */}
              <button 
                onClick={() => setSelectedProfileIdx(p => (p - 1 + PROFILE_TEMPLATES.length) % PROFILE_TEMPLATES.length)}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-slate-850 bg-slate-900/40 hover:bg-slate-800 text-slate-400 flex items-center justify-center cursor-pointer active:scale-95 transition shrink-0"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* 3 Circular items row representation */}
              <div className="flex items-center gap-2 sm:gap-5 justify-center overflow-hidden">
                {/* Previous circle index */}
                <div className="flex flex-col items-center opacity-30 scale-75 filter grayscale transition-all duration-300 shrink-0 w-14 sm:w-16">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border border-slate-850 bg-slate-950 flex items-center justify-center overflow-hidden">
                    {PROFILE_TEMPLATES[prevIdx].char ? (
                      <img src={PROFILE_TEMPLATES[prevIdx].char} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xl">👤</span>
                    )}
                  </div>
                  <span className="text-[9px] text-slate-500 font-mono mt-1.5 font-bold truncate max-w-full">{PROFILE_TEMPLATES[prevIdx].name}</span>
                </div>

                {/* Central active glowing profile circle */}
                <div className="flex flex-col items-center scale-105 sm:scale-110 duration-300 select-none shrink-0 border-none bg-transparent">
                  <div className="relative">
                    {/* Glowing outer backdrop */}
                    <div className="absolute -inset-2 bg-gradient-to-tr from-red-650 via-[#dfb76c] to-red-650 rounded-full blur-md opacity-65 animate-pulse"></div>
                    
                    <div className={`relative w-24 h-24 sm:w-28 sm:h-28 rounded-full border-3 border-[#dfb76c] bg-neutral-950 flex items-center justify-center overflow-hidden shadow-2xl`}>
                      {activeProfiler.char ? (
                        <img src={activeProfiler.char} alt="" className="w-full h-full object-cover animate-duration-1000" />
                      ) : (
                        <span className="text-3xl">👤</span>
                      )}
                    </div>
                    
                    {/* Gold sparkle mini badge */}
                    <div className="absolute -top-0.5 -right-0.5 bg-red-650 p-1.5 rounded-full text-white shadow-md border border-red-500">
                      <Sparkles className="w-3.5 h-3.5 text-[#dfb76c] fill-[#dfb76c]/20" />
                    </div>
                  </div>
                </div>

                {/* Next circle index */}
                <div className="flex flex-col items-center opacity-30 scale-75 filter grayscale transition-all duration-300 shrink-0 w-14 sm:w-16">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border border-slate-855 bg-slate-950 flex items-center justify-center overflow-hidden">
                    {PROFILE_TEMPLATES[nextIdx].char ? (
                      <img src={PROFILE_TEMPLATES[nextIdx].char} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xl">👤</span>
                    )}
                  </div>
                  <span className="text-[9px] text-slate-500 font-mono mt-1.5 font-bold truncate max-w-full">{PROFILE_TEMPLATES[nextIdx].name}</span>
                </div>
              </div>

              {/* Right arrow */}
              <button 
                onClick={() => setSelectedProfileIdx(p => (p + 1) % PROFILE_TEMPLATES.length)}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-slate-850 bg-slate-900/40 hover:bg-slate-800 text-slate-400 flex items-center justify-center cursor-pointer active:scale-95 transition shrink-0"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Selected labels details */}
            <div className="text-center space-y-1.5 pt-2">
              <h3 className="font-serif text-xl font-bold tracking-wide text-white">{activeProfiler.name}</h3>
              <span className="text-[10px] tracking-[0.25em] font-mono font-extrabold text-red-500 block uppercase">{activeProfiler.label}</span>
            </div>

            {/* Slider Dots */}
            <div className="flex gap-2 justify-center py-1">
              {PROFILE_TEMPLATES.map((_, dotIdx) => (
                <button
                  key={dotIdx}
                  onClick={() => setSelectedProfileIdx(dotIdx)}
                  className={`h-1.5 rounded-full transition-all duration-350 ${
                    dotIdx === selectedProfileIdx ? 'w-5 bg-red-650' : 'w-1.5 bg-neutral-800 hover:bg-neutral-750'
                  }`}
                />
              ))}
            </div>

            {/* Back to cover and Confirm Buttons row */}
            <div className="w-full flex flex-col items-center gap-3 pt-4">
              <button 
                onClick={() => {
                  setSelectedAvatar(activeProfiler.char);
                  setSelectedProfileName(activeProfiler.name);
                  setCustomAvatarUrl('');
                  setIsMovieLoading(true);
                  // Play background sound immediately on click activation to bypass browser autoplay blocks
                  const isYt = getYouTubeId(settings?.backgroundMusicUrl || '');
                  if (!isYt && settings?.backgroundMusicUrl) {
                    if (!audioRef.current) {
                      const audio = new Audio(settings.backgroundMusicUrl);
                      audio.loop = true;
                      audioRef.current = audio;
                    }
                    audioRef.current.play().then(() => {
                      setIsMusicPlaying(true);
                    }).catch(e => console.log("Audio play blocked/failed:", e));
                  } else if (isYt) {
                    setIsMusicPlaying(true);
                  }
                }}
                className="w-full max-w-[220px] py-3.5 px-6 rounded-full bg-red-650 hover:bg-red-750 select-none cursor-pointer flex items-center justify-center gap-2 text-white font-extrabold uppercase tracking-widest text-[11px] shadow-lg border border-red-700/40 active:scale-95 transition-all duration-200"
              >
                <Sparkles className="w-4 h-4 text-[#dfb76c] animate-pulse" />
                <span>KONFIRMASI</span>
                <ChevronRight className="w-4 h-4 text-white" />
              </button>

              <button 
                onClick={() => setCoverStep(1)}
                className="text-[9px] font-mono tracking-[0.2em] font-bold text-neutral-500 hover:text-white uppercase transition"
              >
                Kembali ke Cover
              </button>
            </div>

          </div>

          <div className="py-4 z-10 text-[9px] text-neutral-600 font-mono">
            SECURE ADMISSION SYSTEM v1.3
          </div>
        </div>
      );
    }
  }

  // ==========================================
  // VIEW 2: FULL IMMERSIVE WEDDING SITE
  // ==========================================
  return (
    <div className="relative min-h-screen pb-32 bg-[#070707] text-[#eeeff2] font-sans">
      {renderYouTubePlayer()}

      {/* Floating Buttons: Mail and Vinyl, at bottom right */}
      <div className="fixed bottom-24 right-5 sm:right-8 z-40 flex flex-col items-center gap-3">
        {/* Floating Mail Guestbook Shortcut */}
        <button
          onClick={() => {
            const rsvpSection = document.getElementById('rsvp-section');
            if (rsvpSection) {
              rsvpSection.scrollIntoView({ behavior: 'smooth' });
            }
          }}
          className="w-12 h-12 rounded-full bg-neutral-950 border border-neutral-800 text-white flex items-center justify-center hover:scale-105 shadow-xl transition active:scale-95 cursor-pointer group"
          title="Tulis Ucapan & Doa"
        >
          <div className="relative p-1.5 rounded-full border border-red-800/25 group-hover:border-red-600/45 transition">
            <Send className="w-4 h-4 text-slate-300" />
          </div>
        </button>

        {/* Floating Vinyl player audio control */}
        <button
          onClick={toggleMusic}
          className={`w-12 h-12 rounded-full border-2 bg-neutral-950 flex items-center justify-center hover:scale-105 shadow-xl transition active:scale-95 cursor-pointer relative overflow-hidden group ${
            isMusicPlaying ? 'border-red-700 animate-[spin_8s_linear_infinite]' : 'border-neutral-800'
          }`}
          title="Putar Musik Backsound"
        >
          <div className="absolute inset-2.5 border border-dashed border-neutral-800/80 rounded-full"></div>
          <div className="relative w-4 h-4 bg-[#821E1E] rounded-full flex items-center justify-center text-[8px] text-[#dfb76c]">
            {isMusicPlaying ? '●' : '✕'}
          </div>
        </button>
      </div>

      {/* Sticky Bottom Red Ticket CTA Bar */}
      <div className="fixed bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/90 to-transparent p-4 z-40 flex justify-center pointer-events-none md:max-w-3xl md:mx-auto">
        <button
          onClick={() => {
            const rsvpSection = document.getElementById('rsvp-section');
            if (rsvpSection) {
              rsvpSection.scrollIntoView({ behavior: 'smooth' });
            }
          }}
          className="pointer-events-auto w-full max-w-md py-4 bg-[#821E1E] hover:bg-red-700 text-white font-extrabold uppercase tracking-widest text-xs rounded-2xl shadow-xl flex items-center justify-center gap-2 transform active:scale-95 transition-all duration-200 border border-red-650"
        >
          <Ticket className="w-4 h-4 text-[#dfb76c] fill-[#dfb76c]/20 animate-pulse" />
          <span>DAPATKAN TIKET ANDA</span>
        </button>
      </div>

      {/* Sticky Header Top Bar of The Premiere */}
      <div className="sticky top-0 bg-[#070707]/65 backdrop-blur-md z-40 border-b border-white/5 py-4 px-6 flex justify-between items-center w-full max-w-3xl mx-auto">
        <span className="font-serif tracking-widest text-[#dfb76c] italic font-semibold text-lg select-none">The Premiere</span>
        <div className="flex items-center gap-3">
          <button className="p-2 rounded-full bg-neutral-900 border border-neutral-800 text-[#dfb76c] hover:bg-neutral-800 transition">
            <Sparkle className="w-4 h-4 animate-spin-slow text-[#dfb76c]" />
          </button>
          <button 
            onClick={() => {
              const giftSection = document.getElementById('gift-section');
              if (giftSection) {
                giftSection.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="p-2 rounded-full bg-red-950/40 border border-red-900/60 text-[#dfb76c] hover:bg-red-900/60 transition"
          >
            <Gift className="w-4 h-4" />
          </button>
          <div className="w-8 h-8 rounded-full border border-neutral-800 overflow-hidden bg-slate-950 flex items-center justify-center text-sm">
            {getAvatarView(selectedAvatar)}
          </div>
        </div>
      </div>

      {/* Interactive Review Modal Pop-up Popup-Details (Image 7) */}
      {selectedReview && (
        <div className="fixed inset-0 bg-[#070707]/90 backdrop-blur-sm flex items-center justify-center z-50 p-6 overflow-y-auto">
          <div className="bg-neutral-900 border border-neutral-800 rounded-[32px] p-6 text-[#eeeff2] relative space-y-6 max-w-md w-full shadow-2xl animate-[fadeIn_0.25s_ease-out]">
            <button 
              onClick={() => setSelectedReview(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-neutral-950 border border-neutral-800 text-neutral-400 flex items-center justify-center hover:bg-neutral-850 hover:text-white transition cursor-pointer"
            >
              ✕
            </button>

            {/* Friend Details Header */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full border-2 border-[#821E1E]/40 bg-neutral-950 flex items-center justify-center text-2xl shadow-md overflow-hidden select-none">
                {getAvatarView(selectedReview.avatar)}
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">{selectedReview.fullName}</h4>
                <div className="flex items-center gap-1.5 mt-0.5 font-mono text-[8px] uppercase font-bold text-stone-500 tracking-wider">
                  <span>{selectedReview.time}</span>
                  <span>•</span>
                  <span className="text-red-500 font-extrabold uppercase">TAMU SAHABAT</span>
                </div>
              </div>
            </div>

            {/* Quote of message */}
            <div className="space-y-1">
              <p className="text-center text-sm italic font-serif leading-relaxed text-slate-100 max-w-xs mx-auto">
                "{selectedReview.message}"
              </p>
            </div>

            {/* Bride reply sub-card */}
            <div className="bg-neutral-950/80 rounded-2xl p-4 border border-[#dfb76c]/10 relative space-y-1.5">
              <div className="flex items-center gap-1.5 text-[8.5px] uppercase font-mono tracking-widest text-[#dfb76c] font-black">
                <Sparkles className="w-3.5 h-3.5 text-[#dfb76c]" />
                <span>✨ BALASAN HANGAT MEMPELAI</span>
              </div>
              <p className="text-[11px] text-stone-300 leading-relaxed font-sans">
                {selectedReview.reply}
              </p>
            </div>

            {/* Rating Box */}
            <div className="p-3.5 rounded-xl border border-neutral-800 bg-neutral-950/50 flex flex-col justify-center items-center space-y-2">
              <div className="w-full flex justify-between items-center text-[8.5px] uppercase font-mono tracking-widest text-stone-500 font-extrabold pb-1.5 border-b border-white/5">
                <span>RATING DOA &amp; SKALA FAVORIT</span>
                <span className="text-white font-black">{selectedReview.rating}</span>
              </div>
              
              <div className="flex items-center gap-1 text-[#dfb76c]">
                {Array.from({ length: 5 }).map((_, sIdx) => (
                  <span key={sIdx} className="text-lg">★</span>
                ))}
              </div>

              <div className="w-full flex justify-between items-center text-[8.5px] uppercase font-mono text-stone-500 font-extrabold pt-1">
                <span className="text-red-500 flex items-center gap-1 font-bold">♥ SKALA FAVORIT: FAVORIT KAMI</span>
                <span>👁 PENAYANGAN: {selectedReview.views}</span>
              </div>
            </div>

            {/* Tag information label */}
            <div className="text-center space-y-1">
              <span className="text-[8.5px] text-[#dfb76c] tracking-widest font-mono font-bold uppercase block">
                TAG KAMI @HANUMLUTHFI UNTUK KESEMPATAN DITAMPILKAN!
              </span>
            </div>

            {/* Red button capsule */}
            <button
              onClick={() => setSelectedReview(null)}
              className="w-full py-3.5 bg-[#821E1E] hover:bg-rose-700 text-white font-extrabold uppercase tracking-widest text-xs rounded-full shadow-lg border border-red-700/40 active:scale-95 transition-all duration-200 cursor-pointer"
            >
              TUTUP
            </button>
          </div>
        </div>
      )}
            {/* Decorative background overlays */}
      <div className="absolute top-[800px] left-1/4 w-72 h-72 bg-red-950/20 rounded-full blur-3xl pointer-events-none opacity-20 animate-pulse"></div>
      <div className="absolute top-[1800px] right-1/4 w-80 h-80 bg-[#dfb76c]/5 rounded-full blur-3xl pointer-events-none opacity-20"></div>

      {/* 2.A SECTION TYPE: COVER BANNER (FULL VIEWPORT WIDTH & PHOTO BACKDROP WITH GRADIENT - REQ 4) */}
      {sections.filter(s => s.isEnabled && s.type === 'cover').map((sec) => {
        return (
          <section 
            key={sec.id} 
            className="relative w-full min-h-[90vh] flex flex-col justify-between items-center text-center py-16 px-6 bg-cover bg-center text-white overflow-hidden select-none"
            style={{ backgroundImage: `url(${sec.mediaUrl || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200\''})` }}
          >
            {/* Cinematic Overlay to darken slightly and fade smoothly at the bottom */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#070707] via-black/40 to-black/60 pointer-events-none z-0"></div>
            
            {/* Direct thick gradient fade from background color #070707 on bottom to make transparency transition */}
            <div className="absolute bottom-0 inset-x-0 h-48 bg-gradient-to-t from-[#070707] via-[#070707]/75 to-transparent pointer-events-none z-0"></div>

            <div className="space-y-2 relative z-10">
              <span className="text-[9.5px] tracking-[0.3em] font-extrabold text-neutral-400 uppercase font-mono block">
                A DIGITAL AUTEUR PRESENTATION
              </span>
              <div className="flex items-center justify-center gap-1.5">
                <div className="h-[1px] w-6 bg-red-700/80"></div>
                <Heart className="w-3.5 h-3.5 text-red-650 fill-red-650 animate-pulse" />
                <div className="h-[1px] w-6 bg-red-700/80"></div>
              </div>
            </div>

            <div className="space-y-4 max-w-xl mx-auto relative z-10 select-none py-12">
              <span className="text-[10px] tracking-[0.25em] font-extrabold text-[#dfb76c] uppercase font-mono block">
                THE WEDDING OF
              </span>
              
              <div className="space-y-2">
                <h1 className="font-serif text-3xl sm:text-5xl font-black tracking-wide text-white leading-tight">
                  {settings?.coupleDisplayTitle || 'Hanum & Luthfi'}
                </h1>
                <p className="text-[10px] sm:text-xs text-stone-300 tracking-wider font-mono uppercase bg-black/40 backdrop-blur-xs py-1.5 px-4 rounded-full inline-block border border-white/5">
                  Muhammad Luthfi, S.Pd. &amp; Hanum Muftiani, S.Kom.
                </p>
              </div>

              <div className="w-8 h-[1.5px] bg-red-700 mx-auto my-2"></div>

              <p className="text-[9px] text-slate-350 max-w-sm mx-auto leading-relaxed font-mono tracking-widest uppercase bg-black/20 backdrop-blur-xs p-2 rounded-xl">
                PUTRA DARI BAPAK H. ABDURRAHMAN &amp; IBU HJ. AMINAH
                <br />
                <span className="text-red-500 font-bold">&amp;</span>
                <br />
                PUTRI PERTAMA DARI BAPAK H. BAMBANG SUSILO &amp; IBU HJ. HARTATI
              </p>
            </div>

            {/* Float Seat Admission and Countdown inside cover */}
            <div className="w-full max-w-md mx-auto space-y-4 relative z-10">
              <div className="p-4 bg-black/50 backdrop-blur-md rounded-2xl border border-white/5 shadow-2xl text-left font-mono relative overflow-hidden">
                <div className="absolute right-4 bottom-4 text-5xl opacity-5 pointer-events-none">
                  {selectedAvatar.startsWith('http') ? (
                    <img src={selectedAvatar} alt="" className="w-12 h-12 object-cover rounded-full opacity-10" />
                  ) : (
                    selectedAvatar
                  )}
                </div>
                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[7px] text-red-500 font-extrabold tracking-[0.2em] block uppercase font-mono">CINEMA GATEKEEPER PASS</span>
                    <h4 className="text-xs font-bold font-sans text-white flex items-center gap-1.5 pt-0.5">
                      <div className="w-5 h-5 rounded-full overflow-hidden shrink-0 bg-neutral-900 border border-white/10">
                        {getAvatarView(selectedAvatar)}
                      </div>
                      <span>{toGuest ? toGuest : 'Tamu Undangan'}</span>
                    </h4>
                    <span className="text-[7.5px] text-stone-450 block tracking-wider pt-0.5">Hadir Sebagai: <strong className="text-stone-300 font-bold">{selectedProfileName}</strong></span>
                  </div>
                  
                  <div className="text-right shrink-0">
                    <span className="text-[7px] text-stone-500 block uppercase tracking-widest font-bold">VIP SEAT PASS</span>
                    <span className="text-10px text-[#dfb76c] font-black">{myTicket ? myTicket.seatNumber : 'VIP-A11'}</span>
                  </div>
                </div>
              </div>

              {/* Event Countdown Timers block inside cover banner bottom */}
              <div className="grid grid-cols-4 gap-2.5 max-w-sm mx-auto font-mono text-[#dfb76c] font-bold bg-[#030303]/60 backdrop-blur-md border border-white/5 p-3 rounded-2xl shadow-xl">
                <div className="bg-black/60 border border-neutral-900/60 rounded-xl p-2 flex flex-col justify-center items-center">
                  <span className="text-lg font-black text-white">{timeLeft.days}</span>
                  <span className="text-[7px] text-stone-500 font-bold uppercase tracking-wider mt-1">HARI</span>
                </div>
                <div className="bg-black/60 border border-neutral-900/60 rounded-xl p-2 flex flex-col justify-center items-center">
                  <span className="text-lg font-black text-white">{timeLeft.hours}</span>
                  <span className="text-[7px] text-stone-500 font-bold uppercase tracking-wider mt-1">JAM</span>
                </div>
                <div className="bg-black/60 border border-neutral-900/60 rounded-xl p-2 flex flex-col justify-center items-center">
                  <span className="text-lg font-black text-white">{timeLeft.minutes}</span>
                  <span className="text-[7px] text-stone-500 font-bold uppercase tracking-wider mt-1">MENIT</span>
                </div>
                <div className="bg-[#821E1E]/50 border border-red-950 rounded-xl p-2 flex flex-col justify-center items-center animate-pulse">
                  <span className="text-lg font-black text-white">{timeLeft.seconds}</span>
                  <span className="text-[7px] text-red-450 font-bold uppercase tracking-wider mt-1">DETIK</span>
                </div>
              </div>
            </div>
          </section>
        );
      })}

      {/* Content wrapper */}
      <div id="premiere-content" className="max-w-3xl mx-auto px-4 md:px-0 pt-6 space-y-20 relative">
        
        {/* Render each dynamic section in order */}
        {sections.filter(s => s.isEnabled && s.type !== 'cover').map((sec) => {
          if (sec.type === 'movie_poster') {
            return (
              <section key={sec.id} className="space-y-6">
                <div className="flex items-end justify-between pb-2">
                  <div>
                    <span className="text-[10px] text-stone-500 font-bold uppercase tracking-wider block font-mono">NOW SHOWING</span>
                    <h3 className="text-2xl font-serif text-white font-black mt-1">Kisah Cinta Kami</h3>
                  </div>
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => {
                        setCarouselIdx(p => (p - 1 + CINEMATIC_CHAPTERS.length) % CINEMATIC_CHAPTERS.length);
                        setVideoPlaying(false);
                      }}
                      className="w-10 h-10 rounded-full bg-neutral-900 shadow-md flex items-center justify-center hover:bg-neutral-850 active:scale-95 transition text-stone-400 hover:text-white"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => {
                        setCarouselIdx(p => (p + 1) % CINEMATIC_CHAPTERS.length);
                        setVideoPlaying(false);
                      }}
                      className="w-10 h-10 rounded-full bg-neutral-900 shadow-md flex items-center justify-center hover:bg-neutral-850 active:scale-95 transition text-stone-400 hover:text-white"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* 3D stacked movie poster carousel container */}
                <div className="relative w-full overflow-hidden py-4 select-none">
                  <div className="flex justify-center items-center h-[340px] relative">
                    {CINEMATIC_CHAPTERS.map((chap, idx) => {
                      const total = CINEMATIC_CHAPTERS.length;
                      let offset = idx - carouselIdx;
                      // Handle modular wrap-around for infinite carousel loop
                      if (offset > total / 2) {
                        offset -= total;
                      } else if (offset < -total / 2) {
                        offset += total;
                      }
                      
                      const isActive = idx === carouselIdx;
                      
                      if (Math.abs(offset) > 2) return null;
 
                      let styleClass = "";
                      if (isActive) {
                        styleClass = "scale-100 z-30 opacity-100 translate-x-0 pointer-events-auto shadow-[0_0_45px_rgba(130,30,30,0.85)]";
                      } else if (offset === -1) {
                        styleClass = "scale-80 z-20 opacity-50 -translate-x-[110px] sm:-translate-x-[150px] pointer-events-none";
                      } else if (offset === 1) {
                        styleClass = "scale-80 z-20 opacity-50 translate-x-[110px] sm:translate-x-[150px] pointer-events-none";
                      } else if (offset === -2) {
                        styleClass = "scale-65 z-10 opacity-20 -translate-x-[170px] sm:-translate-x-[230px] pointer-events-none";
                      } else if (offset === 2) {
                        styleClass = "scale-65 z-10 opacity-20 translate-x-[170px] sm:translate-x-[230px] pointer-events-none";
                      }
 
                      return (
                        <div
                          key={chap.title}
                          className={`absolute w-[185px] h-[265px] sm:w-[220px] sm:h-[310px] rounded-[24px] overflow-hidden transition-all duration-500 ease-out flex flex-col justify-between p-4 bg-neutral-900 ${styleClass}`}
                        >
                          {/* Poster Background */}
                          <div className="absolute inset-0 z-0">
                            <img src={chap.image} alt={chap.title} className="w-full h-full object-cover opacity-75" referrerPolicy="no-referrer" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                          </div>
 
                          {/* Header badge inside card */}
                          <div className="z-10 bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-full w-fit text-[7.5px] tracking-wider uppercase font-mono font-black text-[#dfb76c] shadow-sm">
                            {chap.subtitle}
                          </div>
 
                          {/* Center Play button */}
                          {isActive && (
                            <div className="z-10 absolute inset-0 flex items-center justify-center">
                              <button 
                                onClick={() => setVideoPlaying(!videoPlaying)}
                                className="w-14 h-14 rounded-full bg-[#821E1E]/95 text-white flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition cursor-pointer"
                              >
                                {videoPlaying ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white pl-0.5" />}
                              </button>
                            </div>
                          )}
 
                          {/* Bottom metadata */}
                          <div className="z-10 space-y-1">
                            <h4 className="text-white text-xs sm:text-sm font-black tracking-wide leading-tight">{chap.title}</h4>
                            <span className="text-[7.5px] tracking-widest text-[#dfb76c] uppercase font-mono block">{chap.genre}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
 
                  {/* Dot sliders */}
                  <div className="flex gap-2 justify-center py-2">
                    {CINEMATIC_CHAPTERS.map((_, dotIdx) => (
                      <button
                        key={dotIdx}
                        onClick={() => {
                          setCarouselIdx(dotIdx);
                          setVideoPlaying(false);
                        }}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          dotIdx === carouselIdx ? 'w-6 bg-[#821E1E]' : 'w-1.5 bg-neutral-800'
                        }`}
                      />
                    ))}
                  </div>
                </div>
 
                {/* Simulated inline Video Playback */}
                {videoPlaying && (
                  <div className="p-4 bg-neutral-900/40 backdrop-blur-md rounded-2xl text-center shadow-[0_25px_60px_rgba(0,0,0,0.85)] animate-[fadeIn_0.3s_ease-out] space-y-2 max-w-xl mx-auto">
                    <video 
                      src={CINEMATIC_CHAPTERS[carouselIdx].videoUrl} 
                      controls 
                      autoPlay
                      className="w-full h-auto max-h-72 rounded-xl bg-black shadow-inner"
                    />
                    <p className="text-[10px] text-[#dfb76c] font-mono uppercase tracking-widest mt-1">
                      NOW PLAYING: CHAPTER {carouselIdx + 1} - "{CINEMATIC_CHAPTERS[carouselIdx].quote}"
                    </p>
                  </div>
                )}

                {/* Classic Quote Frame (Image 2) */}
                <div className="max-w-xl mx-auto p-6 rounded-3xl bg-neutral-950/60 shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-xs text-center space-y-4">
                  <p className="text-xs sm:text-sm italic font-serif leading-relaxed text-stone-200">
                    "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang."
                  </p>
                  <div className="w-12 h-[1px] bg-red-700 mx-auto"></div>
                  <span className="text-[10px] uppercase tracking-widest font-mono font-bold text-red-500 block">- QS. AR-RUM: 21</span>

                  <p className="text-[11px] italic font-serif text-slate-400 pt-2 leading-relaxed max-w-md mx-auto">
                    "Sebagaimana kapal nabi Nuh, ia akan mengikuti arus cinta hingga ke tempat yang tinggi, berlabuh diteduhnya rukun barakah sakinah."
                  </p>
                </div>
              </section>
            );
          }

          // ==========================================
          // 2.C SECTION TYPE: BRIDE PROFILE
          // ==========================================
          if (sec.type === 'bride') {
            return (
              <section key={sec.id} className="space-y-6">
                <div className="text-center">
                  <span className="text-[10px] text-red-500 font-extrabold uppercase tracking-widest block font-mono">INTRODUCING THE CAST</span>
                  <h2 className="text-2xl font-serif text-white font-black mt-1">Mempelai Wanita</h2>
                </div>

                <div className="bg-neutral-950 p-6 sm:p-8 rounded-[32px] max-w-xl mx-auto flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left shadow-[0_25px_55px_rgba(0,0,0,0.7)] relative overflow-hidden">
                  <div className="absolute right-4 top-4 text-[#dfb76c]/5 font-serif text-8xl font-black pointer-events-none select-none">H</div>
                  
                  {/* Photo crop */}
                  <div className="w-32 h-32 rounded-full overflow-hidden shrink-0 shadow-xl bg-neutral-900">
                    <img 
                      src={sec.mediaUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250"} 
                      alt="The Bride Siti Hanum Handayani" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* text */}
                  <div className="space-y-3 relative z-10">
                    <span className="inline-block text-[9px] bg-red-950/60 text-[#dfb76c] px-3 py-1 rounded-full font-extrabold uppercase tracking-widest font-mono">
                      {sec.subtitle || 'Siti Hanum Handayani, S.Kom.'}
                    </span>
                    <h3 className="text-xl font-serif font-black text-white">
                      {sec.title}
                    </h3>
                    <p className="text-xs text-stone-300 leading-relaxed font-sans">
                      {sec.description}
                    </p>
                  </div>
                </div>
              </section>
            );
          }

          // ==========================================
          // 2.D SECTION TYPE: GROOM PROFILE
          // ==========================================
          if (sec.type === 'groom') {
            return (
              <section key={sec.id} className="space-y-6">
                <div className="text-center">
                  <span className="text-[10px] text-red-500 font-extrabold uppercase tracking-widest block font-mono">INTRODUCING THE CAST</span>
                  <h2 className="text-2xl font-serif text-white font-black mt-1">Mempelai Pria</h2>
                </div>

                <div className="bg-neutral-950 p-6 sm:p-8 rounded-[32px] max-w-xl mx-auto flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left shadow-[0_25px_55px_rgba(0,0,0,0.7)] relative overflow-hidden">
                  <div className="absolute right-4 top-4 text-red-800/10 font-serif text-8xl font-black pointer-events-none select-none">L</div>
                  
                  {/* Photo crop */}
                  <div className="w-32 h-32 rounded-full overflow-hidden shrink-0 shadow-xl bg-neutral-900">
                    <img 
                      src={sec.mediaUrl || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=250"} 
                      alt="The Groom Muhammad Luthfi" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* text */}
                  <div className="space-y-3 relative z-10">
                    <span className="inline-block text-[9px] bg-red-950/60 text-[#dfb76c] px-3 py-1 rounded-full font-extrabold uppercase tracking-widest font-mono">
                      {sec.subtitle || 'Muhammad Luthfi, S.Pd.'}
                    </span>
                    <h3 className="text-xl font-serif font-black text-white">
                      {sec.title}
                    </h3>
                    <p className="text-xs text-stone-300 leading-relaxed font-sans">
                      {sec.description}
                    </p>
                  </div>
                </div>
              </section>
            );
          }

          // ==========================================
          // 2.E SECTION TYPE: LOVE STORY
          // ==========================================
          if (sec.type === 'story') {
            return (
              <section key={sec.id} className="space-y-6">
                <div className="text-center">
                  <h2 className="wedding-font-serif text-2xl font-extrabold text-[#dfb76c]">
                    {sec.title}
                  </h2>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                    {sec.subtitle || 'Our Love Story'}
                  </p>
                </div>

                <div className="p-6 sm:p-8 bg-neutral-950/60 rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.6)] transition max-w-xl mx-auto">
                  <p className="text-xs text-stone-200 leading-relaxed italic text-center">
                    "{sec.description}"
                  </p>
                </div>
              </section>
            );
          }

          // ==========================================
          // 2.F SECTION TYPE: GALLERY SHOWCASE
          // ==========================================
          if (sec.type === 'gallery') {
            const galleryImages = [
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

            const getSpanClass = (idx: number) => {
              switch (idx) {
                case 0: return 'col-span-2 row-span-2';
                case 1: return 'col-span-1 row-span-1';
                case 2: return 'col-span-1 row-span-1';
                case 3: return 'col-span-1 row-span-2';
                case 4: return 'col-span-2 row-span-1';
                case 5: return 'col-span-1 row-span-1';
                case 6: return 'col-span-1 row-span-1';
                case 7: return 'col-span-2 row-span-1';
                case 8: return 'col-span-1 row-span-2';
                case 9: return 'col-span-2 row-span-1';
                case 10: return 'col-span-1 row-span-1';
                case 11: return 'col-span-2 row-span-1';
                default: return 'col-span-1 row-span-1';
              }
            };

            return (
              <section key={sec.id} className="space-y-6">
                <div className="text-center">
                  <h2 className="wedding-font-serif text-2xl font-extrabold text-[#dfb76c]">
                    {sec.title}
                  </h2>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                    {sec.subtitle || 'Prewedding Photo Gallery'}
                  </p>
                </div>

                {/* Asymmetric Bento / Masonry Grid without empty gaps */}
                <div className="grid grid-cols-3 gap-3 auto-rows-[120px] sm:auto-rows-[150px]">
                  {galleryImages.map((img, index) => (
                    <div 
                      key={index} 
                      onClick={() => setLightboxImage(img)}
                      className={`${getSpanClass(index)} relative group rounded-2xl overflow-hidden hover:scale-[1.03] hover:ring-2 hover:ring-[#dfb76c]/40 hover:shadow-[0_15px_30px_rgba(130,30,30,0.4)] transition-all duration-300 cursor-pointer shadow-md bg-neutral-900`}
                    >
                      <img 
                        src={img} 
                        alt="Prewedding item" 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                      {/* Interactive Hover Overlay (Upgraded Anim) */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300 flex items-center gap-1.5 bg-black/60 backdrop-blur-xs px-3 py-1.5 rounded-full border border-white/10">
                          <Compass className="w-3.5 h-3.5 text-[#dfb76c] animate-[spin_5s_linear_infinite]" />
                          <span className="text-[10px] tracking-wider text-stone-200 font-mono font-bold uppercase">VIEW PHOTO</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Lightbox Modal */}
                {lightboxImage && (
                  <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-sm flex items-center justify-center p-4">
                    <button 
                      onClick={() => setLightboxImage(null)}
                      className="absolute top-5 right-5 w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center shadow hover:bg-slate-800 cursor-pointer"
                    >
                      ✕
                    </button>
                    <img 
                      src={lightboxImage} 
                      alt="Lightbox visual prewedding" 
                      className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
                    />
                  </div>
                )}
              </section>
            );
          }

          // ==========================================
          // 2.G SECTION TYPE: TIMELINE EVENT INFO & MAPS
          // ==========================================
          if (sec.type === 'timeline') {
            return (
              <section key={sec.id} className="space-y-6">
                <div className="text-center">
                  <span className="text-[10px] text-red-500 font-extrabold uppercase tracking-widest block font-mono">TIMELINE SCHEDULE</span>
                  <h2 className="text-2xl font-serif text-white font-black mt-1">Jadwal Acara Premiere</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Item 1: Akad */}
                  <div className="bg-neutral-950 p-6 rounded-[28px] relative text-center space-y-4 shadow-[0_20px_50px_rgba(0,0,0,0.65)]">
                    <div className="w-12 h-12 rounded-full bg-[#821E1E]/20 text-[#dfb76c] flex items-center justify-center mx-auto shadow-md">
                      <Users className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-serif text-base font-bold text-white">Akad Nikah</h3>
                      <p className="text-[9px] text-red-500 font-mono font-bold uppercase tracking-widest">AKAD PEMBUKA</p>
                    </div>
                    <div className="w-10 h-[1px] bg-[#dfb76c]/40 mx-auto"></div>
                    
                    <div className="space-y-2 text-xs text-stone-300 font-mono">
                      <div className="flex items-center justify-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#dfb76c]" />
                        <span>Minggu, 13 September 2026</span>
                      </div>
                      <div className="flex items-center justify-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#dfb76c]" />
                        <span>08:00 - 10:00 WIB</span>
                      </div>
                      <p className="text-[11px] leading-relaxed italic not-mono text-stone-400">
                        Masjid Agung Al-Fatih, Jl. Siliwangi No. 12, Bandung
                      </p>
                    </div>
                  </div>

                  {/* Item 2: Resepsi */}
                  <div className="bg-neutral-950 p-6 rounded-[28px] relative text-center space-y-4 shadow-[0_20px_50px_rgba(0,0,0,0.65)]">
                    <div className="w-12 h-12 rounded-full bg-red-950/40 text-[#dfb76c] flex items-center justify-center mx-auto shadow-md">
                      <Users2 className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-serif text-base font-bold text-white">Resepsi Nikah</h3>
                      <p className="text-[9px] text-red-500 font-mono font-bold uppercase tracking-widest">THE SHOWTIME</p>
                    </div>
                    <div className="w-10 h-[1px] bg-[#dfb76c]/40 mx-auto"></div>

                    <div className="space-y-2 text-xs text-stone-300 font-mono">
                      <div className="flex items-center justify-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#dfb76c]" />
                        <span>Minggu, 13 September 2026</span>
                      </div>
                      <div className="flex items-center justify-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#dfb76c]" />
                        <span>11:00 - 16:00 WIB</span>
                      </div>
                      <p className="text-[11px] leading-relaxed italic not-mono text-stone-400">
                        Gedung Bale Pertiwi Indah, Raya Cipaganti, Bandung
                      </p>
                    </div>
                  </div>
                </div>

                {/* Real-time Address Peta layout */}
                <div className="bg-neutral-950 rounded-[28px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.65)]">
                  <div className="bg-neutral-900 px-4 py-3.5 flex items-center justify-between text-xs font-bold font-mono">
                    <span className="flex items-center gap-1.5 text-[#dfb76c]">
                      <Map className="w-4 h-4 text-[#dfb76c]" />
                      <span>LIVE DIRECTIONS MAP</span>
                    </span>
                    <a 
                      href="https://maps.google.com" 
                      target="_blank" 
                      rel="noreferrer"
                      className="text-red-500 font-black uppercase text-[9px] tracking-wider"
                    >
                      Google Maps Asli ↗
                    </a>
                  </div>
                  <div className="h-44 bg-neutral-900 relative overflow-hidden flex items-center justify-center p-4">
                    <img 
                      src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800" 
                      alt="Address map preview background" 
                      className="absolute inset-0 w-full h-full object-cover opacity-10"
                      referrerPolicy="no-referrer"
                    />
                    <div className="p-4 bg-neutral-950/95 rounded-2xl max-w-sm text-center relative z-10 space-y-2.5 shadow-xl">
                      <span className="text-[8px] bg-red-950 text-[#dfb76c] px-2.5 py-0.5 rounded font-bold uppercase tracking-widest font-mono shadow-sm">MAP POINT VENUE</span>
                      <h4 className="text-xs font-bold text-white">Gedung Bale Pertiwi Indah, Bandung</h4>
                      <p className="text-[10px] text-stone-300 leading-relaxed">Raya Cipaganti, Bandung, Jawa Barat (lokasi strategis dekat pusat kota).</p>
                      
                      <div className="flex items-center justify-center gap-1.5 pt-1.5 font-mono">
                        <button 
                          onClick={() => handleCopy('-6.8912, 107.6045', 'gps')}
                          className="px-3 py-1 bg-neutral-900 text-[9.5px] font-bold text-stone-300 rounded-md hover:bg-neutral-850 shadow-md"
                        >
                          {copiedAccount === 'gps' ? 'Tersalin' : 'Copy GPS Koordinat'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI ROUTE ASSISTANT (CO-PILOT CONCIERGE) */}
                <div className="bg-neutral-950 rounded-[28px] p-5 space-y-4 text-xs shadow-[0_20px_50px_rgba(0,0,0,0.65)]">
                  <div className="flex items-center gap-1.5">
                    <Compass className="w-5 h-5 text-red-500 animate-pulse" />
                    <span className="text-[9px] font-black uppercase tracking-widest font-mono text-stone-400">🧭 CO-PILOT ASISTEN RUTE CERDAS (AI COMPASS)</span>
                  </div>

                  <p className="text-[10.5px] text-stone-300 leading-relaxed font-sans">
                    Masukkan asal lokasi atau perkiraan sarana kendaraan Anda secara spesifik untuk kalkulasi arah rute terbaik, durasi waktu cepat, serta anjuran berangkat ke lokasi (Bandung).
                  </p>

                  <form onSubmit={async (e) => {
                    e.preventDefault();
                    if (!routeStartLocation.trim()) return;
                    setRouteLoading(true);
                    try {
                      const response = await fetch('/api/wedding/route-assistant', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ startLocation: routeStartLocation })
                      });
                      if (response.ok) {
                        const data = await response.json();
                        setRoutePlanning(data);
                      } else {
                        setRoutePlanning({
                          recommendedRoute: 'Gunakan Jl. Dr. Djunjunan langsung mengarah ke Flyover Pasupati, ambil jalur keluar Cipaganti lurus terus hingga lokasi Gedung.',
                          estimatedTime: '25 Menit',
                          suggestedDeparture: '10:15 WIB (Disarankan berangkat awal menghindari macet akhir pekan)'
                        });
                      }
                    } catch {
                      setRoutePlanning({
                        recommendedRoute: 'Gunakan Jl. Dr. Djunjunan langsung mengarah ke Flyover Pasupati, ambil jalur keluar Cipaganti lurus terus hingga lokasi Gedung.',
                        estimatedTime: '25 Menit',
                        suggestedDeparture: '10:15 WIB (Disarankan berangkat awal menghindari macet akhir pekan)'
                      });
                    } finally {
                      setRouteLoading(false);
                    }
                  }} className="flex gap-2">
                    <input 
                      type="text" 
                      required
                      placeholder="Contoh: Dari Pasteur naik mobil / Dari Dago"
                      className="flex-1 px-3 py-2 border border-neutral-800 bg-neutral-900 rounded-xl focus:outline-none focus:border-[#dfb76c] text-[11px] text-white"
                      value={routeStartLocation}
                      onChange={(e) => setRouteStartLocation(e.target.value)}
                    />
                    <button 
                      type="submit" 
                      disabled={routeLoading}
                      className="px-4 py-2 bg-[#821E1E] text-white font-extrabold uppercase rounded-xl tracking-widest text-[8px] hover:bg-red-700 transition flex items-center gap-1 cursor-pointer disabled:opacity-40"
                    >
                      {routeLoading ? 'KALKULASI...' : 'INPUT AI'}
                    </button>
                  </form>

                  {routePlanning && (
                    <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-2xl space-y-3 animate-[fadeIn_0.2s_ease-out]">
                      <div className="grid grid-cols-2 gap-3 text-center border-b border-white/5 pb-3 font-mono">
                        <div className="border-r border-white/5">
                          <span className="text-[7.5px] text-stone-500 font-bold uppercase tracking-wider block">⏱ ESTIMASI DURASI</span>
                          <span className="text-xs font-black text-[#dfb76c] block mt-1">{routePlanning.estimatedTime}</span>
                        </div>
                        <div>
                          <span className="text-[7.5px] text-stone-500 font-bold uppercase tracking-wider block">🕰 WAKTU BERANGKAT ANJURAN</span>
                          <span className="text-xs font-black text-red-500 block mt-1">{routePlanning.suggestedDeparture}</span>
                        </div>
                      </div>

                      <div>
                        <span className="text-[8px] text-[#dfb76c] font-black uppercase tracking-widest font-mono block mb-1">🛣 JALUR UTAMA REKOMENDASI AI:</span>
                        <p className="text-[10.5px] text-stone-300 leading-relaxed font-mono">
                          {routePlanning.recommendedRoute}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </section>
            );
          }

          // ==========================================
          // 2.H SECTION TYPE: SMART SEATING RSVP
          // ==========================================
          if (sec.type === 'rsvp') {
            return (
              <section key={sec.id} className="space-y-6">
                <div className="text-center">
                  <span className="text-[10px] text-red-500 font-extrabold uppercase tracking-widest block font-mono">SEATING REGISTRATION</span>
                  <h2 className="text-2xl font-serif text-white font-black mt-1">
                    {sec.title}
                  </h2>
                </div>

                <div className="bg-neutral-950 p-6 sm:p-8 rounded-[32px] border border-neutral-800 max-w-xl mx-auto shadow-2xl space-y-6">
                  <p className="text-xs text-stone-400 leading-relaxed text-center">
                    {sec.description || 'Konfirmasi reservasi kehadiran Anda untuk verifikasi boarding-pass dan alokasi tempat duduk VIP.'}
                  </p>

                  {rsvpSent && myTicket ? (
                    <div className="space-y-5 animate-[fadeIn_0.3s_ease-out]">
                      <div className="p-4 bg-red-950/40 border border-red-900/60 text-stone-200 font-bold rounded-2xl text-xs flex items-center gap-2.5">
                        <Check className="w-5 h-5 text-red-500 shrink-0" />
                        <span>KEHADIRAN DIKONFIRMASI! E-Ticket premiere bioskop Anda siap diunduh & digunakan.</span>
                      </div>

                      {/* Display beautiful confirmed cinema ticket */}
                      <div className="bg-neutral-900 rounded-2xl border border-red-900/60 text-slate-100 font-mono text-xs overflow-hidden shadow-2xl">
                        <div className="bg-black border-b border-neutral-800 px-4 py-3.5 flex justify-between items-center text-[9px]">
                          <span className="text-[#dfb76c] font-black tracking-widest">VIP ADMISSION PASS</span>
                          <span className="text-red-500 font-black">{myTicket.ticketNumber}</span>
                        </div>

                        <div className="p-4 grid grid-cols-2 gap-4 text-center">
                          <div className="border-r border-neutral-800 p-2">
                            <span className="text-[8px] text-stone-500 font-bold uppercase block tracking-wider">RECIPIENT NAME</span>
                            <span className="text-white font-bold block mt-1 truncate">{myTicket.guestName}</span>
                          </div>
                          <div className="p-2">
                            <span className="text-[8px] text-stone-500 font-bold uppercase block tracking-wider">SEAT ROW / NO</span>
                            <span className="text-[#dfb76c] font-black block mt-1">{myTicket.seatNumber}</span>
                          </div>

                          <div className="border-r border-neutral-800 p-2 border-t border-neutral-800">
                            <span className="text-[8px] text-stone-500 font-bold uppercase block tracking-wider">BOOKING SESSION</span>
                            <span className="text-white font-bold block mt-1 truncate text-[10px]">{myTicket.session}</span>
                          </div>
                          <div className="p-2 border-t border-neutral-800">
                            <span className="text-[8px] text-stone-500 font-bold uppercase block tracking-wider">VISITOR PAX</span>
                            <span className="text-white font-bold block mt-1">{myTicket.guestsCount} Pax</span>
                          </div>
                        </div>

                        <div className="bg-black px-4 py-4 flex flex-col items-center gap-2 border-t border-dashed border-red-900/40">
                          <img 
                            src={myTicket.qrCodeUrl} 
                            alt="QR Invitation ticket barcode" 
                            className="w-24 h-24 bg-white p-1 rounded-lg"
                          />
                          <span className="text-[8px] text-stone-500 uppercase tracking-widest font-bold">Tunjukkan barcode di atas saat di pintu utama.</span>
                        </div>
                      </div>

                    </div>
                  ) : (
                    <form onSubmit={handleRSVPBooking} className="space-y-4 text-xs text-stone-300">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-stone-400 font-bold mb-1">Kehadiran Berkenan Hadir?</label>
                          <select
                            className="w-full px-3 py-2 border border-neutral-850 bg-neutral-900 text-white rounded-lg font-bold"
                            value={rsvpForm.attendance}
                            onChange={(e) => setRsvpForm({ ...rsvpForm, attendance: e.target.value as any })}
                          >
                            <option value="hadir">Yth. Berkenan Hadir</option>
                            <option value="tidak_hadir">Berhalangan Hadir</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-stone-400 font-bold mb-1">Pilih Sesi Resepsi</label>
                          <select
                            className="w-full px-3 py-2 border border-neutral-850 bg-neutral-900 text-white rounded-lg font-bold"
                            value={rsvpForm.session}
                            onChange={(e) => setRsvpForm({ ...rsvpForm, session: e.target.value })}
                          >
                            <option value="Sesi 1 (Akad & Opening VIP)">Sesi 1 (Akad & Opening): 10:00 - 12:00 WIB</option>
                            <option value="Sesi 2 (Resepsi VIP Premiere)">Sesi 2 (Resepsi Premiere): 13:00 - 15:00 WIB</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-stone-400 font-bold mb-1">Jumlah Tamu (Max 4 Pax)</label>
                          <input 
                            type="number"
                            min={1} 
                            max={4}
                            className="w-full px-3 py-2 border border-neutral-850 bg-neutral-900 text-white rounded-lg font-bold"
                            value={rsvpForm.guestsCount}
                            onChange={(e) => setRsvpForm({ ...rsvpForm, guestsCount: Number(e.target.value) })}
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-stone-400 font-bold mb-1">Nama Tamu Pemesan</label>
                          <input 
                            type="text" 
                            disabled 
                            className="w-full px-3 py-2 border border-neutral-850 bg-neutral-900 rounded-lg font-bold text-stone-500"
                            value={toGuest || 'Tamu Undangan'}
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3 bg-[#821E1E] text-white font-black tracking-widest uppercase rounded-xl hover:bg-red-700 cursor-pointer text-[10px] transform hover:-translate-y-0.5 transition"
                      >
                        PESAN TIKET ADMISSION & AMBIL NOMOR SEAT
                      </button>
                    </form>
                  )}
                </div>
              </section>
            );
          }

          // ==========================================
          // 2.I SECTION TYPE: DIGITAL SOUVENIR GACHA
               if (sec.type === 'gift') {
            return (
              <section key={sec.id} className="space-y-6">
                <div className="text-center">
                  <span className="text-[10px] text-red-500 font-extrabold uppercase tracking-widest block font-mono">EXCLUSIVE SOUVENIR</span>
                  <h2 className="text-2xl font-serif text-white font-black mt-1">
                    {sec.title}
                  </h2>
                </div>

                <div className="bg-neutral-950 p-6 sm:p-8 rounded-[32px] max-w-xl mx-auto shadow-[0_25px_60px_rgba(0,0,0,0.7)] text-center space-y-6 relative overflow-hidden">
                  {/* Glowing background highlights in Gacha box */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[#dfb76c]/5 rounded-full blur-2xl pointer-events-none"></div>

                  <p className="text-xs text-stone-400 leading-relaxed">
                    {sec.description || 'Ambil dan undilah souvenir digital spesial berhadiah menarik dari Hanum & Luthfi di bawah ini.'}
                  </p>

                  <div className="relative max-w-xs mx-auto">
                    {/* Spinning wheel / Box animation graphics */}
                    <div className="w-36 h-36 mx-auto bg-black rounded-full flex items-center justify-center relative shadow-inner overflow-hidden">
                      
                      {isSpinning ? (
                        <div className="absolute inset-0 border-4 border-dashed border-red-500 rounded-full animate-spin"></div>
                      ) : null}

                      {/* Content insides of box */}
                      <div className="text-center z-10 space-y-1">
                        {isSpinning ? (
                          <div className="space-y-1.5 animate-pulse">
                            <Sparkle className="w-6 h-6 text-red-500 animate-spin mx-auto" />
                            <span className="text-[8px] font-mono text-red-500 font-black tracking-widest block uppercase">DRAWING SEED...</span>
                          </div>
                        ) : gachaReward ? (
                          <span className="text-3xl">🎉</span>
                        ) : (
                          <div className="space-y-1">
                            <Gift className="w-8 h-8 text-[#dfb76c] mx-auto animate-bounce animate-duration-1000" />
                            <span className="text-[8px] font-mono text-stone-500 font-bold uppercase block tracking-widest">TAP SPIN BUTTON</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Draw button or Reward Card results */}
                  {gachaReward ? (
                    <div className="p-5 rounded-2xl bg-neutral-900 shadow-[0_15px_35px_rgba(0,0,0,0.5)] max-w-sm mx-auto space-y-3 animate-[fadeIn_0.3s_ease-out]">
                      <span className="text-[9px] bg-red-950 text-red-400 font-extrabold uppercase px-2.5 py-0.5 rounded-full font-mono tracking-widest">
                        MY EXCLUSIVE PRIZE DRAWN
                      </span>
                      
                      <div className="aspect-video w-full rounded-xl overflow-hidden bg-black shadow-inner">
                        <img 
                          src={gachaReward.imageUrl} 
                          alt="Gacha prize rewards background" 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      
                      <h4 className="text-sm font-black text-white">{gachaReward.title}</h4>
                      <p className="text-[11px] text-stone-300 leading-relaxed font-mono">{gachaReward.description}</p>
                      
                      <div className="text-[10px] text-emerald-500 font-bold font-mono">
                        ✓ Souvenir tervalidasi dan disimpan di boarding-pass tamu Anda.
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <button 
                        onClick={spinGacha}
                        disabled={isSpinning}
                        className="px-8 py-3 rounded-full bg-neutral-900 hover:bg-neutral-850 text-[#dfb76c] font-black tracking-widest uppercase text-[10px] cursor-pointer shadow-md transform hover:scale-[1.03] transition-all disabled:opacity-40"
                      >
                        {isSpinning ? 'MEMUTAR REEL SOUVENIR...' : 'ROLL SOUVENIR TICKET'}
                      </button>
                      <span className="block text-[8px] text-stone-500 font-medium font-mono uppercase tracking-widest">
                        Limit: 1x Draw untuk setiap tamu aktif!
                      </span>
                    </div>
                  )}

                  {/* Reward List is hidden for guests (Requirement 4) and editable in the Editor view */}

                </div>
              </section>
            );
          }

          // ==========================================
          // 2.J SECTION TYPE: INSTAGRAM STORY GUESTBOOK
          // ==========================================
          if (sec.type === 'guestbook') {
            const hasStories = guestBook.length > 0;
            const currentStory = hasStories ? guestBook[activeStoryIdx] : null;

            return (
              <React.Fragment key="thematic-dresscode">
                {/* DRESSCODE PALETTE */}
                <section className="space-y-6 select-none sm:py-6">
                  <div className="text-center">
                    <span className="text-[10px] text-red-500 font-extrabold uppercase tracking-widest block font-mono">DRESS CODE PALETTE</span>
                    <h2 className="text-2xl font-serif text-white font-black mt-1">
                      Dresscode Undangan
                    </h2>
                  </div>

                  <div className="bg-neutral-950 p-6 sm:p-8 rounded-[32px] text-stone-200 max-w-xl mx-auto shadow-[0_25px_60px_rgba(0,0,0,0.7)] space-y-6">
                    <p className="text-xs text-stone-400 leading-relaxed text-center font-sans">
                      Demi keselarasan visual dokumentasi pada penayangan perdana istimewa Hanum & Luthfi, para tamu undangan kehormatan disarankan mengenakan pakaian dengan nuansa palet warna berikut:
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div className="p-3 bg-neutral-900 rounded-2xl text-center space-y-2 flex flex-col items-center shadow-md">
                        <div className="w-10 h-10 rounded-full bg-[#FAECE1] shadow-inner"></div>
                        <span className="font-extrabold text-xs text-white">Warm Cream</span>
                        <span className="text-[8px] text-[#dfb76c] font-mono block uppercase font-bold">Keluarga</span>
                      </div>

                      <div className="p-3 bg-neutral-900 rounded-2xl text-center space-y-2 flex flex-col items-center shadow-md">
                        <div className="w-10 h-10 rounded-full bg-[#A2B8AA] shadow-inner"></div>
                        <span className="font-extrabold text-xs text-white">Sage Green</span>
                        <span className="text-[8px] text-[#dfb76c] font-mono block uppercase font-bold">Kerabat</span>
                      </div>

                      <div className="p-3 bg-neutral-900 rounded-2xl text-center space-y-2 flex flex-col items-center shadow-md">
                        <div className="w-10 h-10 rounded-full bg-[#AA8060] shadow-inner"></div>
                        <span className="font-extrabold text-xs text-white">Warm Brown</span>
                        <span className="text-[8px] text-[#dfb76c] font-mono block uppercase font-bold">Teman Kerja</span>
                      </div>

                      <div className="p-3 bg-neutral-900 rounded-2xl text-center space-y-2 flex flex-col items-center shadow-md">
                        <div className="w-10 h-10 rounded-full bg-[#821E1E] shadow-inner"></div>
                        <span className="font-extrabold text-xs text-white">Deep Maroon</span>
                        <span className="text-[8px] text-[#dfb76c] font-mono block uppercase font-bold">Tamu VIP</span>
                      </div>
                    </div>
                  </div>
                </section>

                {/* CERITA KECIL DARI SAHABAT avatar carousel rails */}
                <section className="space-y-4 select-none sm:py-6">
                  <div className="text-center">
                    <span className="text-[10px] text-red-500 font-extrabold uppercase tracking-widest block font-mono">FRIENDS REVIEW STORIES</span>
                    <h3 className="text-xl font-serif text-white font-black mt-1">Cerita Kecil Dari Sahabat</h3>
                  </div>
                  
                  {/* Scrollable round avatars train */}
                  <div className="flex gap-4 overflow-x-auto py-4 px-2 justify-start sm:justify-center scrollbar-hide max-w-xl mx-auto pb-6">
                    {/* Dynamic integration: Maps directly over guestBook messages! (Requirement 5) */}
                    {guestBook.map((story, idx) => (
                      <button 
                        key={story.id || idx}
                        onClick={() => {
                          setActiveStoryIdx(idx);
                          setStoryProgress(0); // Reset IG-story timer progress bar on user tap
                        }}
                        className={`flex flex-col items-center gap-2 shrink-0 group focus:outline-none cursor-pointer transition-all ${
                          idx === activeStoryIdx ? 'scale-105' : 'opacity-70 hover:opacity-100'
                        }`}
                      >
                        <div className={`w-14 h-14 rounded-full p-0.5 bg-gradient-to-tr ${
                          idx === activeStoryIdx 
                            ? 'from-red-500 via-amber-500 to-yellow-400 ring-2 ring-[#dfb76c]' 
                            : 'from-neutral-700 via-neutral-600 to-stone-500'
                        } group-hover:scale-[1.05] transition-all shadow-md`}>
                          <div className="w-full h-full rounded-full overflow-hidden bg-neutral-900 flex items-center justify-center text-lg">
                            {getAvatarView(story.avatar)}
                          </div>
                        </div>
                        <div className="text-center">
                          <span className="text-[10.5px] font-black text-stone-200 block max-w-[80px] truncate">{story.name}</span>
                          <span className="text-[8px] font-mono text-red-500 block uppercase font-bold tracking-wider">{story.relation || 'Sahabat'}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </section>

                <section key={sec.id} className="space-y-6">
                  <div className="text-center">
                    <span className="text-[10px] text-red-500 font-extrabold uppercase tracking-widest block font-mono">CINEMATIC CAROUSEL GUESTBOOK</span>
                    <h2 className="text-2xl font-serif text-white font-black mt-1">
                      {sec.title}
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                    
                    {/* IG Story Carousel Active Player Component */}
                    <div className="md:col-span-7 select-none">
                      <div className="relative bg-[#090909] aspect-[9/16] max-w-[300px] mx-auto rounded-[32px] overflow-hidden shadow-2xl border border-[#dfb76c]/15 flex flex-col justify-between p-5 text-slate-100">
                        
                        {/* Top Story Progressive bar list */}
                        <div className="flex gap-1 z-10">
                          {hasStories && guestBook.map((_, idx) => (
                            <div key={idx} className="h-0.5 flex-1 bg-stone-900 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-red-500 to-amber-500 transition-all duration-75"
                                style={{ 
                                  width: idx === activeStoryIdx 
                                    ? `${storyProgress}%` 
                                    : idx < activeStoryIdx 
                                    ? '100%' 
                                    : '0%' 
                                }}
                              />
                            </div>
                          ))}
                        </div>

                        {/* Active Guest Info top tag */}
                        {currentStory && (
                          <div className="flex items-center justify-between z-10 mt-3 bg-neutral-950 p-2 rounded-xl border border-neutral-800">
                            <div className="flex items-center gap-2 text-xs">
                              <div className="w-8 h-8 rounded-full border border-red-900/60 overflow-hidden flex items-center justify-center bg-black shrink-0 select-none">
                                {getAvatarView(currentStory.avatar)}
                              </div>
                              <div>
                                <div className="font-black text-white truncate max-w-[130px] leading-none">
                                  {currentStory.name}
                                </div>
                                <span className="text-[8px] text-[#dfb76c] uppercase font-bold tracking-widest block font-mono mt-0.5">
                                  {currentStory.relation}
                                </span>
                              </div>
                            </div>
                            
                            <span className="text-[7.5px] text-stone-500 font-bold uppercase tracking-widest font-mono">
                              {new Date(currentStory.createdAt).toLocaleDateString('id-ID')}
                            </span>
                          </div>
                        )}

                        {/* Left/Right click triggers zone */}
                        <div className="absolute inset-y-0 left-0 w-1/4 z-20 cursor-w-resize" onClick={() => {
                          if (hasStories) {
                            setActiveStoryIdx(prev => (prev === 0 ? guestBook.length - 1 : prev - 1));
                            setStoryProgress(0);
                          }
                        }}></div>
                        <div className="absolute inset-y-0 right-0 w-1/4 z-20 cursor-e-resize" onClick={() => {
                          if (hasStories) {
                            setActiveStoryIdx(prev => (prev + 1) % guestBook.length);
                            setStoryProgress(0);
                          }
                        }}></div>

                        {/* Center Content Message */}
                        <div className="flex-1 flex flex-col justify-center items-center px-4 text-center z-10">
                          {currentStory ? (
                            <div className="space-y-4 max-w-[220px]">
                              <h4 className="text-sm font-black text-[#dfb76c] uppercase tracking-wider leading-relaxed">
                                "{currentStory.message}"
                              </h4>
                              <div className="w-8 h-[1px] bg-[#dfb76c]/20 mx-auto"></div>
                              <p className="text-xs text-stone-300 leading-relaxed italic">
                                "{currentStory.prayer}"
                              </p>
                            </div>
                          ) : (
                            <div className="text-center space-y-2 text-stone-500">
                              <Smile className="w-8 h-8 text-[#821E1E] mx-auto animate-bounce" />
                              <p className="text-[10px] font-mono text-stone-400 font-bold uppercase tracking-widest">Belum ada ucapan</p>
                            </div>
                          )}
                        </div>

                        {/* Bottom AI Reply Overlay */}
                        {currentStory && currentStory.aiReply && (
                          <div className="z-10 bg-[#821E1E]/10 p-3 rounded-2xl border border-red-900/40 text-stone-200 leading-relaxed font-mono">
                            <div className="flex items-center gap-1.5 text-[8px] text-[#dfb76c] font-black tracking-widest uppercase mb-1">
                              <Sparkles className="w-3.5 h-3.5 text-[#dfb76c] fill-yellow-850" />
                              <span>AI WEDDING CO-HOST REPLY</span>
                            </div>
                            <p className="text-[10px] leading-relaxed text-stone-200">
                              "{currentStory.aiReply}"
                            </p>
                          </div>
                        )}

                      </div>

                      {/* Story Arrow Navigation indicators */}
                      <div className="flex items-center justify-center gap-4 mt-3">
                        <button 
                          onClick={() => {
                            if (hasStories) {
                              setActiveStoryIdx(prev => (prev === 0 ? guestBook.length - 1 : prev - 1));
                              setStoryProgress(0);
                            }
                          }}
                          className="w-8 h-8 rounded-full border border-neutral-800 bg-[#0c0c0c] hover:bg-neutral-900 shadow flex items-center justify-center text-white active:scale-90 transition cursor-pointer"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <span className="font-mono text-[9px] text-[#dfb76c] font-black uppercase">
                          {guestBook.length > 0 ? `${activeStoryIdx + 1} / ${guestBook.length} DOA` : '0 DOA'}
                        </span>
                        <button 
                          onClick={() => {
                            if (hasStories) {
                              setActiveStoryIdx(prev => (prev + 1) % guestBook.length);
                              setStoryProgress(0);
                            }
                          }}
                          className="w-8 h-8 rounded-full border border-neutral-800 bg-[#0c0c0c] hover:bg-neutral-900 shadow flex items-center justify-center text-white active:scale-90 transition cursor-pointer"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Form to post message & prayer wishes */}
                    <div className="md:col-span-5 bg-neutral-950 p-5 rounded-3xl border border-neutral-800 text-stone-300 text-xs shadow-2xl">
                      <h3 className="text-xs font-black uppercase tracking-widest text-red-500 mb-3 flex items-center gap-1.5 font-mono">
                        <Smile className="w-3.5 h-3.5" />
                        <span>KIRIM UCAPAN & DOA BERKAH</span>
                      </h3>

                      <form onSubmit={handleSendMessage} className="space-y-3">
                        <div>
                          <label className="block text-stone-400 mb-0.5 font-bold uppercase text-[8px] font-mono">Hubungan Kerabat</label>
                          <select 
                            className="w-full px-3 py-2 border border-neutral-850 bg-neutral-900 text-white rounded-lg font-black"
                            value={newMessage.relation}
                            onChange={(e) => setNewMessage({ ...newMessage, relation: e.target.value })}
                          >
                            <option value="Kerabat Dekat / Sahabat">Kerabat Dekat / Sahabat</option>
                            <option value="Keluarga Kandung / Besar">Keluarga Kandung / Besar</option>
                            <option value="Rekan Kerja SMAN">Rekan Kerja Guru Sekolah</option>
                            <option value="Tamu Kehormatan VIP">Tamu Kehormatan VIP</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-stone-400 mb-0.5 font-bold uppercase text-[8px] font-mono">Ucapan Selamat Utama</label>
                          <input 
                            type="text"
                            required
                            placeholder="Contoh: Happy wedding day Hanum & Luthfi!"
                            className="w-full px-3 py-2 border border-neutral-850 bg-neutral-900 text-white rounded-lg"
                            value={newMessage.message}
                            onChange={(e) => setNewMessage({ ...newMessage, message: e.target.value })}
                          />
                        </div>

                        <div>
                          <label className="block text-stone-400 mb-0.5 font-bold uppercase text-[8px] font-mono">Doa Berkat & Harapan</label>
                          <textarea 
                            rows={3}
                            required
                            placeholder="Tulis berkah barakah rumahtangga sakinah mawaddah..."
                            className="w-full px-3 py-2 border border-neutral-850 bg-neutral-900 text-white rounded-lg"
                            value={newMessage.prayer}
                            onChange={(e) => setNewMessage({ ...newMessage, prayer: e.target.value })}
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={isSubmittingMessage}
                          className="w-full py-2.5 bg-[#821E1E] text-white font-black tracking-widest uppercase rounded-lg shadow-md cursor-pointer hover:bg-red-700 transition"
                        >
                          {isSubmittingMessage ? 'PROSES ANALISA AI REPLIES...' : 'POST KE INSTA-STORY CARD'}
                        </button>
                      </form>
                    </div>

                  </div>
                </section>
              </React.Fragment>
            );
          }

          // Fallback return null
          return null;
        })}

        {/* Floating Wedding Cashless gift button at page bottom */}
        <div id="tanda-kasih-digital" className="pt-10 text-center space-y-4 px-4 pb-4">
          <div className="w-10 h-10 bg-red-950/40 text-[#dfb76c] rounded-full flex items-center justify-center mx-auto mb-1">
            <Gift className="w-5 h-5 text-[#dfb76c]" />
          </div>
          <h3 className="font-serif text-xl font-bold text-white">Tanda Kasih Digital</h3>
          <p className="text-xs text-stone-400 max-w-sm mx-auto leading-relaxed font-sans">
            Doa dan restu Anda adalah berkah mulia bagi rukun keluarga kami. Namun bagi yang berkenan mengirim kado digital cashless, silakan salin rekening berikut:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-lg mx-auto text-left text-xs font-mono pt-4">
            {(() => {
              const walletsList = settings?.wallets || [
                { id: 'w-1', bankName: 'BCA', accountNumber: '8600123456', accountHolder: 'Hanum Muftiani' },
                { id: 'w-2', bankName: 'Mandiri', accountNumber: '1230004567890', accountHolder: 'Muhammad Luthfi' }
              ];
              // Show up to first 2 wallets in front page
              const frontWallets = walletsList.slice(0, 2);

              const BANK_STYLES: Record<string, { bg: string; text: string; border: string; label: string }> = {
                'BCA': { bg: 'from-[#053e7a] via-[#0950a2] to-[#0d64cc]', text: 'text-white', border: 'border-[#0a1c38]/40', label: 'BANK BCA' },
                'Bank Jago': { bg: 'from-[#fdbc14] via-[#fcd116] to-[#edd350]', text: 'text-[#1c1917]', border: 'border-[#e0b70c]/50', label: 'BANK JAGO' },
                'BRI': { bg: 'from-[#003566] via-[#00529c] to-[#007cc7]', text: 'text-white', border: 'border-[#dfb76c]/40', label: 'BANK BRI' },
                'Mandiri': { bg: 'from-[#143254] via-[#1c3f68] to-[#2b5c92]', text: 'text-white', border: 'border-[#dfb76c]/40', label: 'BANK MANDIRI' },
                'Bank Jateng': { bg: 'from-[#8b0000] via-[#c62828] to-[#e53935]', text: 'text-white', border: 'border-yellow-500/40', label: 'BANK JATENG' },
                'SeaBank': { bg: 'from-[#cc4900] via-[#ff5a00] to-[#ff7e33]', text: 'text-white', border: 'border-orange-600/40', label: 'SEABANK' },
                'Krom Bank': { bg: 'from-[#421d5f] via-[#652d90] to-[#8c3fc6]', text: 'text-white', border: 'border-purple-400/40', label: 'KROM BANK' },
                'Gopay': { bg: 'from-[#007f0e] via-[#00aa13] to-[#25d33a]', text: 'text-white', border: 'border-emerald-500/40', label: 'GOPAY' },
                'Shopeepay': { bg: 'from-[#bf3e23] via-[#ee4d2d] to-[#ff6f51]', text: 'text-white', border: 'border-[#ff6f51]/40', label: 'SHOPEEPAY' }
              };

              return frontWallets.map(w => {
                const style = BANK_STYLES[w.bankName] || { bg: 'from-neutral-850 via-neutral-900 to-neutral-950', text: 'text-white', border: 'border-white/10', label: w.bankName.toUpperCase() };
                return (
                  <div key={w.id} className={`p-5 bg-gradient-to-br ${style.bg} rounded-2xl relative shadow-[0_20px_50px_rgba(0,0,0,0.65)] overflow-hidden min-h-[170px] flex flex-col justify-between border ${style.border}`}>
                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-xl pointer-events-none"></div>
                    
                    <div className="flex justify-between items-start">
                      <div>
                        <span className={`text-[8.5px] font-black font-sans px-2.5 py-1 rounded tracking-wider uppercase block w-fit shadow-xs ${style.text === 'text-white' ? 'bg-black/30 text-white' : 'bg-white/40 text-black'}`}>
                          {style.label}
                        </span>
                        {/* Microchip ornament */}
                        <div className="w-8 h-6 bg-gradient-to-tr from-[#dfb76c]/40 to-yellow-500/10 rounded-sm mt-3 relative">
                          <div className="absolute inset-1 opacity-20"></div>
                        </div>
                      </div>
                      {/* Card layout details */}
                      <div className="flex -space-x-2 opacity-60">
                        <div className="w-6 h-6 rounded-full bg-stone-100/10"></div>
                        <div className="w-6 h-6 rounded-full bg-stone-100/20"></div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <span className="text-[7.5px] text-stone-300/70 uppercase tracking-widest block font-bold leading-none font-sans">NOMOR REKENING</span>
                      <div className="text-white font-bold text-sm tracking-wider mt-1 select-all">{w.accountNumber}</div>
                    </div>

                    <div className="flex justify-between items-end mt-2.5 font-sans">
                      <div>
                        <span className="text-[7px] text-stone-300/60 uppercase tracking-widest block leading-none">NAMA PENERIMA</span>
                        <div className="text-stone-100 font-extrabold uppercase text-[10px] mt-1 leading-none">{w.accountHolder}</div>
                      </div>
                      <button 
                        onClick={() => handleCopy(w.accountNumber, w.id)}
                        className="px-2.5 py-1.5 bg-black/40 hover:bg-black/60 text-[#dfb76c] border border-white/10 rounded-md font-bold text-[9px] uppercase cursor-pointer flex items-center gap-1 transition-all"
                      >
                        {copiedAccount === w.id ? (
                          <>
                            <Check className="w-3 h-3 text-green-400" />
                            <span>COPIED</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>COPY</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              });
            })()}
          </div>

          {/* Home Address Section for Physical Gifts (Requirement 1) */}
          {settings?.giftAddress && (
            <div className="max-w-lg mx-auto mt-6 bg-[#0c0c0c] border border-neutral-850 p-5 rounded-2xl text-left shadow-lg select-text">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-red-950/40 text-[#dfb76c] flex items-center justify-center shrink-0 border border-red-900/30">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="flex-1 space-y-1">
                  <span className="text-[8.5px] text-[#dfb76c] font-black uppercase tracking-widest block font-mono">📍 ALAMAT PENGIRIMAN KADO FISIK:</span>
                  <p className="text-stone-305 text-xs leading-relaxed font-sans mt-1">
                    {settings.giftAddress}
                  </p>
                  <div className="pt-2">
                    <button
                      onClick={() => handleCopy(settings.giftAddress || '', 'giftAddress')}
                      className="px-2.5 py-1 bg-neutral-900 hover:bg-neutral-850 text-[#dfb76c] border border-neutral-800 rounded-md font-black text-[9px] uppercase cursor-pointer inline-flex items-center gap-1 font-mono transition-all"
                    >
                      {copiedAccount === 'giftAddress' ? (
                        <>
                          <Check className="w-2.5 h-2.5 text-green-400" />
                          <span>ALAMAT TERSALIN</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-2.5 h-2.5" />
                          <span>SALIN ALAMAT</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* All Wallet Toggle Menu/Button */}
          <div className="pt-3">
            <button
              onClick={() => setIsAllWalletsModalOpen(true)}
              className="px-5 py-2.5 bg-neutral-950 hover:bg-neutral-900 border border-neutral-850 text-stone-200 hover:text-[#dfb76c] rounded-full font-bold text-xs uppercase tracking-wider cursor-pointer inline-flex items-center gap-2 transition-all shadow-md group"
            >
              <Users2 className="w-4 h-4 text-[#dfb76c] group-hover:scale-110 transition-transform" />
              <span>Lihat Semua Rekening / E-Wallet</span>
            </button>
          </div>
        </div>

        {/* Closing Thank You & Doa Section (Requirement 3) */}
        <div className="pt-16 pb-14 text-center space-y-6 max-w-xl mx-auto px-6">
          <span className="font-serif text-3xl text-[#dfb76c] block italic font-bold">Thankyou!</span>
          <p className="text-xs text-stone-400 leading-relaxed font-sans max-w-md mx-auto">
            Menjadi sebuah kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dalam hari bahagia ini. Terima kasih atas segala ucapan, doa, dan perhatian yang diberikan.
          </p>
          <div className="space-y-1.5 pt-4">
            <p className="text-[9px] tracking-[0.25em] text-[#dfb76c] font-black font-mono">SEE YOU ON OUR BIG DAY!</p>
            <h3 className="font-serif text-2xl font-black text-white">Hanum & Luthfi</h3>
          </div>
        </div>

        {/* Beautiful Custom Footer with Love and Custom Styled Red-to-Orange Gradient Text (Requirement 4) */}
        <div className="w-full border-t border-white/5 py-8 text-center text-stone-500 text-[11px] font-medium tracking-wide">
          <div className="flex items-center justify-center gap-1 flex-wrap">
            <span>Made with Love</span>
            <span className="text-red-500 animate-pulse text-[12px] mx-0.5">❤️</span>
            <span>—</span>
            <span className="font-extrabold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent select-text">
              Muhammad Luthfi
            </span>
          </div>
        </div>

        {/* All Wallets / Accounts Modal Popup (Requirement 1) */}
        {isAllWalletsModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
            <div className="relative bg-[#0c0c0c] border border-neutral-850 rounded-[28px] max-w-md w-full overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
              {/* Modal Header */}
              <div className="p-5 border-b border-neutral-850/60 flex justify-between items-center bg-neutral-950">
                <div className="flex items-center gap-2">
                  <Gift className="w-4 h-4 text-[#dfb76c]" />
                  <h4 className="font-serif text-lg font-black text-white">Semua Rekening & Dompet</h4>
                </div>
                <button
                  onClick={() => setIsAllWalletsModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 hover:bg-neutral-850 text-stone-400 hover:text-white flex items-center justify-center cursor-pointer transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Body: Scrollable list of wallets */}
              <div className="p-5 overflow-y-auto space-y-4 scrollbar-hide flex-1">
                <p className="text-[11px] text-stone-400 leading-relaxed font-sans text-center max-w-xs mx-auto pb-2">
                  Berikut daftar lengkap rekening bank dan akun dompet digital terdaftar kami:
                </p>

                {(() => {
                  const walletsList = settings?.wallets || [
                    { id: 'w-1', bankName: 'BCA', accountNumber: '8600123456', accountHolder: 'Hanum Muftiani' },
                    { id: 'w-2', bankName: 'Mandiri', accountNumber: '1230004567890', accountHolder: 'Muhammad Luthfi' }
                  ];

                  const BANK_STYLES: Record<string, { bg: string; text: string; border: string; label: string }> = {
                    'BCA': { bg: 'from-[#053e7a] via-[#0950a2] to-[#0d64cc]', text: 'text-white', border: 'border-[#0a5aa2]/40', label: 'BANK BCA' },
                    'Bank Jago': { bg: 'from-[#fdbc14] via-[#fcd116] to-[#edd350]', text: 'text-[#1c1917]', border: 'border-[#e0b70c]/50', label: 'BANK JAGO' },
                    'BRI': { bg: 'from-[#003566] via-[#00529c] to-[#007cc7]', text: 'text-white', border: 'border-orange-500/40', label: 'BANK BRI' },
                    'Mandiri': { bg: 'from-[#143254] via-[#1c3f68] to-[#2b5c92]', text: 'text-white', border: 'border-[#dfb76c]/40', label: 'BANK MANDIRI' },
                    'Bank Jateng': { bg: 'from-[#8b0000] via-[#c62828] to-[#e53935]', text: 'text-white', border: 'border-yellow-500/40', label: 'BANK JATENG' },
                    'SeaBank': { bg: 'from-[#cc4900] via-[#ff5a00] to-[#ff7e33]', text: 'text-white', border: 'border-orange-600/40', label: 'SEABANK' },
                    'Krom Bank': { bg: 'from-[#421d5f] via-[#652d90] to-[#8c3fc6]', text: 'text-white', border: 'border-purple-400/40', label: 'KROM BANK' },
                    'Gopay': { bg: 'from-[#007f0e] via-[#00aa13] to-[#25d33a]', text: 'text-white', border: 'border-emerald-500/40', label: 'GOPAY' },
                    'Shopeepay': { bg: 'from-[#bf3e23] via-[#ee4d2d] to-[#ff6f51]', text: 'text-white', border: 'border-[#ff6f51]/40', label: 'SHOPEEPAY' }
                  };

                  return walletsList.map(w => {
                    const style = BANK_STYLES[w.bankName] || { bg: 'from-neutral-800 via-neutral-900 to-neutral-950', text: 'text-white', border: 'border-white/10', label: w.bankName.toUpperCase() };
                    return (
                      <div key={w.id} className={`p-4 bg-gradient-to-br ${style.bg} rounded-xl relative shadow-md overflow-hidden flex flex-col justify-between border ${style.border}`}>
                        <div className="absolute top-0 right-0 w-16 h-16 bg-white/5 rounded-full blur-lg pointer-events-none"></div>
                        
                        <div className="flex justify-between items-center">
                          <span className={`text-[8px] font-black font-sans px-2 py-0.5 rounded tracking-wider uppercase block w-fit ${style.text === 'text-white' ? 'bg-black/35 text-white' : 'bg-white/45 text-black'}`}>
                            {style.label}
                          </span>
                          <span className="font-bold text-[8px] opacity-40 uppercase tracking-widest font-mono text-white">Cashless Gift</span>
                        </div>

                        <div className="mt-3">
                          <div className="text-white font-bold text-xs tracking-wider select-all">{w.accountNumber}</div>
                          <div className="text-[9px] text-stone-200/90 font-sans mt-0.5 font-bold uppercase truncate">{w.accountHolder}</div>
                        </div>

                        <div className="flex justify-end mt-2 animate-pulse-once">
                          <button 
                            onClick={() => handleCopy(w.accountNumber, w.id)}
                            className="px-2 py-1 bg-black/45 hover:bg-black/60 text-[#dfb76c] border border-white/10 rounded-md font-bold text-[8px] uppercase cursor-pointer flex items-center gap-1 transition-all"
                          >
                            {copiedAccount === w.id ? (
                              <>
                                <Check className="w-2.5 h-2.5 text-green-450" />
                                <span>COPIED</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-2.5 h-2.5" />
                                <span>COPY</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-neutral-950 border-t border-neutral-850/60 text-center">
                <button
                  onClick={() => setIsAllWalletsModalOpen(false)}
                  className="px-4 py-1.5 bg-[#821E1E] hover:bg-red-700 text-white font-black text-[10px] tracking-widest uppercase rounded-full cursor-pointer transition-all"
                >
                  Tutup Tampilan
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
