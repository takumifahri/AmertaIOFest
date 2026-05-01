"use client";

import { useState, useEffect } from "react";
import { FaSearch, FaTrashAlt, FaEye, FaComment, FaLeaf, FaExternalLinkAlt } from "react-icons/fa";
import api from "@/lib/axios";
import toast from "react-hot-toast";
import { getImageUrl } from "@/lib/imageUrl";

export default function AdminPostsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/management/posts?search=${search}&page=${page}`);
      setPosts(res.data.data.posts);
      setPagination(res.data.data.pagination);
    } catch (err) {
      toast.error("Gagal mengambil data post.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchPosts();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [search, page]);

  const handleDeletePost = async (postId) => {
    if (!confirm("Apakah Anda yakin ingin menghapus post ini?")) return;
    try {
      await api.delete(`/admin/management/posts/${postId}`);
      toast.success("Post berhasil dihapus.");
      fetchPosts();
    } catch (err) {
      toast.error("Gagal menghapus post.");
    }
  };

  return (
    <div className="p-8 max-w-8xl mx-auto">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-foreground uppercase tracking-tight italic">Manajemen Post</h1>
          <p className="text-gray-500 text-sm">Monitor dan kelola konten komunitas Amerta.</p>
        </div>
        
        <div className="relative group">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Cari judul, isi, atau penulis..."
            className="pl-12 pr-6 py-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl w-full md:w-80 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array(6).fill(0).map((_, i) => (
            <div key={i} className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-3xl p-6 animate-pulse">
              <div className="h-48 bg-gray-100 dark:bg-white/5 rounded-2xl mb-4"></div>
              <div className="h-6 bg-gray-100 dark:bg-white/5 rounded-lg w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-100 dark:bg-white/5 rounded-lg w-full mb-4"></div>
              <div className="flex justify-between items-center">
                <div className="w-24 h-4 bg-gray-100 dark:bg-white/5 rounded-lg"></div>
                <div className="w-10 h-10 bg-gray-100 dark:bg-white/5 rounded-xl"></div>
              </div>
            </div>
          ))
        ) : posts.length > 0 ? (
          posts.map((post) => (
            <div key={post.id} className="group bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all flex flex-col">
              {post.images && post.images.length > 0 && (
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={getImageUrl(post.images[0].url)} 
                    alt={post.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-black text-primary uppercase tracking-wider">
                      {post.type}
                    </span>
                  </div>
                </div>
              )}
              
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                    {post.author?.name?.charAt(0)}
                  </div>
                  <p className="text-xs font-bold text-gray-500">{post.author?.name}</p>
                </div>

                <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-1">{post.title}</h3>
                <p className="text-sm text-gray-500 line-clamp-3 mb-6 flex-1">{post.content}</p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-white/5">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 text-gray-400">
                      <FaComment size={12} />
                      <span className="text-xs font-bold">{post._count?.comments || 0}</span>
                    </div>
                    <div className="text-[10px] text-gray-400 font-medium">
                      {new Date(post.createdAt).toLocaleDateString('id-ID')}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <a 
                      href={`/komunitas/post/${post.id}`} 
                      target="_blank"
                      className="p-2.5 bg-gray-100 dark:bg-white/5 text-gray-500 hover:text-primary rounded-xl transition-all"
                      title="Lihat Detail"
                    >
                      <FaExternalLinkAlt size={14} />
                    </a>
                    <button 
                      onClick={() => handleDeletePost(post.id)}
                      className="p-2.5 bg-red-50 dark:bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all"
                      title="Hapus Post"
                    >
                      <FaTrashAlt size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center">
            <div className="w-20 h-20 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
              <FaLeaf size={32} />
            </div>
            <h3 className="text-xl font-bold text-foreground">Tidak ada post ditemukan</h3>
            <p className="text-gray-500">Coba gunakan kata kunci pencarian lain.</p>
          </div>
        )}
      </div>

      {pagination.totalPages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-4">
          <button 
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-6 py-3 border border-gray-200 dark:border-white/10 rounded-2xl text-sm font-bold disabled:opacity-50 hover:bg-white dark:hover:bg-white/5 transition-all"
          >
            Previous
          </button>
          <span className="text-sm font-black text-gray-500 px-4">
            {page} / {pagination.totalPages}
          </span>
          <button 
            disabled={page === pagination.totalPages}
            onClick={() => setPage(page + 1)}
            className="px-6 py-3 bg-primary text-white rounded-2xl text-sm font-bold disabled:opacity-50 shadow-xl shadow-primary/20 transition-all"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
