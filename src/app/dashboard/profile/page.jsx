"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { FaCamera } from "react-icons/fa";
import api from "@/lib/axios";

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
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
      });
      setLoading(false);
    } catch (err) {
      if (err.response?.status === 401) {
        toast.error("Sesi telah habis, silakan masuk kembali.");
      } else {
        toast.error("Gagal memuat profil.");
      }
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.patch("/profile", {
        name: profile.name,
        phone: profile.phone,
        address: profile.address,
      });
      toast.success("Profil berhasil diperbarui!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal memperbarui profil.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center p-12">
        <div className="w-8 h-8 border-4 border-amerta-green border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-12 animate-fade-in-up max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-amerta-dark tracking-tight">Pengaturan Profil</h1>
        <p className="text-gray-500 mt-2">Kelola informasi pribadi agar mempermudah sirkulasi pakaian Anda.</p>
      </div>

      <div className="bg-background rounded-2xl border border-gray-200 dark:border-gray-800 p-6 md:p-8">
        <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-100 dark:border-gray-800">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center cursor-pointer overflow-hidden relative">
              <span className="text-3xl font-bold text-gray-500">{profile.name.charAt(0).toUpperCase()}</span>
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <FaCamera className="text-white" />
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold text-amerta-dark">{profile.name}</h3>
            <p className="text-gray-500 text-sm mt-1">{profile.email}</p>
          </div>
        </div>

        <form onSubmit={handleUpdateProfile} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-amerta-dark mb-1">Nama Lengkap</label>
              <input
                name="name"
                type="text"
                required
                value={profile.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-surface border border-gray-200 dark:border-gray-800 rounded-xl text-amerta-dark focus:ring-2 focus:ring-amerta-green focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-amerta-dark mb-1">Alamat Email</label>
              <input
                type="email"
                disabled
                value={profile.email}
                className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-800 rounded-xl text-gray-500 cursor-not-allowed"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-amerta-dark mb-1">Nomor Telepon</label>
              <input
                name="phone"
                type="tel"
                value={profile.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-surface border border-gray-200 dark:border-gray-800 rounded-xl text-amerta-dark focus:ring-2 focus:ring-amerta-green focus:outline-none"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-amerta-dark mb-1">Alamat Lengkap</label>
              <textarea
                name="address"
                rows="3"
                value={profile.address}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-surface border border-gray-200 dark:border-gray-800 rounded-xl text-amerta-dark focus:ring-2 focus:ring-amerta-green focus:outline-none resize-none"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3 bg-amerta-green text-white rounded-xl font-semibold shadow-sm hover:opacity-90 hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amerta-green disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
