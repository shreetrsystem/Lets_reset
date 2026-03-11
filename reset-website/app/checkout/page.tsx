"use client";

import { useCart } from "@/lib/store/useCart";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FiChevronLeft, FiLock, FiCheck, FiArrowRight, FiInfo } from "react-icons/fi";
import Link from "next/link";
import { toast } from "react-hot-toast";

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

export default function CheckoutPage() {
  const { items, getTotalPrice, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const supabase = createClient();

  // Form State
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState({
    street: "",
    apt: "",
    city: "",
    state: "Uttar Pradesh",
    pin: "",
  });
  const [orderNotes, setOrderNotes] = useState("");
  const [discountCode, setDiscountCode] = useState("");
  const [isDiscountApplied, setIsDiscountApplied] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please login to checkout");
        router.push("/?login=true&next=/checkout");
        return;
      }
      setUser(user);
      setEmail(user.email || "");
    };
    checkUser();
  }, [supabase, router]);

  const handleApplyDiscount = () => {
    if (discountCode.toUpperCase() === "RESET10") {
      setIsDiscountApplied(true);
      toast.success("Discount applied! 10% off", { icon: "🎉" });
    } else {
      toast.error("Invalid discount code");
    }
  };

  const calculateTotal = () => {
    const subtotal = getTotalPrice();
    const discount = isDiscountApplied ? subtotal * 0.1 : 0;
    return subtotal - discount;
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const fullAddress = `${address.street}, ${address.apt ? address.apt + ', ' : ''}${address.city}, ${address.state} - ${address.pin}, India`;

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          address: fullAddress,
          total: calculateTotal(),
          orderNotes,
          discountCode: isDiscountApplied ? discountCode : null,
        }),
      });

      if (!response.ok) throw new Error("Failed to create order");

      toast.success("Order placed successfully!", {
          style: {
              borderRadius: '10px',
              background: '#111',
              color: '#fff',
          },
      });
      clearCart();
      router.push("/account");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-brand-light dark:bg-brand-dark flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-4xl font-black uppercase mb-4 dark:text-white">Your cart is empty</h1>
        <Link href="/" className="px-8 py-4 bg-brand-dark dark:bg-brand-light text-brand-light dark:text-brand-dark rounded-2xl font-black uppercase tracking-widest hover:scale-105 transition-all">Go back to shop</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400/5 to-purple-500/5 dark:from-brand-dark dark:to-brand-dark pt-32 pb-24">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left Column: Checkout Forms */}
          <div className="flex-1 space-y-8">
            <div className="flex items-center justify-between mb-4">
               <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-brand-dark dark:hover:text-brand-light transition-colors font-bold group">
                <FiChevronLeft className="group-hover:-translate-x-1 transition-transform" />
                Return to Cart
              </Link>
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-tighter text-gray-400">
                <span>Cart</span>
                <FiArrowRight />
                <span className="text-brand-purple">Information</span>
                <FiArrowRight />
                <span>Payment</span>
              </div>
            </div>

            <form onSubmit={handleCheckout} className="space-y-8">
              {/* Contact Information */}
              <section className="backdrop-blur-xl bg-white/40 dark:bg-white/5 p-8 rounded-[2.5rem] border border-white/20 shadow-2xl shadow-black/5">
                <h2 className="text-2xl font-black uppercase tracking-tight mb-6 dark:text-white">Contact Information</h2>
                <div className="space-y-4">
                  <div className="relative group">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email Address"
                      className="w-full p-4 rounded-xl bg-white/50 dark:bg-white/5 border border-white/20 focus:border-brand-purple focus:ring-4 focus:ring-brand-purple/10 outline-none transition-all dark:text-white placeholder:text-gray-400"
                    />
                  </div>
                  <div className="relative group">
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Phone Number (optional)"
                      className="w-full p-4 rounded-xl bg-white/50 dark:bg-white/5 border border-white/20 focus:border-brand-purple focus:ring-4 focus:ring-brand-purple/10 outline-none transition-all dark:text-white placeholder:text-gray-400"
                    />
                  </div>
                </div>
              </section>

              {/* Shipping Address */}
              <section className="backdrop-blur-xl bg-white/40 dark:bg-white/5 p-8 rounded-[2.5rem] border border-white/20 shadow-2xl shadow-black/5">
                <h2 className="text-2xl font-black uppercase tracking-tight mb-6 dark:text-white">Shipping Address</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <input
                      type="text"
                      required
                      placeholder="Street Address"
                      value={address.street}
                      onChange={(e) => setAddress({...address, street: e.target.value})}
                      className="w-full p-4 rounded-xl bg-white/50 dark:bg-white/5 border border-white/20 focus:border-brand-purple focus:ring-4 focus:ring-brand-purple/10 outline-none transition-all dark:text-white placeholder:text-gray-400"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <input
                      type="text"
                      placeholder="Apartment, suite, etc. (optional)"
                      value={address.apt}
                      onChange={(e) => setAddress({...address, apt: e.target.value})}
                      className="w-full p-4 rounded-xl bg-white/50 dark:bg-white/5 border border-white/20 focus:border-brand-purple focus:ring-4 focus:ring-brand-purple/10 outline-none transition-all dark:text-white placeholder:text-gray-400"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      required
                      placeholder="City"
                      value={address.city}
                      onChange={(e) => setAddress({...address, city: e.target.value})}
                      className="w-full p-4 rounded-xl bg-white/50 dark:bg-white/5 border border-white/20 focus:border-brand-purple focus:ring-4 focus:ring-brand-purple/10 outline-none transition-all dark:text-white placeholder:text-gray-400"
                    />
                  </div>
                  <div>
                    <select
                      required
                      value={address.state}
                      onChange={(e) => setAddress({...address, state: e.target.value})}
                      className="w-full p-4 rounded-xl bg-white/50 dark:bg-white/5 border border-white/20 focus:border-brand-purple outline-none transition-all dark:text-white appearance-none"
                    >
                      {INDIAN_STATES.map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <input
                      type="text"
                      required
                      placeholder="PIN Code"
                      value={address.pin}
                      onChange={(e) => setAddress({...address, pin: e.target.value})}
                      className="w-full p-4 rounded-xl bg-white/50 dark:bg-white/5 border border-white/20 focus:border-brand-purple outline-none transition-all dark:text-white placeholder:text-gray-400"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      disabled
                      value="India"
                      className="w-full p-4 rounded-xl bg-gray-100 dark:bg-white/5 border border-white/10 text-gray-400 outline-none"
                    />
                  </div>
                </div>
              </section>

              {/* Order Notes */}
              <section className="backdrop-blur-xl bg-white/40 dark:bg-white/5 p-8 rounded-[2.5rem] border border-white/20 shadow-2xl shadow-black/5">
                <h2 className="text-2xl font-black uppercase tracking-tight mb-4 dark:text-white">Order Notes</h2>
                <textarea
                  placeholder="Special instructions for delivery (optional)"
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  className="w-full p-4 rounded-xl bg-white/50 dark:bg-white/5 border border-white/20 focus:border-brand-purple outline-none transition-all dark:text-white min-h-[100px] placeholder:text-gray-400"
                />
              </section>

              {/* Secure Checkout */}
              <div className="p-8 backdrop-blur-xl bg-brand-purple/5 rounded-[2.5rem] border border-brand-purple/20">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-brand-purple flex items-center justify-center text-white shadow-lg shadow-brand-purple/30">
                    <FiLock size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black uppercase dark:text-white">Secure Checkout</h3>
                    <p className="text-sm text-gray-500">Your data is always protected.</p>
                  </div>
                </div>
                
                <div className="flex flex-col gap-3 mb-8">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" required className="w-5 h-5 rounded border-gray-300 text-brand-purple focus:ring-brand-purple" />
                    <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-brand-dark dark:group-hover:text-white transition-colors">I agree to the Terms & Conditions</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-brand-purple focus:ring-brand-purple" />
                    <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-brand-dark dark:group-hover:text-white transition-colors">Save my information for a faster checkout</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-6 bg-gradient-to-r from-brand-orange to-rose-500 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-lg hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 shadow-2xl shadow-brand-orange/20 flex items-center justify-center gap-3"
                >
                  {loading ? "Processing..." : (
                    <>
                      <span>Pay ₹{calculateTotal().toFixed(2)} Securely</span>
                      <FiCheck size={20} />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:w-[450px]">
            <div className="lg:sticky lg:top-32 space-y-6">
              <section className="backdrop-blur-2xl bg-white/40 dark:bg-white/5 p-8 rounded-[2.5rem] border border-white/20 shadow-2xl shadow-black/5 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-purple/10 rounded-full filter blur-3xl -mr-32 -mt-32"></div>
                
                <h2 className="text-2xl font-black uppercase tracking-tight mb-8 dark:text-white">Order Summary</h2>
                
                <div className="max-h-[300px] overflow-y-auto pr-2 space-y-6 mb-8 scrollbar-thin scrollbar-thumb-brand-purple/20">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4 group">
                      <div className="relative h-20 w-20 bg-white dark:bg-white/5 rounded-2xl overflow-hidden flex-shrink-0 border border-black/5 dark:border-white/10 p-2 group-hover:scale-110 transition-transform">
                        <Image src={item.image} alt={item.name} fill className="object-contain" />
                      </div>
                      <div className="flex-1 flex flex-col justify-center">
                        <div className="flex justify-between font-black text-brand-dark dark:text-brand-light">
                          <span className="truncate max-w-[180px]">{item.name}</span>
                          <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                        <p className="text-sm font-bold text-gray-400 italic">Qty: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Discount Code */}
                <div className="mb-8 pt-6 border-t border-black/5 dark:border-white/10">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Discount Code"
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value)}
                      className="flex-1 p-4 rounded-xl bg-white/50 dark:bg-white/5 border border-white/20 focus:border-brand-purple outline-none transition-all dark:text-white placeholder:text-gray-400 uppercase font-black tracking-widest text-sm"
                    />
                    <button
                      type="button"
                      onClick={handleApplyDiscount}
                      className="px-6 rounded-xl bg-brand-dark dark:bg-white text-white dark:text-brand-dark font-black uppercase text-xs tracking-widest hover:bg-brand-purple dark:hover:bg-brand-purple dark:hover:text-white transition-all shadow-lg"
                    >
                      Apply
                    </button>
                  </div>
                  <p className="mt-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest px-1">
                    Try <span className="text-brand-purple">RESET10</span> for 10% off
                  </p>
                </div>

                <div className="space-y-4 pt-6 border-t border-black/5 dark:border-white/10 relative z-10">
                  <div className="flex justify-between text-gray-500 font-bold">
                    <span>Subtotal</span>
                    <span className="text-brand-dark dark:text-white">₹{getTotalPrice().toFixed(2)}</span>
                  </div>
                  {isDiscountApplied && (
                    <div className="flex justify-between text-brand-purple font-black">
                      <span>Discount (10%)</span>
                      <span>-₹{(getTotalPrice() * 0.1).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-500 font-bold">
                    <span>Shipping</span>
                    <span className="text-brand-orange uppercase text-sm">Calculated at next step</span>
                  </div>
                  <div className="flex justify-between text-3xl font-black border-t border-black/5 dark:border-white/10 pt-6">
                    <span className="text-brand-dark dark:text-white">Total</span>
                    <span className="text-brand-orange italic">₹{calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
              </section>

              <div className="flex items-center gap-3 p-6 bg-white/30 dark:bg-white/5 rounded-3xl border border-white/20">
                <FiInfo className="text-brand-purple flex-shrink-0" />
                <p className="text-[10px] font-bold uppercase tracking-widest leading-relaxed text-gray-500">
                  By completing your purchase you agree to our <Link href="#" className="underline">Refund Policy</Link> and <Link href="#" className="underline">Terms of Service</Link>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
