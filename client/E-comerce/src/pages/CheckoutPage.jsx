import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import orderService from '../services/orderService';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems, clearCart } = useCart();

  const { register, handleSubmit, formState: { errors, isSubmitting }, setValue } = useForm();

  // Redirect to Auth if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/auth');
    } else {
      // Pre-fill profile values if logged in
      if (user.fullName) setValue('fullName', user.fullName);
      if (user.email) setValue('email', user.email);
    }
  }, [user, navigate, setValue]);

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center py-12 select-none">
        <p className="text-sm font-bold text-slate-400">Your cart is empty. Cannot checkout.</p>
        <Link to="/shop" className="text-xs font-bold text-slate-900 underline mt-4">Continue Shopping</Link>
      </div>
    );
  }

  // Calculate pricing metrics
  const calculateSubtotal = () => {
    return cartItems.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);
  };

  const subtotal = calculateSubtotal();
  const shippingCost = 15.00; // Flat-rate shipping
  const total = subtotal + shippingCost;

  const onSubmit = async (data) => {
    try {
      const orderPayload = {
        items: cartItems.map((item) => ({
          product: item.id,
          quantity: item.quantity,
        })),
        shippingAddress: {
          fullName: data.fullName,
          phone: data.phone,
          email: data.email,
          country: data.country,
          city: data.city,
          address: data.address,
          postalCode: data.postalCode,
        },
      };

      const response = await orderService.createOrder(orderPayload);

      if (response.success) {
        clearCart();
        // Extract order number (if split-seller, take the first or pass them combined)
        const orderNum = response.orderNumbers && response.orderNumbers.length > 0 
          ? response.orderNumbers.join(',') 
          : 'CONFIRMED';
        navigate(`/order-success/${orderNum}`);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to place order. Check product stock or connect database.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 font-sans select-none animate-fadeIn">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Checkout Header */}
        <div className="mb-8 border-b border-slate-200 pb-4">
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Checkout</h1>
          <p className="text-xs text-slate-400 font-bold">Secure checkout interface. Cash on Delivery only.</p>
        </div>

        {/* Layout Grid */}
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT SIDE: Billing / Shipping forms */}
          <div className="lg:col-span-7 bg-white border border-slate-250/80 p-6 rounded-lg space-y-6">
            
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">
              Shipping Information
            </h3>

            <div className="space-y-4 text-xs">
              
              {/* Full Name */}
              <div>
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wide block mb-1">Full Name</label>
                <input 
                  type="text" 
                  {...register('fullName', { required: 'Full name is required.' })}
                  placeholder="e.g. John Doe"
                  className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:border-slate-400 placeholder-slate-300 font-semibold text-slate-700 bg-slate-50/50"
                />
                {errors.fullName && <p className="text-[9px] text-rose-500 font-bold mt-1">{errors.fullName.message}</p>}
              </div>

              {/* Email and Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wide block mb-1">Email Address</label>
                  <input 
                    type="email" 
                    {...register('email', { 
                      required: 'Email address is required.',
                      pattern: { value: /^\S+@\S+$/i, message: 'Invalid email pattern.' }
                    })}
                    placeholder="john@example.com"
                    className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:border-slate-400 placeholder-slate-300 font-semibold text-slate-700 bg-slate-50/50"
                  />
                  {errors.email && <p className="text-[9px] text-rose-500 font-bold mt-1">{errors.email.message}</p>}
                </div>
                
                <div>
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wide block mb-1">Phone Number</label>
                  <input 
                    type="text" 
                    {...register('phone', { required: 'Phone number is required.' })}
                    placeholder="e.g. +92 300 1234567"
                    className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:border-slate-400 placeholder-slate-300 font-semibold text-slate-700 bg-slate-50/50"
                  />
                  {errors.phone && <p className="text-[9px] text-rose-500 font-bold mt-1">{errors.phone.message}</p>}
                </div>
              </div>

              {/* Country, City, Postal Code */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wide block mb-1">Country</label>
                  <input 
                    type="text" 
                    {...register('country', { required: 'Country is required.' })}
                    placeholder="e.g. Pakistan"
                    className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:border-slate-400 placeholder-slate-300 font-semibold text-slate-700 bg-slate-50/50"
                  />
                  {errors.country && <p className="text-[9px] text-rose-500 font-bold mt-1">{errors.country.message}</p>}
                </div>

                <div>
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wide block mb-1">City</label>
                  <input 
                    type="text" 
                    {...register('city', { required: 'City is required.' })}
                    placeholder="e.g. Lahore"
                    className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:border-slate-400 placeholder-slate-300 font-semibold text-slate-700 bg-slate-50/50"
                  />
                  {errors.city && <p className="text-[9px] text-rose-500 font-bold mt-1">{errors.city.message}</p>}
                </div>

                <div>
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wide block mb-1">Postal Code</label>
                  <input 
                    type="text" 
                    {...register('postalCode', { required: 'Postal code is required.' })}
                    placeholder="e.g. 54000"
                    className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:border-slate-400 placeholder-slate-300 font-semibold text-slate-700 bg-slate-50/50"
                  />
                  {errors.postalCode && <p className="text-[9px] text-rose-500 font-bold mt-1">{errors.postalCode.message}</p>}
                </div>
              </div>

              {/* Complete Address */}
              <div>
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wide block mb-1">Complete Address</label>
                <textarea 
                  rows="3"
                  {...register('address', { required: 'Street address is required.' })}
                  placeholder="Apartment number, street, sector, or block details"
                  className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:border-slate-400 placeholder-slate-300 font-semibold text-slate-700 bg-slate-50/50 resize-none"
                />
                {errors.address && <p className="text-[9px] text-rose-500 font-bold mt-1">{errors.address.message}</p>}
              </div>

            </div>

            {/* Payment Method Panel */}
            <div className="pt-4 border-t border-slate-100">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-3">
                Payment Method
              </h3>
              
              <div className="flex items-center justify-between p-3.5 border border-slate-200 rounded-lg bg-slate-55/30 text-xs">
                <div className="flex items-center gap-2">
                  <input 
                    type="radio" 
                    checked 
                    readOnly
                    className="text-slate-900 focus:ring-0" 
                  />
                  <span className="font-bold text-slate-700">Cash on Delivery (COD)</span>
                </div>
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Default</span>
              </div>
            </div>

          </div>

          {/* RIGHT SIDE: Order Summary */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-white border border-slate-250/80 p-5 rounded-lg space-y-4">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">
                Order Summary
              </h3>

              {/* Items List */}
              <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto custom-scrollbar pr-1">
                {cartItems.map((item) => (
                  <div key={item.id} className="py-2.5 flex items-center gap-3 first:pt-0 last:pb-0">
                    <img 
                      src={item.img || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=100&q=80'} 
                      alt={item.name} 
                      className="w-10 h-10 rounded object-cover border border-slate-200 shrink-0 bg-slate-50"
                      onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=100&q=80'; }}
                    />
                    <div className="flex-grow min-w-0">
                      <h4 className="text-[11px] font-bold text-slate-800 truncate">{item.name}</h4>
                      <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-xs font-bold text-slate-900 shrink-0">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Calculations */}
              <div className="border-t border-slate-100 pt-3 space-y-2 text-xs font-semibold text-slate-550">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-slate-850 font-bold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping Cost</span>
                  <span className="text-slate-850 font-bold">${shippingCost.toFixed(2)}</span>
                </div>
                <div className="border-t border-slate-100 pt-2.5 flex justify-between text-sm font-bold text-slate-900">
                  <span>Total Amount</span>
                  <span className="text-lg font-black text-slate-950">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-350 text-white font-bold text-xs py-3 rounded-lg transition-colors shadow-sm cursor-pointer mt-4"
              >
                {isSubmitting ? 'Placing Order...' : 'Place Order'}
              </button>
            </div>

          </div>

        </form>

      </div>
    </div>
  );
};

export default CheckoutPage;
