import express from 'express';
import path from 'path';
import fs from 'fs';
import { GoogleGenAI } from '@google/genai';

// DEFAULT INITIAL CONTENT SEEDS FOR FULL STACK CENTRAL SQL/JSON BACKEND
const DEFAULT_SECTIONS = [
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
    description: "Putri Keempat dari Bapak H. Sa'dun Makhali & Ibu Hj. Ulil Faekoh (Jepara, Jawa Tengah)",
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

const DEFAULT_WALLETS = [
  { id: 'w-1', bankName: 'BCA', accountNumber: '8600123456', accountHolder: 'Hanum Muftiani' },
  { id: 'w-2', bankName: 'Mandiri', accountNumber: '1230004567890', accountHolder: 'Muhammad Luthfi' }
];

const DEFAULT_SETTINGS = {
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

const DEFAULT_REWARDS = [
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

const DEFAULT_GUESTBOOK_MESSAGES = [
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

const DEFAULT_TICKETS = [
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

// File Storage Setup
const dataDir = path.join(process.cwd(), 'data');
const stateFilePath = path.join(dataDir, 'wedding_state.json');

function ensureDataSetup() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(stateFilePath)) {
    const initialState = {
      sections: DEFAULT_SECTIONS,
      settings: DEFAULT_SETTINGS,
      rewards: DEFAULT_REWARDS,
      guestbook: DEFAULT_GUESTBOOK_MESSAGES,
      tickets: DEFAULT_TICKETS,
      drawHistory: []
    };
    fs.writeFileSync(stateFilePath, JSON.stringify(initialState, null, 2), 'utf8');
  }
}

function readState() {
  ensureDataSetup();
  const raw = fs.readFileSync(stateFilePath, 'utf8');
  return JSON.parse(raw);
}

function writeState(state: any) {
  ensureDataSetup();
  fs.writeFileSync(stateFilePath, JSON.stringify(state, null, 2), 'utf8');
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // API routes FIRST
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Serve the uploads directory statically
  const uploadsDir = path.join(process.cwd(), 'uploads');
  const fs = await import('fs');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  app.use('/uploads', express.static(uploadsDir));

  // GET uploaded images list
  app.get('/api/images', (req, res) => {
    try {
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      const files = fs.readdirSync(uploadsDir);
      const images = files
        .filter(file => {
          const ext = path.extname(file).toLowerCase();
          return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
        })
        .map(file => ({
          name: file,
          url: `/uploads/${file}`,
          createdAt: fs.statSync(path.join(uploadsDir, file)).mtime
        }))
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      
      res.json({ images });
    } catch (err: any) {
      console.error('Failed to read images list:', err);
      res.status(500).json({ error: 'Failed to retrieve files: ' + err.message });
    }
  });

  // POST upload a new image via Base64
  app.post('/api/images/upload', (req, res) => {
    const { name, data } = req.body || {};
    if (!name || !data) {
      return res.status(400).json({ error: 'Filename and Base64 data are required' });
    }

    try {
      const matches = data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        return res.status(400).json({ error: 'Invalid Base64 data format' });
      }

      const buffer = Buffer.from(matches[2], 'base64');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      // Sanitize name and prepend timestamp to prevent collision
      const safeName = `${Date.now()}_${name.replace(/[^a-zA-Z0-9.\-_]/g, '_')}`;
      const filePath = path.join(uploadsDir, safeName);
      
      fs.writeFileSync(filePath, buffer);
      res.json({ success: true, url: `/uploads/${safeName}`, name: safeName });
    } catch (err: any) {
      console.error('File write error:', err);
      res.status(500).json({ error: 'Failed to save image to disk: ' + err.message });
    }
  });

  // DELETE an uploaded image
  app.delete('/api/images/:name', (req, res) => {
    const fileName = req.params.name;
    if (!fileName || fileName.includes('/') || fileName.includes('..') || fileName.includes('\\')) {
      return res.status(400).json({ error: 'Invalid filename' });
    }

    try {
      const filePath = path.join(uploadsDir, fileName);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        res.json({ success: true });
      } else {
        res.status(404).json({ error: 'Image not found' });
      }
    } catch (err: any) {
      console.error('Failed to delete file:', err);
      res.status(500).json({ error: 'Failed to delete file: ' + err.message });
    }
  });

  // AI assistant reply endpoint to congratulate guests on behalf of Luthfi and Hanum
  app.post('/api/wedding/ai-reply', async (req, res) => {
    const { name, message } = req.body || {};
    try {
      if (!message) {
        return res.status(400).json({ error: 'Message is required' });
      }

      // Check if API key is configured
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        console.warn('GEMINI_API_KEY environment variable is not defined. Using offline mock replies.');
        // Return a warm Indonesian fallback reply
        return res.json({
          reply: `Aamiin ya rabbal alamin. Terima kasih banyak Kak ${name || 'Tamu Undangan'} atas barakah ucapan dan restu indahnya untuk ikatan pernikahan Luthfi & Hanum!`
        });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const prompt = `Kamu adalah AI Co-Host pernikahan Muhammad Luthfi, S.Pd. dan Siti Hanum Handayani, S.Kom. (brand Educita).
Seorang tamu bernama "${name || 'Tamu Undangan'}" meninggalkan ucapan doa berikut:
"${message}"

Tulislah balasan apresiasi ucapan selamat pernikahan yang sangat hangat, sopan, puitis, dan penuh rasa syukur dari pasangan pengantin Luthfi & Hanum.
Aturan penting:
1. Tulis maksimal 2 kalimat.
2. Gunakan Bahasa Indonesia yang indah, santun, ramah, dan tulus.
3. Sebutkan nama mereka "${name || 'Tamu Undangan'}".
4. Berikan doa balasan yang baik untuk mereka.`;

      const aiResponse = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
      });

      const replyText = aiResponse.text?.trim() || `Aamiin, terima kasih banyak Kak ${name || 'Tamu Undangan'} atas doa dan dukungannya untuk kami berdua!`;
      res.json({ reply: replyText });
    } catch (err: any) {
      console.error('Gemini AI Reply error:', err);
      res.json({
        reply: `Aamiin ya rabbal alamin. Terima kasih banyak Kak ${name || 'Tamu Undangan'} atas restu hangatnya untuk hari bahagia Luthfi & Hanum!`
      });
    }
  });

  // AI Route Assistant endpoint to guide guests to the venue in Mayong/Kudus
  app.post('/api/wedding/route-assistant', async (req, res) => {
    try {
      const { startLocation } = req.body;
      if (!startLocation) {
        return res.status(400).json({ error: 'Origin location is required' });
      }

      const locLower = startLocation.toLowerCase();

      // Check if API key is configured
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        console.warn('GEMINI_API_KEY is not defined. Using offline mock route assistant.');
        
        // Custom smart local fallback for the requested examples
        let recommendedRoute = `Keluar menuju Jl. Raya Kudus-Jepara, ikuti rute lurus melintasi perbatasan Mayong hingga sampai di gerbang Royal Bloom Pavilion di sebelah kiri jalan.`;
        let estimatedTime = `20 - 35 Menit`;
        let suggestedDeparture = `09:15 WIB (Disarankan berangkat 45 menit sebelum sesi dibuka untuk mengantisipasi kepadatan lalu lintas pagi hari di Pasar Mayong).`;

        if (locLower.includes('mayong')) {
          recommendedRoute = `Dari pusat Mayong, arahkan kendaraan ke Timur menyusuri Jl. Raya Mayong-Kudus. Lokasi Royal Bloom Pavilion berada di sebelah kanan jalan sebelum jembatan perbatasan Kudus.`;
          estimatedTime = `10 - 15 Menit`;
          suggestedDeparture = `09:30 WIB (Berangkat awal memudahkan Anda memilih tempat parkir premier terdekat).`;
        } else if (locLower.includes('term') || locLower.includes('kudus')) {
          recommendedRoute = `Dari Terminal Kudus / Kota Kudus, ambil rute Barat menuju Jl. Raya Kudus-Jepara. Lewati Pabrik Djarum, lalu terus lurus melintasi gerbang perbatasan Mayong. Lokasi berada tepat di sebelah kiri jalan.`;
          estimatedTime = `25 - 30 Menit`;
          suggestedDeparture = `09:15 WIB (Disarankan mengantisipasi antrean lampu merah di perempatan Jati).`;
        }

        return res.json({ recommendedRoute, estimatedTime, suggestedDeparture });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const prompt = `Kamu adalah Asisten Rute Cerdas untuk pernikahan Muhammad Luthfi, S.Pd. & Hanum Muftiani, S.Kom.
Lokasi Pernikahan (Tujuan): "Royal Bloom Pavilion, Jl. Raya Mayong No. 88 (Perbatasan Kudus - Jepara, Jawa Tengah)".
Asal Keberangkatan Tamu: "${startLocation}"

Berikan instruksi rute jalan terbaik menuju ke lokasi pernikahan.
Kembalikan respon dalam format JSON murni dengan key objek berikut:
{
  "recommendedRoute": "Deskripsi rute jalan singkat, jelas, menyebutkan jalan utama dan patokan/landmark penting di sekitar Mayong/Kudus.",
  "estimatedTime": "Estimasi durasi perjalanan (misal: '15 Menit' atau '40 Menit' tergantung jarak realistis).",
  "suggestedDeparture": "Waktu keberangkatan ideal serta tips kemacetan/parkir (misal: '09:20 WIB (Disarankan 40 menit sebelum acara untuk antisipasi kemacetan di pasar Mayong)')."
}
Kembalikan HANYA format JSON murni tanpa markdown formatting, tanpa backticks \`\`\`json.`;

      const aiResponse = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      const text = aiResponse.text?.trim() || '{}';
      const parsed = JSON.parse(text);
      res.json({
        recommendedRoute: parsed.recommendedRoute || 'Ambil Jl. Raya Kudus-Jepara langsung menuju wilayah Mayong.',
        estimatedTime: parsed.estimatedTime || '25 Menit',
        suggestedDeparture: parsed.suggestedDeparture || '09:15 WIB (Disarankan berangkat awal)'
      });

    } catch (err: any) {
      console.error('Route Assistant error:', err);
      res.json({
        recommendedRoute: `Keluar ke arah Jl. Raya Kudus-Jepara, terus lurus menuju area perbatasan Mayong. Gedung Royal Bloom Pavilion terletak di pinggir jalan raya utama.`,
        estimatedTime: `aprox. 30 Menit`,
        suggestedDeparture: `09:15 WIB (Disarankan menyisihkan waktu luang 45 menit)`
      });
    }
  });

  // ────────────────────────────────────────────────────────
  // WEDDING CENTRAL DATABASE ENDPOINTS (V1 - FULL SYSTEM)
  // ────────────────────────────────────────────────────────

  // Get full state
  app.get('/api/wedding-state', (req, res) => {
    try {
      const state = readState();
      res.json(state);
    } catch (err: any) {
      console.error('Failed to read wedding-state:', err);
      res.status(500).json({ error: err.message });
    }
  });

  // Save/Edit sections
  app.post('/api/wedding-state/sections', (req, res) => {
    try {
      const { sections } = req.body || {};
      if (!Array.isArray(sections)) {
        return res.status(400).json({ error: 'Sections array is required' });
      }
      const state = readState();
      state.sections = sections;
      writeState(state);
      res.json({ success: true });
    } catch (err: any) {
      console.error('Failed to save wedding sections:', err);
      res.status(500).json({ error: err.message });
    }
  });

  // Save/Edit settings
  app.post('/api/wedding-state/settings', (req, res) => {
    try {
      const { settings } = req.body || {};
      if (!settings) {
        return res.status(400).json({ error: 'Settings object is required' });
      }
      const state = readState();
      state.settings = settings;
      writeState(state);
      res.json({ success: true });
    } catch (err: any) {
      console.error('Failed to save wedding settings:', err);
      res.status(500).json({ error: err.message });
    }
  });

  // Save/Edit rewards
  app.post('/api/wedding-state/rewards', (req, res) => {
    try {
      const { rewards } = req.body || {};
      if (!Array.isArray(rewards)) {
        return res.status(400).json({ error: 'Rewards array is required' });
      }
      const state = readState();
      state.rewards = rewards;
      writeState(state);
      res.json({ success: true });
    } catch (err: any) {
      console.error('Failed to save wedding rewards:', err);
      res.status(500).json({ error: err.message });
    }
  });

  // Save/Edit all guestbook messages (Moderation)
  app.post('/api/wedding-state/guestbook-all', (req, res) => {
    try {
      const { guestbook } = req.body || {};
      if (!Array.isArray(guestbook)) {
        return res.status(400).json({ error: 'Guestbook array is required' });
      }
      const state = readState();
      state.guestbook = guestbook;
      writeState(state);
      res.json({ success: true, guestbook: state.guestbook });
    } catch (err: any) {
      console.error('Failed to save wedding guestbook:', err);
      res.status(500).json({ error: err.message });
    }
  });

  // Add guestbook messages (with optional Gemini reply generated automatically)
  app.post('/api/wedding-state/guestbook', async (req, res) => {
    try {
      const { name, avatar, relation, message, prayer } = req.body || {};
      if (!name || !message) {
        return res.status(400).json({ error: 'Name and message are required' });
      }

      const newEntry = {
        id: `msg-${Date.now()}`,
        name,
        avatar: avatar || '👩',
        relation: relation || 'Sahabat',
        message,
        prayer: prayer || '',
        createdAt: new Date().toISOString(),
        aiReply: '',
        weddingSlug: 'hanum-luthfi'
      };

      // Generate Gemini/Mock AI Reply
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        newEntry.aiReply = `Aamiin ya rabbal alamin. Terima kasih banyak Kak ${name} atas doa restu, ucapan, dan kebaikan doanya untuk kami berdua!`;
      } else {
        try {
          const ai = new GoogleGenAI({
            apiKey,
            httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
          });
          
          const prompt = `Kamu adalah AI Co-Host pernikahan Muhammad Luthfi, S.Pd. dan Siti Hanum Handayani, S.Kom. (brand Educita).
Seorang tamu bernama "${name}" meninggalkan ucapan doa berikut:
"${message} ${prayer}"

Tulislah balasan apresiasi ucapan selamat pernikahan yang sangat hangat, sopan, puitis, dan penuh rasa syukur dari pasangan pengantin Luthfi & Hanum.
Aturan penting:
1. Tulis maksimal 2 kalimat.
2. Gunakan Bahasa Indonesia yang indah, santun, ramah, dan tulus.
3. Sebutkan nama mereka "${name}".
4. Berikan doa balasan yang baik untuk mereka.`;

          const aiResponse = await ai.models.generateContent({
            model: 'gemini-3.5-flash',
            contents: prompt,
          });
          newEntry.aiReply = aiResponse.text?.trim() || `Aamiin, terima kasih banyak Kak ${name} atas doa dan dukungannya untuk kami berdua!`;
        } catch (aiErr) {
          console.error('Gemini error during guestbook reply:', aiErr);
          newEntry.aiReply = `Aamiin ya rabbal alamin. Terima kasih banyak Kak ${name} atas restu hangatnya untuk hari bahagia Luthfi & Hanum!`;
        }
      }

      const state = readState();
      state.guestbook.unshift(newEntry);
      writeState(state);
      res.json(newEntry);
    } catch (err: any) {
      console.error('Failed to add guestbook message:', err);
      res.status(500).json({ error: err.message });
    }
  });

  // Add RSVP Ticketing
  app.post('/api/wedding-state/rsvp', (req, res) => {
    try {
      const rsvp = req.body || {};
      if (!rsvp.guestName) {
        return res.status(400).json({ error: 'Guest name is required' });
      }

      const id = `tix-${Date.now()}`;
      const serial = Math.floor(100 + Math.random() * 900);
      const ticketNumber = `VIP-2026-0913-${serial}`;
      
      const row = ['A', 'B', 'C', 'D', 'E'][Math.floor(Math.random() * 5)];
      const num = Math.floor(1 + Math.random() * 30);
      const seatNumber = `Seat ${row}-${num}`;
      const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(ticketNumber)}`;

      const newTicket = {
        id,
        guestName: rsvp.guestName,
        attendance: rsvp.attendance || 'hadir',
        guestsCount: Number(rsvp.guestsCount) || 1,
        session: rsvp.session || 'Sesi 1 (Akad & Opening VIP)',
        scheduleTime: rsvp.scheduleTime || '10:00 - 12:00 WIB',
        ticketNumber,
        seatNumber,
        qrCodeUrl,
        avatar: rsvp.avatar || '👩',
        createdAt: new Date().toISOString(),
        checkInStatus: 'belum_hadir',
        weddingSlug: 'hanum-luthfi'
      };

      const state = readState();
      state.tickets.unshift(newTicket);
      writeState(state);
      res.json(newTicket);
    } catch (err: any) {
      console.error('Failed to register rsvp ticket:', err);
      res.status(500).json({ error: err.message });
    }
  });

  // CheckIn Scan Ticket
  app.post('/api/wedding-state/checkin', (req, res) => {
    try {
      const { ticketNumber } = req.body || {};
      if (!ticketNumber) {
        return res.status(400).json({ error: 'Ticket number is required' });
      }

      const state = readState();
      const tixIdx = state.tickets.findIndex(
        (t: any) => t.ticketNumber.trim().toUpperCase() === ticketNumber.trim().toUpperCase()
      );

      if (tixIdx === -1) {
        return res.json({ success: false, message: 'Tiket tidak ditemukan. Silakan periksa kembali kode tiket.' });
      }

      const ticket = state.tickets[tixIdx];
      if (ticket.checkInStatus === 'sudah_hadir') {
        return res.json({ 
          success: false, 
          message: `Tiket sudah check-in sebelumnya pada pukul ${new Date(ticket.checkInTime).toLocaleTimeString('id-ID')}.`,
          ticket 
        });
      }

      ticket.checkInStatus = 'sudah_hadir';
      ticket.checkInTime = new Date().toISOString();
      state.tickets[tixIdx] = ticket;
      writeState(state);

      res.json({ 
        success: true, 
        message: `Check-in Berhasil! Selamat datang Kak ${ticket.guestName}.`, 
        ticket 
      });
    } catch (err: any) {
      console.error('Failed to checkin ticket:', err);
      res.status(500).json({ error: err.message });
    }
  });

  // Draw Gacha souvenir
  app.post('/api/wedding-state/draw-souvenir', (req, res) => {
    try {
      const { guestName } = req.body || {};
      if (!guestName) {
        return res.status(400).json({ error: 'Guest name is required' });
      }

      const state = readState();
      const available = state.rewards.filter((r: any) => r.remaining > 0);
      if (available.length === 0) {
        return res.json({ error: 'Semua souvenir sudah habis terjual/terbagi!' });
      }

      // Distribute by probability
      let selected: any = null;
      const totalProb = available.reduce((acc: number, r: any) => acc + r.probability, 0);
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
        const fullIdx = state.rewards.findIndex((r: any) => r.id === selected.id);
        if (fullIdx !== -1) {
          state.rewards[fullIdx].remaining -= 1;
          
          // Record draw history
          if (!state.drawHistory) {
            state.drawHistory = [];
          }
          state.drawHistory.push({
            id: `draw-${Date.now()}`,
            guestName,
            rewardTitle: selected.title,
            drawnAt: new Date().toISOString()
          });

          writeState(state);
        }
      }

      res.json(selected);
    } catch (err: any) {
      console.error('Failed to draw souvenir gacha:', err);
      res.status(500).json({ error: err.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
