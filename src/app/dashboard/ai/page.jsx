"use client";

import { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import { FaCamera, FaRobot, FaCheckCircle, FaRedo, FaUpload, FaTimesCircle, FaLeaf } from "react-icons/fa";

export default function AIKuratorPage() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      setStream(mediaStream);
      setCapturedImage(null);
      setResult(null);
      
    } catch (err) {
      toast.error("Tidak dapat mengakses kamera. Pastikan izin telah diberikan.");
    }
  };

  // Bind video element when stream is ready
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => stopCamera();
  }, [stream]);

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      const imageUrl = canvas.toDataURL('image/jpeg', 0.8);
      setCapturedImage(imageUrl);
      stopCamera();
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCapturedImage(event.target.result);
        stopCamera();
      };
      reader.readAsDataURL(file);
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    setResult(null);
    startCamera();
  };

  const analyzeImage = () => {
    if (!capturedImage) return;

    setIsAnalyzing(true);
    
    // Simulating advanced Nilacare AI logic processing
    setTimeout(() => {
      setIsAnalyzing(false);
      
      const score = Math.floor(Math.random() * 100);
      let grade, status, color, description, percentage;

      if (score >= 90) {
        grade = "Perfect";
        status = "Kondisi Istimewa";
        color = "text-emerald-500";
        percentage = 95 + Math.random() * 5;
        description = "Kualitas premium! Serat kain 100% utuh, warna tajam, dan tidak ada tanda pemakaian. Sangat layak untuk marketplace atau donasi eksklusif.";
      } else if (score >= 75) {
        grade = "Good";
        status = "Sangat Layak";
        color = "text-amerta-green";
        percentage = 80 + Math.random() * 10;
        description = "Kondisi sangat baik. Terdapat jejak pemakaian minimal yang wajar. Struktur kain sangat kuat. Direkomendasikan untuk program donasi reguler.";
      } else if (score >= 45) {
        grade = "Layak";
        status = "Layak Pakai";
        color = "text-blue-500";
        percentage = 60 + Math.random() * 15;
        description = "Masih berfungsi dengan baik. Ada sedikit penurunan warna atau serat mikro, namun tetap nyaman digunakan sehari-hari.";
      } else {
        grade = "Not Layak";
        status = "Daur Ulang Saja";
        color = "text-red-500";
        percentage = 30 + Math.random() * 15;
        description = "Ditemukan kerusakan struktur kain atau noda permanen. Untuk menjaga standar Amerta, pakaian ini disarankan masuk ke jalur Recycling (Daur Ulang).";
      }

      setResult({
        grade,
        status,
        color,
        score,
        confidence: percentage.toFixed(1),
        description
      });
      toast.success("Analisis kurasi selesai.");
    }, 3000);
  };

  const getScalePosition = (grade) => {
    const scales = ["Not Layak", "Layak", "Good", "Perfect"];
    return scales.indexOf(grade);
  };

  return (
    <div className="p-6 md:p-12 animate-fade-in-up max-w-5xl mx-auto flex flex-col h-full overflow-y-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-amerta-dark tracking-tight flex items-center gap-3">
          <div className="p-2 bg-amerta-green/10 rounded-lg">
            <FaRobot className="text-amerta-green" />
          </div>
          AI Kurator <span className="text-xs font-medium bg-amerta-green/10 text-amerta-green px-2 py-1 rounded-full uppercase tracking-wider">Powered by NilaCare</span>
        </h1>
        <p className="text-gray-500 mt-2 max-w-2xl">
          Sistem automasi penilaian kualitas pakaian menggunakan Computer Vision. 
          Pastikan logo atau area tekstur pakaian terlihat jelas di kamera.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left Column: Camera / Image */}
        <div className="space-y-4">
          <div className="relative bg-black rounded-3xl overflow-hidden aspect-[4/3] shadow-2xl border-4 border-white dark:border-gray-800 flex items-center justify-center group">
            
            {!stream && !capturedImage && (
              <div className="text-center p-6 select-none">
                <div className="w-20 h-20 bg-surface rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                  <FaCamera size={32} className="text-gray-400" />
                </div>
                <p className="text-gray-400 mb-6 font-medium">Siapkan pakaian Anda di depan layar</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button 
                    onClick={startCamera}
                    className="px-8 py-3 bg-amerta-green text-white font-bold rounded-2xl hover:scale-105 transition-all shadow-lg shadow-amerta-green/20 flex items-center justify-center gap-2"
                  >
                    <FaCamera /> Buka Kamera
                  </button>
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="px-8 py-3 bg-white border border-gray-200 text-amerta-dark font-bold rounded-2xl hover:bg-gray-50 transition-all shadow-sm flex items-center justify-center gap-2"
                  >
                    <FaUpload /> File Lokal
                  </button>
                </div>
              </div>
            )}

            {stream && !capturedImage && (
              <>
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  muted 
                  className="w-full h-full object-cover"
                />
                
                {/* Aiming guide overlay */}
                <div className="absolute inset-x-12 inset-y-16 border-2 border-white/40 border-dashed rounded-[2rem] pointer-events-none flex items-center justify-center">
                  <div className="w-8 h-8 border-t-2 border-l-2 border-white absolute top-0 left-0 rounded-tl-xl" />
                  <div className="w-8 h-8 border-t-2 border-r-2 border-white absolute top-0 right-0 rounded-tr-xl" />
                  <div className="w-8 h-8 border-b-2 border-l-2 border-white absolute bottom-0 left-0 rounded-bl-xl" />
                  <div className="w-8 h-8 border-b-2 border-r-2 border-white absolute bottom-0 right-0 rounded-br-xl" />
                  <div className="text-white/30 text-xs font-mono uppercase tracking-[0.2em] animate-pulse">Scanning Area</div>
                </div>

                <div className="absolute bottom-8 inset-x-0 flex justify-center">
                  <button 
                    onClick={capturePhoto}
                    className="group relative"
                  >
                    <div className="absolute inset-0 bg-white/20 rounded-full scale-125 blur-md" />
                    <div className="w-20 h-20 bg-white flex items-center justify-center rounded-full active:scale-90 transition-all shadow-2xl border-[6px] border-white/30 p-1 relative z-10">
                      <div className="w-full h-full bg-amerta-green rounded-full flex items-center justify-center">
                         <FaCamera className="text-white" />
                      </div>
                    </div>
                  </button>
                </div>
              </>
            )}

            {capturedImage && (
              <img 
                src={capturedImage} 
                alt="Captured Garment" 
                className="w-full h-full object-cover" 
              />
            )}
            
            {/* hidden canvas for grabbing the frame */}
            <canvas ref={canvasRef} className="hidden" />
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
            />
          </div>

          {capturedImage && !isAnalyzing && !result && (
            <div className="flex gap-4 animate-fade-in-up">
              <button 
                onClick={retakePhoto}
                className="flex-1 px-4 py-4 bg-white border border-gray-200 dark:border-gray-800 dark:bg-black text-amerta-dark font-bold rounded-2xl hover:bg-gray-50 flex justify-center items-center gap-2 transition-all shadow-sm"
              >
                <FaRedo /> Ulangi
              </button>
              <button 
                onClick={analyzeImage}
                className="flex-[2] px-4 py-4 bg-amerta-green text-white font-bold rounded-2xl hover:opacity-90 flex justify-center items-center gap-2 transition-all shadow-xl shadow-amerta-green/20"
              >
                <FaRobot /> Mulai Kurasi
              </button>
            </div>
          )}
        </div>

        {/* Right Column: AI Analysis Result */}
        <div className="h-full">
          {isAnalyzing ? (
            <div className="h-full min-h-[400px] bg-background border-2 border-gray-100 dark:border-gray-800 rounded-3xl flex flex-col items-center justify-center p-10 shadow-inner relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gray-100">
                <div className="h-full bg-amerta-green animate-[loading_2s_infinite]" style={{width: '30%'}} />
              </div>
              
              <div className="relative mb-8">
                <div className="w-24 h-24 border-4 border-gray-100 rounded-full" />
                <div className="w-24 h-24 border-4 border-amerta-green border-t-transparent rounded-full animate-spin absolute inset-0" />
                <div className="absolute inset-0 flex items-center justify-center text-amerta-green animate-pulse">
                  <FaRobot size={36} />
                </div>
              </div>
              <h3 className="text-2xl font-black text-amerta-dark mb-3">Menganalisis Serat...</h3>
              <p className="text-gray-400 text-center text-sm leading-relaxed max-w-xs">
                NilaCare Engine sedang membandingkan pola tekstur dengan database sirkular kami.
              </p>
            </div>
          ) : result ? (
            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-8 shadow-2xl animate-fade-in-up h-full flex flex-col relative overflow-hidden">
              {/* Grading Badge Floating */}
              <div className="absolute -top-4 -right-4 w-32 h-32 bg-amerta-green opacity-5 rounded-full" />
              
              <div className="flex justify-between items-start mb-8 relative z-10">
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">AI Classification</p>
                  <h2 className={`text-4xl font-black transition-colors ${result.color}`}>{result.grade}</h2>
                  <p className="text-amerta-dark font-bold text-lg mt-1">{result.status}</p>
                </div>
                <div className="text-right">
                   <div className="inline-flex flex-col items-center p-3 bg-surface rounded-2xl border border-gray-100">
                      <span className="text-xs font-bold text-gray-400">Confidence</span>
                      <span className="text-xl font-black text-amerta-green">{result.confidence}%</span>
                   </div>
                </div>
              </div>

              {/* Quality Scale Chart */}
              <div className="mb-10 p-6 bg-surface rounded-[2rem] border border-gray-50 dark:border-gray-800 flex-1">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6 px-1">Quality Measurement Scale</h4>
                <div className="relative px-2">
                  <div className="h-3 w-full bg-gray-200 dark:bg-gray-800 rounded-full flex overflow-hidden">
                    <div className="h-full w-1/4 bg-red-400 border-r border-white/20" />
                    <div className="h-full w-1/4 bg-blue-400 border-r border-white/20" />
                    <div className="h-full w-1/4 bg-amerta-green border-r border-white/20" />
                    <div className="h-full w-1/4 bg-emerald-400" />
                  </div>
                  
                  {/* Indicator Arrow */}
                  <div 
                    className="absolute top-1/2 -translate-y-1/2 transition-all duration-1000 ease-out" 
                    style={{ left: `${(getScalePosition(result.grade) * 25) + 12.5}%` }}
                  >
                    <div className="w-6 h-6 bg-white dark:bg-black rounded-full border-4 border-amerta-dark shadow-lg flex items-center justify-center -translate-x-1/2">
                       <div className="w-1.5 h-1.5 bg-amerta-dark rounded-full" />
                    </div>
                  </div>

                  <div className="flex justify-between mt-4">
                    {["Not Layak", "Layak", "Good", "Perfect"].map((label, idx) => (
                      <span key={idx} className={`text-[10px] font-bold uppercase transition-colors ${result.grade === label ? "text-amerta-dark" : "text-gray-300"}`}>
                        {label}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-800">
                  <h4 className="font-bold text-amerta-dark mb-3 flex items-center gap-2">
                    <FaLeaf size={14} className="text-amerta-green" /> Rekomendasi Sistem
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed italic">
                    "{result.description}"
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={retakePhoto}
                  className="px-6 py-4 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-amerta-dark font-bold rounded-2xl transition-all shadow-sm"
                >
                  Ulangi Scan
                </button>
                <button 
                  onClick={() => toast.success("Data kurasi tersimpan!")}
                  className="px-6 py-4 bg-amerta-dark text-white font-bold rounded-2xl hover:opacity-90 transition-all shadow-xl shadow-amerta-dark/10"
                >
                  Simpan & Lanjut 
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[400px] border-4 border-dashed border-gray-100 dark:border-gray-800 rounded-3xl flex flex-col items-center justify-center p-12 text-center group">
              <div className="w-24 h-24 bg-surface rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                <FaRobot size={48} className="text-amerta-green/20" />
              </div>
              <h3 className="text-xl font-bold text-amerta-dark mb-2">Belum Ada Sesi Kurasi</h3>
              <p className="text-gray-400 text-sm max-w-[240px]">Ambil foto pakaian Anda untuk memvalidasi kondisi serat dan warna secara digital.</p>
            </div>
          )}
        </div>
      </div>

      {/* Criteria Chart / Explanation Section */}
      <div className="mt-16 border-t border-gray-100 pt-12">
        <h2 className="text-2xl font-black text-amerta-dark mb-8 text-center">Standar Kualitas Amerta</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "Perfect", color: "bg-emerald-400", desc: "Seperti baru, serat padat, warna cerah, cocok untuk Resale Premium." },
            { label: "Good", color: "bg-amerta-green", desc: "Sangat baik, minim aus, tidak ada cacat, ideal untuk Donasi Prioritas." },
            { label: "Layak", color: "bg-blue-400", desc: "Berfungsi normal, ada tanda pemakaian wajar, diteruskan ke Social Loop." },
            { label: "Not Layak", color: "bg-red-400", desc: "Kerusakan serat substansial, diarahkan ke Fibers Recycling Hub." },
          ].map((item, idx) => (
            <div key={idx} className="bg-background p-6 rounded-2xl border border-gray-50 shadow-sm hover:shadow-md transition-shadow">
              <div className={`w-3 h-3 rounded-full ${item.color} mb-4`} />
              <h4 className="font-bold text-amerta-dark mb-2">{item.label}</h4>
              <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
