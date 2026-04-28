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

    socket.on('room_history', onHistory);
    socket.on('new_message', onNewMessage);
    socket.on('user_typing', onUserTyping);
    socket.on('user_stopped_typing', onUserStoppedTyping);
    socket.on('error', onError);

    return () => {
      console.log(`[Chat] Cleaning up room: ${roomId}`);
      socket.off('room_history', onHistory);
      socket.off('new_message', onNewMessage);
      socket.off('user_typing', onUserTyping);
      socket.off('user_stopped_typing', onUserStoppedTyping);
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

  const sendTyping = useCallback((typing) => {
    if (socket && isConnected) {
      socket.emit(typing ? 'typing' : 'stop_typing', { roomId });
    }
  }, [socket, isConnected, roomId]);

  return {
    messages,
    sendMessage,
    sendTyping,
    isTyping,
    isConnected,
    scrollRef
  };
};
