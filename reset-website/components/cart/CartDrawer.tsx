"use client";

import { useCart } from "@/lib/store/useCart";
import { FiX, FiMinus, FiPlus, FiTrash2, FiShoppingBag } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, updateQuantity, removeItem, getTotalPrice, getTotalItems } = useCart();
  const totalPrice = getTotalPrice();
  const totalItems = getTotalItems();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-brand-dark/40 backdrop-blur-sm z-[100]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-brand-dark shadow-2xl z-[101] flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-100 dark:border-white/10 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <FiShoppingBag className="text-brand-purple" size={24} />
                <h2 className="text-2xl font-black uppercase tracking-tight text-brand-dark dark:text-brand-light">
                  Your Cart ({totalItems})
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-gray-400"
              >
                <FiX size={24} />
              </button>
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-20 h-20 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center text-gray-400">
                    <FiShoppingBag size={40} />
                  </div>
                  <h3 className="text-xl font-bold dark:text-white">Your cart is empty</h3>
                  <p className="text-gray-500 max-w-[200px]">Looks like you haven't added any resets yet.</p>
                  <Link
                    href="/#products"
                    onClick={onClose}
                    className="px-8 py-3 bg-brand-dark dark:bg-brand-light text-brand-light dark:text-brand-dark rounded-full font-bold uppercase tracking-widest hover:scale-105 transition-transform"
                  >
                    Start Shopping
                  </Link>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex gap-4 group">
                    <div className="relative h-24 w-24 bg-gray-50 dark:bg-white/5 rounded-2xl overflow-hidden flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-contain p-2"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <div className="flex justify-between items-start">
                          <h4 className="font-bold text-brand-dark dark:text-brand-light">{item.name}</h4>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                        <p className="text-sm font-black text-brand-purple mt-1">${item.price}</p>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center border border-gray-100 dark:border-white/10 rounded-full p-1 bg-gray-50 dark:bg-white/5">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 hover:text-brand-purple transition-colors dark:text-gray-400"
                          >
                            <FiMinus size={14} />
                          </button>
                          <span className="w-8 text-center text-xs font-bold dark:text-white">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 hover:text-brand-purple transition-colors dark:text-gray-400"
                          >
                            <FiPlus size={14} />
                          </button>
                        </div>
                        <p className="text-sm font-bold dark:text-white">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t border-gray-100 dark:border-white/10 bg-gray-50/50 dark:bg-white/5">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-500 font-medium">Subtotal</span>
                  <span className="font-bold dark:text-white">${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-6">
                  <span className="text-gray-500 font-medium">Shipping</span>
                  <span className="text-xs font-bold uppercase text-brand-orange">Calculated at checkout</span>
                </div>
                <Link
                  href="/checkout"
                  onClick={onClose}
                  className="block w-full py-4 bg-brand-dark dark:bg-brand-light text-brand-light dark:text-brand-dark text-center rounded-2xl font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-brand-dark/10 dark:shadow-none"
                >
                  Checkout Now
                </Link>
                <Link
                  href="/#products"
                  onClick={onClose}
                  className="block w-full mt-4 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-brand-dark dark:hover:text-brand-light transition-colors text-center"
                >
                  Continue Shopping
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
