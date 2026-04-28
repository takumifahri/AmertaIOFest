'use client';
import { useState, useEffect } from 'react';
import { 
  FaPlus, FaFilter, FaLeaf, FaExchangeAlt, 
  FaBullhorn, FaGraduationCap, FaSync,
  FaImage, FaTimes
} from 'react-icons/fa';
import api from '@/lib/axios';
import toast from 'react-hot-toast';
import CommunityPost from '@/components/community/CommunityPost';

export default function CommunityPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'EDUCATION',
    imageUrl: ''
  });

  useEffect(() => {
    fetchPosts();
    fetchUser();
  }, [filter]);

  const fetchUser = async () => {
    try {
      const res = await api.get('/auth/me');
      setCurrentUser(res.data.user);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/community', formData);
      toast.success('Postingan berhasil dibuat!');
      setIsModalOpen(false);
      setFormData({ title: '', content: '', type: 'EDUCATION', imageUrl: '' });
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
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-amerta-dark flex items-center gap-3">
            <span className="p-2 bg-amerta-sand/30 rounded-xl">
              <FaLeaf className="text-amerta-green" />
            </span>
            Komunitas Amerta
          </h1>
          <p className="text-gray-500 mt-2 font-medium">Berbagi inspirasi untuk masa depan sirkular.</p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-amerta-dark text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-black transition-all shadow-lg shadow-black/10 active:scale-95"
        >
          <FaPlus />
          Buat Postingan
        </button>
      </div>

      {/* Filter Chips */}
      <div className="flex overflow-x-auto pb-4 mb-6 gap-3 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setFilter(cat.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap border
              ${filter === cat.id 
                ? 'bg-amerta-dark text-white border-amerta-dark shadow-md' 
                : 'bg-white text-gray-500 border-gray-100 hover:border-amerta-sand'
              }`}
          >
            {cat.icon}
            {cat.name}
          </button>
        ))}
      </div>

      {/* Feed */}
      <div className="space-y-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-10 h-10 border-4 border-amerta-sand border-t-amerta-dark rounded-full animate-spin" />
            <p className="text-gray-400 font-medium animate-pulse">Memuat postingan...</p>
          </div>
        ) : posts.length > 0 ? (
          posts.map((post) => (
            <CommunityPost key={post.id} post={post} currentUser={currentUser} />
          ))
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-gray-100">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-200">
              <FaLeaf size={40} />
            </div>
            <h3 className="text-lg font-bold text-gray-700">Belum ada postingan</h3>
            <p className="text-gray-400 mt-1 max-w-xs mx-auto">Mulai berbagi edukasi atau ajak teman-teman bertukar pakaian!</p>
          </div>
        )}
      </div>

      {/* Create Post Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
            onClick={() => setIsModalOpen(false)}
          />
          <div className="bg-white w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl relative z-10 animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-amerta-dark">Buat Postingan Baru</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500 transition-colors">
                <FaTimes size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Judul Postingan</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 text-sm focus:outline-none focus:border-amerta-sand"
                  placeholder="Contoh: Tips Mengolah Kaos Bekas Menjadi Tas"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Kategori</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 text-sm focus:outline-none focus:border-amerta-sand appearance-none"
                  >
                    <option value="EDUCATION">Edukasi</option>
                    <option value="EXCHANGE">Tukar Menukar</option>
                    <option value="ANNOUNCEMENT">Pengumuman</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">URL Gambar (Opsional)</label>
                  <input
                    type="text"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 text-sm focus:outline-none focus:border-amerta-sand"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Konten</label>
                <textarea
                  required
                  rows={5}
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 text-sm focus:outline-none focus:border-amerta-sand resize-none"
                  placeholder="Jelaskan detail edukasi atau tawaran tukar menukarmu di sini..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-amerta-dark text-white py-4 rounded-2xl font-bold hover:bg-black transition-all shadow-lg active:scale-[0.98]"
              >
                Posting Sekarang
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
