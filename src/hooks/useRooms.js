"use client";

import { useState, useEffect } from 'react';
import api from '@/lib/axios';

export const useRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const res = await api.get('/chat/rooms');
      setRooms(res.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch rooms');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const initiateChat = async (targetUserId) => {
    try {
      const res = await api.post('/chat/rooms/initiate', { targetUserId });
      await fetchRooms();
      return res.data.data;
    } catch (err) {
      throw err.response?.data?.message || 'Gagal memulai percakapan';
    }
  };

  return { rooms, loading, error, refetch: fetchRooms, initiateChat };
};
