'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/axios';
import toast from 'react-hot-toast';
import {
  FaChevronLeft, FaUserCircle, FaLeaf, FaComment,
  FaShare, FaMapMarkerAlt, FaPaperPlane, FaChevronRight,
  FaEllipsisV, FaBan
} from 'react-icons/fa';
import { getImageUrl } from '@/lib/imageUrl';
import { formatRelativeDate } from '@/lib/dateUtils';
import { useRooms } from '@/hooks/useRooms';



export default function PostDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showAuthorMenu, setShowAuthorMenu] = useState(false);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const { initiateChat } = useRooms();


  useEffect(() => {
    const init = async () => {
      setLoading(true);
      const user = await fetchUser();
      await fetchPost(user);
      setLoading(false);
    };
    init();
  }, [id]);

  const fetchUser = async () => {
    try {
      const res = await api.get('/auth/me');
      const user = res.data.data.user;
      setCurrentUser(user);
      return user;
    } catch (err) {
      setCurrentUser(null);
      return null;
    }
  };

  const fetchPost = async (user) => {
    try {
      const response = await api.get(`/community/${id}`);
      const postData = response.data;
      const liked = postData.likes?.some(l => l.userId === user?.id) || false;
      setPost({ ...postData, isLiked: liked });
    } catch (error) {
      toast.error('Gagal mengambil detail postingan');
      router.push('/komunitas');
    }
  };

  const handleChatWithAuthor = async () => {
    if (!currentUser) {
      toast.error('Silakan login terlebih dahulu');
      return;
    }
    if (currentUser.id === post.author.id) {
      toast.error('Anda tidak bisa chat dengan diri sendiri');
      return;
    }

    setIsChatLoading(true);
    try {
      const room = await initiateChat(post.author.id);
      router.push(`/dashboard/chat?room=${room.id}`);
      toast.success('Melanjutkan ke percakapan...');
    } catch (err) {
      toast.error(typeof err === 'string' ? err : 'Gagal memulai percakapan');
    } finally {
      setIsChatLoading(false);
      setShowAuthorMenu(false);
    }
  };

  const handleBlockAuthor = () => {
    toast.success(`${post.author.name} telah diblokir (Simulasi)`);
    setShowAuthorMenu(false);
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      toast.error('Silakan login untuk memberikan komentar');
      return;
    }
    if (!comment.trim()) return;

    try {
      const response = await api.post(`/community/${id}/comment`, { content: comment });
      setPost({
        ...post,
        comments: [...(post.comments || []), response.data]
      });
      setComment('');
      toast.success('Komentar ditambahkan');
    } catch (error) {
      toast.error('Gagal menambahkan komentar');
    }
  };

  const handleLike = async () => {
    if (!currentUser) {
      toast.error('Silakan login untuk memberikan Leaf');
      return;
    }

    const isLiked = post.isLiked;
    const likeCount = post._count?.likes || 0;

    // Optimistic Update
    setPost({
      ...post,
      isLiked: !isLiked,
      _count: {
        ...post._count,
        likes: isLiked ? likeCount - 1 : likeCount + 1
      }
    });

    try {
      await api.post(`/community/${id}/like`);
      toast.success(isLiked ? 'Leaf dilepas' : 'Leaf diberikan!');
    } catch (err) {
      // Revert on error
      setPost({
        ...post,
        isLiked: isLiked,
        _count: {
          ...post._count,
          likes: likeCount
        }
      });
      toast.error('Gagal memberikan Leaf');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FCFBF7] dark:bg-[#0d110f] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!post) return null;

  const nextImage = () => {
    if (!post.images) return;
    setActiveImageIndex((prev) => (prev + 1) % post.images.length);
  };

  const prevImage = () => {
    if (!post.images) return;
    setActiveImageIndex((prev) => (prev - 1 + post.images.length) % post.images.length);
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'EDUCATION': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'EXCHANGE': return 'text-primary bg-primary/10 border-primary/20';
      case 'ANNOUNCEMENT': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
      default: return 'text-gray-400 bg-white/5 border-white/10';
    }
  };

  return (
    <div className="min-h-screen bg-[#FCFBF7] dark:bg-[#0d110f] transition-colors duration-500 py-6 md:py-12">
      <div className="max-w-7xl mx-auto px-4">

        {/* Navigation */}
        <Link
          href="/komunitas"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-primary transition-colors mb-6 group"
        >
          <FaChevronLeft size={12} />
          <span className="text-xs font-bold uppercase tracking-wider">Kembali</span>
        </Link>

        {/* Side-by-Side Post Detail (Social Media Desktop Style) */}
        <article className="bg-white dark:bg-[#0f0f0f] rounded-[32px] border border-black/5 dark:border-white/10 overflow-hidden shadow-2xl flex flex-col lg:flex-row min-h-[600px] lg:max-h-[85vh]">

          {/* Left Side: Images Carousel */}
          <div className="lg:w-[60%] bg-black relative flex items-center justify-center overflow-hidden">
            {post.images && post.images.length > 0 ? (
              <>
                <img
                  src={getImageUrl(post.images[activeImageIndex].url)}
                  className="w-full h-full object-contain"
                  alt={post.title}
                />

                {/* Navigation Arrows */}
                {post.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/60 transition-all"
                    >
                      <FaChevronLeft />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/60 transition-all"
                    >
                      <FaChevronRight />
                    </button>

                    {/* Indicators */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                      {post.images.map((_, idx) => (
                        <div
                          key={idx}
                          className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${idx === activeImageIndex ? 'bg-primary w-4' : 'bg-white/30'}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center gap-4 text-gray-600">
                <FaLeaf size={64} className="opacity-10" />
                <span className="text-xs font-black uppercase tracking-widest opacity-20">No Visuals</span>
              </div>
            )}
          </div>

          {/* Right Side: Header, Content, Comments */}
          <div className="lg:w-[40%] flex flex-col border-l border-black/5 dark:border-white/10 bg-white dark:bg-[#0c0c0c]">

            {/* Header */}
            <div className="p-6 border-b border-black/5 dark:border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-4 relative">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                  <FaUserCircle size={24} className="opacity-40" />
                </div>
                <div
                  className="cursor-pointer group/author"
                  onClick={() => setShowAuthorMenu(!showAuthorMenu)}
                >
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-amerta-dark dark:text-white text-sm leading-none group-hover:text-primary transition-colors">{post.author.name}</h4>
                    <FaEllipsisV size={10} className="text-gray-400 opacity-0 group-hover:opacity-100 transition-all" />
                  </div>
                  <p className="text-[9px] text-gray-500 font-bold uppercase tracking-tight mt-1">
                    {formatRelativeDate(post.createdAt)}
                  </p>
                </div>

                {/* Author Dropdown Menu */}
                {showAuthorMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowAuthorMenu(false)}
                    />
                    <div className="absolute top-12 left-10 w-48 bg-white dark:bg-[#1a1a1a] border border-black/5 dark:border-white/10 rounded-2xl shadow-2xl z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                      <button
                        onClick={handleChatWithAuthor}
                        disabled={isChatLoading}
                        className="w-full flex items-center gap-3 px-4 py-3 text-left text-xs font-bold text-amerta-dark dark:text-white hover:bg-primary/10 hover:text-primary transition-all disabled:opacity-50"
                      >
                        {isChatLoading ? (
                          <div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <FaComment size={12} />
                        )}
                        <span>Chat dengan Author</span>
                      </button>
                      <button
                        onClick={handleBlockAuthor}
                        className="w-full flex items-center gap-3 px-4 py-3 text-left text-xs font-bold text-red-500 hover:bg-red-500/10 transition-all border-t border-black/5 dark:border-white/5"
                      >
                        <FaBan size={12} />
                        <span>Blokir Pengguna</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
              <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider border ${getTypeColor(post.type)}`}>
                {post.type}
              </span>
            </div>

            {/* Content & Location (Scrollable) */}
            <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-6">
              <div>
                <h1 className="text-2xl font-black text-amerta-dark dark:text-white mb-3 tracking-tighter uppercase leading-tight">
                  {post.title}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed font-medium">
                  {post.content}
                </p>
              </div>

              {/* Location */}
              {post.address && (
                <div className="bg-primary/5 border border-primary/10 rounded-2xl p-4 flex items-start gap-3 group/loc">
                  <FaMapMarkerAlt className="text-primary mt-0.5" size={14} />
                  <div className="flex-1">
                    <p className="text-[9px] font-black text-primary uppercase tracking-widest mb-0.5">Lokasi</p>
                    <p className="text-xs text-amerta-dark dark:text-white font-bold leading-tight line-clamp-2">{post.address}</p>
                    {post.latitude && (
                      <a
                        href={`https://www.google.com/maps?q=${post.latitude},${post.longitude}`}
                        target="_blank"
                        className="inline-block mt-2 text-[8px] font-black uppercase tracking-widest text-primary hover:underline"
                      >
                        Buka di Google Maps →
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Divider */}
              <div className="h-px bg-black/5 dark:bg-white/5" />

              {/* Comments List */}
              <div className="space-y-6 pb-6">
                <h5 className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4">Diskusi Komunitas</h5>
                {post.comments?.map((c) => (
                  <div key={c.id} className="flex gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 flex items-center justify-center shrink-0">
                      <FaUserCircle size={18} className="opacity-10 text-amerta-dark dark:text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-[11px] text-amerta-dark dark:text-white">{c.user.name}</span>
                        <span className="text-[9px] text-gray-500 font-medium">{formatRelativeDate(c.createdAt)}</span>
                      </div>
                      <div className="bg-black/5 dark:bg-white/5 p-3 rounded-xl rounded-tl-none text-xs text-gray-600 dark:text-gray-400 font-medium">
                        {c.content}
                      </div>
                    </div>
                  </div>
                ))}
                {(!post.comments || post.comments.length === 0) && (
                  <div className="text-center py-6 opacity-30 italic text-xs font-medium">
                    Belum ada diskusi...
                  </div>
                )}
              </div>
            </div>

            {/* Interaction Footer */}
            <div className="p-6 border-t border-black/5 dark:border-white/5 bg-white dark:bg-[#0c0c0c]">
              <div className="flex items-center gap-6 mb-6">
                <button 
                  onClick={handleLike}
                  className={`flex items-center gap-2 transition-all duration-300 font-black text-[10px] uppercase tracking-wider ${post.isLiked ? 'text-primary scale-110' : 'text-gray-400 hover:text-primary'}`}
                >
                  <FaLeaf size={14} className={`${post.isLiked ? 'fill-primary' : ''}`} />
                  <span>{post._count?.likes || 0} Leaf</span>
                </button>
                <div className="flex items-center gap-2 text-gray-400 font-black text-[10px] uppercase tracking-wider">
                  <FaComment size={14} />
                  <span>{post.comments?.length || 0} Komentar</span>
                </div>
                <button className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors font-black text-[10px] uppercase tracking-wider">
                  <FaShare size={14} />
                  <span>Bagikan</span>
                </button>
              </div>

              {/* Comment Input */}
              <form onSubmit={handleAddComment} className="relative flex items-center gap-3">
                <input
                  type="text"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder={currentUser ? "Tambah komentar..." : "Login untuk komentar"}
                  disabled={!currentUser}
                  className="flex-1 bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-xl py-3 px-4 text-xs text-amerta-dark dark:text-white focus:outline-none focus:border-primary transition-all font-medium"
                />
                <button
                  type="submit"
                  disabled={!currentUser || !comment.trim()}
                  className="w-10 h-10 bg-primary text-black rounded-xl flex items-center justify-center hover:scale-105 transition-all disabled:opacity-20 shadow-lg shadow-primary/20 shrink-0"
                >
                  <FaPaperPlane size={14} />
                </button>
              </form>
            </div>
          </div>
        </article>
      </div>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
