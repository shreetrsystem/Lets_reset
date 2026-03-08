"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

const FLAVORS = [
  {
    id: "cranberry",
    name: "Cranberry",
    tagline: "Crisp, tart, wildly refreshing.",
    color: "from-brand-red to-[#ff4d6d]",
    image: "/cranberry.png",
    blobText: "text-brand-red",
  },
  {
    id: "spiced-jamun",
    name: "Spiced Jamun",
    tagline: "Deep, earthy, with a familiar kick.",
    color: "from-brand-purple to-[#5a189a]",
    image: "/jamun.png",
    blobText: "text-brand-purple",
  },
  {
    id: "coffee-peach",
    name: "Coffee Peach",
    tagline: "An unexpected spark to start your day.",
    color: "from-brand-orange to-[#f4a261]",
    image: "/peach.png",
    blobText: "text-brand-orange",
  }
];

export default function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % FLAVORS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const activeFlavor = FLAVORS[currentIndex];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-brand-light via-brand-light to-brand-light dark:from-brand-dark dark:via-[#1a1515] dark:to-[#1a1515] pt-20 transition-colors duration-500">
      {/* Decorative blobs */}
      <div className={`absolute top-1/4 left-10 w-72 h-72 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-20 animate-blob bg-current ${activeFlavor.blobText}`}></div>
      <div className={`absolute -bottom-8 right-1/3 w-96 h-96 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-20 animate-blob animation-delay-2000 bg-current ${activeFlavor.blobText}`}></div>

      <div className="container mx-auto px-6 relative z-10 grid md:grid-cols-2 gap-12 items-center">
        <div className="text-center md:text-left z-20">
          <h1 className="text-6xl md:text-8xl font-black text-brand-dark dark:text-brand-light leading-tight tracking-tighter mb-4 text-balance transition-colors duration-300">
            TASTES AMAZING. <br />
            <span className={`text-gradient transition-all duration-700 ${activeFlavor.color}`}>
              FEELS EVEN BETTER.
            </span>
          </h1>
          <div className="h-16 mb-4">
            <p className="text-2xl md:text-3xl font-bold dark:text-white transition-all duration-500">
              {activeFlavor.name}
            </p>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 font-medium">
              {activeFlavor.tagline}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start mt-8">
            <Link
              href="#products"
              className="bg-brand-dark text-brand-light dark:bg-brand-light dark:text-brand-dark rounded-full font-bold text-lg hover:scale-105 transition-all duration-300 px-8 py-4 flex items-center justify-center group"
            >
              Shop Now
              <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>

          <div className="flex gap-3 justify-center md:justify-start mt-12">
            {FLAVORS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  idx === currentIndex 
                    ? "bg-brand-dark dark:bg-brand-light w-8" 
                    : "bg-gray-300 dark:bg-gray-700 hover:bg-gray-400"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="relative h-[500px] md:h-[650px] w-full flex items-center justify-center perspective-1000">
          {FLAVORS.map((flavor, idx) => {
            const isActive = idx === currentIndex;
            const isPrev = idx === (currentIndex - 1 + FLAVORS.length) % FLAVORS.length;
            const isNext = idx === (currentIndex + 1) % FLAVORS.length;

            let transformClass = "translate-x-full opacity-0 scale-75"; 
            let zIndex = "z-0";

            if (isActive) {
              transformClass = "translate-x-0 opacity-100 scale-100 rotate-0";
              zIndex = "z-30";
            } else if (isPrev) {
              transformClass = "-translate-x-1/2 opacity-40 scale-75 -rotate-12 blur-sm";
              zIndex = "z-10";
            } else if (isNext) {
              transformClass = "translate-x-1/2 opacity-40 scale-75 rotate-12 blur-sm";
              zIndex = "z-10";
            }

            return (
              <div 
                key={flavor.id}
                className={`absolute inset-0 w-full h-full flex items-center justify-center transition-all duration-700 ease-in-out cursor-pointer ${transformClass} ${zIndex}`}
                onClick={() => setCurrentIndex(idx)}
              >
                <div className="relative w-3/5 h-[80%] drop-shadow-2xl">
                  <Image
                    src={flavor.image}
                    alt={`${flavor.name} Kombucha`}
                    fill
                    className="object-contain"
                    priority={isActive}
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
