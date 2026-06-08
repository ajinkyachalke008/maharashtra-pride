import React, { useEffect, useRef } from 'react';
import Hls from 'hls.js';
import { motion } from 'framer-motion';

export function FraudLensBackground() {
  const videoRef1 = useRef<HTMLVideoElement>(null);
  const videoRef2 = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const videoSrc = "https://stream.mux.com/tLkHO1qZoaaQOUeVWo8hEBeGQfySP02EPS02BmnNFyXys.m3u8";

    const initVideo = (video: HTMLVideoElement | null) => {
      if (!video) return null;
      if (Hls.isSupported()) {
        const hls = new Hls({ enableWorker: false });
        hls.loadSource(videoSrc);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          video.play().catch(e => console.log("Video auto-play prevented:", e));
        });
        return hls;
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = videoSrc;
        video.addEventListener('loadedmetadata', () => {
          video.play().catch(e => console.log("Video auto-play prevented:", e));
        });
      }
      return null;
    };

    const hls1 = initVideo(videoRef1.current);
    const hls2 = initVideo(videoRef2.current);

    return () => {
      if (hls1) hls1.destroy();
      if (hls2) hls2.destroy();
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 bg-[#020406]">
      {/* 1A. Background Video - Flipped horizontally to fill empty gaps on the left side */}
      <video
        ref={videoRef2}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-[0.4] scale-x-[-1] scale-y-[1.5] translate-y-[15%]"
      />
      
      {/* 1B. Background Video - Primary (Uniformly distributed) */}
      <video
        ref={videoRef1}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-[0.65] mix-blend-screen scale-y-[1.5] translate-y-[15%]"
      />

      {/* 2. Top blending overlay only */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#080810] to-transparent" />
      
      {/* 3. Floating Cyber Data Sparks to detail the bottom area */}
      <div className="absolute inset-x-0 bottom-0 h-64 overflow-hidden pointer-events-none">
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bottom-[-10px] w-1 h-1 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(34,211,238,1)]"
            style={{
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -150 - Math.random() * 150],
              opacity: [0, Math.random() * 0.6 + 0.4, 0],
              scale: [0, Math.random() + 0.5, 0]
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>
      
    </div>
  );
}
