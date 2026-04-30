"use client";

import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { FaCamera, FaMapMarkerAlt, FaEnvelope, FaUser, FaPhone, FaMapSigns, FaSync, FaCoins, FaAward, FaInfoCircle, FaUpload } from "react-icons/fa";
import api from "@/lib/axios";
import dynamic from 'next/dynamic';
import { motion } from "framer-motion";

// Dynamically import Leaflet components
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const MapEvents = dynamic(() => import('../../(main)/komunitas/MapEvents'), { ssr: false });

import 'leaflet/dist/leaflet.css';

const STORAGE_URL = process.env.NEXT_PUBLIC_API_STORAGE_URL || "http://localhost:3001";

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [L, setL] = useState(null);
  const fileInputRef = useRef(null);
  
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    profilePicture: "",
    latitude: null,
    longitude: null,
    points: 0,
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
        import('leaflet').then(mod => setL(mod.default));
    }
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/profile");
      const data = res.data;
      setProfile({
        name: data.name || "",
        email: data.email || "",
        phone: data.phone || "",
        address: data.address || "",
        profilePicture: data.profilePicture || "",
        latitude: data.latitude || null,
        longitude: data.longitude || null,
        points: data.points || 0,
      });
      setLoading(false);
    } catch (err) {
      toast.error("Gagal memuat profil.");
      setLoading(false);
    }
  };

  const getImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith("http")) return url;
    return `${STORAGE_URL}${url}`;
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.patch("/profile", profile);
      toast.success("Profil diperbarui!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal memperbarui profil.");
    } finally {
      setSaving(false);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (e.g., 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Ukuran file terlalu besar (Maks 2MB)");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await api.post("/profile/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setProfile({ ...profile, profilePicture: res.data.url });
      toast.success("Foto profil diunggah!");
    } catch (err) {
      toast.error("Gagal mengunggah foto.");
    } finally {
      setUploading(false);
    }
  };

  const handleLocateMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setProfile({
            ...profile,
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude
        });
        toast.success("Lokasi terdeteksi!");
      });
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-background space-y-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500 font-black uppercase tracking-[4px] text-[10px]">Loading Identity...</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-12 min-h-screen bg-background text-foreground selection:bg-primary selection:text-white transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
            <div>
                <motion.h1 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-5xl font-black tracking-tighter mb-2"
                >
                  PENGATURAN <span className="text-primary italic">PROFIL</span>
                </motion.h1>
                <p className="text-gray-500 font-medium max-w-md">Identitasmu adalah fondasi dari kepercayaan di komunitas Amerta. Pastikan semuanya akurat.</p>
            </div>
            <div className="flex items-center gap-4">
                <button 
                    onClick={handleLocateMe}
                    className="px-6 py-4 bg-surface border border-gray-200 dark:border-white/10 rounded-2xl flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-white/10 transition-all text-[10px] font-black uppercase tracking-[2px] shadow-sm"
                >
                    <FaSync className="text-primary" /> Auto Geolocation
                </button>
            </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-primary via-primary-light to-secondary rounded-[32px] p-8 flex items-center justify-between group overflow-hidden relative shadow-xl shadow-primary/10"
            >
                <div className="relative z-10">
                    <p className="text-[10px] font-black uppercase tracking-[3px] text-white/70 mb-2">Amerta Points</p>
                    <h2 className="text-4xl font-black tracking-tighter text-white">{profile.points} <span className="text-sm font-bold opacity-40 text-white">XP</span></h2>
                </div>
                <div className="w-16 h-16 bg-white text-primary rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform relative z-10">
                    <FaCoins size={24} />
                </div>
                <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/5 rounded-full blur-3xl" />
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-surface border border-gray-200 dark:border-white/10 rounded-[32px] p-8 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-white/10 transition-all shadow-sm"
            >
                <div>
                    <p className="text-[10px] font-black uppercase tracking-[3px] text-gray-500 mb-2">Achievement Level</p>
                    <h2 className="text-2xl font-black tracking-tighter uppercase italic text-foreground">Eco Pioneer</h2>
                </div>
                <div className="w-16 h-16 bg-primary/5 text-primary rounded-2xl flex items-center justify-center border border-primary/10">
                    <FaAward size={24} />
                </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-surface border border-gray-200 dark:border-white/10 rounded-[32px] p-8 flex items-center justify-center gap-4 text-center cursor-help group shadow-sm"
            >
                <FaInfoCircle className="text-gray-300 group-hover:text-primary transition-colors" />
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed">Poin didapatkan dari setiap donasi & aktivitas ramah lingkungan</p>
            </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left: Form */}
            <div className="lg:col-span-5 space-y-8">
                <div className="bg-surface backdrop-blur-xl rounded-[40px] p-8 border border-gray-200 dark:border-white/10 shadow-xl">
                    <form onSubmit={handleUpdateProfile} className="space-y-6">
                        <div className="flex flex-col items-center mb-10 group">
                            <input 
                              type="file" 
                              ref={fileInputRef} 
                              onChange={handleFileChange} 
                              className="hidden" 
                              accept="image/*"
                            />
                            <div 
                              onClick={() => fileInputRef.current.click()}
                              className="relative w-40 h-40 rounded-[48px] overflow-hidden border-4 border-dashed border-gray-200 dark:border-white/10 group-hover:border-primary transition-all mb-4 cursor-pointer"
                            >
                                {profile.profilePicture ? (
                                    <img src={getImageUrl(profile.profilePicture)} className="w-full h-full object-cover" alt="Profile" />
                                ) : (
                                    <div className="w-full h-full bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-300">
                                        <FaUser size={48} />
                                    </div>
                                )}
                                <div className={`absolute inset-0 bg-black/60 flex items-center justify-center transition-opacity ${uploading ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                                    {uploading ? (
                                      <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                      <FaCamera className="text-white text-2xl" />
                                    )}
                                </div>
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-[2px] text-gray-400 group-hover:text-primary transition-colors">
                              {uploading ? "Uploading..." : "Klik untuk ganti foto"}
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="relative">
                                <label className="text-[9px] font-black uppercase tracking-[2px] text-gray-400 absolute left-4 -top-2 px-2 bg-surface">Full Name</label>
                                <input
                                    required value={profile.name}
                                    onChange={(e) => setProfile({...profile, name: e.target.value})}
                                    className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-5 text-sm focus:outline-none focus:border-primary font-bold transition-all text-foreground"
                                />
                            </div>

                            <div className="relative">
                                <label className="text-[9px] font-black uppercase tracking-[2px] text-gray-400 absolute left-4 -top-2 px-2 bg-surface">Email Address</label>
                                <input
                                    disabled value={profile.email}
                                    className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-5 text-sm font-bold text-gray-400 cursor-not-allowed"
                                />
                            </div>

                            <div className="relative">
                                <label className="text-[9px] font-black uppercase tracking-[2px] text-gray-400 absolute left-4 -top-2 px-2 bg-surface">Phone Number</label>
                                <input
                                    value={profile.phone}
                                    onChange={(e) => setProfile({...profile, phone: e.target.value})}
                                    className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-5 text-sm focus:outline-none focus:border-primary font-bold transition-all text-foreground"
                                />
                            </div>

                            <div className="relative">
                                <label className="text-[9px] font-black uppercase tracking-[2px] text-gray-400 absolute left-4 -top-2 px-2 bg-surface">Full Address</label>
                                <textarea
                                    rows={3} value={profile.address}
                                    onChange={(e) => setProfile({...profile, address: e.target.value})}
                                    className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-5 text-sm focus:outline-none focus:border-primary font-bold resize-none transition-all text-foreground"
                                />
                            </div>
                        </div>

                        <button
                            type="submit" disabled={saving || uploading}
                            className="w-full bg-primary text-white py-6 rounded-[24px] font-black uppercase tracking-[4px] hover:opacity-90 transition-all shadow-xl shadow-primary/20 active:scale-[0.98] disabled:opacity-50"
                        >
                            {saving ? 'Saving...' : 'Update Profil'}
                        </button>
                    </form>
                </div>
            </div>

            {/* Right: Map Integration */}
            <div className="lg:col-span-7">
                <div className="bg-surface backdrop-blur-xl rounded-[40px] p-2 border border-gray-200 dark:border-white/10 h-full min-h-[500px] flex flex-col shadow-xl">
                    <div className="p-8 pb-4">
                        <div className="flex items-center gap-3 mb-2">
                            <FaMapSigns className="text-primary" />
                            <h3 className="text-xl font-bold text-foreground">Titik Temu Sirkular</h3>
                        </div>
                        <p className="text-xs text-gray-500 font-medium leading-relaxed">Klik pada peta untuk memperbarui koordinat tempat tinggalmu. Ini membantu komunitas menemukanmu untuk pertukaran pakaian!</p>
                    </div>
                    
                    <div className="flex-1 m-4 rounded-[32px] overflow-hidden border border-gray-200 dark:border-white/10 relative group">
                        <MapContainer 
                            center={profile.latitude ? [profile.latitude, profile.longitude] : [-6.2088, 106.8456]} 
                            zoom={12} 
                            style={{ height: '100%', width: '100%' }}
                            className="grayscale-[0.4] group-hover:grayscale-0 transition-all duration-700"
                        >
                            <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
                            <MapEvents onLocationSelect={(lat, lng) => setProfile({...profile, latitude: lat, longitude: lng})} />
                            
                            {profile.latitude && (
                                <Marker 
                                    position={[profile.latitude, profile.longitude]}
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
                                />
                            )}
                        </MapContainer>
                        
                        <div className="absolute bottom-8 right-8 z-[1000] bg-white/80 dark:bg-black/80 backdrop-blur-md px-6 py-4 rounded-2xl border border-gray-200 dark:border-white/10">
                            <div className="text-[9px] font-black uppercase tracking-[2px] text-gray-400 mb-1">Coordinates</div>
                            <div className="text-[11px] font-mono text-primary">
                                {profile.latitude?.toFixed(4) || '0.0000'}, {profile.longitude?.toFixed(4) || '0.0000'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>

      <style jsx global>{`
        .user-marker-container { position: relative; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; }
        .user-marker-core { width: 12px; height: 12px; background: white; border: 3px solid #2B4C3B; border-radius: 50%; z-index: 2; box-shadow: 0 0 15px rgba(43, 76, 59, 0.5); }
        .user-marker-pulse { position: absolute; width: 100%; height: 100%; background: rgba(43, 76, 59, 0.4); border-radius: 50%; animation: userPulse 2s infinite; z-index: 1; }
        @keyframes userPulse { 0% { transform: scale(1); opacity: 0.8; } 100% { transform: scale(3); opacity: 0; } }
      `}</style>
    </div>
  );
}
