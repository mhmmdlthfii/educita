import React, { useState } from 'react';
import { 
  Database, DatabaseBackup, PlusCircle, CheckCircle2, 
  Copy, Check, FileCheck2, Trash2, ArrowRight, BookOpen, 
  ShieldCheck, HelpCircle, Key, Edit, Sliders, ChevronDown 
} from 'lucide-react';
import { dbService, SUPABASE_SQL_DDL } from '../lib/supabase';
import { SchoolService, ShopProduct, ProjectShowcase } from '../types/database';

export default function AdminView() {
  const [activeTab, setActiveTab] = useState<'sql' | 'add_service' | 'add_product' | 'add_project'>('sql');
  const [copiedSql, setCopiedSql] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  // 1. Service Form State
  const [serviceForm, setServiceForm] = useState<Omit<SchoolService, 'id'>>({
    name: '',
    category: 'software',
    description: '',
    details: [''],
    icon: 'Globe',
    priceRange: '',
    popular: false
  });

  // 2. Product Form State
  const [productForm, setProductForm] = useState<Omit<ShopProduct, 'id' | 'slug'>>({
    name: '',
    category: 'systems',
    description: '',
    price: 3500000,
    featured: false,
    imageUrl: 'https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&q=80&w=600',
    features: [''],
    specs: ['']
  });

  // 3. Project Form State
  const [projectForm, setProjectForm] = useState<Omit<ProjectShowcase, 'id'>>({
    title: '',
    category: 'Website Sekolah',
    schoolName: '',
    description: '',
    stats: '',
    imageUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=600',
    completedYear: 2026
  });

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_DDL);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 3000);
  };

  // Service submit
  const handleServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceForm.name || !serviceForm.description) {
      alert('Mohon isi nama layanan dan deskripsi singkat.');
      return;
    }
    const newService: SchoolService = {
      id: `srv-${Date.now()}`,
      ...serviceForm,
      details: serviceForm.details.filter(d => d.trim() !== '')
    };
    await dbService.saveService(newService);
    triggerSuccess();
    setServiceForm({
      name: '',
      category: 'software',
      description: '',
      details: [''],
      icon: 'Globe',
      priceRange: '',
      popular: false
    });
  };

  // Product submit
  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name || !productForm.description) {
      alert('Mohon lengkapi nama produk.');
      return;
    }
    const slug = productForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newProduct: ShopProduct = {
      id: `prod-${Date.now()}`,
      slug,
      ...productForm,
      features: productForm.features.filter(f => f.trim() !== ''),
      specs: productForm.specs.filter(s => s.trim() !== '')
    };
    await dbService.saveProduct(newProduct);
    triggerSuccess();
    setProductForm({
      name: '',
      category: 'systems',
      description: '',
      price: 3500000,
      featured: false,
      imageUrl: 'https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&q=80&w=600',
      features: [''],
      specs: ['']
    });
  };

  // Project submit
  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectForm.title || !projectForm.schoolName) {
      alert('Mohon lengkapi judul projek dan nama sekolah.');
      return;
    }
    const newProject: ProjectShowcase = {
      id: `proj-${Date.now()}`,
      ...projectForm
    };
    await dbService.saveProject(newProject);
    triggerSuccess();
    setProjectForm({
      title: '',
      category: 'Website Sekolah',
      schoolName: '',
      description: '',
      stats: '',
      imageUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=600',
      completedYear: 2026
    });
  };

  const triggerSuccess = () => {
    setSubmissionSuccess(true);
    setTimeout(() => setSubmissionSuccess(false), 4000);
  };

  const handleArrayFieldChange = (
    value: string, 
    index: number, 
    formType: 'service' | 'product_feat' | 'product_spec',
    action: 'update' | 'add'
  ) => {
    if (formType === 'service') {
      const copy = [...serviceForm.details];
      if (action === 'update') {
        copy[index] = value;
      } else {
        copy.push('');
      }
      setServiceForm({ ...serviceForm, details: copy });
    } else if (formType === 'product_feat') {
      const copy = [...productForm.features];
      if (action === 'update') {
        copy[index] = value;
      } else {
        copy.push('');
      }
      setProductForm({ ...productForm, features: copy });
    } else {
      const copy = [...productForm.specs];
      if (action === 'update') {
        copy[index] = value;
      } else {
        copy.push('');
      }
      setProductForm({ ...productForm, specs: copy });
    }
  };

  return (
    <div className="relative pb-24 pattern-dots pt-4 text-slate-800">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        
        {/* HEADER SECTION */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest block mb-1">EDUCITA CENTRAL CMS</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">Manajemen Konten Sekolah</h1>
          <p className="mt-2 text-slate-500 text-xs sm:text-sm">
            Kontrol dan perbarui seluruh konten visual, layanan, dan katalog produk yang tampil pada halaman depan website Educita secara modular.
          </p>
        </div>

        {/* TABS SELECTOR */}
        <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-xl bg-slate-100 border border-slate-200 mb-8 max-w-2xl mx-auto">
          {[
            { id: 'sql', label: 'Supabase SQL Schema', icon: <Database className="w-4 h-4" /> },
            { id: 'add_service', label: 'Tambah Layanan', icon: <PlusCircle className="w-4 h-4" /> },
            { id: 'add_product', label: 'Tambah Produk Jualan', icon: <PlusCircle className="w-4 h-4" /> },
            { id: 'add_project', label: 'Tambah Kisah Sukses', icon: <PlusCircle className="w-4 h-4" /> }
          ].map(tb => (
            <button 
              key={tb.id}
              onClick={() => setActiveTab(tb.id as any)}
              className={`flex items-center gap-2 py-2 px-4 rounded-lg font-bold text-xs cursor-pointer transition-colors ${
                activeTab === tb.id 
                  ? 'bg-emerald-600 text-white shadow' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {tb.icon}
              <span>{tb.label}</span>
            </button>
          ))}
        </div>

        {/* GLOBAL SUBMISSIONS SUCCESS BANNER */}
        {submissionSuccess && (
          <div className="p-4 bg-emerald-100 border border-emerald-300 text-emerald-950 font-bold rounded-2xl text-xs mb-8 flex items-center gap-2.5 animate-pulse">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Konten baru berhasil diunggah! Perubahan ini langsung disinkronkan dan dapat ditinjau di tab navigasi `/` dan `/shop` seketika.</span>
          </div>
        )}

        {/* 1. SUPABASE SQL SCHEMA GENERATOR */}
        {activeTab === 'sql' && (
          <div className="liquid-glass rounded-3xl border border-white/80 p-6 md:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-5">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                  <DatabaseBackup className="w-5 h-5 text-emerald-600" />
                  <span>PostgreSQL / Supabase DDL Script</span>
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Salin script SQL di bawah ini untuk menginisialisasi skema tabel database sesungguhnya di dasbor Supabase Anda.</p>
              </div>

              <button 
                onClick={handleCopySql}
                className="w-full sm:w-auto px-4 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl shadow hover:bg-slate-800 transition duration-200 cursor-pointer flex items-center justify-center gap-2"
              >
                {copiedSql ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedSql ? 'Tersalin!' : 'Copy Script SQL'}</span>
              </button>
            </div>

            <div className="p-4 bg-slate-900 text-slate-100 rounded-2xl overflow-x-auto font-mono text-[10px] leading-relaxed max-h-96 border border-slate-950">
              <pre>{SUPABASE_SQL_DDL}</pre>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl">
              <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <ShieldCheck className="w-4.5 h-4.5 text-emerald-600" />
                <span>Rekomendasi Keamanan & RLS (Row Level Security)</span>
              </h4>
              <p className="text-[10px] text-slate-500 mt-1 lines-relaxed leading-relaxed">
                Skema SQL di atas secara otomatis mengonfigurasi Row Level Security (RLS) pada tabel-tabel penerimaan publik seperti `wedding_guestbook`, `rsvp`, dan `consultations`. Ini mencegah pembacaan atau manipulasi data ilegal oleh pengguna tidak dikenal sekaligus menjamin integritas situs sekolah.
              </p>
            </div>
          </div>
        )}

        {/* 2. TAMBAH LAYANAN FORM */}
        {activeTab === 'add_service' && (
          <form onSubmit={handleServiceSubmit} className="liquid-glass rounded-3xl border border-white/80 p-6 sm:p-8 space-y-4">
            <h3 className="text-base font-extrabold text-slate-950 tracking-tight">Buat Layanan Sekolah Baru</h3>
            <p className="text-[11px] text-slate-400">Layanan baru ini akan ditambahkan ke dashboard depan list "Solusi Teknologi Terbaik untuk Sekolah" secara real-time.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Layanan</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  placeholder="Contoh: Digital Signature Guru"
                  value={serviceForm.name}
                  onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Kategori Layanan</label>
                <select 
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-white"
                  value={serviceForm.category}
                  onChange={(e) => setServiceForm({ ...serviceForm, category: e.target.value as any })}
                >
                  <option value="software">Software (Administrasi / Web)</option>
                  <option value="hardware">Hardware (CCTV / Lab)</option>
                  <option value="infrastructure">Infrastructure (BOS / Jaringan)</option>
                  <option value="consultation">Consultation (Privat IT / RAB)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Desain Icon Visual</label>
                <select 
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-white"
                  value={serviceForm.icon}
                  onChange={(e) => setServiceForm({ ...serviceForm, icon: e.target.value })}
                >
                  <option value="Globe">Dunia / Globe (Web)</option>
                  <option value="GraduationCap">Toga (Kelulusan)</option>
                  <option value="Mail">E-Mail / Surat (Arsip)</option>
                  <option value="FileSpreadsheet">Tabel Excel (Rapor)</option>
                  <option value="Camera">CCTV Pemantau (Keamanan)</option>
                  <option value="Monitor">Lab Kerja PC (Perakitan)</option>
                  <option value="Wifi">Sinyal Wi-Fi (MikroTik)</option>
                  <option value="Cpu">Central Chip (Servis BOS)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Estimasi Kisaran Biaya</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  placeholder="Contoh: Rp 3.000.000 - Rp 5.000.000"
                  value={serviceForm.priceRange || ''}
                  onChange={(e) => setServiceForm({ ...serviceForm, priceRange: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Deskripsi Singkat (Bahasa Indonesia)</label>
              <textarea 
                rows={3}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                placeholder="Tuliskan jaminan penyelesaian hardware/software lengkap penawaran..."
                value={serviceForm.description}
                onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                required
              />
            </div>

            {/* Service details (array) */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-semibold text-slate-700">Poin Fitur Unggulan (Hingga 3 Poin)</label>
                <button 
                  type="button" 
                  onClick={() => handleArrayFieldChange('', 0, 'service', 'add')}
                  className="text-[10px] font-bold text-emerald-800 hover:underline"
                >
                  + Tambah Poin Fitur
                </button>
              </div>
              <div className="space-y-2">
                {serviceForm.details.map((det, index) => (
                  <input 
                    key={index}
                    type="text"
                    placeholder={`Fitur ${index + 1}`}
                    className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    value={det}
                    onChange={(e) => handleArrayFieldChange(e.target.value, index, 'service', 'update')}
                  />
                ))}
              </div>
            </div>

            <button 
              type="submit"
              className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-extrabold text-xs rounded-xl shadow cursor-pointer"
            >
              Simpan dan Publikasikan Layanan
            </button>
          </form>
        )}

        {/* 3. TAMBAH SHOP PRODUCT FORMS */}
        {activeTab === 'add_product' && (
          <form onSubmit={handleProductSubmit} className="liquid-glass rounded-3xl border border-white/80 p-6 sm:p-8 space-y-4">
            <h3 className="text-base font-extrabold text-slate-950 tracking-tight">Tambah Produk Toko</h3>
            <p className="text-[11px] text-slate-400">Produk yang diunggah akan otomatis terintegrasi dengan filter pencarian dan detail page di menu `/shop`.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Produk Toko</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  placeholder="Contoh: Paket CCTV 12 Kamera IP"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Kategori Produk</label>
                <select 
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-white"
                  value={productForm.category}
                  onChange={(e) => setProductForm({ ...productForm, category: e.target.value as any })}
                >
                  <option value="packages">Paket Layanan Utama / Bundle</option>
                  <option value="systems">Sistem Web (Aplikasi Sekolah)</option>
                  <option value="hardware">Instalasi Hardware (Lab / Server)</option>
                  <option value="services">Maintenance Jasa Servis Bulanan</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Harga Dasar (IDR / Rupiah)</label>
                <input 
                  type="number" 
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  placeholder="Contoh: 1500000"
                  value={productForm.price}
                  onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Asset Cover Image (CDN/Unsplash)</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  value={productForm.imageUrl}
                  onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Deskripsi Lengkap Jual</label>
              <textarea 
                rows={3}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                placeholder="Rincian kegunaan solusi, efisiensi kerja operator..."
                value={productForm.description}
                onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-semibold text-slate-700">Materi Fitur</label>
                  <button 
                    type="button" 
                    onClick={() => handleArrayFieldChange('', 0, 'product_feat', 'add')}
                    className="text-[10px] font-bold text-emerald-800 hover:underline"
                  >
                    + Tambah Fitur
                  </button>
                </div>
                {productForm.features.map((feat, idx) => (
                  <input 
                    key={idx}
                    type="text"
                    placeholder={`Fitur Materi ${idx + 1}`}
                    className="w-full px-3 py-1 text-xs border border-slate-200 rounded-lg mb-1 focus:outline-none"
                    value={feat}
                    onChange={(e) => handleArrayFieldChange(e.target.value, idx, 'product_feat', 'update')}
                  />
                ))}
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-semibold text-slate-700">Spesifikasi Delivery</label>
                  <button 
                    type="button" 
                    onClick={() => handleArrayFieldChange('', 0, 'product_spec', 'add')}
                    className="text-[10px] font-bold text-emerald-800 hover:underline"
                  >
                    + Tambah Spek
                  </button>
                </div>
                {productForm.specs.map((spec, idx) => (
                  <input 
                    key={idx}
                    type="text"
                    placeholder={`Spek Pengiriman ${idx + 1}`}
                    className="w-full px-3 py-1 text-xs border border-slate-200 rounded-lg mb-1 focus:outline-none"
                    value={spec}
                    onChange={(e) => handleArrayFieldChange(e.target.value, idx, 'product_spec', 'update')}
                  />
                ))}
              </div>
            </div>

            <button 
              type="submit"
              className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-extrabold text-xs rounded-xl shadow cursor-pointer"
            >
              Simpan dan Publikasikan SKU Produk
            </button>
          </form>
        )}

        {/* 4. TAMBAH PROJEK SHOWCASE */}
        {activeTab === 'add_project' && (
          <form onSubmit={handleProjectSubmit} className="liquid-glass rounded-3xl border border-white/80 p-6 sm:p-8 space-y-4">
            <h3 className="text-base font-extrabold text-slate-950 tracking-tight">Unggah Kisah Sukses Sekolah</h3>
            <p className="text-[11px] text-slate-400">Tampilkan portfolio instalasi asli tim Educita untuk menaikkan trust-level calon klien baru.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Judul Projek Utama</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  placeholder="Contoh: Digitalisasi Lab SMPN 3"
                  value={projectForm.title}
                  onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Sekolah</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  placeholder="Contoh: SMPN 3 Bogor"
                  value={projectForm.schoolName}
                  onChange={(e) => setProjectForm({ ...projectForm, schoolName: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Kategori Portofolio</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  placeholder="Contoh: Website & Jaringan"
                  value={projectForm.category}
                  onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Dampak Utama (Stats Singkat)</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  placeholder="Contoh: 1,500 Siswa Terfasilitasi"
                  value={projectForm.stats}
                  onChange={(e) => setProjectForm({ ...projectForm, stats: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Tahun Penyelesaian</label>
                <input 
                  type="number" 
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  placeholder="Contoh: 2026"
                  value={projectForm.completedYear}
                  onChange={(e) => setProjectForm({ ...projectForm, completedYear: Number(e.target.value) })}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Foto Portofolio Utama</label>
              <input 
                type="text" 
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                value={projectForm.imageUrl}
                onChange={(e) => setProjectForm({ ...projectForm, imageUrl: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Penjelasan Singkat Projek</label>
              <textarea 
                rows={3}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                placeholder="Rincian perangkat keras yang dipasang atau keunggulan server yang didirikan..."
                value={projectForm.description}
                onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                required
              />
            </div>

            <button 
              type="submit"
              className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-extrabold text-xs rounded-xl shadow cursor-pointer"
            >
              Publikasikan Kisah Sukses Sekolah
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
