"use client";

import { useState, useEffect, useRef } from "react";
import { useRooms } from "@/hooks/useRooms";
import { useChat } from "@/hooks/useChat";
import { 
  FaSearch, FaPaperPlane, FaImage, 
  FaCircle, FaRegSmile, FaEllipsisV,
  FaChevronLeft, FaInfoCircle, FaCommentDots
} from "react-icons/fa";
import api from "@/lib/axios";
import toast from "react-hot-toast";

export default function ChatPage() {
  const { rooms, loading: roomsLoading, refetch: refetchRooms } = useRooms();
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Fetch current user on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/profile");
        setCurrentUser(res.data);
      } catch (err) {
        console.error("Failed to fetch user", err);
      }
    };
    fetchUser();
  }, []);

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
    sendTyping, 
    isTyping, 
    isConnected, 
    scrollRef 
  } = useChat(null, selectedRoomId);

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
    // Typing indicator logic could be added here
  };

  if (roomsLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-amerta-green border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-64px)] md:h-screen bg-surface overflow-hidden relative">
      {/* Sidebar - Room List */}
      <div 
        className={`fixed md:relative z-20 inset-y-0 left-0 transition-all duration-300 ease-in-out bg-background border-r border-gray-200 dark:border-gray-800 flex flex-col
          ${isSidebarOpen 
            ? 'w-[85vw] translate-x-0 md:w-80' 
            : 'w-0 -translate-x-full md:translate-x-0 md:w-20'}`}
      >
        <div className={`p-6 border-b border-gray-100 dark:border-gray-800 flex items-center transition-all ${isSidebarOpen ? 'justify-between' : 'justify-center px-2'}`}>
          {isSidebarOpen && <h1 className="text-2xl font-bold text-amerta-dark animate-in fade-in slide-in-from-left-2">Pesan</h1>}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={`p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors ${!isSidebarOpen ? 'text-amerta-green' : 'text-gray-400'}`}
          >
            {isSidebarOpen ? <FaChevronLeft /> : <FaCommentDots size={20} />}
          </button>
        </div>
        
        {isSidebarOpen && (
          <div className="p-6 pt-0 mt-4 animate-in fade-in duration-500">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <input 
                type="text" 
                placeholder="Cari percakapan..." 
                className="w-full pl-10 pr-4 py-2 bg-surface border border-gray-100 dark:border-gray-800 rounded-xl text-sm focus:ring-2 focus:ring-amerta-green focus:outline-none"
              />
            </div>
          </div>
        )}
        
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {rooms.length === 0 ? (
            isSidebarOpen && (
              <div className="text-center p-8">
                <p className="text-gray-500 text-sm italic">Belum ada percakapan.</p>
              </div>
            )
          ) : (
            rooms.map(room => {
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
                    ${isSidebarOpen ? 'gap-3 p-3' : 'p-2 justify-center'}
                    ${isActive 
                      ? "bg-amerta-green/10 border-l-4 border-amerta-green shadow-sm" 
                      : "hover:bg-gray-50 dark:hover:bg-gray-800 border-l-4 border-transparent"}
                  `}
                >
                  <div className={`rounded-full bg-amerta-sand flex items-center justify-center text-amerta-dark font-bold shrink-0 relative transition-all duration-300
                    ${isSidebarOpen ? 'w-12 h-12 text-base' : 'w-10 h-10 text-xs'}
                  `}>
                    {otherUser?.name?.charAt(0).toUpperCase()}
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full group-hover:scale-125 transition-transform" />
                  </div>
                  
                  {isSidebarOpen && (
                    <div className="flex-1 text-left min-w-0 animate-in fade-in slide-in-from-left-2">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold text-amerta-dark truncate">{otherUser?.name}</span>
                        <span className="text-[10px] text-gray-400 capitalize">{room.type?.toLowerCase()}</span>
                      </div>
                      <p className="text-xs text-gray-500 truncate">{room.lastMessage || "Mulai percakapan baru..."}</p>
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
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-10 md:hidden transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-surface/30 min-w-0 relative">
        {selectedRoomId ? (
          <>
            {/* Chat Header */}
            <div className="px-6 py-4 bg-background border-b border-gray-100 dark:border-gray-800 flex justify-between items-center shadow-sm z-10">
              <div className="flex items-center gap-3 min-w-0">
                <button 
                  onClick={() => setIsSidebarOpen(true)}
                  className="md:hidden p-2 mr-1 text-gray-500 hover:text-amerta-dark bg-gray-50 dark:bg-gray-800 rounded-lg transition-all"
                >
                  <FaCommentDots size={20} />
                </button>
                <div className="w-10 h-10 rounded-full bg-amerta-green text-white flex items-center justify-center font-bold shrink-0 shadow-sm">
                  {selectedRoom.users.find(u => u.id !== currentUser?.id)?.name?.charAt(0).toUpperCase() || "?"}
                </div>
                <div className="truncate">
                  <h3 className="font-bold text-amerta-dark truncate">
                    {selectedRoom.users.find(u => u.id !== currentUser?.id)?.name || "Grup Chat"}
                  </h3>
                  <div className="flex items-center gap-1.5">
                    <FaCircle className={`${isConnected ? 'text-green-500' : 'text-gray-300'} text-[8px] animate-pulse`} />
                    <span className="text-[10px] text-gray-500 font-medium">
                      {isConnected ? 'Online' : 'Offline'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button className="text-gray-400 hover:text-amerta-dark transition-colors">
                  <FaInfoCircle size={18} />
                </button>
                <button className="text-gray-400 hover:text-amerta-dark transition-colors">
                  <FaEllipsisV size={18} />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-6 space-y-4 scroll-smooth"
            >
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center opacity-50 space-y-4">
                  <div className="p-6 bg-white rounded-full shadow-inner">
                    <FaCommentDots size={48} className="text-amerta-green" />
                  </div>
                  <p className="text-sm font-medium">Kirim pesan pertama kamu!</p>
                </div>
              ) : (
                messages.map((msg, i) => {
                  const isMe = msg.userId === currentUser?.id;
                  return (
                    <div 
                      key={i} 
                      className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
                    >
                      <div className={`max-w-[75%] md:max-w-[60%] px-4 py-3 rounded-2xl shadow-sm ${
                        isMe 
                          ? 'bg-amerta-green text-white rounded-tr-none' 
                          : 'bg-white text-[#1A231C] rounded-tl-none border border-gray-100'
                      }`}>
                        {msg.image && (
                          <img src={msg.image} alt="attachment" className="rounded-lg mb-2 max-w-full" />
                        )}
                        <p className="text-[15px] leading-relaxed font-medium">{msg.message}</p>
                        <p className={`text-[10px] mt-1 text-right ${isMe ? 'text-white/70' : 'text-gray-500'}`}>
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  )
                })
              )}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-100 px-4 py-2 rounded-2xl rounded-tl-none">
                    <div className="flex gap-1.5">
                      <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" />
                      <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Message Input */}
            <div className="p-6 bg-background border-t border-gray-100 dark:border-gray-800">
              <form 
                onSubmit={handleSendMessage}
                className="flex items-center gap-3 bg-surface border border-gray-100 dark:border-gray-800 p-2 pl-4 rounded-2xl shadow-inner focus-within:ring-2 focus-within:ring-amerta-green/20 transition-all"
              >
                <button type="button" className="text-gray-400 hover:text-amerta-dark p-2 transition-colors">
                  <FaRegSmile size={20} />
                </button>
                <button type="button" className="text-gray-400 hover:text-amerta-dark p-2 transition-colors">
                  <FaImage size={20} />
                </button>
                <input 
                  type="text" 
                  value={messageInput}
                  onChange={handleInputChange}
                  placeholder="Ketik pesan..." 
                  className="flex-1 bg-transparent border-none focus:ring-0 text-[15px] text-amerta-dark py-2"
                />
                <button 
                  type="submit"
                  disabled={!messageInput.trim()}
                  className="p-3 bg-amerta-green text-white rounded-xl shadow-md hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:shadow-none"
                >
                  <FaPaperPlane size={18} />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
            <div className="w-32 h-32 bg-amerta-green/5 rounded-full flex items-center justify-center mb-6">
              <FaCommentDots size={64} className="text-amerta-green/20" />
            </div>
            <h2 className="text-xl font-bold text-amerta-dark mb-2">Pilih Percakapan</h2>
            <p className="text-gray-500 max-w-xs">
              Silakan pilih salah satu percakapan di samping untuk mulai berkirim pesan.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
