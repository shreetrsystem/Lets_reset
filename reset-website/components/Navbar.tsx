"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { FiSun, FiMoon } from "react-icons/fi";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "glass py-4 shadow-sm" : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-6 md:px-12 flex justify-between items-center">
        <Link
          href="/"
          className="text-2xl font-black tracking-tighter uppercase text-brand-dark dark:text-brand-light relative z-50"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          Let's Reset
        </Link>
        <div className="hidden md:flex gap-8 items-center font-medium text-sm tracking-wide">
          <Link href="#products" className="hover:text-brand-red dark:text-brand-light transition-colors">
            SHOP
          </Link>
          <Link href="#about" className="hover:text-brand-red dark:text-brand-light transition-colors">
            ABOUT
          </Link>
          <Link href="#journal" className="hover:text-brand-red dark:text-brand-light transition-colors">
            JOURNAL
          </Link>
          
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-brand-dark dark:text-brand-light"
              aria-label="Toggle Dark Mode"
            >
              {theme === 'dark' ? <FiSun size={20} /> : <FiMoon size={20} />}
            </button>
          )}

          <Link
            href="#cart"
            className="bg-brand-dark text-brand-light dark:bg-brand-light dark:text-brand-dark px-6 py-2 rounded-full hover:scale-105 transition-transform"
          >
            CART (0)
          </Link>
        </div>
        
        {/* Mobile menu toggle */}
        <div className="flex md:hidden items-center gap-4 relative z-50">
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
              aria-label="Toggle Dark Mode"
            >
              {theme === 'dark' ? <FiSun size={24} className="text-brand-light" /> : <FiMoon size={24} className="text-brand-dark" />}
            </button>
          )}
          
          <button 
            className="flex flex-col gap-1.5 focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
            aria-expanded={isMobileMenuOpen}
          >
            <span className={`block w-6 h-0.5 bg-current transition-transform duration-300 ${isMobileMenuOpen ? "rotate-45 translate-y-2 text-brand-dark" : "text-brand-dark dark:text-brand-light"}`}></span>
            <span className={`block w-6 h-0.5 bg-current transition-opacity duration-300 ${isMobileMenuOpen ? "opacity-0" : "text-brand-dark dark:text-brand-light"}`}></span>
            <span className={`block w-6 h-0.5 bg-current transition-transform duration-300 ${isMobileMenuOpen ? "-rotate-45 -translate-y-2 text-brand-dark" : "text-brand-dark dark:text-brand-light"}`}></span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div 
        className={`fixed inset-0 bg-brand-light dark:bg-brand-dark z-40 flex flex-col justify-center items-center gap-8 text-2xl font-black transition-transform duration-500 ease-in-out md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <Link 
          href="#products" 
          className="text-brand-dark dark:text-brand-light hover:text-brand-red"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          SHOP
        </Link>
        <Link 
          href="#about" 
          className="text-brand-dark dark:text-brand-light hover:text-brand-red"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          ABOUT
        </Link>
        <Link 
          href="#journal" 
          className="text-brand-dark dark:text-brand-light hover:text-brand-red"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          JOURNAL
        </Link>
        <Link 
          href="#cart" 
          className="bg-brand-dark text-brand-light dark:bg-brand-light dark:text-brand-dark px-8 py-3 rounded-full mt-4"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          CART (0)
        </Link>
      </div>
    </nav>
  );
}
