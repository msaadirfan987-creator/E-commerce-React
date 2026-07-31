import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import orderService from '../services/orderService';

const OrderDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOrderDetails = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await orderService.getOrderDetails(id);
      if (data.success) {
        setOrder(data.order);
      }
    } catch (err) {
      console.error('Failed to load order details:', err);
      setError('Could not fetch transaction details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    } else {
      fetchOrderDetails();
    }
  }, [id, user, navigate]);

  const handleCancelOrder = async () => {
    const confirmCancel = window.confirm('Are you sure you want to cancel this order?');
    if (!confirmCancel) return;

    try {
      const data = await orderService.cancelOrder(id);
      if (data.success) {
        alert('Order cancelled successfully.');
        setOrder({ ...order, orderStatus: 'Cancelled' });
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel order.');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-slate-100 text-slate-700';
      case 'Confirmed':
        return 'bg-blue-50 text-blue-700';
      case 'Packed':
        return 'bg-amber-50 text-amber-700';
      case 'Shipped':
        return 'bg-indigo-50 text-indigo-700';
      case 'Out For Delivery':
        return 'bg-purple-50 text-purple-700';
      case 'Delivered':
        return 'bg-emerald-50 text-emerald-700';
      case 'Cancelled':
      case 'Rejected':
        return 'bg-rose-50 text-rose-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center select-none">
        <p className="text-slate-400 font-bold text-xs animate-pulse">Loading order details...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center select-none text-center">
        <p className="text-rose-500 font-bold text-xs">{error || 'Order record not found.'}</p>
        <Link to="/my-orders" className="text-slate-900 text-xs font-bold underline mt-4">Back to My Orders</Link>
      </div>
    );
  }

  const isPending = order.orderStatus === 'Pending';
  const shippingCost = 15.00;
  const subtotal = order.totalPrice;
  const total = subtotal + shippingCost;
  const sellerName = order.seller?.fullName || 'Vendor';

  return (
    <div className="min-h-screen bg-slate-50 py-10 font-sans select-none animate-fadeIn">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Header toolbar */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-200 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-bold text-slate-400 font-mono">#{order.orderNumber}</span>
              <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold ${getStatusColor(order.orderStatus)}`}>
                {order.orderStatus}
              </span>
            </div>
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">Order Invoice Details</h1>
          </div>

          <div className="flex gap-2">
            <Link 
              to="/my-orders" 
              className="px-3 py-1.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-650 font-bold text-xs rounded-lg transition-colors cursor-pointer"
            >
              Back to List
            </Link>
            {isPending && (
              <button 
                onClick={handleCancelOrder}
                className="px-3 py-1.5 bg-rose-550 hover:bg-rose-600 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
              >
                Cancel Order
              </button>
            )}
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          
          {/* LEFT/CENTER DETAILS: Products & Costs */}
          <div className="md:col-span-2 space-y-6">
            
            {/* Products Card */}
            <div className="bg-white border border-slate-250/80 p-5 rounded-lg space-y-4">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">
                Ordered Products
              </h3>

              <div className="divide-y divide-slate-100">
                {order.items.map((item, idx) => (
                  <div key={idx} className="py-3 flex items-center gap-4 first:pt-0 last:pb-0">
                    <img 
                      src={item.image || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=100&q=80'} 
                      alt={item.title} 
                      className="w-12 h-12 rounded object-cover border border-slate-200 shrink-0 bg-slate-50"
                      onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=100&q=80'; }}
                    />
                    <div className="flex-grow min-w-0">
                      <h4 className="text-xs font-bold text-slate-800 truncate">{item.title}</h4>
                      <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Quantity: {item.quantity}</p>
                    </div>
                    <span className="text-xs font-black text-slate-900 shrink-0">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Calculations Card */}
            <div className="bg-white border border-slate-250/80 p-5 rounded-lg space-y-3.5 text-xs font-semibold text-slate-500">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">
                Cost Breakdown
              </h3>
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-slate-800 font-bold">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping Cost</span>
                <span className="text-slate-800 font-bold">${shippingCost.toFixed(2)}</span>
              </div>
              <div className="border-t border-slate-100 pt-2.5 flex justify-between text-sm font-bold text-slate-900">
                <span>Total Bill (COD)</span>
                <span className="text-base font-black text-slate-950">${total.toFixed(2)}</span>
              </div>
            </div>

          </div>

          {/* RIGHT DETAILS: Shipping Address & Merchant info */}
          <div className="md:col-span-1 space-y-6">
            
            {/* Delivery address */}
            <div className="bg-white border border-slate-250/80 p-5 rounded-lg space-y-3">
              <h3 className="text-xs font-bold text-slate-850 uppercase tracking-wider border-b border-slate-100 pb-2">
                Delivery Address
              </h3>
              
              <div className="text-xs font-semibold text-slate-650 space-y-2 leading-relaxed">
                <div>
                  <p className="font-bold text-slate-900">{order.shippingAddress.fullName}</p>
                  <p>{order.shippingAddress.phone}</p>
                  <p className="text-slate-400 text-[10px]">{order.shippingAddress.email}</p>
                </div>
                <div className="pt-2 border-t border-slate-50 text-[11px]">
                  <p>{order.shippingAddress.address}</p>
                  <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                  <p>{order.shippingAddress.country}</p>
                </div>
              </div>
            </div>

            {/* Merchant Details */}
            <div className="bg-white border border-slate-250/80 p-5 rounded-lg space-y-2 text-xs font-semibold text-slate-500">
              <h3 className="text-xs font-bold text-slate-850 uppercase tracking-wider border-b border-slate-100 pb-1.5">
                Merchant Info
              </h3>
              <p className="text-slate-800 font-bold">{sellerName}</p>
              <p className="text-[10px] text-slate-405">{order.seller?.email}</p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default OrderDetailsPage;
