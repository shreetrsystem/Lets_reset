"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { FiShoppingBag, FiPackage, FiCalendar, FiMapPin } from "react-icons/fi";
import { toast } from "react-hot-toast";

export default function OrderHistory() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await fetch("/api/orders/history");
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error("Failed to load orders");
        toast.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  if (loading) {
     return <div className="text-center py-12 text-gray-400">Loading order history...</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-20 bg-gray-50 dark:bg-white/5 rounded-3xl border-2 border-dashed border-gray-100 dark:border-white/10">
        <FiShoppingBag className="mx-auto text-gray-300 mb-4" size={48} />
        <h3 className="text-xl font-bold dark:text-white mb-2">No orders yet</h3>
        <p className="text-gray-500">Your reset journey begins with your first sip.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <div key={order.id} className="glass p-6 md:p-8 rounded-[2rem] border border-gray-100 dark:border-white/10 shadow-sm">
          <div className="flex flex-wrap justify-between items-start gap-4 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-purple/10 flex items-center justify-center text-brand-purple">
                <FiPackage size={24} />
              </div>
              <div>
                <h4 className="font-black text-brand-dark dark:text-brand-light uppercase tracking-tight">Order #{order.id.slice(-8).toUpperCase()}</h4>
                <div className="flex items-center gap-4 text-xs text-gray-500 font-bold mt-1">
                  <span className="flex items-center gap-1"><FiCalendar /> {new Date(order.createdAt).toLocaleDateString()}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase ${order.status === 'paid' ? 'bg-green-100 text-green-600' : 'bg-brand-orange/10 text-brand-orange'}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Amount</p>
              <p className="text-2xl font-black text-brand-dark dark:text-brand-light">${order.total.toFixed(2)}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Items Bundled</p>
              <div className="space-y-3">
                {order.items.map((item: any) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="relative h-12 w-12 bg-gray-50 dark:bg-white/5 rounded-lg overflow-hidden flex-shrink-0">
                      <Image src={item.product.image} alt={item.product.name} fill className="object-contain p-1" />
                    </div>
                    <div>
                      <p className="text-sm font-bold dark:text-white">{item.product.name}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity} · ${item.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-gray-50 dark:bg-white/5 p-6 rounded-2xl">
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Shipping Destination</p>
               <div className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-300">
                  <FiMapPin className="text-brand-purple mt-1 flex-shrink-0" />
                  <p className="leading-relaxed whitespace-pre-wrap">{order.address}</p>
               </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
