"use client";

import { useEffect } from 'react';

declare global {
  interface Window {
    Tawk_API?: any;
    Tawk_LoadStart?: Date;
  }
}

export function TawkMessenger() {
  useEffect(() => {
    const tawkId = process.env.NEXT_PUBLIC_TAWK_ID;
    const tawkPath = process.env.NEXT_PUBLIC_TAWK_PATH;

    if (!tawkId || !tawkPath) {
      console.error('Tawk.to configuration is missing');
      return;
    }

    if (document.getElementById('tawk-script')) {
      return;
    }

    if (!window.Tawk_API) {
      window.Tawk_API = {};
      window.Tawk_LoadStart = new Date();
    }

    const script = document.createElement('script');
    script.id = 'tawk-script';
    script.async = true;
    script.src = `https://embed.tawk.to/${tawkId}/${tawkPath}`;
    script.charset = 'UTF-8';
    script.setAttribute('crossorigin', '*');

    script.onerror = (error) => {
      console.error('Error loading Tawk.to widget:', error);
    };

    document.body.appendChild(script);

    return () => {
      const existingScript = document.getElementById('tawk-script');
      if (existingScript?.parentNode) {
        existingScript.parentNode.removeChild(existingScript);
      }
      
      if (window.Tawk_API) {
        window.Tawk_API = undefined;
      }
      if (window.Tawk_LoadStart) {
        window.Tawk_LoadStart = undefined;
      }
    };
  }, []);

  return null;
}