"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useRooms } from "@/hooks/useRooms";
import { useChat } from "@/hooks/useChat";
import { 
  FaSearch, FaPaperPlane, FaImage, 
  FaCircle, FaRegSmile, FaEllipsisV,
  FaChevronLeft, FaInfoCircle, FaCommentDots,
  FaCheck, FaCheckDouble, FaPlus, FaTimes
} from "react-icons/fa";
import api from "@/lib/axios";
import toast from "react-hot-toast";

function ChatComponent() {
  const searchParams = useSearchParams();
  const roomParam = searchParams.get("room");
  const { rooms, loading: roomsLoading, refetch: refetchRooms, initiateChat } = useRooms();
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  
  // Handle room parameter from URL
  useEffect(() => {
    if (roomParam) {
      setSelectedRoomId(roomParam);
    }
  }, [roomParam]);

  const [currentUser, setCurrentUser] = useState(null);

  const [messageInput, setMessageInput] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);


  // Fetch current user on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/profile");
        setCurrentUser(res.data.data);
      } catch (err) {
        console.error("Failed to fetch user", err);
      }
    };

    fetchUser();
  }, []);

  const [roomSearchQuery, setRoomSearchQuery] = useState("");

  const filteredRooms = rooms.filter(room => {
    const otherUser = room.users.find(u => u.id !== currentUser?.id) || room.users[0];
    return otherUser?.name?.toLowerCase().includes(roomSearchQuery.toLowerCase());
  });

  // Search users for new chat
  useEffect(() => {
    const searchUsers = async () => {
      if (searchQuery.length < 2) {
        setSearchResults([]);
        return;
      }
      setIsSearching(true);
      try {
        const res = await api.get(`/profile/search?q=${searchQuery}`);
        setSearchResults(res.data.data || []);
      } catch (err) {
        console.error("Search failed", err);
      } finally {
        setIsSearching(false);
      }
    };

    const timer = setTimeout(searchUsers, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleInitiateChat = async (userId) => {
    try {
      const room = await initiateChat(userId);
      setSelectedRoomId(room.id);
      setIsNewChatModalOpen(false);
      setSearchQuery("");
      toast.success("Percakapan dimulai!");
    } catch (err) {
      toast.error(typeof err === 'string' ? err : "Gagal memulai percakapan");
    }
  };

  // Auto-select first room if none selected
  useEffect(() => {
    if (rooms.length > 0 && !selectedRoomId) {
      setSelectedRoomId(rooms[0].id);
    }
  }, [rooms, selectedRoomId]);

  const selectedRoom = rooms.find(r => r.id === selectedRoomId);
  const { 
    messages, 
    sendMessage, 
    markAsRead,
    sendTyping, 
    isTyping, 
    isConnected, 
    scrollRef 
  } = useChat(null, selectedRoomId);

  // Mark messages as read when they appear
  useEffect(() => {
    if (messages.length > 0 && currentUser) {
      messages.forEach(msg => {
        if (!msg.isRead && msg.userId !== currentUser.id) {
          markAsRead(msg.id);
        }
      });
    }
  }, [messages, currentUser, markAsRead]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageInput.trim()) return;
    
    if (!isConnected) {
      toast.error("Koneksi terputus. Silakan tunggu sebentar atau muat ulang halaman.");
      return;
    }
    
    sendMessage(messageInput);
    setMessageInput("");
  };

  const handleInputChange = (e) => {
    setMessageInput(e.target.value);
  };

  if (roomsLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-64px)] md:h-screen bg-surface/50 dark:bg-background overflow-hidden relative transition-colors duration-500">
      {/* Sidebar - Room List */}
      <div 
        className={`fixed md:relative z-20 inset-y-0 left-0 transition-all duration-300 ease-in-out bg-background border-r border-gray-200 dark:border-white/5 flex flex-col
          ${isSidebarOpen 
            ? 'w-[85vw] translate-x-0 md:w-80' 
            : 'w-0 -translate-x-full md:translate-x-0 md:w-20'}`}
      >
        <div className={`p-6 border-b border-gray-100 dark:border-white/5 flex items-center transition-all ${isSidebarOpen ? 'justify-between' : 'justify-center px-2'}`}>
          {isSidebarOpen && <h1 className="text-2xl font-black text-foreground tracking-tighter animate-in fade-in slide-in-from-left-2 uppercase italic">Pesan</h1>}
          <div className="flex items-center gap-2">
            {isSidebarOpen && (
              <button 
                onClick={() => setIsNewChatModalOpen(true)}
                className="p-2.5 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-xl transition-all shadow-sm group"
                title="Mulai Chat Baru"
              >
                <FaPlus size={14} className="group-hover:rotate-90 transition-transform duration-300" />
              </button>
            )}
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className={`p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl transition-colors ${!isSidebarOpen ? 'text-primary' : 'text-gray-400'}`}
            >
              {isSidebarOpen ? <FaChevronLeft /> : <FaCommentDots size={20} />}
            </button>
          </div>
        </div>
        
        {isSidebarOpen && (
          <div className="p-6 pt-0 mt-6 animate-in fade-in duration-500">
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <input 
                type="text" 
                placeholder="Cari percakapan..." 
                value={roomSearchQuery}
                onChange={(e) => setRoomSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-surface border border-gray-100 dark:border-white/5 rounded-2xl text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
              />
            </div>
          </div>
        )}
        
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {filteredRooms.length === 0 ? (
            isSidebarOpen && (
              <div className="text-center p-8 opacity-50">
                <p className="text-gray-500 text-sm italic">
                  {roomSearchQuery ? "Tidak ada hasil pencarian." : "Belum ada percakapan."}
                </p>
              </div>
            )
          ) : (
            filteredRooms.map(room => {
              const otherUser = room.users.find(u => u.id !== currentUser?.id) || room.users[0];
              const isActive = selectedRoomId === room.id;
              
              return (
                <button
                  key={room.id}
                  onClick={() => {
                    setSelectedRoomId(room.id);
                    if (window.innerWidth < 768) setIsSidebarOpen(false);
                    else if (!isSidebarOpen) setIsSidebarOpen(true);
                  }}
                  title={!isSidebarOpen ? otherUser?.name : ""}
                  className={`w-full flex items-center transition-all duration-300 rounded-2xl group
                    ${isSidebarOpen ? 'gap-4 p-4' : 'p-3 justify-center'}
                    ${isActive 
                      ? "bg-primary/10 dark:bg-primary/20 border-l-4 border-primary shadow-sm" 
                      : "hover:bg-gray-50 dark:hover:bg-white/5 border-l-4 border-transparent"}
                  `}
                >
                  <div className={`rounded-2xl bg-primary/10 dark:bg-white/5 flex items-center justify-center text-primary font-black shrink-0 relative transition-all duration-300
                    ${isSidebarOpen ? 'w-12 h-12 text-base' : 'w-10 h-10 text-xs'}
                  `}>
                    {otherUser?.name?.charAt(0).toUpperCase()}
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 border-4 border-background rounded-full group-hover:scale-125 transition-transform ${otherUser?.is_active ? 'bg-green-500' : 'bg-gray-300'}`} />
                  </div>
                  
                  {isSidebarOpen && (
                    <div className="flex-1 text-left min-w-0 animate-in fade-in slide-in-from-left-2">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-foreground truncate">{otherUser?.name}</span>
                        <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">{room.type}</span>
                      </div>
                      <p className="text-xs text-gray-500 truncate font-medium">{room.lastMessage || "Mulai percakapan baru..."}</p>
                    </div>
                  )}
                </button>
              )
            })
          )}
        </div>
      </div>

      {/* Overlay for mobile when sidebar is open */}
      <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-10 md:hidden transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-surface/30 dark:bg-background/30 min-w-0 relative">
        {selectedRoomId ? (
          <>
            {/* Chat Header */}
            <div className="px-8 py-5 bg-background border-b border-gray-100 dark:border-white/5 flex justify-between items-center shadow-sm z-10">
              <div className="flex items-center gap-4 min-w-0">
                <button 
                  onClick={() => setIsSidebarOpen(true)}
                  className="md:hidden p-2 mr-1 text-gray-500 hover:text-foreground bg-gray-50 dark:bg-white/5 rounded-xl transition-all"
                >
                  <FaCommentDots size={20} />
                </button>
                <div className="w-11 h-11 rounded-2xl bg-primary text-white flex items-center justify-center font-black shrink-0 shadow-lg shadow-primary/20">
                  {selectedRoom.users.find(u => u.id !== currentUser?.id)?.name?.charAt(0).toUpperCase() || "?"}
                </div>
                <div className="truncate">
                  <h3 className="font-black text-foreground truncate tracking-tight">
                    {selectedRoom.users.find(u => u.id !== currentUser?.id)?.name || "Grup Chat"}
                  </h3>
                  <div className="flex items-center gap-1.5">
                    <FaCircle className={`${selectedRoom.users.find(u => u.id !== currentUser?.id)?.is_active ? 'text-green-500' : 'text-gray-300'} text-[7px] animate-pulse`} />
                    <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">
                      {selectedRoom.users.find(u => u.id !== currentUser?.id)?.is_active ? 'Online' : 'Offline'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button className="w-10 h-10 flex items-center justify-center rounded-xl text-gray-400 hover:text-foreground hover:bg-gray-100 dark:hover:bg-white/5 transition-all">
                  <FaInfoCircle size={18} />
                </button>
                <button className="w-10 h-10 flex items-center justify-center rounded-xl text-gray-400 hover:text-foreground hover:bg-gray-100 dark:hover:bg-white/5 transition-all">
                  <FaEllipsisV size={18} />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-8 space-y-6 scroll-smooth"
            >
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center opacity-30 space-y-6">
                  <div className="p-8 bg-surface rounded-[40px] shadow-inner">
                    <FaCommentDots size={64} className="text-primary" />
                  </div>
                  <p className="text-sm font-black uppercase tracking-[4px]">Say Hello!</p>
                </div>
              ) : (
                messages.map((msg, i) => {
                  const isMe = msg.userId === currentUser?.id;
                  return (
                    <div 
                      key={i} 
                      className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
                    >
                      <div className={`max-w-[75%] md:max-w-[60%] px-5 py-4 rounded-[28px] shadow-sm ${
                        isMe 
                          ? 'bg-primary text-white rounded-tr-none' 
                          : 'bg-surface dark:bg-white/5 text-foreground rounded-tl-none border border-gray-100 dark:border-white/5'
                      }`}>
                        {msg.image && (
                          <div className="rounded-2xl overflow-hidden mb-3">
                            <img src={msg.image} alt="attachment" className="max-w-full hover:scale-105 transition-transform duration-500" />
                          </div>
                        )}
                        <p className="text-[15px] leading-relaxed font-medium">{msg.message}</p>
                        <div className="flex items-center justify-end gap-1.5 mt-2">
                          <p className={`text-[10px] font-bold ${isMe ? 'text-white/60' : 'text-gray-400'}`}>
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                          {isMe && (
                            <span className={msg.isRead ? 'text-secondary' : 'text-white/40'}>
                              {msg.isRead ? <FaCheckDouble size={10} /> : <FaCheck size={10} />}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-surface dark:bg-white/5 border border-gray-100 dark:border-white/5 px-5 py-3 rounded-[20px] rounded-tl-none">
                    <div className="flex gap-1.5">
                      <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce" />
                      <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Message Input */}
            <div className="p-8 bg-background border-t border-gray-100 dark:border-white/5">
              <form 
                onSubmit={handleSendMessage}
                className="flex items-center gap-4 bg-surface dark:bg-white/5 border border-gray-100 dark:border-white/5 p-2 pl-5 rounded-[24px] shadow-sm focus-within:ring-4 focus-within:ring-primary/10 transition-all"
              >
                <button type="button" className="text-gray-400 hover:text-foreground p-2 transition-all hover:scale-110">
                  <FaRegSmile size={20} />
                </button>
                <button type="button" className="text-gray-400 hover:text-foreground p-2 transition-all hover:scale-110">
                  <FaImage size={20} />
                </button>
                <input 
                  type="text" 
                  value={messageInput}
                  onChange={handleInputChange}
                  placeholder="Ketik pesan..." 
                  className="flex-1 bg-transparent border-none focus:ring-0 text-[15px] text-foreground font-medium py-3 placeholder:text-gray-400"
                />
                <button 
                  type="submit"
                  disabled={!messageInput.trim()}
                  className="p-4 bg-primary text-white rounded-2xl shadow-lg shadow-primary/30 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 disabled:shadow-none"
                >
                  <FaPaperPlane size={18} />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
            <div className="w-40 h-40 bg-primary/5 rounded-[48px] flex items-center justify-center mb-8 animate-float">
              <FaCommentDots size={72} className="text-primary/20" />
            </div>
            <h2 className="text-2xl font-black text-foreground mb-3 tracking-tight">Pilih Percakapan</h2>
            <p className="text-gray-500 font-medium max-w-xs leading-relaxed">
              Silakan pilih salah satu percakapan di samping untuk mulai berkirim pesan sirkular.
            </p>
          </div>
        )}
      </div>
      
      {/* New Chat Modal */}
      {isNewChatModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-md animate-in fade-in duration-300"
            onClick={() => setIsNewChatModalOpen(false)}
          />
          <div className="relative w-full max-w-md bg-background border border-gray-100 dark:border-white/10 rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-6 border-b border-gray-100 dark:border-white/5 flex justify-between items-center bg-surface/50">
              <h2 className="text-xl font-black text-foreground tracking-tight uppercase italic">Mulai Chat Baru</h2>
              <button 
                onClick={() => setIsNewChatModalOpen(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors text-gray-400 hover:text-foreground"
              >
                <FaTimes />
              </button>
            </div>
            
            <div className="p-6">
              <div className="relative mb-6">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari nama atau email..." 
                  className="w-full pl-11 pr-4 py-3 bg-surface border border-gray-100 dark:border-white/10 rounded-2xl text-sm focus:ring-4 focus:ring-primary/10 focus:outline-none transition-all placeholder:text-gray-400 font-medium"
                  autoFocus
                />
              </div>
              
              <div className="max-h-[350px] overflow-y-auto pr-2 space-y-2 no-scrollbar">
                {isSearching ? (
                  <div className="py-12 flex flex-col items-center justify-center gap-4">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    <p className="text-xs font-black uppercase tracking-widest text-gray-400">Mencari User...</p>
                  </div>
                ) : searchResults.length > 0 ? (
                  searchResults.map(user => (
                    <button
                      key={user.id}
                      onClick={() => handleInitiateChat(user.id)}
                      className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-primary/5 border border-transparent hover:border-primary/10 transition-all group text-left"
                    >
                      <div className="w-11 h-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-black group-hover:scale-110 transition-transform">
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-0.5">
                          <p className="font-bold text-foreground truncate">{user.name}</p>
                          <span className="text-[8px] font-black uppercase tracking-[1px] px-2 py-0.5 bg-gray-100 dark:bg-white/5 rounded-md text-gray-500">{user.role}</span>
                        </div>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-primary/0 group-hover:bg-primary/10 flex items-center justify-center text-primary opacity-0 group-hover:opacity-100 transition-all">
                        <FaPaperPlane size={12} />
                      </div>
                    </button>
                  ))
                ) : searchQuery.length >= 2 ? (
                  <div className="py-12 text-center">
                    <div className="w-16 h-16 bg-gray-50 dark:bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-4">
                      <FaSearch className="text-gray-200 dark:text-white/10" size={24} />
                    </div>
                    <p className="text-sm font-bold text-gray-400">User tidak ditemukan.</p>
                  </div>
                ) : (
                  <div className="py-12 text-center opacity-30">
                    <p className="text-xs font-black uppercase tracking-[3px]">Cari Teman Berbagi</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-6 bg-surface/50 border-t border-gray-100 dark:border-white/5">
              <p className="text-[10px] text-center text-gray-400 font-medium">
                Tip: Cari pengguna berdasarkan nama lengkap atau alamat email mereka.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );  
}

export default function ChatPage() {
  return (
    <Suspense 
      fallback={
        <div className="h-screen flex items-center justify-center bg-background">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ChatComponent />
    </Suspense>
  );
}
