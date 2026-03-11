"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "react-hot-toast";
import { FiMail, FiLock, FiUser } from "react-icons/fi";

import { useRouter } from "next/navigation";

interface AuthFormProps {
  onSuccess?: () => void;
  redirectTo?: string;
}

export default function AuthForm({ onSuccess, redirectTo }: AuthFormProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  
  const supabase = createClient();
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast.success("Welcome back!");
        // Redirect after successful login
        router.push(redirectTo || "/#products");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
            emailRedirectTo: `${window.location.origin}/auth/callback${redirectTo ? `?next=${redirectTo}` : ""}`,
          },
        });
        if (error) throw error;
        toast.success("Check your email to confirm your account!");
      }
      if (onSuccess) onSuccess();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="w-full max-w-md mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-black uppercase tracking-tight text-brand-dark dark:text-brand-light">
          {isLogin ? "Welcome Back" : "Create Account"}
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          {isLogin ? "Get back to your reset routine." : "Join the Let's Reset community."}
        </p>
      </div>

      <form onSubmit={handleAuth} className="space-y-4">
        {!isLogin && (
          <div className="relative">
            <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-100 dark:bg-white/5 border border-transparent focus:border-brand-purple focus:bg-white dark:focus:bg-transparent outline-none transition-all text-brand-dark dark:text-brand-light"
              required={!isLogin}
            />
          </div>
        )}

        <div className="relative">
          <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-100 dark:bg-white/5 border border-transparent focus:border-brand-purple focus:bg-white dark:focus:bg-transparent outline-none transition-all text-brand-dark dark:text-brand-light"
            required
          />
        </div>

        <div className="relative">
          <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-100 dark:bg-white/5 border border-transparent focus:border-brand-purple focus:bg-white dark:focus:bg-transparent outline-none transition-all text-brand-dark dark:text-brand-light"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-brand-dark dark:bg-brand-light text-brand-light dark:text-brand-dark rounded-2xl font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
        >
          {loading ? "Processing..." : isLogin ? "Login" : "Sign Up"}
        </button>
      </form>


      <p className="text-center mt-8 text-sm text-gray-500 dark:text-gray-400">
        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-brand-purple font-bold hover:underline"
        >
          {isLogin ? "Sign Up" : "Login"}
        </button>
      </p>
    </div>
  );
}
