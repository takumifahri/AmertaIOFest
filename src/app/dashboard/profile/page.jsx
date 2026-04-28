"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { FaCamera, FaMapMarkerAlt, FaEnvelope, FaUser, FaPhone, FaMapSigns, FaSync } from "react-icons/fa";
import api from "@/lib/axios";
import dynamic from 'next/dynamic';

// Dynamically import Leaflet components
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const MapEvents = dynamic(() => import('../../(main)/komunitas/MapEvents'), { ssr: false });

import 'leaflet/dist/leaflet.css';

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [L, setL] = useState(null);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    profilePicture: "",
    latitude: null,
    longitude: null,
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
      });
      setLoading(false);
    } catch (err) {
      toast.error("Gagal memuat profil.");
      setLoading(false);
    }
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
      <div className="h-screen flex flex-col items-center justify-center bg-[#050505] space-y-4">
        <div className="w-12 h-12 border-4 border-amerta-green border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500 font-black uppercase tracking-[4px] text-[10px]">Loading Identity...</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-12 min-h-screen bg-[#050505] text-white selection:bg-amerta-green selection:text-black">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
            <div>
                <h1 className="text-5xl font-black tracking-tighter mb-2">PENGATURAN <span className="text-amerta-green">PROFIL</span></h1>
                <p className="text-gray-500 font-medium max-w-md">Identitasmu adalah fondasi dari kepercayaan di komunitas Amerta. Pastikan semuanya akurat.</p>
            </div>
            <div className="flex items-center gap-4">
                <button 
                    onClick={handleLocateMe}
                    className="px-6 py-4 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-3 hover:bg-white/10 transition-all text-[10px] font-black uppercase tracking-[2px]"
                >
                    <FaSync className="text-amerta-green" /> Auto Geolocation
                </button>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left: Form */}
            <div className="lg:col-span-5 space-y-8">
                <div className="bg-white/5 backdrop-blur-xl rounded-[40px] p-8 border border-white/10">
                    <form onSubmit={handleUpdateProfile} className="space-y-6">
                        <div className="flex flex-col items-center mb-10 group">
                            <div className="relative w-32 h-32 rounded-[32px] overflow-hidden border-2 border-dashed border-white/20 group-hover:border-amerta-green transition-all mb-4">
                                {profile.profilePicture ? (
                                    <img src={profile.profilePicture} className="w-full h-full object-cover" alt="Profile" />
                                ) : (
                                    <div className="w-full h-full bg-white/5 flex items-center justify-center text-gray-700">
                                        <FaUser size={40} />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                    <FaCamera className="text-white" />
                                </div>
                            </div>
                            <input 
                                type="text" placeholder="URL Foto Profil"
                                value={profile.profilePicture}
                                onChange={(e) => setProfile({...profile, profilePicture: e.target.value})}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-xs focus:outline-none focus:border-amerta-green font-bold text-center"
                            />
                        </div>

                        <div className="space-y-4">
                            <div className="relative">
                                <label className="text-[9px] font-black uppercase tracking-[2px] text-gray-500 absolute left-4 -top-2 px-2 bg-[#0c0c0c]">Full Name</label>
                                <input
                                    required value={profile.name}
                                    onChange={(e) => setProfile({...profile, name: e.target.value})}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-sm focus:outline-none focus:border-amerta-green font-bold"
                                />
                            </div>

                            <div className="relative">
                                <label className="text-[9px] font-black uppercase tracking-[2px] text-gray-500 absolute left-4 -top-2 px-2 bg-[#0c0c0c]">Email Address</label>
                                <input
                                    disabled value={profile.email}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-sm font-bold text-gray-600 cursor-not-allowed"
                                />
                            </div>

                            <div className="relative">
                                <label className="text-[9px] font-black uppercase tracking-[2px] text-gray-500 absolute left-4 -top-2 px-2 bg-[#0c0c0c]">Phone Number</label>
                                <input
                                    value={profile.phone}
                                    onChange={(e) => setProfile({...profile, phone: e.target.value})}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-sm focus:outline-none focus:border-amerta-green font-bold"
                                />
                            </div>

                            <div className="relative">
                                <label className="text-[9px] font-black uppercase tracking-[2px] text-gray-500 absolute left-4 -top-2 px-2 bg-[#0c0c0c]">Full Address</label>
                                <textarea
                                    rows={3} value={profile.address}
                                    onChange={(e) => setProfile({...profile, address: e.target.value})}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-sm focus:outline-none focus:border-amerta-green font-bold resize-none"
                                />
                            </div>
                        </div>

                        <button
                            type="submit" disabled={saving}
                            className="w-full bg-amerta-green text-black py-6 rounded-[24px] font-black uppercase tracking-[4px] hover:bg-white transition-all shadow-[0_20px_50px_rgba(34,197,94,0.2)] active:scale-[0.98] disabled:opacity-50"
                        >
                            {saving ? 'Saving...' : 'Update Profil'}
                        </button>
                    </form>
                </div>
            </div>

            {/* Right: Map Integration */}
            <div className="lg:col-span-7">
                <div className="bg-white/5 backdrop-blur-xl rounded-[40px] p-2 border border-white/10 h-full min-h-[500px] flex flex-col">
                    <div className="p-8 pb-4">
                        <div className="flex items-center gap-3 mb-2">
                            <FaMapSigns className="text-amerta-green" />
                            <h3 className="text-xl font-bold">Titik Temu Sirkular</h3>
                        </div>
                        <p className="text-xs text-gray-500 font-medium">Klik pada peta untuk memperbarui koordinat tempat tinggalmu. Ini membantu komunitas menemukanmu!</p>
                    </div>
                    
                    <div className="flex-1 m-4 rounded-[32px] overflow-hidden border border-white/10 relative group">
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
                        
                        <div className="absolute bottom-8 right-8 z-[1000] bg-black/80 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10">
                            <div className="text-[9px] font-black uppercase tracking-[2px] text-gray-500 mb-1">Coordinates</div>
                            <div className="text-[11px] font-mono text-amerta-green">
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
        .user-marker-core { width: 12px; height: 12px; background: white; border: 3px solid #22c55e; border-radius: 50%; z-index: 2; box-shadow: 0 0 15px rgba(34, 197, 94, 0.5); }
        .user-marker-pulse { position: absolute; width: 100%; height: 100%; background: rgba(255, 255, 255, 0.4); border-radius: 50%; animation: userPulse 2s infinite; z-index: 1; }
        @keyframes userPulse { 0% { transform: scale(1); opacity: 0.8; } 100% { transform: scale(3); opacity: 0; } }
      `}</style>
    </div>
  );
}
