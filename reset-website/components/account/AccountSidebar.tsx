"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiGrid, FiShoppingBag, FiMapPin, FiUser, FiLogOut } from "react-icons/fi";
import { createClient } from "@/lib/supabase/client";
import { toast } from "react-hot-toast";

const navItems = [
  { label: "Dashboard", href: "/account?tab=dashboard", icon: FiGrid },
  { label: "Orders", href: "/account?tab=orders", icon: FiShoppingBag },
  { label: "Addresses", href: "/account?tab=addresses", icon: FiMapPin },
  { label: "Account Details", href: "/account/details", icon: FiUser },
];

export default function AccountSidebar() {
  const pathname = usePathname();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
    window.location.href = "/";
  };

  return (
    <aside className="w-full lg:w-72 flex-shrink-0">
      <div className="backdrop-blur-xl bg-white/40 dark:bg-white/5 p-6 rounded-[2.5rem] border border-white/20 shadow-2xl shadow-black/5">
        <nav className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-4 p-4 rounded-2xl transition-all font-black uppercase text-xs tracking-[0.1em] ${
                  isActive
                    ? "bg-brand-dark dark:bg-white text-white dark:text-brand-dark shadow-xl"
                    : "text-gray-500 hover:bg-white/50 dark:hover:bg-white/5 hover:text-brand-dark dark:hover:text-brand-light"
                }`}
              >
                <item.icon size={20} />
                {item.label}
              </Link>
            );
          })}
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 p-4 rounded-2xl transition-all font-black uppercase text-xs tracking-[0.1em] text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
          >
            <FiLogOut size={20} />
            Logout
          </button>
        </nav>
      </div>
    </aside>
  );
}
