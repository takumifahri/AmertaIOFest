import { io } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:3001';

export const socket = io(SOCKET_URL, {
  autoConnect: false,
  withCredentials: true,
});

export const connectSocket = (token) => {
  if (token) {
    socket.auth = { token };
  }
  socket.connect();
};

export const disconnectSocket = () => {
  socket.disconnect();
};
