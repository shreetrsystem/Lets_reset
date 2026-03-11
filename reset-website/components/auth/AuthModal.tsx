"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import AuthForm from "./AuthForm";
import { FiUser, FiX, FiLogOut, FiSettings, FiShoppingBag } from "react-icons/fi";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { useCart } from "@/lib/store/useCart";
import { useSearchParams } from "next/navigation";

export default function AuthModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const supabase = createClient();
  const searchParams = useSearchParams();
  const nextParam = searchParams.get("next");

  useEffect(() => {
    // Check if login modal should be open by default
    if (searchParams.get("login") === "true") {
      setIsOpen(true);
    }

    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    fetchUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      if (_event === 'SIGNED_IN') {
        setIsOpen(false);
        // Sync cart on login
        const { syncWithServer } = useCart.getState();
        await syncWithServer();
        toast.success("Welcome back! Cart synced.", {
          icon: '🛒',
          style: {
            borderRadius: '10px',
            background: '#111',
            color: '#fff',
          },
        });
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase, searchParams]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsDropdownOpen(false);
    toast.success("Logged out successfully");
  };

  if (loading) return <div className="w-10 h-10 rounded-full animate-pulse bg-gray-200 dark:bg-white/10" />;

  if (user) {
    return (
      <div className="relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-2 hover:bg-black/5 dark:hover:bg-white/10 p-2 rounded-full transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-brand-purple flex items-center justify-center text-white font-black text-xs uppercase shadow-sm">
            {user.email?.[0] ?? "U"}
          </div>
        </button>

        <AnimatePresence>
          {isDropdownOpen && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setIsDropdownOpen(false)}
              />
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-2 w-64 bg-white dark:bg-brand-dark border border-gray-100 dark:border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden"
              >
                <div className="p-4 border-b border-gray-100 dark:border-white/10">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Signed in as</p>
                  <p className="text-sm font-bold text-brand-dark dark:text-brand-light truncate">{user.email}</p>
                </div>
                <div className="p-2">
                  <Link 
                    href="/account" 
                    className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-sm font-medium text-brand-dark dark:text-brand-light"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <FiUser className="text-gray-400" />
                    My Account
                  </Link>
                  <Link 
                   href="/account/orders" 
                   className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-sm font-medium text-brand-dark dark:text-brand-light"
                   onClick={() => setIsDropdownOpen(false)}
                  >
                    <FiShoppingBag className="text-gray-400" />
                    Order History
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors text-sm font-bold text-red-500"
                  >
                    <FiLogOut />
                    Logout
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 hover:bg-black/5 dark:hover:bg-white/10 p-2 rounded-full transition-colors text-brand-dark dark:text-brand-light"
        aria-label="Login"
      >
        <FiUser size={20} />
        <span className="hidden lg:inline text-sm font-bold uppercase tracking-tight">Login</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-brand-dark/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white dark:bg-brand-dark rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-gray-400"
              >
                <FiX size={24} />
              </button>
              <AuthForm 
                onSuccess={() => setIsOpen(false)} 
                redirectTo={nextParam || undefined}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
