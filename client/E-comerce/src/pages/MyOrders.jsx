import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import orderService from '../services/orderService';

const MyOrders = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await orderService.getBuyerOrders();
      if (data.success) {
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error('Failed to load buyer orders:', err);
      setError('Connection issue loading orders. Try logging in again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    } else {
      fetchOrders();
    }
  }, [user, navigate]);

  const handleCancelOrder = async (orderId) => {
    const confirmCancel = window.confirm('Are you sure you want to cancel this order? This will return the inventory to stock.');
    if (!confirmCancel) return;

    try {
      const data = await orderService.cancelOrder(orderId);
      if (data.success) {
        alert('Order cancelled successfully.');
        // Refresh local orders list
        setOrders(orders.map((o) => o._id === orderId ? { ...o, orderStatus: 'Cancelled' } : o));
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

  return (
    <div className="min-h-screen bg-slate-50 py-10 font-sans select-none animate-fadeIn">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="mb-8 border-b border-slate-200 pb-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">My Orders</h1>
            <p className="text-xs text-slate-400 font-bold">Inspect shipment trackers, trace receipts, or request cancellations.</p>
          </div>
          <Link 
            to="/shop" 
            className="px-3.5 py-1.5 border border-slate-200 hover:border-slate-350 bg-white text-slate-650 hover:text-slate-900 transition-colors text-xs font-bold rounded-lg cursor-pointer"
          >
            Continue Shopping
          </Link>
        </div>

        {/* Content Box */}
        <div className="bg-white border border-slate-250/80 rounded-lg overflow-hidden shadow-xs">
          
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/50">
                  <th className="py-3 px-4 text-[9px] font-bold text-slate-400 uppercase tracking-wider">Order ID</th>
                  <th className="py-3 px-4 text-[9px] font-bold text-slate-400 uppercase tracking-wider">Merchant</th>
                  <th className="py-3 px-4 text-[9px] font-bold text-slate-400 uppercase tracking-wider">Total Price</th>
                  <th className="py-3 px-4 text-[9px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="py-3 px-4 text-[9px] font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="py-12 text-center text-xs font-bold text-slate-400 animate-pulse">
                      Loading your order history...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="5" className="py-12 text-center text-xs font-bold text-rose-500">
                      {error}
                    </td>
                  </tr>
                ) : orders.length > 0 ? (
                  orders.map((order) => {
                    const orderId = order._id;
                    const isPending = order.orderStatus === 'Pending';
                    const sellerName = order.seller?.fullName || 'Vendor';

                    return (
                      <tr key={orderId} className="hover:bg-slate-50/30 transition-colors">
                        
                        <td className="py-4 px-4">
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-slate-800 font-mono">
                              #{order.orderNumber}
                            </span>
                            <span className="text-[9px] text-slate-400 font-bold mt-0.5">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </td>

                        <td className="py-4 px-4 text-xs font-bold text-slate-650">
                          {sellerName}
                        </td>

                        <td className="py-4 px-4 text-xs font-black text-slate-850">
                          ${order.totalPrice.toFixed(2)}
                        </td>

                        <td className="py-4 px-4">
                          <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-bold ${getStatusColor(order.orderStatus)}`}>
                            {order.orderStatus}
                          </span>
                        </td>

                        <td className="py-4 px-4 text-right space-x-3 text-xs font-bold">
                          <Link 
                            to={`/my-orders/${orderId}`}
                            className="text-slate-550 hover:text-slate-900 transition-colors"
                          >
                            Details
                          </Link>
                          {isPending && (
                            <button
                              onClick={() => handleCancelOrder(orderId)}
                              className="text-rose-500 hover:text-rose-700 transition-colors cursor-pointer"
                            >
                              Cancel
                            </button>
                          )}
                        </td>

                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="py-12 text-center text-xs font-bold text-slate-400">
                      You have not placed any orders yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>

      </div>
    </div>
  );
};

export default MyOrders;
