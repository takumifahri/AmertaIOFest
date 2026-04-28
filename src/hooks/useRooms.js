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

  return { rooms, loading, error, refetch: fetchRooms };
};
