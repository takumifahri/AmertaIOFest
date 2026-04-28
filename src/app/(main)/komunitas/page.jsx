'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import toast from 'react-hot-toast';
import CommunityPost from '@/components/community/CommunityPost';
import dynamic from 'next/dynamic';
import { FaMapMarkerAlt, FaPlus, FaFilter, FaLeaf, FaExchangeAlt, FaBullhorn, FaGraduationCap, FaSync, FaImage, FaTimes, FaSearchLocation } from 'react-icons/fa';

// Dynamically import Leaflet components to avoid SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });
const MapEvents = dynamic(() => import('./MapEvents'), { ssr: false });

import 'leaflet/dist/leaflet.css';

export default function CommunityPage() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ALL');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [showMap, setShowMap] = useState(false);
    const [userLocation, setUserLocation] = useState(null);
    const [L, setL] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        type: 'EDUCATION',
        images: [''],
        latitude: null,
        longitude: null
    });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            import('leaflet').then(mod => {
                setL(mod.default);
            });
        }
    }, []);

    useEffect(() => {
        fetchPosts();
        fetchUser();
    }, [filter]);

    const fetchUser = async () => {
        try {
            const res = await api.get('/auth/me');
            setCurrentUser(res.data.user);
        } catch (err) {
            setCurrentUser(null);
        }
    };

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const url = filter === 'ALL' ? '/community' : `/community?type=${filter}`;
            const response = await api.get(url);
            setPosts(response.data);
        } catch (error) {
            toast.error('Gagal mengambil data komunitas');
        } finally {
            setLoading(false);
        }
    };

    const handleAddImageUrl = () => {
        setFormData({ ...formData, images: [...formData.images, ''] });
    };

    const handleImageUrlChange = (index, value) => {
        const newImages = [...formData.images];
        newImages[index] = value;
        setFormData({ ...formData, images: newImages });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!currentUser) {
            toast.error('Silakan login terlebih dahulu');
            return;
        }

        try {
            const payload = {
                ...formData,
                images: formData.images.filter(url => url.trim() !== '')
            };
            await api.post('/community', payload);
            toast.success('Postingan berhasil dibuat!');
            setIsModalOpen(false);
            setFormData({ title: '', content: '', type: 'EDUCATION', images: [''], latitude: null, longitude: null });
            fetchPosts();
        } catch (error) {
            toast.error('Gagal membuat postingan');
        }
    };

    const categories = [
        { id: 'ALL', name: 'Semua', icon: <FaSync /> },
        { id: 'EDUCATION', name: 'Edukasi', icon: <FaGraduationCap /> },
        { id: 'EXCHANGE', name: 'Tukar Menukar', icon: <FaExchangeAlt /> },
        { id: 'ANNOUNCEMENT', name: 'Pengumuman', icon: <FaBullhorn /> },
    ];



    useEffect(() => {
        if (showMap && !userLocation && typeof window !== 'undefined') {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                },
                (error) => console.log('Geolocation disabled or failed')
            );
        }
    }, [showMap, userLocation]);

    return (
        <div className="min-h-screen bg-background text-foreground transition-colors duration-500 selection:bg-primary selection:text-white">
            {/* Dynamic Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
            </div>

            {/* Hero Section */}
            <div className="relative pt-40 pb-20 px-6 overflow-hidden">
                <div className="max-w-6xl mx-auto relative z-10 text-center">
                    <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter leading-[0.9] animate-in fade-in slide-in-from-bottom-8 duration-1000">
                        GERAKAN <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary to-foreground">SIRKULAR</span>
                    </h1>
                    
                    <p className="text-gray-500 dark:text-gray-400 text-xl md:text-2xl max-w-3xl mx-auto font-medium leading-relaxed mb-12 opacity-80">
                        Platform kolaboratif untuk berbagi edukasi, aksi penanggulangan limbah, dan tukar menukar pakaian di sekitarmu.
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-6 mb-20">
                        <button
                            onClick={() => {
                                if (!currentUser) toast.error('Silakan login terlebih dahulu');
                                else setIsModalOpen(true);
                            }}
                            className="group relative bg-primary text-white dark:text-black px-12 py-6 rounded-2xl font-black flex items-center gap-3 overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_20px_40px_rgba(43,76,59,0.2)] dark:shadow-[0_0_40px_rgba(34,197,94,0.3)]"
                        >
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                            <FaPlus className="relative z-10" />
                            <span className="relative z-10 uppercase tracking-wider">Mulai Beraksi</span>
                        </button>
                        
                        <button
                            onClick={() => setShowMap(!showMap)}
                            className={`px-12 py-6 rounded-2xl font-black flex items-center gap-3 border backdrop-blur-md transition-all hover:scale-105 active:scale-95
                                ${showMap ? 'bg-foreground text-background border-foreground' : 'bg-surface/50 dark:bg-white/5 text-foreground border-gray-200 dark:border-white/10 hover:border-primary/50'}`}
                        >
                            <FaSearchLocation />
                            <span className="uppercase tracking-wider">{showMap ? 'Tutup Peta' : 'Cari Terdekat'}</span>
                        </button>
                    </div>

                    {/* Integrated Map Overview */}
                    {showMap && (
                        <div className="mb-24 rounded-[48px] overflow-hidden border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.5)] h-[600px] relative animate-in fade-in zoom-in duration-700 group">
                            <MapContainer
                                center={userLocation ? [userLocation.lat, userLocation.lng] : [-6.2088, 106.8456]}
                                zoom={12}
                                style={{ height: '100%', width: '100%' }}
                                className="z-10 grayscale-[0.5] group-hover:grayscale-0 transition-all duration-1000"
                            >
                                <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
                                
                                {/* User Current Location Marker */}
                                {userLocation && (
                                    <Marker 
                                        position={[userLocation.lat, userLocation.lng]}
                                        icon={L ? L.divIcon({
                                            className: 'user-marker',
                                            html: `
                                                <div class="user-marker-container">
                                                    <div class="user-marker-pulse"></div>
                                                    <div class="user-marker-core"></div>
                                                </div>
                                            `,
                                            iconSize: [30, 30],
                                            iconAnchor: [15, 15]
                                        }) : null}
                                    >
                                        <Popup>
                                            <div className="text-black font-bold p-1">Anda di sini</div>
                                        </Popup>
                                    </Marker>
                                )}

                                {posts.filter(p => p.latitude && p.longitude).map(post => {
                                    const getMarkerColor = (type) => {
                                        if (type === 'EXCHANGE') return '#22c55e'; // amerta-green
                                        if (type === 'EDUCATION') return '#3b82f6'; // blue
                                        return '#f59e0b'; // amber
                                    };

                                    const customIcon = L ? L.divIcon({
                                        className: 'custom-marker',
                                        html: `
                                            <div class="marker-container">
                                                <div class="marker-pulse" style="background-color: ${getMarkerColor(post.type)}"></div>
                                                <div class="marker-core" style="background-color: ${getMarkerColor(post.type)}"></div>
                                            </div>
                                        `,
                                        iconSize: [20, 20],
                                        iconAnchor: [10, 10]
                                    }) : null;

                                    return (
                                        <Marker 
                                            key={post.id} 
                                            position={[post.latitude, post.longitude]}
                                            icon={customIcon}
                                        >
                                            <Popup className="premium-popup">
                                                <div className="p-2 min-w-[220px]">
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: getMarkerColor(post.type) }}></span>
                                                        <span className="text-[9px] font-black uppercase tracking-[2px] text-gray-500">{post.type}</span>
                                                    </div>
                                                    <h4 className="font-bold text-base text-black mb-1 leading-tight">{post.title}</h4>
                                                    <p className="text-[10px] text-gray-400 mb-4 line-clamp-2">{post.content}</p>
                                                    <button className="w-full bg-black text-white py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[1px] hover:bg-amerta-green hover:text-black transition-all">
                                                        Lihat Detail
                                                    </button>
                                                </div>
                                            </Popup>
                                        </Marker>
                                    );
                                })}
                            </MapContainer>

                            {/* Map Legend Floating UI */}
                            <div className="absolute bottom-8 left-8 z-[500] bg-black/80 backdrop-blur-xl border border-white/10 p-5 rounded-3xl flex flex-col gap-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-amerta-green shadow-[0_0_10px_#22c55e]"></div>
                                    <span className="text-[9px] font-black uppercase tracking-[1px] text-gray-400">Penukaran</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_#3b82f6]"></div>
                                    <span className="text-[9px] font-black uppercase tracking-[1px] text-gray-400">Edukasi</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_10px_#f59e0b]"></div>
                                    <span className="text-[9px] font-black uppercase tracking-[1px] text-gray-400">Pengumuman</span>
                                </div>
                            </div>
                        </div>
                    )}

                    <style jsx global>{`
                        .marker-container {
                            position: relative;
                            width: 20px;
                            height: 20px;
                            display: flex;
                            items-center: center;
                            justify-content: center;
                        }
                        .marker-core {
                            width: 10px;
                            height: 10px;
                            border-radius: 50%;
                            border: 2px solid white;
                            z-index: 2;
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
                        .user-marker-container {
                            position: relative;
                            width: 30px;
                            height: 30px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                        }
                        .user-marker-core {
                            width: 12px;
                            height: 12px;
                            background: white;
                            border: 3px solid #22c55e;
                            border-radius: 50%;
                            z-index: 2;
                            box-shadow: 0 0 15px rgba(34, 197, 94, 0.5);
                        }
                        .user-marker-pulse {
                            position: absolute;
                            width: 100%;
                            height: 100%;
                            background: rgba(255, 255, 255, 0.4);
                            border-radius: 50%;
                            animation: userPulse 2s infinite;
                            z-index: 1;
                        }
                        @keyframes userPulse {
                            0% { transform: scale(1); opacity: 0.8; }
                            100% { transform: scale(3); opacity: 0; }
                        }
                        @keyframes pulse {
                            0% { transform: scale(1); opacity: 0.6; }
                            100% { transform: scale(3.5); opacity: 0; }
                        }
                        .premium-popup .leaflet-popup-content-wrapper {
                            background: rgba(255, 255, 255, 0.9);
                            backdrop-filter: blur(10px);
                            border-radius: 24px;
                            padding: 0;
                            border: 1px solid rgba(255, 255, 255, 0.2);
                        }
                        .premium-popup .leaflet-popup-tip {
                            background: rgba(255, 255, 255, 0.9);
                        }
                    `}</style>

                    {/* Modern Filter Tabs */}
                    <div className="bg-white/5 backdrop-blur-2xl border border-white/10 p-2.5 rounded-3xl inline-flex flex-wrap items-center justify-center gap-2 mb-20">
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setFilter(cat.id)}
                                className={`flex items-center gap-3 px-8 py-4 rounded-2xl text-xs font-black transition-all uppercase tracking-widest
                                    ${filter === cat.id
                                        ? 'bg-amerta-green text-black shadow-lg shadow-amerta-green/20'
                                        : 'text-gray-500 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                {cat.icon}
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content Feed */}
            <div className="max-w-4xl mx-auto px-6 pb-40">
                <div className="space-y-12">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-32 space-y-8">
                            <div className="relative w-20 h-20">
                                <div className="absolute inset-0 border-4 border-white/5 rounded-full" />
                                <div className="absolute inset-0 border-4 border-t-amerta-green rounded-full animate-spin" />
                            </div>
                            <p className="text-gray-600 font-black uppercase tracking-[6px] text-[10px]">Harmonizing Feed...</p>
                        </div>
                    ) : posts.length > 0 ? (
                        posts.map((post) => (
                            <div key={post.id} className="animate-in fade-in slide-in-from-bottom-12 duration-700">
                                <CommunityPost post={post} currentUser={currentUser} />
                            </div>
                        ))
                    ) : (
                        <div className="bg-white/5 backdrop-blur-xl rounded-[56px] p-24 text-center border border-white/10 group hover:border-amerta-green/30 transition-all duration-700">
                            <div className="w-28 h-28 bg-amerta-green/10 rounded-[40px] flex items-center justify-center mx-auto mb-10 text-amerta-green -rotate-6 group-hover:rotate-12 transition-transform duration-700">
                                <FaLeaf size={56} className="opacity-50" />
                            </div>
                            <h3 className="text-4xl font-black mb-4 tracking-tighter">Sunyi di Sini...</h3>
                            <p className="text-gray-500 max-w-sm mx-auto font-medium text-lg leading-relaxed">
                                Jadilah orang pertama yang menyebarkan kebaikan sirkular di komunitas ini.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Premium Create Post Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center px-4 overflow-y-auto py-12">
                    <div className="absolute inset-0 bg-black/95 backdrop-blur-2xl" onClick={() => setIsModalOpen(false)} />
                    
                    <div className="bg-[#0c0c0c] w-full max-w-5xl rounded-[48px] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,1)] relative z-10 border border-white/10 flex flex-col md:flex-row h-full md:h-[85vh] animate-in fade-in zoom-in duration-500">
                        {/* Left Side: Preview & Branding */}
                        <div className="hidden md:flex md:w-[35%] bg-gradient-to-br from-amerta-green/20 to-black p-12 flex-col justify-between border-r border-white/5">
                            <div>
                                <div className="p-4 bg-amerta-green text-black rounded-2xl w-fit mb-8">
                                    <FaLeaf size={32} />
                                </div>
                                <h2 className="text-5xl font-black leading-[0.9] tracking-tighter mb-6 uppercase">
                                    Mulai <br /> Langkah <br /> <span className="text-amerta-green">Nyata</span>
                                </h2>
                                <p className="text-gray-400 font-medium leading-relaxed">
                                    Setiap postingan adalah kontribusi kecil untuk masa depan yang lebih berkelanjutan.
                                </p>
                            </div>
                            
                            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-[32px]">
                                <div className="text-[10px] font-black uppercase tracking-[2px] text-amerta-green mb-2">Tips</div>
                                <p className="text-xs text-gray-500 leading-relaxed font-medium">
                                    Gunakan foto yang jelas dan deskripsi yang mendetail agar user lain lebih mudah memahami maksud postinganmu.
                                </p>
                            </div>
                        </div>

                        {/* Right Side: Form */}
                        <div className="flex-1 flex flex-col h-full overflow-hidden">
                            <div className="p-8 md:p-12 border-b border-white/5 flex items-center justify-between">
                                <span className="text-xs font-black uppercase tracking-[4px] text-gray-500">Formulir Gerakan</span>
                                <button onClick={() => setIsModalOpen(false)} className="bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white p-4 rounded-2xl transition-all active:scale-90">
                                    <FaTimes size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 md:p-12 space-y-10 no-scrollbar pb-32">
                                <div className="grid md:grid-cols-2 gap-10">
                                    <div className="space-y-8">
                                        <div className="group">
                                            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[3px] mb-4 group-hover:text-amerta-green transition-colors">Judul Kampanye</label>
                                            <input
                                                type="text" required value={formData.title}
                                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-sm focus:outline-none focus:border-amerta-green focus:bg-white/10 transition-all font-bold placeholder:text-gray-700"
                                                placeholder="Judul yang menarik..."
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 gap-8">
                                            <div>
                                                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[3px] mb-4">Pilih Kategori</label>
                                                <select
                                                    value={formData.type}
                                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-sm focus:outline-none focus:border-amerta-green appearance-none cursor-pointer font-bold"
                                                >
                                                    <option value="EDUCATION">Edukasi & Tips</option>
                                                    <option value="EXCHANGE">Tukar Menukar Barang</option>
                                                    <option value="ANNOUNCEMENT">Pengumuman Penting</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[3px] mb-4">Galeri Foto (URL)</label>
                                            <div className="space-y-4">
                                                {formData.images.map((url, idx) => (
                                                    <div key={idx} className="relative flex items-center gap-3">
                                                        <div className="flex-1 relative">
                                                            <input
                                                                type="text" value={url}
                                                                onChange={(e) => handleImageUrlChange(idx, e.target.value)}
                                                                className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-xs focus:outline-none focus:border-amerta-green font-bold pr-12"
                                                                placeholder={`https://image-url-${idx + 1}.jpg`}
                                                            />
                                                            <FaImage className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-700" />
                                                        </div>
                                                        {idx > 0 && (
                                                            <button 
                                                                type="button" 
                                                                onClick={() => setFormData({ ...formData, images: formData.images.filter((_, i) => i !== idx) })}
                                                                className="p-4 bg-red-500/10 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all"
                                                            >
                                                                <FaTimes />
                                                            </button>
                                                        )}
                                                    </div>
                                                ))}
                                                <button
                                                    type="button" onClick={handleAddImageUrl}
                                                    className="flex items-center gap-2 px-6 py-4 bg-amerta-green/5 text-amerta-green rounded-2xl text-[10px] font-black uppercase tracking-[2px] hover:bg-amerta-green/10 transition-all"
                                                >
                                                    <FaPlus size={10} /> Tambah Gambar
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-8">
                                        <div>
                                            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[3px] mb-4">Pilih Lokasi Aksi</label>
                                            <div className="h-[300px] rounded-3xl overflow-hidden border border-white/10 shadow-inner group relative">
                                                <MapContainer center={[-6.2088, 106.8456]} zoom={11} style={{ height: '100%', width: '100%' }}>
                                                    <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
                                                    <MapEvents onLocationSelect={(lat, lng) => setFormData({ ...formData, latitude: lat, longitude: lng })} />
                                                    {formData.latitude && (
                                                        <Marker 
                                                            position={[formData.latitude, formData.longitude]} 
                                                            icon={L ? L.divIcon({
                                                                className: 'custom-marker',
                                                                html: `
                                                                    <div class="marker-container">
                                                                        <div class="marker-pulse" style="background-color: #22c55e"></div>
                                                                        <div class="marker-core" style="background-color: #22c55e"></div>
                                                                    </div>
                                                                `,
                                                                iconSize: [20, 20],
                                                                iconAnchor: [10, 10]
                                                            }) : null}
                                                        />
                                                    )}
                                                </MapContainer>
                                                <div className="absolute top-4 right-4 z-[500] px-3 py-1.5 bg-black/80 backdrop-blur-md rounded-lg border border-white/10 text-[9px] font-bold text-gray-400">
                                                    {formData.latitude ? 'Lokasi Terkunci' : 'Klik di Peta'}
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[3px] mb-4">Ceritakan Detailnya</label>
                                            <textarea
                                                required rows={6} value={formData.content}
                                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-3xl p-6 text-sm focus:outline-none focus:border-amerta-green resize-none font-bold placeholder:text-gray-700"
                                                placeholder="Jelaskan gerakanmu di sini..."
                                            />
                                        </div>
                                    </div>
                                </div>
                            </form>

                            {/* Sticky Submit Button */}
                            <div className="absolute bottom-0 right-0 left-0 md:left-[35%] p-8 bg-gradient-to-t from-[#0c0c0c] via-[#0c0c0c] to-transparent">
                                <button
                                    type="submit"
                                    onClick={handleSubmit}
                                    className="w-full bg-amerta-green text-black py-7 rounded-[28px] font-black hover:bg-white transition-all shadow-[0_20px_50px_rgba(34,197,94,0.3)] active:scale-[0.98] text-lg uppercase tracking-[4px]"
                                >
                                    Publikasikan Sekarang
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
