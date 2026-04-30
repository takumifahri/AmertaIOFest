'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import toast from 'react-hot-toast';
import CommunityPost from '@/components/community/CommunityPost';
import CreatePostModal from '@/components/community/CreatePostModal';
import dynamic from 'next/dynamic';
import { 
  FaPlus, FaFilter, FaLeaf, FaExchangeAlt, 
  FaBullhorn, FaGraduationCap, FaSync, 
  FaSearchLocation, FaMapMarkerAlt 
} from 'react-icons/fa';

// Dynamically import Leaflet components
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

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

    const handleCreatePost = async (payload) => {
        try {
            await api.post('/community', payload);
            toast.success('Postingan berhasil dibuat!');
            setIsModalOpen(false);
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
        <div className="min-h-screen bg-[#FCFBF7] dark:bg-[#0d110f] transition-colors duration-500">
            {/* Dynamic Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
            </div>

            <div className="max-w-6xl mx-auto px-6 py-20 relative z-10">
                {/* Hero Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-12">
                    <div className="space-y-6 animate-fade-in-up">
                        
                        <h1 className="text-7xl md:text-8xl font-black text-amerta-dark dark:text-white leading-[0.85] tracking-tighter">
                            GERAKAN<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary to-amerta-dark dark:to-white">SIRKULAR</span>
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 max-w-xl text-xl font-medium leading-relaxed">
                            Platform kolaboratif untuk berbagi edukasi, aksi penanggulangan limbah, dan tukar menukar di sekitarmu.
                        </p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        <button 
                            onClick={() => {
                                if (!currentUser) toast.error('Silakan login terlebih dahulu');
                                else setIsModalOpen(true);
                            }}
                            className="group relative bg-primary hover:bg-primary-light text-black px-12 py-6 rounded-[28px] font-black uppercase tracking-[0.2em] text-xs transition-all shadow-[0_20px_40px_rgba(43,76,59,0.2)] active:scale-95 flex items-center gap-3 overflow-hidden w-full sm:w-auto justify-center"
                        >
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                            <FaPlus className="relative z-10" />
                            <span className="relative z-10">Mulai Beraksi</span>
                        </button>

                        <button
                            onClick={() => setShowMap(!showMap)}
                            className={`px-10 py-6 rounded-[28px] font-black flex items-center gap-3 border backdrop-blur-md transition-all active:scale-95 text-xs uppercase tracking-widest w-full sm:w-auto justify-center
                                ${showMap ? 'bg-amerta-dark dark:bg-white text-white dark:text-black border-transparent' : 'bg-transparent text-gray-500 border-gray-200 dark:border-white/10 hover:border-primary'}`}
                        >
                            <FaSearchLocation />
                            {showMap ? 'Tutup Peta' : 'Cari Terdekat'}
                        </button>
                    </div>
                </div>

                {/* Map Section */}
                {showMap && (
                    <div className="mb-24 rounded-[56px] overflow-hidden border border-black/5 dark:border-white/10 shadow-[0_40px_80px_rgba(0,0,0,0.1)] h-[600px] relative animate-in fade-in zoom-in duration-700 group">
                        <MapContainer
                            center={userLocation ? [userLocation.lat, userLocation.lng] : [-6.2088, 106.8456]}
                            zoom={12}
                            style={{ height: '100%', width: '100%' }}
                            className="z-10 grayscale-[0.3] group-hover:grayscale-0 transition-all duration-1000"
                        >
                            <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
                            
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
                                    <Popup><div className="text-black font-bold p-1">Anda di sini</div></Popup>
                                </Marker>
                            )}

                            {posts.filter(p => p.latitude && p.longitude).map(post => {
                                const getMarkerColor = (type) => {
                                    if (type === 'EXCHANGE') return '#2B4C3B';
                                    if (type === 'EDUCATION') return '#3b82f6';
                                    return '#f59e0b';
                                };

                                return (
                                    <Marker 
                                        key={post.id} 
                                        position={[post.latitude, post.longitude]}
                                        icon={L ? L.divIcon({
                                            className: 'custom-marker',
                                            html: `
                                                <div class="marker-container">
                                                    <div class="marker-pulse" style="background-color: ${getMarkerColor(post.type)}"></div>
                                                    <div class="marker-core" style="background-color: ${getMarkerColor(post.type)}"></div>
                                                </div>
                                            `,
                                            iconSize: [20, 20],
                                            iconAnchor: [10, 10]
                                        }) : null}
                                    >
                                        <Popup className="premium-popup">
                                            <div className="p-3 min-w-[240px]">
                                                <h4 className="font-bold text-base text-black mb-1">{post.title}</h4>
                                                <div className="flex items-start gap-2 mb-3 bg-gray-100 p-2 rounded-lg">
                                                    <FaMapMarkerAlt className="text-primary mt-0.5 shrink-0" size={10} />
                                                    <p className="text-[10px] text-gray-700 font-medium leading-tight">
                                                        {post.address || 'Lokasi tidak bernama'}
                                                    </p>
                                                </div>
                                                <button 
                                                    onClick={() => window.location.href = `/komunitas/${post.id}`}
                                                    className="w-full bg-black text-white py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[1px] hover:bg-primary hover:text-black transition-all"
                                                >
                                                    Lihat Detail
                                                </button>
                                            </div>
                                        </Popup>
                                    </Marker>
                                );
                            })}
                        </MapContainer>
                    </div>
                )}

                {/* Filter Bar */}
                <div className="sticky top-24 z-40 mb-16 py-6 bg-[#FCFBF7]/80 dark:bg-[#0d110f]/80 backdrop-blur-xl border-y border-black/5 dark:border-white/5 -mx-6 px-6">
                    <div className="flex items-center gap-3 overflow-x-auto no-scrollbar">
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setFilter(cat.id)}
                                className={`flex items-center gap-4 px-10 py-5 rounded-[22px] text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap border
                                    ${filter === cat.id 
                                        ? 'bg-amerta-dark dark:bg-white text-white dark:text-black border-transparent shadow-2xl scale-105' 
                                        : 'bg-transparent text-gray-400 border-transparent hover:border-gray-200 dark:hover:border-white/10'
                                    }`}
                            >
                                <span className={filter === cat.id ? 'opacity-100' : 'opacity-40'}>{cat.icon}</span>
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Feed Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {loading ? (
                        <div className="col-span-full flex flex-col items-center justify-center py-40 space-y-8">
                            <div className="relative w-20 h-20">
                                <div className="absolute inset-0 border-4 border-primary/10 rounded-full" />
                                <div className="absolute inset-0 border-4 border-t-primary rounded-full animate-spin" />
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-primary animate-pulse">Menyelaraskan Data...</p>
                        </div>
                    ) : posts.length > 0 ? (
                        posts.map((post, idx) => (
                            <div key={post.id} className="animate-fade-in-up" style={{ animationDelay: `${idx * 100}ms` }}>
                                <CommunityPost post={post} currentUser={currentUser} />
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full bg-white dark:bg-white/5 rounded-[56px] p-24 text-center border-2 border-dashed border-gray-100 dark:border-white/10">
                            <div className="w-32 h-32 bg-primary/5 rounded-[40px] flex items-center justify-center mx-auto mb-10 text-primary/20">
                                <FaLeaf size={64} />
                            </div>
                            <h3 className="text-4xl font-black text-amerta-dark dark:text-white tracking-tight">Sunyi di Sini...</h3>
                            <p className="text-gray-400 mt-4 max-w-sm mx-auto font-medium text-lg leading-relaxed">Jadilah yang pertama untuk menyebarkan jejak kebaikan hari ini.</p>
                        </div>
                    )}
                </div>

                <CreatePostModal 
                    isOpen={isModalOpen} 
                    onClose={() => setIsModalOpen(false)} 
                    onSubmit={handleCreatePost}
                />
            </div>

            <style jsx global>{`
                .user-marker-container { position: relative; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; }
                .user-marker-core { width: 12px; height: 12px; background: white; border: 3px solid #2B4C3B; border-radius: 50%; z-index: 2; box-shadow: 0 0 15px rgba(43,76,59,0.5); }
                .user-marker-pulse { position: absolute; width: 100%; height: 100%; background: rgba(43,76,59,0.3); border-radius: 50%; animation: userPulse 2s infinite; z-index: 1; }
                @keyframes userPulse { 0% { transform: scale(1); opacity: 0.8; } 100% { transform: scale(3.5); opacity: 0; } }
                .marker-container { position: relative; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; }
                .marker-core { width: 10px; height: 10px; border-radius: 50%; border: 2px solid white; z-index: 2; }
                .marker-pulse { position: absolute; width: 100%; height: 100%; border-radius: 50%; opacity: 0.6; animation: pulse 2s infinite; z-index: 1; }
                @keyframes pulse { 0% { transform: scale(1); opacity: 0.6; } 100% { transform: scale(4); opacity: 0; } }
                .premium-popup .leaflet-popup-content-wrapper { background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(20px); border-radius: 32px; padding: 12px; border: 1px solid white; }
                .premium-popup .leaflet-popup-tip { background: rgba(255, 255, 255, 0.95); }
            `}</style>
        </div>
    );
}
