"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import AccountSidebar from "@/components/account/AccountSidebar";
import { FiUser, FiLock, FiCheck } from "react-icons/fi";
import { toast } from "react-hot-toast";

export default function AccountDetailsPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  // Form State
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    displayName: "",
    email: "",
    phone: "",
    currentPassword: "",
    newPassword: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = "/?login=true";
        return;
      }
      setUser(user);
      
      const response = await fetch("/api/profile");
      if (response.ok) {
        const data = await response.json();
        setProfile({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          displayName: data.displayName || user.user_metadata?.full_name || "",
          email: user.email || "",
          phone: data.phone || "",
          currentPassword: "",
          newPassword: "",
        });
      }
      setLoading(false);
    };
    fetchUser();
  }, [supabase]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      // 1. Update Profile Data
      const response = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            firstName: profile.firstName,
            lastName: profile.lastName,
            displayName: profile.displayName,
            phone: profile.phone,
        }),
      });

      if (!response.ok) throw new Error("Failed to update profile");

      // 2. Update Password if provided
      if (profile.newPassword) {
        const { error } = await supabase.auth.updateUser({
          password: profile.newPassword
        });
        if (error) throw error;
        toast.success("Password updated successfully!");
        setProfile(prev => ({ ...prev, currentPassword: "", newPassword: "" }));
      }

      toast.success("Profile updated successfully!", {
          icon: '🚀',
          style: {
              borderRadius: '10px',
              background: '#111',
              color: '#fff',
          },
      });
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400/5 to-purple-500/5 dark:from-brand-dark dark:to-brand-dark pt-32 pb-24">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-12">
          <AccountSidebar />
          
          <div className="flex-1 space-y-8">
            <header className="space-y-2">
              <h1 className="text-4xl font-black uppercase tracking-tight dark:text-white">Account Details</h1>
              <p className="text-gray-500 font-bold uppercase text-xs tracking-widest">
                Edit your profile information and change your password.
              </p>
            </header>

            <form onSubmit={handleSave} className="space-y-8" autoComplete="off">
              <section className="backdrop-blur-xl bg-white/40 dark:bg-white/5 p-8 rounded-[2.5rem] border border-white/20 shadow-2xl shadow-black/5">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-full bg-brand-purple/10 flex items-center justify-center text-brand-purple">
                    <FiUser size={24} />
                  </div>
                  <h2 className="text-2xl font-black uppercase tracking-tight dark:text-white">Profile Info</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-wider text-gray-400 ml-1">First Name</label>
                    <input
                      type="text"
                      required
                      value={profile.firstName}
                      onChange={(e) => setProfile({...profile, firstName: e.target.value})}
                      autoComplete="given-name"
                      className="w-full p-4 rounded-xl bg-white/50 dark:bg-white/5 border border-white/20 focus:border-brand-purple outline-none transition-all dark:text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-wider text-gray-400 ml-1">Last Name</label>
                    <input
                      type="text"
                      required
                      value={profile.lastName}
                      onChange={(e) => setProfile({...profile, lastName: e.target.value})}
                      autoComplete="family-name"
                      className="w-full p-4 rounded-xl bg-white/50 dark:bg-white/5 border border-white/20 focus:border-brand-purple outline-none transition-all dark:text-white"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-wider text-gray-400 ml-1">Display Name *</label>
                    <input
                      type="text"
                      required
                      value={profile.displayName}
                      onChange={(e) => setProfile({...profile, displayName: e.target.value})}
                      autoComplete="name"
                      className="w-full p-4 rounded-xl bg-white/50 dark:bg-white/5 border border-white/20 focus:border-brand-purple outline-none transition-all dark:text-white"
                    />
                    <p className="text-[10px] text-gray-400 font-bold italic px-1">This will be how your name will be displayed in the account section and in reviews</p>
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-wider text-gray-400 ml-1">Phone Number</label>
                    <input
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => setProfile({...profile, phone: e.target.value})}
                      placeholder="+91 XXXXX XXXXX"
                      autoComplete="tel-national"
                      className="w-full p-4 rounded-xl bg-white/50 dark:bg-white/5 border border-white/20 focus:border-brand-purple outline-none transition-all dark:text-white"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-wider text-gray-400 ml-1">Email Address</label>
                    <input
                      type="email"
                      disabled
                      value={profile.email}
                      className="w-full p-4 rounded-xl bg-gray-100 dark:bg-white/5 border border-white/10 text-gray-400 outline-none cursor-not-allowed"
                    />
                  </div>
                </div>
              </section>

              <section className="backdrop-blur-xl bg-white/40 dark:bg-white/5 p-8 rounded-[2.5rem] border border-white/20 shadow-2xl shadow-black/5">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-full bg-brand-orange/10 flex items-center justify-center text-brand-orange">
                    <FiLock size={24} />
                  </div>
                  <h2 className="text-2xl font-black uppercase tracking-tight dark:text-white">Password Change</h2>
                </div>

                <div className="space-y-6">
                   <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-wider text-gray-400 ml-1">Current Password (Leave blank to leave unchanged)</label>
                    <input
                      type="password"
                      value={profile.currentPassword}
                      onChange={(e) => setProfile({...profile, currentPassword: e.target.value})}
                      autoComplete="current-password"
                      className="w-full p-4 rounded-xl bg-white/50 dark:bg-white/5 border border-white/20 focus:border-brand-purple outline-none transition-all dark:text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-wider text-gray-400 ml-1">New Password (Leave blank to leave unchanged)</label>
                    <input
                      type="password"
                      value={profile.newPassword}
                      onChange={(e) => setProfile({...profile, newPassword: e.target.value})}
                      autoComplete="new-password"
                      className="w-full p-4 rounded-xl bg-white/50 dark:bg-white/5 border border-white/20 focus:border-brand-purple outline-none transition-all dark:text-white"
                    />
                  </div>
                </div>
              </section>

              <button
                type="submit"
                disabled={saving}
                className="px-12 py-5 bg-gradient-to-r from-brand-orange to-rose-500 text-white rounded-[2rem] font-black uppercase tracking-widest text-sm hover:scale-[1.05] active:scale-95 transition-all disabled:opacity-50 shadow-2xl shadow-brand-orange/20 flex items-center gap-3 ml-auto"
              >
                {saving ? "Saving..." : (
                  <>
                    <span>Save Changes</span>
                    <FiCheck />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
