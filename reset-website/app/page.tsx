"use client";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Products from "@/components/Products";
import Recipes from "@/components/Recipes";
import StoreLocator from "@/components/StoreLocator";
import YouTubeSection from "@/components/home/YouTubeSection";
import Features2026 from "@/components/shop/Features2026";
import { useEffect } from "react";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-brand-light font-sans selection:bg-brand-red selection:text-white">
      <Navbar />
      <Hero />
      <Features />
      <Products />
      <Recipes />
      <YouTubeSection />
      <Features2026 />
      <StoreLocator />
      <Testimonials />
      <Footer />
    </main>
  );
}
