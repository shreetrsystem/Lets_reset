"use client";

import { useState } from "react";
import { FiPlay, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const KOMBUCHA_VIDEOS = [
  {
    id: "dQw4w9WgXcQ", // Replace with real ASMR Pouring ID
    title: "4K Kombucha Pouring ASMR",
    thumbnail: "https://images.unsplash.com/photo-1594498653385-d5172c532c00?q=80&w=800&auto=format&fit=crop",
    category: "Sensory"
  },
  {
    id: "9-z7p-q-Xk0", // Replace with real Mocktail ID
    title: "Cranberry Flavor Recipe",
    thumbnail: "https://images.unsplash.com/photo-1582231245980-8b98132e4823?q=80&w=800&auto=format&fit=crop",
    category: "Mixology"
  },
  {
    id: "rY_7sS_h08E", // Replace with real Factory ID
    title: "How It's Made: Reset Edition",
    thumbnail: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=800&auto=format&fit=crop",
    category: "Production"
  }
];

export default function YouTubeSection() {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  return (
    <section className="py-24 bg-white dark:bg-brand-dark" id="videos">
      <div className="container mx-auto px-6">
        <div className="mb-12">
          <h2 className="text-5xl font-black uppercase tracking-tighter dark:text-white mb-4">
            Kombucha <span className="text-brand-purple">Culture</span>
          </h2>
          <p className="text-gray-500 font-bold uppercase text-sm tracking-widest max-w-xl">
            Experience the craft behind the bubbles. From our 4K pouring ASMR to behind-the-scenes production.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {KOMBUCHA_VIDEOS.map((video, index) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative cursor-pointer"
              onClick={() => setSelectedVideo(video.id)}
            >
              <div className="relative aspect-video rounded-[2.5rem] overflow-hidden border border-black/5 dark:border-white/10 shadow-xl group-hover:scale-[1.02] transition-all duration-500">
                <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-brand-purple/20 transition-all duration-500 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-white text-brand-dark flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-500">
                    <FiPlay size={24} className="ml-1" />
                  </div>
                </div>
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-white mb-2">
                    {video.category}
                  </span>
                  <h3 className="text-xl font-black text-white uppercase leading-tight drop-shadow-lg">
                    {video.title}
                  </h3>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-2xl bg-black/60"
            onClick={() => setSelectedVideo(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative w-full max-w-5xl aspect-video rounded-3xl overflow-hidden shadow-2xl border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedVideo(null)}
                className="absolute top-4 right-4 w-12 h-12 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-red-500 transition-all z-10"
              >
                <FiX size={24} />
              </button>
              <iframe
                src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1`}
                className="w-full h-full"
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
              ></iframe>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
