"use client";

import { Toaster } from "react-hot-toast";

export default function ToasterProvider() {
  return (
    <Toaster 
      position="top-center" 
      toastOptions={{
        className: 'text-sm font-medium',
        style: {
          background: '#FFFFFF',
          color: '#1a1f16', // amerta-dark
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
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
