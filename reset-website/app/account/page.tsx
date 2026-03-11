"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { 
  FiShoppingBag, 
  FiArrowRight, 
  FiGrid, 
  FiMapPin, 
  FiUser, 
  FiLogOut,
  FiChevronRight,
  FiClock,
  FiCheckCircle,
  FiXCircle
} from "react-icons/fi";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";

export default function AccountPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tabParam = searchParams.get('tab') || 'dashboard';
  
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState(tabParam);
  const [orders, setOrders] = useState<any[]>([]);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    setActiveTab(tabParam);
  }, [tabParam]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = "/?login=true";
        return;
      }
      setUser(user);

      // Fetch Profile
      const profileRes = await fetch("/api/profile");
      if (profileRes.ok) setProfile(await profileRes.json());

      // Initial Fetch for active tab
      if (activeTab === 'orders') fetchOrders();
      if (activeTab === 'addresses') fetchAddresses();
      
      setLoading(false);
    };
    fetchData();

    // Real-time listener for orders
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'Order' },
        (payload) => {
          console.log('Change received!', payload);
          fetchOrders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, activeTab]);

  const fetchOrders = async () => {
    const response = await fetch("/api/orders/history");
    if (response.ok) setOrders(await response.json());
  };

  const fetchAddresses = async () => {
    const response = await fetch("/api/profile");
    if (response.ok) {
        const data = await response.json();
        if (data.addresses) setAddresses(data.addresses);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
    window.location.href = "/";
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: FiGrid },
    { id: 'orders', label: 'Orders', icon: FiShoppingBag },
    { id: 'addresses', label: 'Addresses', icon: FiMapPin },
    { id: 'details', label: 'Account Details', icon: FiUser },
  ];

  if (loading) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400/5 to-purple-500/5 dark:from-brand-dark dark:to-brand-dark pt-32 pb-24">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar Tabs */}
          <aside className="w-full lg:w-72 flex-shrink-0">
            <div className="backdrop-blur-xl bg-white/40 dark:bg-white/5 p-6 rounded-[2.5rem] border border-white/20 shadow-2xl shadow-black/5">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        router.push(`/account?tab=${tab.id}`, { scroll: false });
                      }}
                      className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all font-black uppercase text-xs tracking-[0.1em] relative overflow-hidden group ${
                        isActive
                          ? "bg-brand-dark dark:bg-white text-white dark:text-brand-dark shadow-xl"
                          : "text-gray-500 hover:bg-white/50 dark:hover:bg-white/5 hover:text-brand-dark dark:hover:text-brand-light"
                      }`}
                    >
                      {isActive && (
                        <motion.div layoutId="activeTab" className="absolute inset-x-0 bottom-0 h-1 bg-brand-orange" />
                      )}
                      <tab.icon size={20} className={isActive ? "text-brand-orange" : ""} />
                      {tab.label}
                    </button>
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

          {/* Main Content Area */}
          <main className="flex-1 space-y-8">
            <AnimatePresence mode="wait">
              {activeTab === 'dashboard' && (
                <motion.div
                  key="dashboard"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <header>
                    <h1 className="text-4xl font-black uppercase tracking-tight dark:text-white">
                      Welcome back, <span className="text-brand-purple">{profile?.displayName?.split(' ')[0] || user?.email?.split('@')[0]}!</span>
                    </h1>
                    <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest mt-2">
                      Control center for your premium kombucha ritual.
                    </p>
                  </header>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-8 backdrop-blur-xl bg-brand-purple/5 rounded-[2.5rem] border border-brand-purple/10">
                       <h3 className="text-sm font-black uppercase text-brand-purple mb-4">Total Orders</h3>
                       <div className="text-5xl font-black dark:text-white">{profile?._count?.orders || orders.length}</div>
                    </div>
                    <div className="p-8 backdrop-blur-xl bg-brand-orange/5 rounded-[2.5rem] border border-brand-orange/10">
                       <h3 className="text-sm font-black uppercase text-brand-orange mb-4">Saved Addresses</h3>
                       <div className="text-5xl font-black dark:text-white">{addresses.length}</div>
                    </div>
                  </div>
                  
                  {/* Latest Order Card */}
                  {orders.length > 0 && (
                    <div className="p-8 backdrop-blur-xl bg-white/40 dark:bg-white/5 rounded-[2.5rem] border border-white/20 shadow-2xl shadow-black/5">
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-black uppercase dark:text-white">Latest Order</h2>
                        <button onClick={() => setActiveTab('orders')} className="text-xs font-black uppercase text-brand-purple hover:underline">View All</button>
                      </div>
                      <div className="flex items-center gap-6 p-6 bg-white dark:bg-white/5 rounded-3xl">
                        <div className="w-16 h-16 rounded-2xl bg-brand-purple/10 flex items-center justify-center text-brand-purple">
                           <FiShoppingBag size={32} />
                        </div>
                        <div>
                          <div className="font-black dark:text-white uppercase text-sm">Order #{(orders[0].id).slice(-6).toUpperCase()}</div>
                          <div className="text-xs text-gray-500 font-bold">Placed on {new Date(orders[0].createdAt).toLocaleDateString()}</div>
                        </div>
                        <div className="ml-auto text-right">
                           <div className="text-lg font-black text-brand-orange italic">₹{orders[0].total.toFixed(2)}</div>
                           <div className="text-[10px] font-black uppercase tracking-widest text-green-500">{orders[0].status}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'orders' && (
                <motion.div
                  key="orders"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <h2 className="text-3xl font-black uppercase dark:text-white">Order History</h2>
                  <div className="space-y-4">
                    {orders.map(order => (
                      <OrderRow key={order.id} order={order} profile={profile} />
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'addresses' && (
                <motion.div
                  key="addresses"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-black uppercase dark:text-white">Shipping Addresses</h2>
                    <button 
                      onClick={() => setShowAddAddress(true)}
                      className="px-6 py-3 bg-brand-dark dark:bg-white text-white dark:text-brand-dark rounded-xl font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-all shadow-lg"
                    >
                      Add New
                    </button>
                  </div>

                  <AnimatePresence>
                    {showAddAddress && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-xl bg-black/40"
                      >
                        <motion.div 
                          initial={{ scale: 0.9, y: 20 }}
                          animate={{ scale: 1, y: 0 }}
                          className="bg-white dark:bg-brand-dark p-8 rounded-[2.5rem] border border-white/20 shadow-2xl max-w-lg w-full"
                        >
                          <h3 className="text-2xl font-black uppercase dark:text-white mb-6">Add New Address</h3>
                          <form onSubmit={async (e) => {
                            e.preventDefault();
                            const formData = new FormData(e.currentTarget);
                            const data = Object.fromEntries(formData);
                            const res = await fetch("/api/profile/address", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ ...data, isDefault: addresses.length === 0 })
                            });
                            if (res.ok) {
                              toast.success("Address added!");
                              setShowAddAddress(false);
                              fetchAddresses();
                            } else {
                              const errorText = await res.text();
                              toast.error(`Failed to save address: ${errorText}`);
                            }
                          }} className="space-y-4">
                            <input name="street1" placeholder="Street Address" required autoComplete="off" className="w-full p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-black/5 dark:border-white/10 outline-none" />
                            <input name="apt" placeholder="Apt, Suite, etc. (Optional)" autoComplete="off" className="w-full p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-black/5 dark:border-white/10 outline-none" />
                            <div className="grid grid-cols-2 gap-4">
                              <input name="city" placeholder="City" required autoComplete="off" className="w-full p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-black/5 dark:border-white/10 outline-none" />
                              <input name="state" placeholder="State" required autoComplete="off" className="w-full p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-black/5 dark:border-white/10 outline-none" />
                            </div>
                            <input name="pin" placeholder="PIN Code" required autoComplete="off" className="w-full p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-black/5 dark:border-white/10 outline-none" />
                            <div className="flex gap-4 mt-8">
                              <button type="button" onClick={() => setShowAddAddress(false)} className="flex-1 py-4 font-black uppercase text-xs tracking-widest text-gray-400">Cancel</button>
                              <button type="submit" className="flex-1 py-4 bg-brand-purple text-white rounded-xl font-black uppercase text-xs tracking-widest shadow-lg">Save Address</button>
                            </div>
                          </form>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    {addresses.length === 0 ? (
                      <div className="md:col-span-2 text-center py-12 backdrop-blur-xl bg-white/20 dark:bg-white/5 rounded-[2.5rem] border border-dashed border-white/40">
                         <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">No addresses saved yet.</p>
                      </div>
                    ) : (
                      addresses.map((addr: any) => (
                        <div key={addr.id} className={`p-8 backdrop-blur-xl bg-white/40 dark:bg-white/5 rounded-[2.5rem] border-2 shadow-2xl relative ${addr.isDefault ? "border-brand-purple/20" : "border-transparent"}`}>
                          {addr.isDefault && (
                            <div className="absolute top-6 right-6 text-brand-purple">
                               <FiCheckCircle size={24} />
                            </div>
                          )}
                          <span className={`inline-block px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest mb-4 ${addr.isDefault ? "bg-brand-purple/10 text-brand-purple" : "bg-gray-100 text-gray-400"}`}>
                            {addr.isDefault ? "Default" : "Saved Address"}
                          </span>
                          <h3 className="text-xl font-black uppercase dark:text-white mb-2">{profile?.displayName || profile?.fullName}</h3>
                          <p className="text-sm text-gray-500 font-bold leading-relaxed">
                            {addr.street1}{addr.apt ? `, ${addr.apt}` : ""}<br />
                            {addr.city}, {addr.state} {addr.pin}<br />
                            {addr.country}
                          </p>
                          <div className="mt-8 flex gap-4">
                             <button className="text-[10px] font-black uppercase tracking-widest text-brand-purple hover:underline">Edit</button>
                             <button 
                               onClick={async () => {
                                 const res = await fetch("/api/profile/address", {
                                   method: "DELETE",
                                   body: JSON.stringify({ id: addr.id })
                                 });
                                 if (res.ok) {
                                   toast.success("Address removed");
                                   fetchAddresses();
                                 }
                               }}
                               className="text-[10px] font-black uppercase tracking-widest text-red-500 hover:underline"
                             >
                               Remove
                             </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === 'details' && (
                <motion.div
                  key="details"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                   {/* Redirect to details sub-component or render it here */}
                   <div className="text-center py-24">
                      <p className="text-gray-400 font-black uppercase text-xs tracking-widest">Redirecting to profile management...</p>
                      <Link href="/account/details" className="text-brand-purple underline mt-4 inline-block">Go to Profile Settings</Link>
                   </div>
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
}

function OrderRow({ order, profile }: { order: any, profile: any }) {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <div className="p-6 backdrop-blur-xl bg-white/40 dark:bg-white/5 rounded-[2rem] border border-white/20 shadow-xl overflow-hidden relative group transition-all duration-500">
      <div className="flex flex-col md:flex-row md:items-center gap-6">
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-3">
            <span className="text-lg font-black dark:text-white tracking-widest uppercase">Order #{(order.id).slice(-6).toUpperCase()}</span>
            <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${
              order.status === 'paid' ? 'bg-green-500/10 text-green-500' : 
              order.status === 'cancelled' ? 'bg-red-500/10 text-red-500' :
              'bg-brand-orange/10 text-brand-orange'
            }`}>
              {order.status}
            </span>
          </div>
          <p className="text-[10px] font-bold text-gray-400 flex items-center gap-1">
            <FiClock /> {new Date(order.createdAt).toDateString()}
          </p>
        </div>
        
        <div className="flex items-center gap-8">
          <div className="text-right">
            <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Amount</p>
            <p className="text-xl font-black text-brand-purple italic">₹{order.total.toFixed(2)}</p>
          </div>
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className={`w-12 h-12 rounded-full bg-brand-dark dark:bg-white text-white dark:text-brand-dark flex items-center justify-center transition-all shadow-lg ${isExpanded ? "rotate-90 bg-brand-purple text-white" : "hover:bg-brand-purple dark:hover:bg-brand-purple dark:hover:text-white"}`}
          >
            <FiArrowRight size={20} />
          </button>
        </div>
      </div>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-8 pt-8 border-t border-black/5 dark:border-white/10">
                <div className="grid md:grid-cols-2 gap-12">
                  <div className="space-y-4">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-purple">Order Items</h4>
                      {order.items?.map((item: any) => (
                        <div key={item.id} className="flex items-center gap-4 bg-white/50 dark:bg-white/5 p-4 rounded-2xl">
                          <div className="w-12 h-12 bg-white rounded-xl shadow-sm overflow-hidden flex items-center justify-center">
                              <img src={item.product?.image} alt={item.product?.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1">
                              <p className="text-xs font-black uppercase dark:text-white">{item.product?.name}</p>
                              <p className="text-[10px] text-gray-500 font-bold">₹{item.price} x {item.quantity}</p>
                          </div>
                          <div className="text-sm font-black dark:text-white">₹{(item.price * item.quantity).toFixed(2)}</div>
                        </div>
                      ))}
                  </div>
                  <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4 text-[10px] font-bold">
                        <div>
                            <p className="uppercase text-gray-400 mb-1 tracking-widest">Shipping to</p>
                            <p className="dark:text-white">{order.address || "Uttar Pradesh, 201301"}</p>
                        </div>
                        <div>
                            <p className="uppercase text-gray-400 mb-1 tracking-widest">Payment</p>
                            <p className="dark:text-white">{order.paymentMethod || "Prepaid (PhonePe)"}</p>
                        </div>
                        <div>
                            <p className="uppercase text-gray-400 mb-1 tracking-widest">Phone</p>
                            <p className="dark:text-white">{profile?.phone || "+91 98765 43210"}</p>
                        </div>
                        <div className="text-right">
                            <p className="uppercase text-gray-400 mb-1 tracking-widest">Subtotal</p>
                            <p className="text-base font-black text-brand-orange italic">₹{(order.total - 50).toFixed(2)}</p>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <button className="flex-1 py-3 bg-brand-dark dark:bg-white text-white dark:text-brand-dark rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-brand-purple dark:hover:bg-brand-purple dark:hover:text-white transition-all">Support</button>
                        <button className="px-6 py-3 border border-black/10 dark:border-white/10 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-red-50 hover:text-white transition-all">Cancel</button>
                      </div>
                  </div>
                </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
