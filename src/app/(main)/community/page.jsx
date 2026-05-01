'use client';
import { useState, useEffect } from 'react';
import {
  FaPlus, FaFilter, FaLeaf, FaExchangeAlt,
  FaBullhorn, FaGraduationCap, FaSync,
  FaImage, FaTimes
} from 'react-icons/fa';
import api from '@/lib/axios';
import toast from 'react-hot-toast';
import CreatePostModal from '@/components/community/CreatePostModal';

export default function CommunityPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    fetchPosts();
    fetchUser();
  }, [filter]);

  const fetchUser = async () => {
    try {
      const res = await api.get('/auth/me');
      setCurrentUser(res.data.data.user);
    } catch (err) {
      console.error('Failed to fetch user');
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

  const handleCreatePost = async (formData) => {
    try {
      await api.post('/community', formData);
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

  return (
    <div className="min-h-screen bg-[#FCFBF7] dark:bg-[#0d110f] transition-colors duration-500">
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="space-y-4 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
              <FaLeaf className="text-primary text-xs" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Amerta Ecosystem</span>
            </div>
            <h1 className="text-6xl font-black text-amerta-dark dark:text-white leading-tight tracking-tighter">
              Komunitas<br />Sirkular
            </h1>
            <p className="text-gray-500 dark:text-gray-400 max-w-md text-lg font-medium leading-relaxed">
              Temukan inspirasi, edukasi, dan peluang kolaborasi untuk gaya hidup tanpa limbah.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="group relative bg-primary hover:bg-primary-light text-black px-10 py-5 rounded-[24px] font-black uppercase tracking-[0.2em] text-xs transition-all shadow-[0_20px_40px_rgba(43,76,59,0.2)] active:scale-95 flex items-center gap-3 overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <FaPlus className="relative z-10" />
            <span className="relative z-10">Mulai Gerakan</span>
          </button>
        </div>

        {/* Filter Bar */}
        <div className="sticky top-24 z-40 mb-12 py-4 bg-[#FCFBF7]/80 dark:bg-[#0d110f]/80 backdrop-blur-xl border-y border-black/5 dark:border-white/5 -mx-6 px-6">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilter(cat.id)}
                className={`flex items-center gap-3 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] transition-all whitespace-nowrap border
                  ${filter === cat.id
                    ? 'bg-amerta-dark dark:bg-white text-white dark:text-black border-transparent shadow-xl'
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
        <div className="grid grid-cols-1 gap-12">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 space-y-6">
              <div className="relative">
                <div className="w-16 h-16 border-[6px] border-primary/20 rounded-full animate-spin" />
                <div className="w-16 h-16 border-[6px] border-primary border-t-transparent rounded-full animate-spin absolute inset-0" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary animate-pulse">Menyelaraskan Data...</p>
            </div>
          ) : posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {posts.map((post, idx) => (
                <div key={post.id} className="animate-fade-in-up" style={{ animationDelay: `${idx * 100}ms` }}>
                  <CommunityPost post={post} currentUser={currentUser} />
                </div>
              ))}
            </div>
          ) : (
            <div className="py-32 text-center">
              <div className="w-24 h-24 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 text-gray-200 dark:text-white/10">
                <FaLeaf size={40} />
              </div>
              <h3 className="text-2xl font-black text-gray-700 dark:text-white tracking-tight">Belum ada jejak gerakan</h3>
              <p className="text-gray-400 mt-2 max-w-xs mx-auto font-medium">Jadilah yang pertama untuk memulai perubahan positif hari ini.</p>
            </div>
          )}
        </div>

        <CreatePostModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleCreatePost}
        />
      </div>
    </div>
  );
}
