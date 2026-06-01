import { createClient } from '@supabase/supabase-js';
import { 
  SchoolService, 
  ProjectShowcase, 
  ShopProduct, 
  Testimonial, 
  WeddingGuestbook, 
  WeddingRSVP,
  ConsultationRequest
} from '../types/database';

// Attempt to read Supabase environment keys
const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

// ==========================================
// SEED DATA FOR SIMULATING DATABASE IN PREVIEW
// ==========================================

const DEFAULT_SERVICES: SchoolService[] = [
  {
    id: 'srv-1',
    name: 'Website Sekolah Modern',
    category: 'software',
    description: 'Landing page interaktif, portal berita, PPDB, dan media informasi terintegrasi untuk meningkatkan prestise sekolah.',
    details: ['Desain responsif mobile-friendly', 'Sistem pengelolaan berita & galeri', 'Integrasi sosial media', 'Hosting super cepat &domain .sch.id'],
    icon: 'Globe',
    priceRange: 'Rp 3.500.000 - Rp 7.500.000',
    popular: true
  },
  {
    id: 'srv-2',
    name: 'Sistem Kelulusan Digital (SKL)',
    category: 'software',
    description: 'Sistem pengumuman kelulusan online aman dan real-time yang dapat diakses siswa dari rumah demi menghindari aksi corat-coret.',
    details: ['Cetak Surat Keterangan Lulus otomatis', 'Input nilai cepat via Excel', 'Proteksi server dari beban tinggi', 'Penghitung mundur pengumuman otomatis'],
    icon: 'GraduationCap',
    priceRange: 'Rp 2.000.000 - Rp 4.500.000',
    popular: true
  },
  {
    id: 'srv-3',
    name: 'Sistem Surat Menyurat Sekolah',
    category: 'software',
    description: 'E-Office internal sekolah untuk mengelola surat masuk, surat keluar, disposisi kepala sekolah, dan arsip dokumen digital.',
    details: ['Disposisi online real-time', 'Template surat otomatis', 'Arsip digital awet & terindeks', 'Notifikasi Telegram/WA admin'],
    icon: 'Mail',
    priceRange: 'Rp 4.000.000 - Rp 8.000.000'
  },
  {
    id: 'srv-4',
    name: 'Sistem Rapor Digital & Nilai',
    category: 'software',
    description: 'Manajemen nilai siswa terpusat untuk mempermudah guru menginput nilai harian, UTS, UAS, dan mencetak rapor berkala.',
    details: ['Akses akun terpisah Guru, Siswa & Wali', 'Ekspor / Impor data Excel instan', 'Grafik perkembangan belajar siswa', 'Perhitungan nilai rapor otomatis'],
    icon: 'FileSpreadsheet'
  },
  {
    id: 'srv-5',
    name: 'Instalasi & Maintenance CCTV',
    category: 'hardware',
    description: 'Sistem pemantauan keamanan kelas, koridor, dan gerbang sekolah yang dapat dipantau langsung dari HP Kepala Sekolah.',
    details: ['Kamera IP Resolusi Tinggi 2K/4K', 'Penyimpanan awet (NVR + Cloud Backup)', 'Monitoring jarak jauh via Android/iOS', 'Garansi pemeliharaan 1 tahun'],
    icon: 'Camera'
  },
  {
    id: 'srv-6',
    name: 'Lab Komputer & Instalasi Server',
    category: 'infrastructure',
    description: 'Penyusunan komputer laboratorium, instalasi server UNBK/Asesmen Nasional, jaringan LAN kelas, dan optimasi hardware.',
    details: ['Instalasi OS & Software berlisensi', 'Manajemen Server Proxy & Firewall', 'Kabel rapi (Trunking/Conduit)', 'Backup daya UPS otomatis'],
    icon: 'Monitor'
  },
  {
    id: 'srv-7',
    name: 'Jaringan & Internet Sekolah (MikroTik)',
    category: 'infrastructure',
    description: 'Optimasi jaringan internet sekolah, pemisahan bandwidth guru/siswa/tamu, dan sistem voucher Wi-Fi modern.',
    details: ['Sistem Voucher Wi-Fi Siswa', 'Pemisahan bandwidth cerdas agar anti-lelet', 'Blokir konten negatif (Internet Sehat)', 'Konfigurasi load balancing multi-provider'],
    icon: 'Wifi'
  },
  {
    id: 'srv-8',
    name: 'Konsultasi IT & Perbaikan Komputer',
    category: 'consultation',
    description: 'Layanan servis berkala komputer guru & TU, perbaikan laptop, serta konsultasi perencanaan dana BOS untuk transformasi digital.',
    details: ['Servis hardware & upgrade SSD', 'Pembersihan virus & optimasi OS', 'Penyusunan RAB IT sekolah gratis', 'Kunjungan berkala teknisi ahli'],
    icon: 'Cpu'
  }
];

const DEFAULT_PROJECTS: ProjectShowcase[] = [
  {
    id: 'proj-1',
    title: 'Digitalisasi Ekosistem Belajar SMAN 1 Jaya',
    category: 'Website & Jaringan',
    schoolName: 'SMAN 1 Jaya',
    description: 'Pemasangan server ujian lokal, jaringan fiber optik antar ruang kelas, dan peluncuran website portal informasi sekolah yang dikunjungi ribuan siswa harian.',
    stats: '1,200 Siswa Aktif Terkoneksi',
    imageUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=600',
    completedYear: 2025
  },
  {
    id: 'proj-2',
    title: 'Sistem Kelulusan Online Terintegrasi',
    category: 'Sistem Kelulusan',
    schoolName: 'SMP Swasta Al-Fatih',
    description: 'Pengembangan sistem SKL digital mandiri. Siswa dapat melihat kelulusan jam 10 malam tepat via smartphone tanpa kerumunan fisik di sekolah.',
    stats: '100% Kelulusan Damai Tanpa Coretan',
    imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=600',
    completedYear: 2025
  },
  {
    id: 'proj-3',
    title: 'Instalasi CCTV Cerdas 32 Titik & Ruang Control',
    category: 'CCTV & Keamanan',
    schoolName: 'SDN Nusantara 02',
    description: 'Penyusunan sistem monitor terpusat di ruang Kepala Sekolah dan piket untuk memantau keamanan di seluruh area sekolah secara aman.',
    stats: '32 Kamera Pemantau Full-HD',
    imageUrl: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=600',
    completedYear: 2024
  }
];

const DEFAULT_PRODUCTS: ShopProduct[] = [
  {
    id: 'prod-1',
    slug: 'paket-website-sekolah',
    name: 'Paket Website Sekolah Premium',
    category: 'packages',
    description: 'Sistem portal sekolah modern dengan subdomain .sch.id resmi, enkripsi HTTPS, halaman berita dinamis, pendaftaran siswa baru (PPDB) online, dan CMS yang dikelola guru.',
    price: 4950000,
    featured: true,
    imageUrl: 'https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&q=80&w=600',
    features: [
      'Hosting Dedicated Cloud 1 Tahun',
      'Domain .sch.id Resmi (Dibantu pendaftaran dokumen)',
      'Sistem PPDB Online & Cetak Formulir',
      'Pelatihan Penggunaan untuk Admin & Guru (Sertifikat)',
      'Desain Responsif Ultra-Premium'
    ],
    specs: [
      'Penyimpanan: 10 GB SSD Storage',
      'Bandwidth: Unlimited',
      'Sistem CMS: WordPress Custom / React Frontend',
      'Akun Email Sekolah Resmi (domain @school.sch.id)',
      'Garansi Pemeliharaan Bug 1 Tahun'
    ]
  },
  {
    id: 'prod-2',
    slug: 'sistem-kelulusan-digital',
    name: 'Aplikasi Kelulusan Digital (SKL)',
    category: 'systems',
    description: 'Aplikasi web mandiri untuk mempublikasikan kelulusan siswa SMA/SMK/SMP secara online. Menghindari kerumunan di sekolah dan mempermudah pencetakan SKL ber-QR Code.',
    price: 2500000,
    featured: true,
    imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=600',
    features: [
      'Import data nilai & siswa via Excel sekali klik',
      'Template cetak SKL instan dengan QR Code tanda tangan',
      'Hosting Mandiri Aman dari overload traffic',
      'Sistem hitung mundur rilis otomatis (Auto-lock)'
    ],
    specs: [
      'Teknologi: Fast static React / Serverless',
      'Keamanan: Enkripsi Query Parameter & PDF Protection',
      'Integrasi: Cetak PDF langsung dari handphone siswa',
      'Lisensi: Berlaku selamanya untuk 1 sekolah'
    ]
  },
  {
    id: 'prod-3',
    slug: 'sistem-absensi-digital-rfid',
    name: 'Sistem Absensi Sekolah RFID + WA',
    category: 'systems',
    description: 'Sistem absensi otomatis tap kartu RFID untuk siswa dengan notifikasi WhatsApp langsung ke HP orang tua ketika siswa masuk dan pulang sekolah.',
    price: 8500000,
    featured: false,
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600',
    features: [
      'Termasuk 1 Unit Reader Terminal Absensi',
      'Free 100 Kartu RFID Cetak Logo Sekolah',
      'Notifikasi WhatsApp Otomatis ke HP Orang tua',
      'Aplikasi monitoring kehadiran guru dan siswa'
    ],
    specs: [
      'Terminal: Prosesor ARM, LCD 3.2 inch, Speaker Voice',
      'Notifikasi Gateway WA terintegrasi 1 tahun',
      'Power supply dengan backup baterai 4 jam',
      'Laporan kehadiran bulanan otomatis (PDF/Excel)'
    ]
  },
  {
    id: 'prod-4',
    slug: 'sistem-surat-digital-signature',
    name: 'E-Surat & Tanda Tangan Digital',
    category: 'systems',
    description: 'Solusi pengelolaan administrasi surat menyurat sekolah modern dengan teknologi pencatatan disposisi dan sertifikasi validasi tanda tangan visual digital.',
    price: 3800000,
    featured: false,
    imageUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&q=80&w=600',
    features: [
      'Pencatatan surat masuk dan nomor otomatis',
      'Lembar disposisi digital oleh Kepala Sekolah',
      'Tanda tangan QR validator keaslian surat',
      'Sistem log aktivitas pengeditan surat'
    ],
    specs: [
      'Kompatibilitas: PDF standard modern',
      'Hak Akses: Admin, Kajur, Kepsek, & Tata Usaha',
      'Pencarian teks cepat pada arsip surat',
      'Skema Database PostgreSQL'
    ]
  },
  {
    id: 'prod-5',
    slug: 'instalasi-cctv-sekolah-6ch',
    name: 'Paket CCTV Sekolah 6 Kamera',
    category: 'hardware',
    description: 'Pemasangan paket pemantauan keamanan sekolah dengan 6 kamera IP resolusi tinggi 4 Megapixel, menjamin setiap sudut gerbang, lorong dan lab terpantau.',
    price: 5200000,
    featured: true,
    imageUrl: 'https://images.unsplash.com/photo-1549488344-cbb6c34cf08b?auto=format&fit=crop&q=80&w=600',
    features: [
      '6 unit IP Camera Dome/Bullet 4MP (Infra-merah malam hari)',
      '1 unit NVR Recorder 8 Channel H.265+',
      'Kabel khusus outdoor berpelindung 100 meter',
      'Setup monitoring online di HP Kepsek & Ruang Keamanan'
    ],
    specs: [
      'Resolusi Kamera: 4 Megapixel (2560 x 1440)',
      'Media Simpan: HDD WD Purple 2TB Khusus CCTV',
      'Bisa merekam nonstop hingga 20 hari',
      'Garansi Resmi Sparepart 1 tahun'
    ]
  }
];

const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    name: 'Drs. H. Mulyadi, M.Pd.',
    role: 'Kepala Sekolah',
    school: 'SMAN 1 Berjaya',
    content: 'Website sekolah kami yang dibuat oleh Educita menaikkan pendaftaran PPDB kami hingga 40%. Sistem kelulusan onlinenya juga luar biasa, membuat pengumuman kelulusan berjalan khidmat tanpa corat-coret di jalanan.',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150',
    rating: 5
  },
  {
    id: 'test-2',
    name: 'Siti Rahma, S.Kom.',
    role: 'Wakasek Sarpras & IT',
    school: 'SMP Prestasi Bangsa',
    content: 'Penyusunan Lab Komputer dan jaringan Wi-Fi voucher untuk siswa sangat rapi! Jaringan dipisahkan cerdas sehingga akses pengerjaan Asesmen Nasional guru dan TU berjalan stabil dan lancar tiada kendala.',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150',
    rating: 5
  }
];

const DEFAULT_GUESTBOOK: WeddingGuestbook[] = [
  {
    id: 'gst-1',
    name: 'Drs. Hermawan',
    relation: 'Rekan Kerja Guru',
    message: 'Selamat menempuh hidup baru Hanum & Luthfi! Semoga dilimpahi keberkahan dan kebahagiaan serta senantiasa dalam cinta yang sakinah mawaddah warahmah.',
    createdAt: '2026-05-29T10:30:00Z'
  },
  {
    id: 'gst-2',
    name: 'Rian & Ika (Bandung)',
    relation: 'Sahabat Kuliah Luthfi',
    message: 'Happy wedding brother! Sori barangkali belum sempat hadir langsung tapi doa terbaik dari kami berdua dari Bandung. Semoga sakinah dan cepat diberikan momongan ya ffi!',
    createdAt: '2026-05-30T14:45:00Z'
  }
];

const DEFAULT_RSVP: WeddingRSVP[] = [
  {
    id: 'rsvp-1',
    name: 'Farhan Azis',
    attendance: 'hadir',
    guestsCount: 2,
    wishes: 'Insya Allah hadir berdua istri bro. Lancar terus ya acaranya sampai hari H.',
    createdAt: '2026-05-31T01:20:00Z'
  }
];

const DEFAULT_CONSULTATIONS: ConsultationRequest[] = [
  {
    id: 'con-1',
    schoolName: 'SMP Harapan Kita',
    contactName: 'Ibu Listiawati, S.E.',
    phone: '081234567890',
    serviceNeeded: 'Website Sekolah Modern',
    message: 'Kami ingin berkonsultasi mengenai paket website sekolah yang sudah include PPDB online, mohon hubungi kami kembali.',
    status: 'pending',
    createdAt: '2026-05-31T09:15:00Z'
  }
];

// Initialize localStorage if keys do not exist
const initLocalStorage = () => {
  if (typeof window === 'undefined') return;
  if (!localStorage.getItem('educita_services')) {
    localStorage.setItem('educita_services', JSON.stringify(DEFAULT_SERVICES));
  }
  if (!localStorage.getItem('educita_projects')) {
    localStorage.setItem('educita_projects', JSON.stringify(DEFAULT_PROJECTS));
  }
  if (!localStorage.getItem('educita_products')) {
    localStorage.setItem('educita_products', JSON.stringify(DEFAULT_PRODUCTS));
  }
  if (!localStorage.getItem('educita_testimonials')) {
    localStorage.setItem('educita_testimonials', JSON.stringify(DEFAULT_TESTIMONIALS));
  }
  if (!localStorage.getItem('educita_guestbook')) {
    localStorage.setItem('educita_guestbook', JSON.stringify(DEFAULT_GUESTBOOK));
  }
  if (!localStorage.getItem('educita_rsvp')) {
    localStorage.setItem('educita_rsvp', JSON.stringify(DEFAULT_RSVP));
  }
  if (!localStorage.getItem('educita_consultations')) {
    localStorage.setItem('educita_consultations', JSON.stringify(DEFAULT_CONSULTATIONS));
  }
};

initLocalStorage();

// ==========================================
// CENTRAL DATA SERVICE FOR REAL / MOCK ENGINES
// ==========================================

export const dbService = {
  // Services
  async getServices(): Promise<SchoolService[]> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase!.from('services').select('*').order('id', { ascending: true });
      if (!error && data) return data as SchoolService[];
    }
    return JSON.parse(localStorage.getItem('educita_services') || '[]');
  },

  async saveService(service: SchoolService): Promise<SchoolService> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase!.from('services').upsert(service).select().single();
      if (!error && data) return data as SchoolService;
    }
    const list = this.getServicesSync();
    const index = list.findIndex(s => s.id === service.id);
    if (index !== -1) {
      list[index] = service;
    } else {
      list.push(service);
    }
    localStorage.setItem('educita_services', JSON.stringify(list));
    return service;
  },

  getServicesSync(): SchoolService[] {
    return JSON.parse(localStorage.getItem('educita_services') || '[]');
  },

  // Projects
  async getProjects(): Promise<ProjectShowcase[]> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase!.from('projects').select('*').order('completedYear', { ascending: false });
      if (!error && data) return data as ProjectShowcase[];
    }
    return JSON.parse(localStorage.getItem('educita_projects') || '[]');
  },

  async saveProject(project: ProjectShowcase): Promise<ProjectShowcase> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase!.from('projects').upsert(project).select().single();
      if (!error && data) return data as ProjectShowcase;
    }
    const list = this.getProjectsSync();
    const index = list.findIndex(p => p.id === project.id);
    if (index !== -1) {
      list[index] = project;
    } else {
      list.push(project);
    }
    localStorage.setItem('educita_projects', JSON.stringify(list));
    return project;
  },

  getProjectsSync(): ProjectShowcase[] {
    return JSON.parse(localStorage.getItem('educita_projects') || '[]');
  },

  // Products
  async getProducts(): Promise<ShopProduct[]> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase!.from('products').select('*').order('name', { ascending: true });
      if (!error && data) return data as ShopProduct[];
    }
    return JSON.parse(localStorage.getItem('educita_products') || '[]');
  },

  async saveProduct(product: ShopProduct): Promise<ShopProduct> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase!.from('products').upsert(product).select().single();
      if (!error && data) return data as ShopProduct;
    }
    const list = this.getProductsSync();
    const index = list.findIndex(p => p.id === product.id);
    if (index !== -1) {
      list[index] = product;
    } else {
      list.push(product);
    }
    localStorage.setItem('educita_products', JSON.stringify(list));
    return product;
  },

  getProductsSync(): ShopProduct[] {
    return JSON.parse(localStorage.getItem('educita_products') || '[]');
  },

  // Testimonials
  async getTestimonials(): Promise<Testimonial[]> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase!.from('testimonials').select('*');
      if (!error && data) return data as Testimonial[];
    }
    return JSON.parse(localStorage.getItem('educita_testimonials') || '[]');
  },

  async saveTestimonial(testimonial: Testimonial): Promise<Testimonial> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase!.from('testimonials').upsert(testimonial).select().single();
      if (!error && data) return data as Testimonial;
    }
    const list = this.getTestimonialsSync();
    const index = list.findIndex(t => t.id === testimonial.id);
    if (index !== -1) {
      list[index] = testimonial;
    } else {
      list.push(testimonial);
    }
    localStorage.setItem('educita_testimonials', JSON.stringify(list));
    return testimonial;
  },

  getTestimonialsSync(): Testimonial[] {
    return JSON.parse(localStorage.getItem('educita_testimonials') || '[]');
  },

  // Wedding Guestbook
  async getWeddingGuestbook(): Promise<WeddingGuestbook[]> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase!.from('wedding_guestbook').select('*').order('createdAt', { ascending: false });
      if (!error && data) return data as WeddingGuestbook[];
    }
    return JSON.parse(localStorage.getItem('educita_guestbook') || '[]')
      .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async addGuestbookEntry(entry: Omit<WeddingGuestbook, 'id' | 'createdAt'>): Promise<WeddingGuestbook> {
    const newEntry: WeddingGuestbook = {
      id: `gst-${Date.now()}`,
      createdAt: new Date().toISOString(),
      ...entry
    };
    if (isSupabaseConfigured) {
      const { data, error } = await supabase!.from('wedding_guestbook').insert(newEntry).select().single();
      if (!error && data) return data as WeddingGuestbook;
    }
    const list = JSON.parse(localStorage.getItem('educita_guestbook') || '[]');
    list.unshift(newEntry);
    localStorage.setItem('educita_guestbook', JSON.stringify(list));
    return newEntry;
  },

  // Wedding RSVPs
  async getRSVPs(): Promise<WeddingRSVP[]> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase!.from('rsvp').select('*').order('createdAt', { ascending: false });
      if (!error && data) return data as WeddingRSVP[];
    }
    return JSON.parse(localStorage.getItem('educita_rsvp') || '[]');
  },

  async addRSVP(rsvp: Omit<WeddingRSVP, 'id' | 'createdAt'>): Promise<WeddingRSVP> {
    const newRsvp: WeddingRSVP = {
      id: `rsvp-${Date.now()}`,
      createdAt: new Date().toISOString(),
      ...rsvp
    };
    if (isSupabaseConfigured) {
      const { data, error } = await supabase!.from('rsvp').insert(newRsvp).select().single();
      if (!error && data) return data as WeddingRSVP;
    }
    const list = JSON.parse(localStorage.getItem('educita_rsvp') || '[]');
    list.unshift(newRsvp);
    localStorage.setItem('educita_rsvp', JSON.stringify(list));
    return newRsvp;
  },

  // Consultation Requests
  async getConsultations(): Promise<ConsultationRequest[]> {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase!.from('consultations').select('*').order('createdAt', { ascending: false });
      if (!error && data) return data as ConsultationRequest[];
    }
    return JSON.parse(localStorage.getItem('educita_consultations') || '[]');
  },

  async addConsultation(req: Omit<ConsultationRequest, 'id' | 'createdAt' | 'status'>): Promise<ConsultationRequest> {
    const newReq: ConsultationRequest = {
      id: `con-${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
      ...req
    };
    if (isSupabaseConfigured) {
      const { data, error } = await supabase!.from('consultations').insert(newReq).select().single();
      if (!error && data) return data as ConsultationRequest;
    }
    const list = JSON.parse(localStorage.getItem('educita_consultations') || '[]');
    list.unshift(newReq);
    localStorage.setItem('educita_consultations', JSON.stringify(list));
    return newReq;
  },

  async updateConsultationStatus(id: string, status: 'pending' | 'contacted' | 'completed'): Promise<boolean> {
    if (isSupabaseConfigured) {
      const { error } = await supabase!.from('consultations').update({ status }).eq('id', id);
      if (!error) return true;
    }
    const list = await this.getConsultations();
    const index = list.findIndex(c => c.id === id);
    if (index !== -1) {
      list[index].status = status;
      localStorage.setItem('educita_consultations', JSON.stringify(list));
      return true;
    }
    return false;
  }
};

// ==========================================
// DDL GENERATOR FOR THE USER COPIED FROM ADMIN
// ==========================================
export const SUPABASE_SQL_DDL = `-- DDL SQL SCHEMA FOR SUPABASE / POSTGRESQL --
-- Run these queries within the Supabase SQL Editor to provision your database tables.

-- 1. Services Table
create table if not exists services (
  id text primary key,
  name text not null,
  category text not null,
  description text not null,
  details text[] not null,
  icon text not null,
  price_range text,
  popular boolean default false
);

-- 2. Projects Table
create table if not exists projects (
  id text primary key,
  title text not null,
  category text not null,
  school_name text not null,
  description text not null,
  stats text not null,
  image_url text not null,
  completed_year integer not null
);

-- 3. Products Table
create table if not exists products (
  id text primary key,
  slug text not null unique,
  name text not null,
  category text not null,
  description text not null,
  price numeric not null,
  featured boolean default false,
  image_url text not null,
  features text[] not null,
  specs text[] not null
);

-- 4. Testimonials Table
create table if not exists testimonials (
  id text primary key,
  name text not null,
  role text not null,
  school text not null,
  content text not null,
  avatar_url text not null,
  rating integer default 5
);

-- 5. Wedding Guestbook Table
create table if not exists wedding_guestbook (
  id text primary key,
  name text not null,
  relation text not null,
  message text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. Wedding RSVP Table
create table if not exists rsvp (
  id text primary key,
  name text not null,
  attendance text not null,
  guests_count integer not null,
  wishes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. Consultations Table
create table if not exists consultations (
  id text primary key,
  school_name text not null,
  contact_name text not null,
  phone text not null,
  service_needed text not null,
  message text,
  status text default 'pending' not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS) on crucial user input tables:
alter table wedding_guestbook enable row level security;
alter table rsvp enable row level security;
alter table consultations enable row level security;

-- Create open inserts policy for guest submissions:
create policy "Allow open creation for wedding guestbook"
  on wedding_guestbook for insert
  with check (true);

create policy "Allow open read access for wedding guestbook"
  on wedding_guestbook for select
  using (true);

create policy "Allow open creation for rsvp"
  on rsvp for insert
  with check (true);

create policy "Allow open reading of RSVPs for admin user"
  on rsvp for select
  using (true); -- Replace with auth verification if required

create policy "Allow anonymous consultations request entry"
  on consultations for insert
  with check (true);
`;
