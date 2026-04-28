"use client";

import { useEffect, useState, useCallback, useRef } from 'react';
import { useSocket } from './useSocket';

export const useChat = (token, roomId) => {
  const { socket, isConnected } = useSocket(token);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    if (!socket || !roomId) return;

    if (!isConnected) {
      console.log(`[Chat] Waiting for connection to join room: ${roomId}`);
      return;
    }

    console.log(`[Chat] Joining room: ${roomId}`);
    socket.emit('join_room', { roomId });

    // Listeners
    const onHistory = (history) => {
      console.log(`[Chat] Received history for room ${roomId}:`, history);
      setMessages(history.messages || []);
      setTimeout(scrollToBottom, 50);
    };

    const onNewMessage = (message) => {
      console.log(`[Chat] New message received:`, message);
      setMessages((prev) => [...prev, message]);
      setTimeout(scrollToBottom, 50);
    };

    const onUserTyping = (data) => {
      if (data.roomId === roomId) setIsTyping(true);
    };

    const onUserStoppedTyping = (data) => {
      if (data.roomId === roomId) setIsTyping(false);
    };

    const onError = (error) => {
      console.error(`[Chat] Socket error:`, error);
    };

    const onMessageRead = (data) => {
      console.log(`[Chat] Message marked as read:`, data.messageId);
      setMessages((prev) => 
        prev.map(msg => msg.id === data.messageId ? { ...msg, isRead: true } : msg)
      );
    };

    socket.on('room_history', onHistory);
    socket.on('new_message', onNewMessage);
    socket.on('user_typing', onUserTyping);
    socket.on('user_stopped_typing', onUserStoppedTyping);
    socket.on('message_read', onMessageRead);
    socket.on('error', onError);

    return () => {
      console.log(`[Chat] Cleaning up room: ${roomId}`);
      socket.off('room_history', onHistory);
      socket.off('new_message', onNewMessage);
      socket.off('user_typing', onUserTyping);
      socket.off('user_stopped_typing', onUserStoppedTyping);
      socket.off('message_read', onMessageRead);
      socket.off('error', onError);
    };
  }, [socket, roomId, isConnected, scrollToBottom]);

  const sendMessage = useCallback((message, image = null) => {
    if (socket && isConnected) {
      console.log(`[Chat] Sending message:`, { roomId, message });
      socket.emit('send_message', { roomId, message, image }, (ack) => {
        if (!ack?.success) {
          console.error('Failed to send message:', ack?.message);
        }
      });
    } else {
      console.warn('[Chat] Cannot send message: Not connected');
    }
  }, [socket, isConnected, roomId]);

  const markAsRead = useCallback((messageId) => {
    if (socket && isConnected) {
      socket.emit('mark_as_read', { roomId, messageId });
    }
  }, [socket, isConnected, roomId]);

  const sendTyping = useCallback((typing) => {
    if (socket && isConnected) {
      socket.emit(typing ? 'typing' : 'stop_typing', { roomId });
    }
  }, [socket, isConnected, roomId]);

  return {
    messages,
    sendMessage,
    markAsRead,
    sendTyping,
    isTyping,
    isConnected,
    scrollRef
  };
};
