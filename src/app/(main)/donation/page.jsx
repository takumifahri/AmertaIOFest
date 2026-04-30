"use client";

import { useState, useEffect, useRef } from "react";
import api from "@/lib/axios";
import toast from "react-hot-toast";
import { 
  FaHeart, FaBuilding, FaUserAlt, FaCheckCircle, 
  FaExclamationCircle, FaTools, FaCoins, FaCamera, 
  FaTimes, FaPlus, FaArrowRight, FaArrowLeft, FaHandSparkles,
  FaLock, FaChevronRight
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";

const STEPS = [
  { id: 1, title: "Tujuan", icon: <FaBuilding /> },
  { id: 2, title: "Kualitas", icon: <FaHandSparkles /> },
  { id: 3, title: "Detail", icon: <FaCamera /> },
];

export default function DonationPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    type: "AMERTA",
    companyId: "",
    description: "",
    grade: "LAYAK",
  });
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const fileInputRef = useRef(null);
  const router = useRouter();

  // Load from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem("amerta_donation_form_state");
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setFormData(parsed.formData);
        setCurrentStep(parsed.currentStep);
      } catch (e) {
        console.error("Failed to parse saved state", e);
      }
    }

    const checkAuth = async () => {
      try {
        const res = await api.get("/auth/me");
        setUser(res.data.user);
      } catch (err) {
        setUser(null);
      } finally {
        setAuthLoading(false);
      }
    };
    checkAuth();

    const fetchCompanies = async () => {
      try {
        const res = await api.get("/donation/companies");
        setCompanies(res.data.data);
      } catch (err) {
        console.error("Failed to fetch companies", err);
      }
    };
    fetchCompanies();
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem("amerta_donation_form_state", JSON.stringify({
      formData,
      currentStep
    }));
  }, [formData, currentStep]);

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    if (selectedImages.length + files.length > 5) {
      toast.error("Maksimal 5 foto per donasi.");
      return;
    }

    const newSelectedImages = [...selectedImages, ...files];
    setSelectedImages(newSelectedImages);

    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...newPreviews]);
  };

  const removeImage = (index) => {
    const newSelectedImages = [...selectedImages];
    newSelectedImages.splice(index, 1);
    setSelectedImages(newSelectedImages);

    const newPreviews = [...imagePreviews];
    URL.revokeObjectURL(newPreviews[index]);
    newPreviews.splice(index, 1);
    setImagePreviews(newPreviews);
  };

  const nextStep = () => {
    if (currentStep === 1 && formData.type === "COMPANY" && !formData.companyId) {
      toast.error("Pilih yayasan tujuan terlebih dahulu.");
      return;
    }
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Silakan masuk terlebih dahulu untuk mengirim donasi.");
      return;
    }
    setLoading(true);

    try {
      const data = new FormData();
      data.append("type", formData.type);
      data.append("companyId", formData.companyId);
      data.append("description", formData.description);
      data.append("grade", formData.grade);
      
      selectedImages.forEach((image) => {
        data.append("images", image);
      });

      const res = await api.post("/donation", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccessData(res.data.data);
      toast.success("Donasi berhasil dikirim! Poin telah ditambahkan.");
      
      // Reset form & Clear storage
      localStorage.removeItem("amerta_donation_form_state");
      setFormData({
        type: "AMERTA",
        companyId: "",
        description: "",
        grade: "LAYAK",
      });
      setSelectedImages([]);
      setImagePreviews([]);
      setCurrentStep(1);
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal mengirim donasi.");
    } finally {
      setLoading(false);
    }
  };

  const grades = [
    { value: "LAYAK", label: "Sangat Layak", icon: <FaCheckCircle className="text-green-500" />, desc: "Baju masih bagus dan siap pakai.", points: 50 },
    { value: "BISA_DIPERBAIKI", label: "Bisa Diperbaiki", icon: <FaTools className="text-yellow-500" />, desc: "Ada sedikit kerusakan kecil yang bisa diperbaiki.", points: 20 },
    { value: "TIDAK_LAYAK", label: "Tidak Layak", icon: <FaExclamationCircle className="text-red-500" />, desc: "Sudah tidak layak pakai namun bisa didaur ulang.", points: 5 },
  ];

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 bg-[url('/images/grid.svg')] bg-fixed bg-center bg-background">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          {/* <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[3px] mb-6"
          >
            <FaHeart className="animate-pulse" /> Berbagi Kebaikan
          </motion.div> */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black text-foreground tracking-tighter mb-6 uppercase"
          >
            Donasikan <span className="text-primary italic">Pakaianmu</span>
          </motion.h1>
          
          {/* Progress Tracker */}
          <div className="flex items-center justify-center gap-4 mt-12 max-w-md mx-auto relative">
             <div className="absolute top-1/2 left-0 w-full h-[2px] bg-gray-200 dark:bg-white/5 -translate-y-1/2 -z-10" />
             {STEPS.map((step) => (
               <div key={step.id} className="relative flex flex-col items-center gap-2">
                 <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 border-2 ${
                   currentStep >= step.id 
                    ? "bg-primary border-primary text-white scale-110 shadow-lg shadow-primary/30" 
                    : "bg-background border-gray-200 dark:border-white/10 text-gray-400"
                 }`}>
                   {currentStep > step.id ? <FaCheckCircle /> : step.icon}
                 </div>
                 <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${
                   currentStep >= step.id ? "text-primary" : "text-gray-400"
                 }`}>
                   {step.title}
                 </span>
               </div>
             ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form Section */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:col-span-8 bg-background/80 backdrop-blur-3xl border border-white/5 rounded-[40px] p-8 md:p-12 shadow-2xl relative overflow-hidden min-h-[500px] flex flex-col"
          >
            <form onSubmit={handleSubmit} className="relative z-10 flex-1 flex flex-col">
              <AnimatePresence mode="wait">
                {/* STEP 1: DESTINATION */}
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8 flex-1"
                  >
                    <div className="space-y-2">
                      <h2 className="text-2xl font-black uppercase tracking-tighter">Pilih Tujuan Donasi</h2>
                      <p className="text-gray-500 text-sm">Kemana kamu ingin mengirimkan pakaianmu?</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, type: "AMERTA", companyId: "" })}
                        className={`flex flex-col items-center justify-center gap-4 p-8 rounded-[32px] border-2 transition-all duration-500 group ${
                          formData.type === "AMERTA"
                            ? "bg-primary text-white border-primary shadow-2xl shadow-primary/30"
                            : "bg-gray-50/50 dark:bg-white/5 border-transparent text-gray-500 hover:border-primary/30"
                        }`}
                      >
                        <div className={`p-4 rounded-2xl ${formData.type === "AMERTA" ? "bg-white/20" : "bg-gray-100 dark:bg-white/10"}`}>
                          <FaUserAlt size={32} />
                        </div>
                        <div className="text-center">
                          <span className="text-sm font-black uppercase tracking-[3px] block mb-1">Ke Amerta</span>
                          <span className="text-[10px] opacity-60">Logistik & Daur Ulang</span>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, type: "COMPANY" })}
                        className={`flex flex-col items-center justify-center gap-4 p-8 rounded-[32px] border-2 transition-all duration-500 group ${
                          formData.type === "COMPANY"
                            ? "bg-primary text-white border-primary shadow-2xl shadow-primary/30"
                            : "bg-gray-50/50 dark:bg-white/5 border-transparent text-gray-500 hover:border-primary/30"
                        }`}
                      >
                        <div className={`p-4 rounded-2xl ${formData.type === "COMPANY" ? "bg-white/20" : "bg-gray-100 dark:bg-white/10"}`}>
                          <FaBuilding size={32} />
                        </div>
                        <div className="text-center">
                          <span className="text-sm font-black uppercase tracking-[3px] block mb-1">Ke Yayasan</span>
                          <span className="text-[10px] opacity-60">Panti Asuhan & Sosial</span>
                        </div>
                      </button>
                    </div>

                    {formData.type === "COMPANY" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="space-y-4 pt-4"
                      >
                        <label className="text-[10px] font-black uppercase tracking-[3px] text-gray-400 block ml-1">
                          Pilih Yayasan / Panti
                        </label>
                        <div className="relative group">
                          <select
                            required
                            value={formData.companyId}
                            onChange={(e) => setFormData({ ...formData, companyId: e.target.value })}
                            className="w-full bg-gray-50/50 dark:bg-white/5 border border-gray-200/50 dark:border-white/10 rounded-2xl px-6 py-5 text-sm font-bold focus:ring-4 focus:ring-primary/20 transition-all outline-none appearance-none cursor-pointer"
                          >
                            <option value="" disabled className="dark:text-black">Cari tujuan yayasan...</option>
                            {companies.map((c) => (
                              <option key={c.id} value={c.id} className="dark:text-black">
                                {c.name}
                              </option>
                            ))}
                          </select>
                          <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                             <FaArrowRight className="rotate-90" />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                )}

                {/* STEP 2: QUALITY / GRADE */}
                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8 flex-1"
                  >
                    <div className="space-y-2">
                      <h2 className="text-2xl font-black uppercase tracking-tighter">Kualitas Pakaian</h2>
                      <p className="text-gray-500 text-sm">Bagaimana kondisi pakaian yang akan kamu donasikan?</p>
                    </div>

                    <div className="space-y-4">
                      {grades.map((g) => (
                        <button
                          key={g.value}
                          type="button"
                          onClick={() => setFormData({ ...formData, grade: g.value })}
                          className={`w-full flex items-center justify-between p-6 rounded-[28px] border-2 transition-all duration-300 relative overflow-hidden group ${
                            formData.grade === g.value
                              ? "bg-white dark:bg-white/5 border-primary shadow-xl"
                              : "bg-gray-50/50 dark:bg-white/5 border-transparent hover:border-gray-200 dark:hover:border-white/10"
                          }`}
                        >
                          <div className="flex items-center gap-5 text-left relative z-10">
                            <div className={`p-4 rounded-2xl transition-transform duration-500 ${
                              formData.grade === g.value ? "bg-primary text-white rotate-6" : "bg-gray-100 dark:bg-white/10"
                            }`}>
                              {g.icon}
                            </div>
                            <div>
                              <p className="text-sm font-black uppercase tracking-widest">{g.label}</p>
                              <p className="text-[10px] text-gray-400 font-medium">{g.desc}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-[12px] font-black relative z-10">
                            <FaCoins /> +{g.points}
                          </div>
                          {formData.grade === g.value && (
                            <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                          )}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* STEP 3: DETAIL / IMAGES */}
                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8 flex-1"
                  >
                    <div className="space-y-2">
                      <h2 className="text-2xl font-black uppercase tracking-tighter">Detail & Foto</h2>
                      <p className="text-gray-500 text-sm">Tambahkan foto dan deskripsi singkat pakaianmu.</p>
                    </div>

                    {!authLoading && !user ? (
                      /* Login Required Section */
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-primary/5 border border-primary/20 rounded-[40px] p-10 text-center space-y-6"
                      >
                         <div className="w-20 h-20 bg-primary text-white rounded-3xl flex items-center justify-center mx-auto shadow-2xl shadow-primary/30">
                            <FaLock size={30} />
                         </div>
                         <div className="space-y-2">
                            <h3 className="text-xl font-black uppercase tracking-tight">Login Diperlukan</h3>
                            <p className="text-sm text-gray-500 leading-relaxed">Kamu hampir sampai! Masuk ke akunmu untuk menyelesaikan pengiriman donasi dan klaim poinmu.</p>
                         </div>
                         <div className="flex flex-col gap-3 pt-4">
                            <Link 
                              href="/login" 
                              className="bg-primary text-white py-5 rounded-[24px] text-[12px] font-black uppercase tracking-[3px] shadow-xl hover:opacity-90 transition-all flex items-center justify-center gap-3"
                            >
                              Masuk Sekarang <FaChevronRight />
                            </Link>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Progressmu telah disimpan secara otomatis</p>
                         </div>
                      </motion.div>
                    ) : (
                      /* Detail Form */
                      <div className="space-y-6">
                        <div className="space-y-4">
                          <label className="text-[10px] font-black uppercase tracking-[3px] text-gray-400 block ml-1">
                            Foto Pakaian (Maks. 5)
                          </label>
                          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                            {imagePreviews.map((preview, index) => (
                              <div key={index} className="relative aspect-square rounded-2xl overflow-hidden group border border-gray-200/50 dark:border-white/10">
                                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                <button
                                  type="button"
                                  onClick={() => removeImage(index)}
                                  className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                >
                                  <FaTimes size={10} />
                                </button>
                              </div>
                            ))}
                            {imagePreviews.length < 5 && (
                              <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="aspect-square rounded-2xl border-2 border-dashed border-gray-200 dark:border-white/10 flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-primary hover:text-primary transition-all bg-gray-50/30"
                              >
                                <FaPlus size={20} />
                                <span className="text-[8px] font-black uppercase tracking-widest">Tambah</span>
                              </button>
                            )}
                          </div>
                          <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageSelect}
                            multiple
                            accept="image/*"
                            className="hidden"
                          />
                        </div>

                        <div className="space-y-4">
                          <label className="text-[10px] font-black uppercase tracking-[3px] text-gray-400 block ml-1">
                            Deskripsi Pakaian
                          </label>
                          <textarea
                            required
                            placeholder="Ceritakan sedikit tentang pakaian yang kamu donasikan..."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full bg-gray-50/50 dark:bg-white/5 border border-gray-200/50 dark:border-white/10 rounded-[32px] px-8 py-6 text-sm font-bold focus:ring-4 focus:ring-primary/20 transition-all outline-none min-h-[160px] resize-none"
                          />
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation Buttons */}
              <div className="flex items-center gap-4 mt-12 pt-8 border-t border-gray-100 dark:border-white/5">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex-1 flex items-center justify-center gap-3 py-5 rounded-3xl border-2 border-gray-200 dark:border-white/10 text-[12px] font-black uppercase tracking-widest hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
                  >
                    <FaArrowLeft /> Kembali
                  </button>
                )}
                
                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="flex-[2] flex items-center justify-center gap-3 py-5 rounded-3xl bg-foreground text-background dark:bg-white dark:text-black text-[12px] font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-xl"
                  >
                    Lanjutkan <FaArrowRight />
                  </button>
                ) : (
                  user && (
                    <button
                      type="submit"
                      disabled={loading || !formData.description || selectedImages.length === 0}
                      className="flex-[2] flex items-center justify-center gap-3 py-5 rounded-3xl bg-primary text-white text-[12px] font-black uppercase tracking-[3px] hover:bg-primary-light transition-all shadow-2xl shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                      {loading ? "Mengirim..." : "Selesaikan Donasi"}
                      {!loading && <FaHeart className="group-hover:scale-125 transition-transform" />}
                    </button>
                  )
                )}
              </div>
            </form>

            {/* Decoration Elements */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-secondary/5 rounded-full blur-[100px] pointer-events-none" />
          </motion.div>

          {/* Sidebar / Info Section */}
          <div className="lg:col-span-4 space-y-6">
            {/* Quick Preview Card */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/40 dark:bg-white/5 backdrop-blur-xl border border-white/10 rounded-[40px] p-8 shadow-sm"
            >
              <h3 className="text-[10px] font-black uppercase tracking-[4px] text-primary mb-8 flex items-center gap-2">
                <div className="w-1 h-1 bg-primary rounded-full" /> Ringkasan Donasi
              </h3>
              
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-500 shrink-0">
                    <FaBuilding size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Tujuan</p>
                    <p className="text-sm font-bold truncate">
                      {formData.type === "AMERTA" ? "Pusat Amerta" : (companies.find(c => c.id === formData.companyId)?.name || "Pilih Yayasan...")}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-500 shrink-0">
                    <FaHandSparkles size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Kualitas</p>
                    <p className="text-sm font-bold uppercase tracking-widest">
                      {grades.find(g => g.value === formData.grade)?.label}
                    </p>
                  </div>
                </div>

                <div className="p-6 rounded-[32px] bg-primary/10 border border-primary/20 flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
                        <FaCoins size={12} />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-primary">Estimasi Poin</span>
                   </div>
                   <span className="text-xl font-black text-primary">+{grades.find(g => g.value === formData.grade)?.points}</span>
                </div>
              </div>
            </motion.div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 gap-4">
               <div className="p-6 rounded-[32px] bg-green-500/5 border border-green-500/10 flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-green-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-green-500/20">
                    <FaCheckCircle size={18} />
                  </div>
                  <p className="text-[11px] text-gray-500 leading-relaxed font-medium">Pakaian akan diverifikasi oleh tim kurasi kami secara profesional.</p>
               </div>
            </div>

            {/* Success Overlay */}
            <AnimatePresence>
              {successData && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-md"
                >
                  <motion.div
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    className="max-w-md w-full bg-white dark:bg-background border border-gray-200 dark:border-white/10 rounded-[48px] p-12 text-center shadow-2xl"
                  >
                    <div className="w-24 h-24 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-primary/40 relative">
                       <FaHeart size={40} className="animate-pulse" />
                       <div className="absolute inset-0 bg-primary rounded-full animate-ping opacity-20" />
                    </div>
                    <h3 className="text-3xl font-black text-foreground tracking-tighter mb-4 uppercase italic">Terima Kasih!</h3>
                    <p className="text-gray-500 text-sm mb-10 leading-relaxed">Kontribusimu sangat berarti bagi keberlanjutan bumi dan kesejahteraan sesama.</p>
                    
                    <div className="bg-primary/5 rounded-3xl p-6 mb-10 flex items-center justify-center gap-4 border border-primary/10">
                      <FaCoins className="text-primary" size={24} />
                      <div className="text-left">
                        <span className="block text-[10px] font-black uppercase tracking-widest text-primary opacity-60">Poin Ditambahkan</span>
                        <span className="text-3xl font-black text-primary tracking-tighter">+{successData.points} XP</span>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => setSuccessData(null)}
                      className="w-full bg-foreground text-background dark:bg-white dark:text-black py-5 rounded-[24px] text-[12px] font-black uppercase tracking-[3px] hover:opacity-90 transition-all shadow-xl"
                    >
                      Lanjutkan Berbagi
                    </button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
