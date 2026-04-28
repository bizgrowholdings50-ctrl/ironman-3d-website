"use client";

import { useEffect, useRef, useState, useCallback } from "react";

// ─── CONFIGURATION ──────────────────────────────────────────────────────────
const TOTAL_FRAMES_1 = 169;
const TOTAL_FRAMES_2 = 169; 
const SCROLL_HEIGHT_PER_SEQ = 500; 

const pad = (n) => String(n).padStart(4, "0");
const frame1Src = (i) => `/frames/frame_${pad(i)}.jpg`;
const frame2Src = (i) => `/frames2/frame_${pad(i)}.jpg`;

// ─── ULTRA-PREMIUM CONTENT DATABASE ─────────────────────────────────────────
const SCENES = {
  seq1: [
    { 
      start: 0, end: 60, 
      badge: "SYSTEM STATUS: INITIALIZING // MK-85",
      title: "BUILD WITH",
      titleHighlight: "UMAR",
      sub: "Digital Architect & Web Systems Engineer.",
      quote: "“The suit and I are one.”",
      nav: "HOME"
    },
    { 
      start: 61, end: 120, 
      badge: "LOGISTICS ENGINE // ICCS CERTIFIED",
      title: "SCM",
      titleHighlight: "OPTIMIZED.",
      sub: "Integrating supply chain logic into high-scale web apps.",
      quote: "“Efficiency is the only currency.”",
      nav: "SERVICES"
    },
    { 
      start: 121, end: 169, 
      badge: "TECH STACK // NEXT.JS 16 // TURBOPACK",
      title: "NEXT GEN",
      titleHighlight: "CODING.",
      sub: "Building the impossible with modern frameworks.",
      quote: "“Sometimes you gotta run before you can walk.”",
      nav: "TECH"
    },
  ],
  seq2: [
    { 
      start: 0, end: 169, 
      badge: "GLOBAL NETWORK // PK-UK ENCRYPTION",
      title: "GLOBAL",
      titleHighlight: "REACH.",
      sub: "Bridging international markets with seamless tech.",
      quote: "“I love you 3000.”",
      nav: "CONTACT"
    },
  ]
};

export default function StarkExperience() {
  const canvasRef = useRef(null);
  const frames1Ref = useRef([]);
  const frames2Ref = useRef([]);
  const containerRef = useRef(null);
  
  const [loadPct, setLoadPct] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [activeScene, setActiveScene] = useState(SCENES.seq1[0]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [times, setTimes] = useState({ pk: "", uk: "" });

  // ─── MOUSE FOLLOW LOGIC ───
  useEffect(() => {
    const handleMouseMove = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // ─── CLOCK & HYDRATION FIX ───
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimes({
        pk: now.toLocaleTimeString("en-GB", { timeZone: "Asia/Karachi", hour12: false }),
        uk: now.toLocaleTimeString("en-GB", { timeZone: "Europe/London", hour12: false }),
      });
    };
    updateTime();
    const t = setInterval(updateTime, 1000);
    return () => clearInterval(t);
  }, []);

  // ─── PRELOADER ───
  useEffect(() => {
    const total = TOTAL_FRAMES_1 + TOTAL_FRAMES_2;
    let count = 0;
    const loadImg = (src, bucket) => new Promise(res => {
      const img = new Image();
      img.src = src;
      img.onload = img.onerror = () => { bucket.push(img); count++; setLoadPct(Math.round((count/total)*100)); res(); };
    });
    const promises = [
      ...Array.from({length: TOTAL_FRAMES_1}, (_, i) => loadImg(frame1Src(i+1), frames1Ref.current)),
      ...Array.from({length: TOTAL_FRAMES_2}, (_, i) => loadImg(frame2Src(i+1), frames2Ref.current))
    ];
    Promise.all(promises).then(() => {
      frames1Ref.current.sort((a,b)=>a.src.localeCompare(b.src));
      frames2Ref.current.sort((a,b)=>a.src.localeCompare(b.src));
      setLoaded(true);
    });
  }, []);

  // ─── DRAWING ENGINE ───
  const drawFrame = useCallback((idx, seq) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const img = (seq === 1 ? frames1Ref.current : frames2Ref.current)[idx];
    if (!img) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const scale = Math.max(canvas.width / img.naturalWidth, canvas.height / img.naturalHeight);
    const w = img.naturalWidth * scale, h = img.naturalHeight * scale;
    ctx.drawImage(img, (canvas.width - w)/2, (canvas.height - h)/2, w, h);
  }, []);

  // ─── SCROLL CONTROLLER ───
  useEffect(() => {
    if (!loaded) return;
    const onScroll = () => {
      const sy = window.scrollY, vh = window.innerHeight;
      const s1 = (SCROLL_HEIGHT_PER_SEQ * vh) / 100;
      let idx, seq;
      if (sy <= s1) {
        idx = Math.min(Math.floor((sy/s1)*(TOTAL_FRAMES_1-1)), TOTAL_FRAMES_1-1);
        seq = 1;
        const scene = SCENES.seq1.find(s => idx >= s.start && idx <= s.end);
        if(scene) setActiveScene(scene);
      } else {
        idx = Math.min(Math.floor(((sy-s1)/s1)*(TOTAL_FRAMES_2-1)), TOTAL_FRAMES_2-1);
        seq = 2;
        setActiveScene(SCENES.seq2[0]);
      }
      requestAnimationFrame(() => drawFrame(idx, seq));
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [loaded, drawFrame]);

  return (
    <div className="bg-[#000b25] text-white font-['Share_Tech_Mono'] select-none" suppressHydrationWarning>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;900&family=Share+Tech+Mono&display=swap');
        .glow-cursor { position: fixed; width: 400px; height: 400px; background: radial-gradient(circle, rgba(181,65,24,0.1) 0%, transparent 70%); pointer-events: none; z-index: 10; transform: translate(-50%, -50%); transition: 0.1s ease-out; }
        .scanlines { position: fixed; inset: 0; background: linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.1) 50%); background-size: 100% 4px; z-index: 20; pointer-events: none; }
        .glitch-text { animation: glitch 2s infinite; }
        @keyframes glitch { 0% { opacity: 1; } 50% { opacity: 0.8; } 51% { opacity: 1; } 100% { opacity: 1; } }
      `}</style>

      {/* CUSTOM MOUSE GLOW */}
      <div className="glow-cursor" style={{ left: mousePos.x, top: mousePos.y }} />
      <div className="scanlines" />

      {/* PRELOADER */}
      {!loaded && (
        <div className="fixed inset-0 z-[100] bg-[#000b25] flex flex-col items-center justify-center">
          <div className="w-20 h-20 border-2 border-[#B54118] border-t-transparent rounded-full animate-spin mb-8" />
          <h2 className="font-['Orbitron'] tracking-[10px] text-[#B54118]">INITIALIZING UMAR.OS</h2>
          <p className="text-[10px] mt-4 opacity-30 tracking-[5px]">{loadPct}% LOADED</p>
        </div>
      )}

      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-50 p-10 flex justify-between items-start mix-blend-difference">
        <div className="border-l-4 border-[#B54118] pl-4">
          <h1 className="font-['Orbitron'] font-black text-2xl leading-none">UMAR</h1>
          <span className="text-[9px] tracking-[4px] opacity-60">DIGITAL ARCHITECT</span>
        </div>
        <div className="text-right text-[10px] tracking-[3px] opacity-60">
          SYSTEM_TIME_PK: {times.pk} <br/>
          STARK_CORE_TEMP: 34°C
        </div>
      </nav>

      {/* MAIN CONTAINER */}
      <div style={{ height: '1100vh' }}>
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          <canvas ref={canvasRef} className="w-full h-full object-cover grayscale-[30%] contrast-[1.2]" />
          
          {/* CONTENT OVERLAY */}
          <div className="absolute inset-0 flex items-center p-8 md:p-32 pointer-events-none">
            <div className="max-w-4xl">
              {/* Badge */}
              <div className="bg-[#B54118]/10 border border-[#B54118]/30 px-3 py-1 inline-block mb-8">
                <span className="text-[9px] tracking-[3px] text-[#B54118] font-bold">{activeScene.badge}</span>
              </div>

              {/* Title */}
              <h1 className="font-['Orbitron'] text-7xl md:text-[120px] font-black leading-[0.9] mb-8 glitch-text">
                {activeScene.title} <br/>
                <span className="text-[#B54118] opacity-90 drop-shadow-[0_0_15px_rgba(181,65,24,0.4)]">
                  {activeScene.titleHighlight}
                </span>
              </h1>

              {/* Description */}
              <p className="text-xs md:text-sm tracking-[4px] opacity-40 uppercase max-w-md border-b border-white/10 pb-10">
                {activeScene.sub}
              </p>

              {/* Quote Box */}
              <div className="mt-16 flex items-start gap-6">
                <div className="w-[1px] h-20 bg-gradient-to-b from-[#B54118] to-transparent" />
                <div className="max-w-xs">
                  <p className="text-sm italic opacity-70 mb-2">{activeScene.quote}</p>
                  <span className="text-[8px] tracking-[2px] opacity-30 font-bold">PROTOCOLS ENABLED // 2026</span>
                </div>
              </div>
            </div>
          </div>

          {/* SIDER DATA HUD */}
          <div className="absolute bottom-12 right-12 hidden md:block">
            <div className="flex gap-10 text-[9px] tracking-[2px] opacity-30 transform rotate-90 origin-bottom-right translate-y-[-100%]">
              <span>LAT: 31.5204 N</span>
              <span>LON: 74.3587 E</span>
              <span>DEV_MODE: ACTIVE</span>
            </div>
          </div>
        </div>
      </div>

      {/* FINAL CTA */}
      <section className="h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        <h2 className="font-['Orbitron'] text-6xl md:text-8xl opacity-10 mb-12">READY TO BUILD?</h2>
        <button className="z-10 px-12 py-5 border-2 border-[#B54118] text-[#B54118] font-['Orbitron'] text-sm tracking-[8px] hover:bg-[#B54118] hover:text-white transition-all duration-500 shadow-[0_0_20px_rgba(181,65,24,0.2)]">
          EXECUTE PROJECT
        </button>
      </section>

      {/* --- ULTRA-PREMIUM DYNAMIC FOOTER --- */}
      <footer className="relative bg-[#000b25] border-t border-[#B54118]/20 pt-20 pb-10 overflow-hidden">
        {/* Background Decorative Element */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-[#B54118] to-transparent opacity-50" />
        
        <div className="max-w-7xl mx-auto px-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-20">
            
            {/* Column 1: Identity */}
            <div className="space-y-6">
              <div className="font-['Orbitron'] text-2xl font-black tracking-tighter">
                UMAR<span className="text-[#B54118]">.OS</span>
              </div>
              <p className="text-[10px] tracking-[3px] opacity-40 leading-relaxed uppercase">
                Specializing in high-performance digital architecture and supply chain optimized web systems.
              </p>
              <div className="flex gap-4 text-[10px] tracking-[2px]">
                <span className="text-[#B54118] animate-pulse">●</span> STATUS: ACCEPTING PROJECTS
              </div>
            </div>

            {/* Column 2: Navigation HUD */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-[#B54118] text-[10px] font-bold tracking-[4px] mb-4">DIRECTORY</h4>
                <ul className="text-[11px] space-y-2 opacity-60 tracking-[2px]">
                  <li className="hover:text-[#B54118] cursor-pointer transition-colors">/PROJECTS</li>
                  <li className="hover:text-[#B54118] cursor-pointer transition-colors">/LOGISTICS</li>
                  <li className="hover:text-[#B54118] cursor-pointer transition-colors">/ARCHIVE</li>
                </ul>
              </div>
              <div>
                <h4 className="text-[#B54118] text-[10px] font-bold tracking-[4px] mb-4">SOCIAL</h4>
                <ul className="text-[11px] space-y-2 opacity-60 tracking-[2px]">
                  <li className="hover:text-[#B54118] cursor-pointer transition-colors">LINKEDIN</li>
                  <li className="hover:text-[#B54118] cursor-pointer transition-colors">GITHUB</li>
                  <li className="hover:text-[#B54118] cursor-pointer transition-colors">TWITTER</li>
                </ul>
              </div>
            </div>

            {/* Column 3: Contact Action */}
            <div className="flex flex-col items-start md:items-end justify-between">
              <div className="text-left md:text-right">
                <div className="text-[10px] opacity-30 mb-1">LOCAL TIME (PK)</div>
                <div className="font-['Orbitron'] text-xl">{times.pk}</div>
              </div>
              <button className="mt-8 group relative px-8 py-4 bg-transparent border border-[#B54118]/50 overflow-hidden transition-all hover:border-[#B54118]">
                <div className="absolute inset-0 bg-[#B54118] translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <span className="relative z-10 font-['Orbitron'] text-[10px] tracking-[5px] group-hover:text-white transition-colors">
                  INITIATE COMMS
                </span>
              </button>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="flex flex-col md:flex-row justify-between items-center pt-10 border-t border-white/5 opacity-20 text-[8px] tracking-[4px]">
            <div>© 2026 UMAR // STARK INDUSTRIES PROTOCOL</div>
            <div className="mt-4 md:mt-0">DESIGNED BY UMAR // POWERED BY NEXT.JS 16</div>
          </div>
        </div>

        {/* Decorative HUD Corner */}
        <div className="absolute bottom-0 right-0 w-32 h-32 opacity-5 pointer-events-none">
          <div className="absolute bottom-4 right-4 border-r border-b border-[#B54118] w-full h-full" />
        </div>
      </footer>
    </div>
  );
}