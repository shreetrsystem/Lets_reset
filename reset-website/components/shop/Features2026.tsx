"use client";

import { useEffect, useState } from "react";
import { FiMessageCircle, FiSmartphone, FiMic, FiSearch, FiArrowRight } from "react-icons/fi";
import { motion } from "framer-motion";

export default function Features2026() {
  const [isListening, setIsListening] = useState(false);
  const [voiceText, setVoiceText] = useState("");

  const handleVoiceSearch = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert("Voice search is not supported in your browser.");
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setVoiceText(transcript);
      // In a real app, this would trigger a site search
      window.location.href = `/?search=${transcript}#products`;
    };

    recognition.start();
  };

  const openWhatsApp = () => {
    const phone = "919876543210"; // Placeholder
    const text = encodeURIComponent("Hey Let's Reset! Checking on my order status. 🥤");
    window.open(`https://wa.me/${phone}?text=${text}`, "_blank");
  };

  return (
    <section className="py-24 bg-[#FCF9F2] dark:bg-brand-dark/50">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block px-4 py-1 bg-brand-orange/10 rounded-full text-brand-orange text-[10px] font-black uppercase tracking-[0.2em] mb-4">
              Coming in 2026
            </span>
            <h2 className="text-5xl font-black uppercase dark:text-white mb-8 leading-tight">
              Future-Proof <br /> <span className="text-brand-purple italic">E-Commerce</span>
            </h2>
            
            <div className="space-y-6">
              <div className="p-8 backdrop-blur-xl bg-white/40 dark:bg-white/5 rounded-[2.5rem] border border-white/20 shadow-2xl shadow-black/5 hover:scale-[1.02] transition-all">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-3xl bg-green-500/10 flex items-center justify-center text-green-500 shadow-lg shadow-green-500/5">
                    <FiMessageCircle size={32} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black uppercase dark:text-white mb-1">WhatsApp Status</h3>
                    <p className="text-sm text-gray-500 italic">One-tap order updates via WhatsApp (+91 prefill)</p>
                  </div>
                  <button onClick={openWhatsApp} className="ml-auto w-12 h-12 rounded-full bg-brand-dark dark:bg-white text-white dark:text-brand-dark flex items-center justify-center shadow-xl hover:bg-brand-purple dark:hover:bg-brand-purple dark:hover:text-white transition-all">
                    <FiArrowRight size={20} />
                  </button>
                </div>
              </div>

              <div className="p-8 backdrop-blur-xl bg-white/40 dark:bg-white/5 rounded-[2.5rem] border border-white/20 shadow-2xl shadow-black/5 hover:scale-[1.02] transition-all">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-3xl bg-brand-purple/10 flex items-center justify-center text-brand-purple shadow-lg shadow-brand-purple/5">
                    <FiMic size={32} className={isListening ? "animate-pulse" : ""} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-black uppercase dark:text-white mb-1">Voice Search</h3>
                    <p className="text-sm text-gray-500 italic">{voiceText || "Find your favorite flavor using just your voice"}</p>
                  </div>
                  <button 
                    onClick={handleVoiceSearch} 
                    className={`ml-auto w-12 h-12 rounded-full flex items-center justify-center shadow-xl transition-all ${isListening ? "bg-red-500 text-white animate-bounce" : "bg-brand-dark dark:bg-white text-white dark:text-brand-dark"}`}
                  >
                    <FiSearch size={20} />
                  </button>
                </div>
              </div>

              <div className="p-8 backdrop-blur-xl bg-white/40 dark:bg-white/5 rounded-[2.5rem] border border-white/20 shadow-2xl shadow-black/5 hover:scale-[1.02] transition-all">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-3xl bg-brand-orange/10 flex items-center justify-center text-brand-orange shadow-lg shadow-brand-orange/5">
                    <FiSmartphone size={32} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black uppercase dark:text-white mb-1">UPI QR Instant Pay</h3>
                    <p className="text-sm text-gray-500 italic">India-first local QR code checkout experience</p>
                  </div>
                  <div className="ml-auto text-xs font-black text-brand-orange grayscale brightness-125">ACTIVE</div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
             <div className="absolute -inset-4 bg-gradient-to-tr from-brand-orange to-brand-purple opacity-20 blur-3xl animate-pulse"></div>
             <img 
               src="https://images.unsplash.com/photo-1556740734-79383633658f?q=80&w=1000&auto=format&fit=crop" 
               alt="Mobile payments" 
               className="relative rounded-[3rem] shadow-2xl border border-white/40 dark:border-white/10"
             />
          </div>
        </div>
      </div>
    </section>
  );
}
