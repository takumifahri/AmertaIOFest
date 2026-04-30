'use client';
import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { FaTimes, FaLeaf, FaCloudUploadAlt, FaChevronDown, FaMapMarkerAlt, FaFileAlt, FaTag, FaImage } from 'react-icons/fa';
import dynamic from 'next/dynamic';

const MapComponent = dynamic(() => import('./MapComponent'), { ssr: false });

import 'leaflet/dist/leaflet.css';
import { getAddressFromCoords } from '@/lib/geo';
import toast from 'react-hot-toast';
import { validateContent } from '@/lib/validation';


export default function CreatePostModal({ isOpen, onClose, onSubmit }) {
  // Form Data State
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'EDUCATION',
    latitude: -6.5892505,
    longitude: 106.8061148,
    address: 'Sekolah Vokasi IPB University'
  });


  const [mapMode, setMapMode] = useState('dark'); // 'dark' or 'light'


  // UI States
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('Sekolah Vokasi IPB University');
  const [searchResults, setSearchResults] = useState([]);
  const [mapCenter, setMapCenter] = useState([-6.5892505, 106.8061148]);


  // Image States
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);

  // Refs & Effects
  const fileInputRef = useRef(null);
  const [L, setL] = useState(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== 'undefined') {
      import('leaflet').then(mod => {
        setL(mod.default);
      });
    }
  }, []);

  if (!isOpen || !isMounted) return null;

  // Location Search Handler
  const handleSearchLocation = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=id`
      );
      const data = await response.json();
      setSearchResults(data.slice(0, 5));
    } catch (error) {
      console.error('Error searching location:', error);
      setSearchResults([]);
    }
  };

  // Select Search Result Handler
  const handleSelectSearchResult = (result) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    const address = result.display_name.split(',')[0];

    setFormData({
      ...formData,
      latitude: lat,
      longitude: lng,
      address
    });
    setMapCenter([lat, lng]);
    setSearchQuery(address);
    setSearchResults([]);
  };

  // File Handlers
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setImages([...images, ...files]);
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setPreviews([...previews, ...newPreviews]);
    }
  };

  const removeImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);

    const newPreviews = [...previews];
    URL.revokeObjectURL(newPreviews[index]);
    newPreviews.splice(index, 1);
    setPreviews(newPreviews);
  };

  // Form Submit Handler
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate Title
    const titleValidation = validateContent(formData.title);
    if (!titleValidation.isValid) {
      toast.error(`Judul bermasalah: ${titleValidation.reason}`);
      return;
    }

    // Validate Content
    const contentValidation = validateContent(formData.content);
    if (!contentValidation.isValid) {
      toast.error(`Konten bermasalah: ${contentValidation.reason}`);
      return;
    }

    const data = new FormData();
    data.append('title', formData.title);
    data.append('content', formData.content);
    data.append('type', formData.type);
    if (formData.latitude) data.append('latitude', formData.latitude);
    if (formData.longitude) data.append('longitude', formData.longitude);
    if (formData.address) data.append('address', formData.address);
    images.forEach((file) => data.append('images', file));
    onSubmit(data);
  };

  // Data
  const categories = [
    { id: 'EDUCATION', label: 'Edukasi & Tips', icon: '📚' },
    { id: 'EXCHANGE', label: 'Tukar Menukar Barang', icon: '♻️' },
    { id: 'ANNOUNCEMENT', label: 'Pengumuman Penting', icon: '📢' }
  ];

  const selectedCategory = categories.find(c => c.id === formData.type);

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4 py-6">
      {/* Background Overlay */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-md transition-all duration-500 cursor-pointer"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="bg-[#0c0c0c] w-full max-w-7xl rounded-[40px] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,1)] relative z-[10000] flex flex-col md:flex-row h-[95vh] md:h-[90vh] max-h-screen border border-white/5 animate-in fade-in zoom-in duration-500">


        {/* Left Side: Branding */}
        <div className="hidden md:flex md:w-[32%] bg-gradient-to-br from-[#0f0f0f] to-[#080808] p-12 flex-col justify-between border-r border-white/10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl opacity-50" />
          </div>

          <div className="relative z-10 space-y-8">
            <div className="w-16 h-16 bg-gradient-to-br from-primary/40 to-primary/10 rounded-[24px] flex items-center justify-center border border-primary/30 shadow-lg shadow-primary/20">
              <FaLeaf className="text-primary text-3xl" />
            </div>
            <div>
              <h2 className="text-5xl font-black leading-[1.1] tracking-tighter mb-6 text-white uppercase">
                MULAI<br />LANGKAH<br /><span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">NYATA</span>
              </h2>
              <p className="text-gray-400 text-sm font-medium leading-relaxed">
                Bagikan aksi sirkularmu dan inspirasi komunitas untuk masa depan yang berkelanjutan.
              </p>
            </div>
          </div>

          <div className="relative z-10 space-y-6">
            <div className="h-px bg-gradient-to-r from-white/0 via-white/20 to-white/0" />
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-[28px] shadow-lg">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-4 flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-primary rounded-full"></span>
                Tips Upload
              </h4>
              <p className="text-xs text-gray-400 leading-relaxed font-medium">
                Gunakan foto berkualitas tinggi dengan pencahayaan baik agar pesanmu tersampaikan dengan jelas.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="flex-1 flex flex-col h-full bg-black">
          {/* Header */}
          <div className="px-10 py-8 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-black via-black to-transparent">
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-500 mb-2">Formulir Gerakan</h3>
              <p className="text-xs text-gray-600">Bagikan cerita perubahan positifmu</p>
            </div>
            <button onClick={onClose} className="w-11 h-11 rounded-xl bg-white/5 hover:bg-red-500/10 flex items-center justify-center text-gray-500 hover:text-red-500 transition-all duration-300 border border-white/5 active:scale-90 shadow-lg">
              <FaTimes size={18} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-10 pt-8 pb-8 no-scrollbar space-y-10">
            {/* Section 1: Title & Category */}
            <div className="space-y-8">
              <h4 className="text-xs font-black uppercase tracking-[0.3em] text-white flex items-center gap-2">
                <span className="w-1 h-5 bg-gradient-to-b from-primary to-primary/50 rounded-full"></span>
                Informasi Dasar
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Title */}
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest flex items-center gap-2">
                    <FaTag size={12} className="text-primary" />
                    Judul Kampanye
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Apa yang ingin kamu bagikan?"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-[#121212] hover:bg-[#151515] border border-white/10 hover:border-white/20 rounded-2xl p-5 text-white text-sm focus:outline-none focus:border-primary/50 focus:bg-[#0a0a0a] focus:shadow-lg focus:shadow-primary/20 transition-all duration-300 font-bold placeholder:text-gray-700"
                  />
                </div>

                {/* Category */}
                <div className="space-y-4 relative">
                  <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest flex items-center gap-2">
                    <FaTag size={12} className="text-primary" />
                    Kategori Gerakan
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-full bg-[#121212] hover:bg-[#151515] border border-white/10 hover:border-white/20 rounded-2xl p-5 text-white text-sm text-left flex items-center justify-between font-bold transition-all duration-300 group"
                  >
                    <span className="flex items-center gap-3">
                      <span className="text-lg">{selectedCategory?.icon}</span>
                      <span>{selectedCategory?.label}</span>
                    </span>
                    <FaChevronDown className={`text-gray-600 group-hover:text-gray-400 transition-all duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} size={14} />
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-3 bg-gradient-to-b from-[#1a1a1a] to-[#131313] border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200 backdrop-blur-md">
                      {categories.map((cat, idx) => (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => {
                            setFormData({ ...formData, type: cat.id });
                            setIsDropdownOpen(false);
                          }}
                          className={`w-full p-4 text-left text-sm font-bold flex items-center gap-4 transition-all duration-200 ${idx !== categories.length - 1 ? 'border-b border-white/5' : ''
                            } ${formData.type === cat.id
                              ? 'bg-gradient-to-r from-primary/20 to-primary/5 text-primary'
                              : 'text-gray-400 hover:bg-white/5'
                            }`}
                        >
                          <span className="text-xl">{cat.icon}</span>
                          <span>{cat.label}</span>
                          {formData.type === cat.id && <span className="ml-auto">✓</span>}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-white/0 via-white/10 to-white/0" />

            {/* Section 2: Location & Content */}
            <div className="space-y-8">
              <h4 className="text-xs font-black uppercase tracking-[0.3em] text-white flex items-center gap-2">
                <span className="w-1 h-5 bg-gradient-to-b from-primary to-primary/50 rounded-full"></span>
                Detail Gerakan
              </h4>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest flex items-center gap-2">
                  <FaMapMarkerAlt size={12} className="text-primary" />
                  Lokasi Kejadian
                </label>

                {/* Search Input */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Cari daerah, jalan, atau kota..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      handleSearchLocation(e.target.value);
                    }}
                    className="w-full bg-[#121212] hover:bg-[#151515] border border-white/10 hover:border-white/20 rounded-2xl p-4 text-white text-sm focus:outline-none focus:border-primary/50 focus:bg-[#0a0a0a] focus:shadow-lg focus:shadow-primary/20 transition-all duration-300 font-bold placeholder:text-gray-700"
                  />

                  {/* Search Results */}
                  {searchResults.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-[#181818] border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-50 max-h-48 overflow-y-auto">
                      {searchResults.map((result, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSelectSearchResult(result)}
                          className="w-full p-3 text-left text-sm hover:bg-primary/10 transition-colors border-b border-white/5 last:border-b-0"
                        >
                          <p className="text-white font-bold text-xs truncate">{result.display_name.split(',')[0]}</p>
                          <p className="text-gray-500 text-[10px] truncate">{result.display_name.split(',').slice(1, 3).join(',')}</p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Map */}
                <div className="h-[450px] -mx-4 rounded-[32px] overflow-hidden border border-white/10 hover:border-white/20 relative bg-[#0a0a0a] shadow-2xl transition-all duration-300 group">


                  {L && (
                    <MapComponent
                      mapCenter={mapCenter}
                      formData={formData}
                      setFormData={setFormData}
                      setMapCenter={setMapCenter}
                      setSearchQuery={setSearchQuery}
                      L={L}
                      mapMode={mapMode}
                    />
                  )}
                  {/* Map Mode Toggle */}
                  <button
                    type="button"
                    onClick={() => setMapMode(mapMode === 'dark' ? 'light' : 'dark')}
                    className="absolute top-4 left-16 z-[500] w-10 h-10 bg-black/90 backdrop-blur-md rounded-xl border border-white/10 flex items-center justify-center text-white hover:text-primary transition-all duration-300 shadow-lg active:scale-90"
                    title="Toggle Map Mode"
                  >
                    {mapMode === 'dark' ? '☀️' : '🌙'}
                  </button>
                  <div className="absolute top-4 right-4 z-[500] px-4 py-2 bg-black/90 backdrop-blur-md rounded-xl border border-white/10 text-[9px] font-black uppercase tracking-widest text-white flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${formData.latitude ? 'bg-primary animate-pulse' : 'bg-gray-600'}`}></span>
                    {formData.latitude ? 'Lokasi Terpilih' : 'Klik di Peta atau Cari'}
                  </div>
                  {formData.latitude && (
                    <div className="absolute bottom-4 left-4 right-4 bg-[#121212]/90 backdrop-blur-xl border border-white/10 rounded-[20px] p-4 z-[500] shadow-2xl animate-in slide-in-from-bottom-2 duration-300">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <FaMapMarkerAlt className="text-primary text-sm" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-black text-white uppercase tracking-[0.2em] mb-1">Lokasi Terpilih</p>
                          <p className="text-xs text-white font-bold truncate">
                            {formData.address || 'Mencari alamat...'}
                          </p>
                          <div className="flex items-center gap-3 mt-2">
                            <div className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded-md">
                              <span className="text-[8px] font-black text-gray-500">LAT</span>
                              <span className="text-[10px] font-mono text-gray-400">{formData.latitude.toFixed(6)}</span>
                            </div>
                            <div className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded-md">
                              <span className="text-[8px] font-black text-gray-500">LNG</span>
                              <span className="text-[10px] font-mono text-gray-400">{formData.longitude.toFixed(6)}</span>
                            </div>
                          </div>
                          <p className="text-[8px] text-gray-500 mt-2 italic font-medium flex items-center gap-1.5">
                            <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
                            Tips: Klik dan geser pin untuk memindahkan lokasi
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="space-y-4">
                <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest flex items-center gap-2">
                  <FaFileAlt size={12} className="text-primary" />
                  Ceritakan Detailnya
                </label>
                <textarea
                  required
                  rows={6}
                  placeholder="Jelaskan aksi atau gerakanmu di sini dengan detail..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full bg-[#121212] hover:bg-[#151515] border border-white/10 hover:border-white/20 rounded-2xl p-6 text-white text-sm focus:outline-none focus:border-primary/50 focus:bg-[#0a0a0a] focus:shadow-lg focus:shadow-primary/20 transition-all duration-300 resize-none font-bold placeholder:text-gray-700"
                />
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-white/0 via-white/10 to-white/0" />

            {/* Section 3: Images */}
            <div className="space-y-8 pb-8">
              <h4 className="text-xs font-black uppercase tracking-[0.3em] text-white flex items-center gap-2">
                <span className="w-1 h-5 bg-gradient-to-b from-primary to-primary/50 rounded-full"></span>
                Dokumentasi Visual
              </h4>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest flex items-center gap-2">
                    <FaImage size={12} className="text-primary" />
                    Upload Dokumentasi
                  </label>
                  <span className="text-[10px] font-bold text-gray-500 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                    {previews.length}/5
                  </span>
                </div>

                <div className="grid grid-cols-5 gap-3">
                  {previews.map((src, idx) => (
                    <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-white/10 group bg-[#0a0a0a] hover:border-white/20 transition-all duration-300">
                      <img src={src} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" alt="preview" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors shadow-lg"
                        >
                          <FaTimes size={12} />
                        </button>
                      </div>
                    </div>
                  ))}

                  {previews.length < 5 && (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="aspect-square rounded-xl border-2 border-dashed border-white/10 hover:border-primary/50 bg-white/[0.02] hover:bg-primary/5 flex flex-col items-center justify-center gap-2 text-gray-600 hover:text-primary transition-all duration-300 group"
                    >
                      <FaCloudUploadAlt size={20} className="group-hover:scale-110 transition-transform" />
                      <span className="text-[8px] font-black uppercase tracking-tighter">Tambah</span>
                    </button>
                  )}
                </div>

                <p className="text-[10px] text-gray-500 flex items-center gap-2">
                  <span>💡</span>
                  <span>Foto berkualitas tinggi dengan pencahayaan baik akan lebih menarik perhatian komunitas</span>
                </p>
              </div>

              <input type="file" multiple hidden ref={fileInputRef} onChange={handleFileChange} accept="image/*" />
            </div>
          </form>

          {/* Footer Button */}
          <div className="sticky bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black via-black/90 to-transparent z-30 border-t border-white/5">
            <button
              type="submit"
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-black py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-sm transition-all duration-300 shadow-[0_20px_60px_rgba(43,76,59,0.4)] active:scale-[0.98] border border-white/10 hover:shadow-[0_30px_80px_rgba(43,76,59,0.5)] flex items-center justify-center gap-2"
            >
              <span>✓</span>
              <span>Publikasikan Sekarang</span>
            </button>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .marker-container { 
          position: relative; 
          width: 30px; 
          height: 30px; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
        }
        .marker-core { 
          width: 14px; 
          height: 14px; 
          border-radius: 50%; 
          border: 2px solid white; 
          z-index: 2; 
          box-shadow: 0 0 8px rgba(43, 76, 59, 0.8);
        }
        .marker-pulse { 
          position: absolute; 
          width: 100%; 
          height: 100%; 
          border-radius: 50%; 
          opacity: 0.6; 
          animation: pulse 2s infinite; 
          z-index: 1; 
        }
        @keyframes pulse { 
          0% { transform: scale(1); opacity: 0.6; } 
          100% { transform: scale(3.5); opacity: 0; } 
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );

  return typeof window !== 'undefined' ? createPortal(modalContent, document.body) : null;
}