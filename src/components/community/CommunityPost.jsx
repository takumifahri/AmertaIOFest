import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { getImageUrl } from '@/lib/imageUrl';
import { formatRelativeDate } from '@/lib/dateUtils';
import {
  FaUserCircle, FaComment, FaShare, FaLeaf, FaMapMarkerAlt,
  FaEllipsisV, FaBan, FaPaperPlane
} from 'react-icons/fa';
import api from '@/lib/axios';
import { useRooms } from '@/hooks/useRooms';

export default function CommunityPost({ post, currentUser }) {
  const router = useRouter();
  const [comment, setComment] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState(post.comments || []);
  const [showAuthorMenu, setShowAuthorMenu] = useState(false);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const { initiateChat } = useRooms();
  
  const [isLiked, setIsLiked] = useState(
    post.likes?.some(like => like.userId === currentUser?.id) || false
  );
  const [likeCount, setLikeCount] = useState(post.likes?.length || 0);
  const [isLiking, setIsLiking] = useState(false);


  const handleChatWithAuthor = async (e) => {
    e.stopPropagation();
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

  const handleBlockAuthor = (e) => {
    e.stopPropagation();
    toast.success(`${post.author.name} telah diblokir (Simulasi)`);
    setShowAuthorMenu(false);
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!currentUser) {
      toast.error('Silakan login terlebih dahulu untuk memberikan komentar');
      return;
    }
    if (!comment.trim()) return;

    try {
      const response = await api.post(`/community/${post.id}/comment`, { content: comment });
      setComments([...comments, response.data]);
      setComment('');
      toast.success('Komentar ditambahkan');
    } catch (error) {
      toast.error('Gagal menambahkan komentar');
    }
  };

  const handleToggleLike = async (e) => {
    e.stopPropagation();
    if (!currentUser) {
      toast.error('Silakan login untuk memberikan Leaf');
      return;
    }

    if (isLiking) return;
    
    // Optimistic Update
    const previousIsLiked = isLiked;
    const previousLikeCount = likeCount;
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
    setIsLiking(true);

    try {
      const res = await api.post(`/community/${post.id}/like`);
      // Update state based on actual response if needed
      setIsLiked(res.data.liked);
    } catch (error) {
      // Revert on error
      setIsLiked(previousIsLiked);
      setLikeCount(previousLikeCount);
      toast.error('Gagal memberikan Leaf');
    } finally {
      setIsLiking(false);
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'EDUCATION': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'EXCHANGE': return 'bg-amerta-green/10 text-amerta-green border-amerta-green/20';
      case 'ANNOUNCEMENT': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      default: return 'bg-white/10 text-gray-400 border-white/10';
    }
  };

  const getTypeText = (type) => {
    switch (type) {
      case 'EDUCATION': return 'Edukasi';
      case 'EXCHANGE': return 'Tukar Menukar';
      case 'ANNOUNCEMENT': return 'Pengumuman';
      default: return type;
    }
  };

  return (
    <div 
      onClick={() => router.push(`/komunitas/${post.id}`)}
      className="bg-white/5 backdrop-blur-sm rounded-[32px] border border-white/10 overflow-hidden hover:border-white/20 transition-all duration-500 group cursor-pointer relative"
    >
      <div className="p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4 relative">
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white border border-white/10 overflow-hidden">
              <FaUserCircle className="w-full h-full opacity-20" />
            </div>
            <div 
              className="cursor-pointer group/author"
              onClick={(e) => {
                e.stopPropagation();
                setShowAuthorMenu(!showAuthorMenu);
              }}
            >
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-white text-base leading-none group-hover:text-primary transition-colors">{post.author.name}</h4>
                <FaEllipsisV size={10} className="text-gray-400 opacity-0 group-hover:opacity-100 transition-all" />
              </div>
              <p className="text-[11px] text-gray-500 font-medium uppercase tracking-wider mt-1">
                {formatRelativeDate(post.createdAt)}
              </p>
            </div>

            {/* Author Dropdown Menu */}
            {showAuthorMenu && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowAuthorMenu(false);
                  }} 
                />
                <div className="absolute top-12 left-10 w-48 bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-2xl z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                  <button 
                    onClick={handleChatWithAuthor}
                    disabled={isChatLoading}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left text-xs font-bold text-white hover:bg-primary/10 hover:text-primary transition-all disabled:opacity-50"
                  >
                    {isChatLoading ? (
                      <div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <FaPaperPlane size={12} />
                    )}
                    <span>Chat dengan Author</span>
                  </button>
                  <button 
                    onClick={handleBlockAuthor}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left text-xs font-bold text-red-500 hover:bg-red-500/10 transition-all border-t border-white/5"
                  >
                    <FaBan size={12} />
                    <span>Blokir Pengguna</span>
                  </button>
                </div>
              </>
            )}
          </div>
          <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-[1px] border ${getTypeColor(post.type)}`}>
            {getTypeText(post.type)}
          </span>
        </div>

        <h3 className="text-xl md:text-2xl font-bold text-white mb-4 leading-tight group-hover:text-primary transition-colors">{post.title}</h3>

        <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-6 whitespace-pre-wrap font-medium">
          {post.content}
        </p>

        {post.images && post.images.length > 0 && (
          <div className={`grid gap-2 mb-6 rounded-3xl overflow-hidden ${post.images.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
            {post.images.map((img, idx) => (
              <div key={img.id} className={`relative overflow-hidden bg-white/5 ${post.images.length === 3 && idx === 0 ? 'row-span-2 h-full' : 'h-48'}`}>
                <img 
                  src={getImageUrl(img.url)} 
                  alt={post.title}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" 
                />
              </div>
            ))}
          </div>
        )}

        {post.address && (
          <div className="mb-6 p-4 bg-white/5 rounded-xl border border-white/10">
            <p className="text-[10px] font-bold uppercase text-gray-500 mb-1">📍 Lokasi</p>
            <p className="text-sm text-gray-300 font-medium">{post.address}</p>
          </div>
        )}

        {post.latitude && post.longitude && (
          <div 
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-2 mb-6 text-amerta-green bg-amerta-green/10 w-fit px-3 py-1.5 rounded-xl border border-amerta-green/20"
          >
            <FaLeaf size={12} />
            <a 
              href={`https://www.google.com/maps?q=${post.latitude},${post.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] font-bold uppercase tracking-wider hover:underline"
            >
              Lihat Lokasi Penukaran
            </a>
          </div>
        )}

        <div className="flex items-center gap-6 pt-6 border-t border-white/5">
          <button 
            onClick={handleToggleLike}
            className={`flex items-center gap-2.5 transition-all text-sm font-bold ${isLiked ? 'text-primary' : 'text-gray-400 hover:text-white'}`}
          >
            <FaLeaf className={`text-lg transition-transform duration-300 ${isLiked ? 'scale-125' : 'group-hover/leaf:rotate-12'}`} />
            <span>{likeCount} Leaf</span>
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setShowComments(!showComments);
            }}
            className="flex items-center gap-2.5 text-gray-400 hover:text-white transition-all text-sm font-bold"
          >
            <FaComment className={`text-lg ${showComments ? 'text-primary' : ''}`} />
            <span>{comments.length} Komentar</span>
          </button>
          <button 
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-2.5 text-gray-400 hover:text-white transition-all text-sm font-bold"
          >
            <FaShare className="text-lg" />
            <span>Bagikan</span>
          </button>
        </div>
      </div>

      {showComments && (
        <div 
          onClick={(e) => e.stopPropagation()}
          className="bg-black/20 p-6 md:p-8 border-t border-white/5"
        >
          <div className="space-y-6 mb-8">
            {comments.map((c) => (
              <div key={c.id} className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
                  <FaUserCircle className="text-white/10 w-full h-full" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1.5">
                    <span className="font-bold text-sm text-white">{c.user.name}</span>
                    <span className="text-[10px] text-gray-600 font-bold">{formatRelativeDate(c.createdAt)}</span>
                  </div>
                  <div className="bg-white/5 p-4 rounded-2xl rounded-tl-none border border-white/5">
                    <p className="text-sm text-gray-400 leading-relaxed font-medium">{c.content}</p>
                  </div>
                </div>
              </div>
            ))}
            {comments.length === 0 && (
              <div className="text-center py-6">
                <p className="text-gray-600 text-sm font-medium italic">Belum ada diskusi di sini. Mulai percakapan?</p>
              </div>
            )}
          </div>

          <form onSubmit={handleAddComment} className="relative group">
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={currentUser ? "Tulis komentar cerdasmu..." : "Silakan login untuk ikut berdiskusi"}
              disabled={!currentUser}
              className="w-full bg-white/5 border border-white/10 rounded-[20px] py-4 px-6 pr-14 text-sm focus:outline-none focus:border-amerta-green focus:bg-white/10 transition-all placeholder:text-gray-600"
            />
            <button
              type="submit"
              disabled={!currentUser}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 bg-amerta-green text-black p-2.5 rounded-xl hover:bg-white transition-all disabled:opacity-20 disabled:grayscale shadow-lg shadow-amerta-green/10"
            >
              <FaComment size={16} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

