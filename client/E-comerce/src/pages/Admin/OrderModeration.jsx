import React, { useState, useEffect } from 'react';
import { Search, RotateCcw, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const OrderModeration = () => {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const orderStatuses = [
    'Pending',
    'Confirmed',
    'Packed',
    'Shipped',
    'Out For Delivery',
    'Delivered',
    'Cancelled',
    'Rejected'
  ];

  const paymentStatuses = [
    'Pending',
    'Paid',
    'Refunded'
  ];

  const fetchOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_URL}/api/admin/orders`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setOrders(data.orders || []);
      } else {
        setError(data.message || 'Failed to load order logs.');
      }
    } catch (err) {
      setError('Connection issues reaching admin server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  const handleUpdateStatus = async (orderId, newOrderStatus, newPaymentStatus) => {
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`${API_URL}/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          orderStatus: newOrderStatus,
          paymentStatus: newPaymentStatus
        }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setSuccess('Order parameters updated successfully.');
        setTimeout(() => setSuccess(''), 2000);
        
        // Update locally
        setOrders(orders.map(o => o._id === orderId ? { 
          ...o, 
          orderStatus: newOrderStatus || o.orderStatus,
          paymentStatus: newPaymentStatus || o.paymentStatus
        } : o));

        // Update active selection
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder({
            ...selectedOrder,
            orderStatus: newOrderStatus || selectedOrder.orderStatus,
            paymentStatus: newPaymentStatus || selectedOrder.paymentStatus
          });
        }
      } else {
        alert(data.message || 'Failed to update order status.');
      }
    } catch (err) {
      alert('Error updating order metadata.');
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

  const filtered = orders.filter((o) => {
    const buyerName = o.buyer?.fullName || '';
    const orderNum = o.orderNumber || '';
    const matchesSearch = orderNum.toLowerCase().includes(search.toLowerCase()) || 
                          buyerName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || o.orderStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 select-none animate-fadeIn">
      
      {/* Title */}
      <div className="pb-4 border-b border-slate-200">
        <h2 className="text-base font-black text-slate-900 tracking-tight uppercase">Platform Orders</h2>
        <p className="text-xs text-slate-400 font-bold">Track customer order registries and perform administrative overrides on transaction statuses.</p>
      </div>

      {success && (
        <div className="bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs font-bold p-3 rounded-lg animate-fadeIn">
          {success}
        </div>
      )}

      {error && (
        <div className="bg-rose-50 border border-rose-100 text-rose-650 text-xs font-bold p-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Table Section */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Controls */}
          <div className="bg-white border border-slate-200 p-4 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
            <div className="w-full sm:max-w-xs flex items-center rounded-lg border border-slate-200 bg-slate-50/50 px-2.5 py-1.5 focus-within:border-slate-400">
              <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <input 
                type="text" 
                placeholder="Search by order ID or customer..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-2 text-xs font-semibold bg-transparent focus:outline-none text-slate-700 placeholder-slate-400"
              />
            </div>

            <div className="flex items-center gap-1.5 text-xs font-bold">
              <span className="text-slate-400">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-slate-200 bg-white px-2 py-1 rounded text-slate-650 font-bold focus:outline-none"
              >
                <option value="All">All Orders</option>
                {orderStatuses.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/50">
                    <th className="py-2.5 px-4 text-[9px] font-bold text-slate-400 uppercase tracking-wider">Order Reference</th>
                    <th className="py-2.5 px-4 text-[9px] font-bold text-slate-400 uppercase tracking-wider">Customer</th>
                    <th className="py-2.5 px-4 text-[9px] font-bold text-slate-400 uppercase tracking-wider">Amount</th>
                    <th className="py-2.5 px-4 text-[9px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
                    <th className="py-2.5 px-4 text-[9px] font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr>
                      <td colSpan="5" className="py-10 text-center text-xs font-bold text-slate-400 animate-pulse">
                        Loading transaction registries...
                      </td>
                    </tr>
                  ) : filtered.length > 0 ? (
                    filtered.map((order) => (
                      <tr key={order._id} className="hover:bg-slate-50/30 transition-colors">
                        
                        {/* Reference ID */}
                        <td className="py-3 px-4 text-xs font-bold text-slate-900 font-mono">
                          #{order.orderNumber}
                        </td>

                        {/* Customer */}
                        <td className="py-3 px-4">
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-slate-700">{order.buyer?.fullName || 'Customer'}</span>
                            <span className="text-[9px] text-slate-400 font-semibold">{order.buyer?.email}</span>
                          </div>
                        </td>

                        {/* Amount */}
                        <td className="py-3 px-4 text-xs font-bold text-slate-800">
                          ${order.totalPrice.toFixed(2)}
                        </td>

                        {/* Status */}
                        <td className="py-3 px-4">
                          <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-bold ${getStatusColor(order.orderStatus)}`}>
                            {order.orderStatus}
                          </span>
                        </td>

                        {/* Detail Trigger */}
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="text-xs font-bold text-slate-500 hover:text-slate-900 cursor-pointer"
                          >
                            Details
                          </button>
                        </td>

                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="py-10 text-center text-xs font-bold text-slate-400">
                        No orders recorded.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Right Detail Overview Panel */}
        <div className="bg-white border border-slate-200 p-5 rounded-lg shadow-xs space-y-4">
          {selectedOrder ? (
            <div className="space-y-4 text-xs font-semibold">
              
              <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                <div className="space-y-0.5">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Transaction parameters</h4>
                  <p className="font-mono font-bold text-slate-900">#{selectedOrder.orderNumber}</p>
                </div>
                <span className={`inline-block px-2.5 py-0.5 rounded text-[9px] font-bold ${getStatusColor(selectedOrder.orderStatus)}`}>
                  {selectedOrder.orderStatus}
                </span>
              </div>

              {/* Items Summary */}
              <div>
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Purchased Products</label>
                <div className="bg-slate-50 border border-slate-100 rounded p-2.5 max-h-36 overflow-y-auto space-y-1.5">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-[11px] text-slate-700">
                      <span>{item.title} <span className="text-slate-400">x{item.quantity}</span></span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Parties */}
              <div className="space-y-2 pt-1 border-t border-slate-50">
                
                <div>
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Buyer Details</label>
                  <span className="text-slate-800 font-bold block">{selectedOrder.buyer?.fullName || 'Customer'}</span>
                  <span className="text-[10px] text-slate-400 block">{selectedOrder.buyer?.email}</span>
                </div>

                <div>
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Seller Details</label>
                  <span className="text-slate-800 font-bold block">{selectedOrder.seller?.fullName || 'Merchant'}</span>
                  <span className="text-[10px] text-slate-400 block">{selectedOrder.seller?.email}</span>
                </div>

              </div>

              {/* Amount Info */}
              <div className="flex justify-between pt-2 border-t border-slate-100">
                <span>Bill Total (COD):</span>
                <span className="text-slate-950 font-black">${selectedOrder.totalPrice.toFixed(2)}</span>
              </div>

              {/* Overrides Controls */}
              <div className="border-t border-slate-100 pt-4 space-y-3">
                <div className="flex items-center gap-1.5 text-rose-600">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Administrative Overrides</span>
                </div>

                {/* Status controls */}
                <div className="space-y-3">
                  <div>
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Override Order Status</label>
                    <select
                      value={selectedOrder.orderStatus}
                      onChange={(e) => handleUpdateStatus(selectedOrder._id, e.target.value, null)}
                      className="w-full border border-slate-200 bg-white px-2.5 py-1.5 rounded-lg text-slate-700 font-bold focus:outline-none"
                    >
                      {orderStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Override Payment Status</label>
                    <select
                      value={selectedOrder.paymentStatus}
                      onChange={(e) => handleUpdateStatus(selectedOrder._id, null, e.target.value)}
                      className="w-full border border-slate-200 bg-white px-2.5 py-1.5 rounded-lg text-slate-700 font-bold focus:outline-none"
                    >
                      {paymentStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

              </div>

            </div>
          ) : (
            <div className="text-center py-12 text-slate-400 text-xs font-semibold leading-relaxed max-w-[160px] mx-auto">
              Select an order row to view details and override transaction parameters.
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

export default OrderModeration;
