"use client";

import { useEffect, useState } from "react";
import { FiDollarSign, FiShoppingBag, FiUsers, FiBox, FiArrowUpRight, FiSearch } from "react-icons/fi";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function fetchStats() {
      const response = await fetch("/api/admin/stats");
      if (!response.ok) {
        toast.error("Not authorized");
        router.push("/");
        return;
      }
      const data = await response.json();
      setData(data);
      setLoading(false);
    }
    fetchStats();
  }, [router]);

  if (loading) return <div className="text-center py-24">Loading Dashboard...</div>;

  const totalRevenue = data.orders.reduce((acc: number, o: any) => acc + o.total, 0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-brand-dark pt-32 pb-24">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-end mb-12">
           <div>
              <h1 className="text-4xl font-black uppercase tracking-tight text-brand-dark dark:text-brand-light">Admin <span className="text-brand-purple">HQ</span></h1>
              <p className="text-gray-500 mt-2 font-medium">Real-time business overview and management.</p>
           </div>
           <div className="bg-white dark:bg-white/5 px-6 py-3 rounded-2xl border dark:border-white/10 flex items-center gap-4">
              <FiSearch className="text-gray-400" />
              <input type="text" placeholder="Search orders..." className="bg-transparent outline-none text-sm dark:text-white" />
           </div>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
           <StatCard icon={<FiDollarSign />} label="Total Revenue" value={`$${totalRevenue.toFixed(2)}`} color="text-green-500" />
           <StatCard icon={<FiShoppingBag />} label="Total Orders" value={data.orders.length} color="text-brand-purple" />
           <StatCard icon={<FiUsers />} label="Total Users" value={data.profiles.length} color="text-brand-orange" />
           <StatCard icon={<FiBox />} label="Products" value={data.products.length} color="text-blue-500" />
        </div>

        {/* Recent Orders Table */}
        <div className="bg-white dark:bg-white/5 rounded-[2.5rem] border dark:border-white/10 overflow-hidden shadow-sm">
           <div className="p-8 border-b dark:border-white/10 flex justify-between items-center">
              <h3 className="text-xl font-bold dark:text-white">Recent Orders</h3>
              <button className="text-sm font-bold text-brand-purple hover:underline flex items-center gap-1">View All <FiArrowUpRight /></button>
           </div>
           <div className="overflow-x-auto">
              <table className="w-full text-left">
                 <thead>
                    <tr className="text-[10px] font-black uppercase tracking-widest text-gray-400 border-b dark:border-white/10">
                       <th className="px-8 py-4">ID</th>
                       <th className="px-8 py-4">Customer</th>
                       <th className="px-8 py-4">Status</th>
                       <th className="px-8 py-4">Total</th>
                       <th className="px-8 py-4">Date</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y dark:divide-white/5">
                    {data.orders.map((order: any) => (
                       <tr key={order.id} className="text-sm dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                          <td className="px-8 py-6 font-mono text-xs">#{order.id.slice(-6).toUpperCase()}</td>
                          <td className="px-8 py-6 font-bold">{order.profile.fullName || order.profile.email}</td>
                          <td className="px-8 py-6">
                             <span className="px-2 py-1 rounded-full text-[10px] font-black uppercase bg-green-100 text-green-600">
                                {order.status}
                             </span>
                          </td>
                          <td className="px-8 py-6 font-black">${order.total.toFixed(2)}</td>
                          <td className="px-8 py-6 text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }: any) {
  return (
    <div className="bg-white dark:bg-white/5 p-8 rounded-[2rem] border dark:border-white/10 shadow-sm relative overflow-hidden group">
      <div className={`absolute -right-4 -bottom-4 text-8xl opacity-[0.03] group-hover:scale-110 transition-transform ${color}`}>
        {icon}
      </div>
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 text-xl bg-opacity-10 ${color.replace('text-', 'bg-')} ${color}`}>
        {icon}
      </div>
      <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-3xl font-black text-brand-dark dark:text-brand-light">{value}</p>
    </div>
  );
}
import { toast } from "react-hot-toast";
