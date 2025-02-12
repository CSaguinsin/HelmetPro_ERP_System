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
    // Initialize Tawk_API
    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = new Date();

    // Create and load the script
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://embed.tawk.to/67243b532480f5b4f5971b2a/1ibioffge';
    script.charset = 'UTF-8';
    script.setAttribute('crossorigin', '*');

    document.body.appendChild(script);

    // Cleanup
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return null; // This component doesn't render anything
}