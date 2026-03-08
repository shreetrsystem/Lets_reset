import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Products from "@/components/Products";
import Recipes from "@/components/Recipes";
import StoreLocator from "@/components/StoreLocator";
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
      <StoreLocator />
      <Testimonials />
      <Footer />
    </main>
  );
}
