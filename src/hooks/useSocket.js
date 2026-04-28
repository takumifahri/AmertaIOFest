"use client";

import { useEffect, useState, useCallback } from 'react';
import { socket, connectSocket, disconnectSocket } from '@/lib/socket';

export const useSocket = (token) => {
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    if (!socket.connected) {
      connectSocket(token);
    }

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, [token]);

  return { isConnected, socket };
};
