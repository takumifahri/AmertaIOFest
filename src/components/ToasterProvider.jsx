"use client";

import { Toaster } from "react-hot-toast";

export default function ToasterProvider() {
  return (
    <Toaster 
      position="top-right" 
      containerStyle={{
        zIndex: 99999,
      }}
      toastOptions={{
        className: 'text-sm font-medium',
        style: {
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(8px)',
          color: '#1a1f16', // amerta-dark
          borderRadius: '16px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          border: '1px solid rgba(0,0,0,0.05)',
        },
        success: {
          iconTheme: {
            primary: '#10B981', // amerta-green approx
            secondary: '#FFFFFF',
          },
        },
        error: {
          iconTheme: {
            primary: '#EF4444', 
            secondary: '#FFFFFF',
          },
        },
      }} 
    />
  );
}
