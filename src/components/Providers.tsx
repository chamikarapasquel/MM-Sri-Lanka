'use client';

import { SessionProvider } from 'next-auth/react';
import { Toaster } from 'react-hot-toast';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: 'rgba(17, 24, 39, 0.95)',
            color: '#f9fafb',
            border: '1px solid rgba(0, 212, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            padding: '14px 20px',
            fontSize: '14px',
          },
          success: {
            iconTheme: {
              primary: '#00ff88',
              secondary: '#111827',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#111827',
            },
          },
        }}
      />
    </SessionProvider>
  );
}
