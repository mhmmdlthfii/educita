import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, ShoppingBag, Check, ShieldCheck, 
  Sparkles, ArrowLeft, Send, CheckCircle, 
  HelpCircle, MessageSquare, Flame, PhoneCall, ChevronRight, Layers
} from 'lucide-react';
import { dbService } from '../lib/supabase';
import { ShopProduct } from '../types/database';

interface ShopViewProps {
  selectedSlug?: string;
  onSelectSlug: (slug: string | null) => void;
  initialSearchQuery?: string;
}

export default function ShopView({ selectedSlug, onSelectSlug, initialSearchQuery = '' }: ShopViewProps) {
  const [products, setProducts] = useState<ShopProduct[]>([]);
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'systems' | 'hardware' | 'services' | 'packages'>('all');
  const [orderModalProduct, setOrderModalProduct] = useState<ShopProduct | null>(null);
  const [orderForm, setOrderForm] = useState({ name: '', school: '', phone: '', note: '' });
  const [orderSuccess, setOrderSuccess] = useState(false);

  useEffect(() => {
    async function load() {
      const p = await dbService.getProducts();
      setProducts(p);
    }
    load();
  }, []);

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(num);
  };

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderForm.name || !orderForm.school || !orderForm.phone) {
      alert('Harap isi nama Anda, nama sekolah, dan nomor kontak.');
      return;
    }
    setOrderSuccess(true);
    setTimeout(() => {
      setOrderSuccess(false);
      setOrderModalProduct(null);
      setOrderForm({ name: '', school: '', phone: '', note: '' });
    }, 4500);
  };

  // Filter based on search & category
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // If a slug is active, show the details view
  const activeProduct = selectedSlug ? products.find(p => p.slug === selectedSlug) : null;

  if (activeProduct) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 relative">
        <div className="absolute top-10 right-10 w-64 h-64 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none"></div>
        
        {/* Back navigation */}
        <button 
          onClick={() => onSelectSlug(null)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm font-semibold text-xs mb-8 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-slate-500" />
          <span>Kembali ke Katalog Produk</span>
        </button>

        {/* Dynamic Product Detail Card */}
        <div className="liquid-glass rounded-3xl overflow-hidden border border-white/80 shadow-lg p-6 sm:p-10 text-slate-800">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
            
            {/* Column Image */}
            <div className="md:col-span-5">
              <div className="rounded-2xl overflow-hidden border border-slate-100 shadow-sm aspect-video sm:aspect-square relative group">
                <img 
                  src={activeProduct.imageUrl} 
                  alt={activeProduct.name} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                {activeProduct.featured && (
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-amber-500/90 text-slate-950 font-black text-[10px] tracking-wider uppercase flex items-center gap-1 shadow-sm">
                    <Flame className="w-3.5 h-3.5 fill-slate-950" />
                    <span>Best Seller</span>
                  </div>
                )}
              </div>

              {/* Secure guarantee widget */}
              <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Garansi Kepuasan Mitra</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">Educita menjamin pelatihan gratis untuk operator sekolah & pemeliharaan bug sistem selama 12 bulan penuh.</p>
                </div>
              </div>
            </div>

            {/* Column Description */}
            <div className="md:col-span-7 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-extrabold text-emerald-700 uppercase tracking-widest block bg-emerald-100/40 w-fit px-2 py-0.5 rounded mb-3">
                  {activeProduct.category.toUpperCase()}
                </span>
                
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
                  {activeProduct.name}
                </h1>

                <div className="mt-4 text-2xl font-black text-emerald-700 font-mono">
                  {formatRupiah(activeProduct.price)}
                </div>

                <p className="mt-4 text-slate-500 text-xs sm:text-sm leading-relaxed">
                  {activeProduct.description}
                </p>

                {/* Features Checklist */}
                <div className="mt-6 border-t border-slate-100 pt-6">
                  <h3 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-3">Materi / Fitur Layanan:</h3>
                  <ul className="space-y-2">
                    {activeProduct.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-600">
                        <Check className="w-4.5 h-4.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Tech Specs */}
                <div className="mt-6 border-t border-slate-100 pt-6">
                  <h3 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-3">Spesifikasi Delivery:</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {activeProduct.specs.map((spec, idx) => (
                      <div key={idx} className="p-2.5 rounded-lg bg-slate-50/50 text-[11px] text-slate-600 border border-slate-100 font-medium">
                        {spec}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Inquiry Action Box */}
              <div className="mt-10 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-4">
                <button 
                  onClick={() => setOrderModalProduct(activeProduct)}
                  className="w-full sm:flex-1 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold tracking-wide shadow-md hover:shadow-lg transition duration-200 cursor-pointer flex items-center justify-center gap-2 text-sm"
                >
                  <ShoppingBag className="w-4.5 h-4.5" />
                  <span>Pesan / Jadwalkan Demo</span>
                </button>
                <a 
                  href={`https://wa.me/6281234567890?text=Halo%20Educita,%20sekolah%20kami%20tertarik%20dengan%20layanan%20${encodeURIComponent(activeProduct.name)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-100 text-slate-700 font-semibold text-xs border border-slate-200 hover:bg-slate-200 transition-colors cursor-pointer text-center flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-600" />
                  <span>Diskusi via WhatsApp</span>
                </a>
              </div>

            </div>

          </div>
        </div>

        {/* ORDER / DEMO REQUEST DRAWER */}
        {orderModalProduct && (
          <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative text-slate-800">
              <button 
                onClick={() => setOrderModalProduct(null)}
                className="absolute top-4 right-4 w-7 h-7 bg-slate-100 rounded-full flex items-center justify-center hover:bg-slate-200 cursor-pointer text-xs"
              >
                ✕
              </button>

              {orderSuccess ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-emerald-600 animate-bounce" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">Demo Terjadwal!</h3>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    Terima kasih! Invoice penawaran informal dan proposal teknis PDF mengenai <strong className="text-emerald-700">{orderModalProduct.name}</strong> akan dikirimkan ke nomor WhatsApp Anda.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleOrderSubmit} className="space-y-4">
                  <h3 className="text-lg font-bold text-slate-950">Formulir Pesan & Demo</h3>
                  <p className="text-[11px] text-slate-400">Silakan lengkapi formulir pendaftaran pemesanan. Tagihan resmi dan lampiran BOS akan diproses tim legal Educita.</p>
                  
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-xs text-slate-700 mb-2">
                    Layanan: <strong className="text-emerald-800">{orderModalProduct.name}</strong><br />
                    Mulai: <span className="font-mono text-emerald-700">{formatRupiah(orderModalProduct.price)}</span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-0.5">Nama Kontak Penjawab</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      placeholder="Nama Lengkap & Jabatan (Contoh: Budi, Wakasek)"
                      value={orderForm.name}
                      onChange={(e) => setOrderForm({...orderForm, name: e.target.value})}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-0.5">Nama Sekolah / Instansi</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      placeholder="Contoh: SMAN 2 Depok"
                      value={orderForm.school}
                      onChange={(e) => setOrderForm({...orderForm, school: e.target.value})}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-0.5">No. WhatsApp / HP Aktif</label>
                    <input 
                      type="tel" 
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      placeholder="Contoh: 0812345xxxxx"
                      value={orderForm.phone}
                      onChange={(e) => setOrderForm({...orderForm, phone: e.target.value})}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-0.5">Catatan Khusus RAB / BOS (Opsional)</label>
                    <textarea 
                      rows={2} 
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      placeholder="Sebutkan jika membutuhkan pemecahan termin bayar atau penawaran formal dulu..."
                      value={orderForm.note}
                      onChange={(e) => setOrderForm({...orderForm, note: e.target.value})}
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs cursor-pointer shadow"
                  >
                    Kirim Form Pesanan & Demo
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative pb-24 pattern-dots pt-4">
      {/* Background blur blobs */}
      <div className="absolute top-20 left-10 w-80 h-80 bg-teal-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-6xl mx-auto px-4 md:px-8">
        
        {/* Title Heading */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest block mb-1">EDUCITA DIGITAL STORE</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Katalog Layanan & Sistem Sekolah</h1>
          <p className="mt-3 text-slate-500 text-xs sm:text-sm">
            Beli lisensi software mandiri sekali bayar (lifetime) atau paket pemasangan hardware lengkap yang disesuaikan dengan juknis BOS.
          </p>
        </div>

        {/* Filters and Search toolbar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 p-4 liquid-glass rounded-2xl border border-white/60">
          
          {/* Search bar */}
          <div className="relative w-full md:w-96 text-slate-700 bg-white rounded-lg border border-slate-200">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input 
              type="text"
              placeholder="Cari sistem atau paket instalasi..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Categories select row */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">KATEGORI:</span>
            {[
              { id: 'all', label: 'Semu' },
              { id: 'packages', label: 'Paket Utama' },
              { id: 'systems', label: 'Sistem Web' },
              { id: 'hardware', label: 'Hardware' }
            ].map(cat => (
              <button 
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as any)}
                className={`py-1.5 px-3 text-xs font-semibold rounded-lg border cursor-pointer transition-colors ${
                  selectedCategory === cat.id 
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm' 
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

        </div>

        {/* Empty Search warning */}
        {filteredProducts.length === 0 && (
          <div className="text-center p-12 liquid-glass rounded-3xl text-slate-500">
            <HelpCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold">Produk Tidak Ditemukan</h3>
            <p className="text-xs mt-1">Coba sesuaikan kata pencarian atau bersihkan filter filter kategori.</p>
            <button 
              onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
              className="mt-4 px-4 py-2 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-lg cursor-pointer"
            >
              Bersihkan Filter
            </button>
          </div>
        )}

        {/* Interactive Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((p) => (
            <div 
              key={p.id} 
              className="group liquid-glass rounded-3xl overflow-hidden border border-white/60 hover:shadow-xl hover:shadow-emerald-500/5 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Image block */}
                <div className="h-44 relative bg-slate-950 overflow-hidden">
                  <img 
                    src={p.imageUrl} 
                    alt={p.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  {p.featured && (
                    <div className="absolute top-3 left-3 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 font-extrabold text-[9px] tracking-widest uppercase px-2 py-0.5 rounded-md shadow-sm">
                      Best choice
                    </div>
                  )}
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur px-2 py-0.5 rounded text-[9px] font-extrabold text-teal-800 uppercase tracking-widest">
                    {p.category}
                  </div>
                </div>

                {/* Body details */}
                <div className="p-6">
                  <h3 className="text-base font-bold text-slate-800 tracking-tight leading-snug group-hover:text-emerald-700 transition-colors">
                    {p.name}
                  </h3>
                  <div className="text-sm font-black text-emerald-700 font-mono mt-2">
                    {formatRupiah(p.price)}
                  </div>
                  <p className="text-slate-500 text-xs mt-3 leading-relaxed line-clamp-3">
                    {p.description}
                  </p>

                  <div className="mt-4 space-y-1.5 border-t border-slate-100 pt-3">
                    {p.features.slice(0, 3).map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-[11px] text-slate-500">
                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span className="truncate">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Grid footer action */}
              <div className="p-6 pt-0 border-t border-slate-50 mt-auto flex items-center justify-between gap-3">
                <button 
                  onClick={() => onSelectSlug(p.slug)}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-0.5 cursor-pointer"
                >
                  <span>Selengkapnya</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setOrderModalProduct(p)}
                  className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer shadow-sm shadow-emerald-500/10"
                >
                  Tanya Demo
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
