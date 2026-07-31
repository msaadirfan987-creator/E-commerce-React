import React, { useState, useEffect } from 'react';
import { Search, RefreshCcw } from 'lucide-react';
import orderService from '../../services/orderService';

const OrdersManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchSellerOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await orderService.getSellerOrders();
      if (data.success) {
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error('Failed to load merchant orders:', err);
      setError('Connection issues fetching orders registry.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellerOrders();
  }, []);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const data = await orderService.updateOrderStatus(orderId, newStatus);
      if (data.success) {
        setSuccess(`Order status updated to '${newStatus}'.`);
        setTimeout(() => setSuccess(''), 2000);

        // Update list locally
        setOrders(orders.map(o => o._id === orderId ? { 
          ...o, 
          orderStatus: newStatus,
          paymentStatus: newStatus === 'Delivered' ? 'Paid' : o.paymentStatus
        } : o));

        // Update selected view
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder({
            ...selectedOrder,
            orderStatus: newStatus,
            paymentStatus: newStatus === 'Delivered' ? 'Paid' : selectedOrder.paymentStatus
          });
        }
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status.');
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

  const filtered = orders.filter(o => {
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
      <div className="pb-4 border-b border-slate-200 flex justify-between items-end">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Orders Registry</h2>
          <p className="text-xs text-slate-400 font-bold">Process order tracking, dispatch parcels, or moderate invoice receipts.</p>
        </div>
        <button 
          onClick={fetchSellerOrders}
          className="p-1.5 border border-slate-200 hover:border-slate-350 bg-white text-slate-500 hover:text-slate-900 rounded-lg transition-colors cursor-pointer"
        >
          <RefreshCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {success && (
        <div className="bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs font-bold p-3 rounded-lg animate-fadeIn">
          {success}
        </div>
      )}

      {error && (
        <div className="bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold p-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left List */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Controls */}
          <div className="bg-white border border-slate-200 p-4 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="w-full sm:max-w-xs flex items-center rounded-lg border border-slate-200 bg-slate-50/50 px-2.5 py-1.5 transition-all focus-within:border-slate-400">
              <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <input 
                type="text" 
                placeholder="Search orders..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-2 text-xs font-semibold bg-transparent focus:outline-none text-slate-700 placeholder-slate-400"
              />
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
              <span className="text-xs font-bold text-slate-400">Filter:</span>
              <div className="bg-slate-100 p-0.5 rounded flex gap-0.5 border border-slate-200/50">
                {['All', 'Pending', 'Confirmed', 'Shipped', 'Delivered'].map((s) => (
                  <button 
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={`px-2.5 py-1 text-[9px] font-bold rounded transition-all cursor-pointer ${
                      statusFilter === s ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-400 hover:text-slate-700'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/50">
                    <th className="py-2.5 px-4 text-[9px] font-bold text-slate-400 uppercase tracking-wider">Order No.</th>
                    <th className="py-2.5 px-4 text-[9px] font-bold text-slate-400 uppercase tracking-wider">Customer</th>
                    <th className="py-2.5 px-4 text-[9px] font-bold text-slate-400 uppercase tracking-wider">Amount</th>
                    <th className="py-2.5 px-4 text-[9px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
                    <th className="py-2.5 px-4 text-[9px] font-bold text-slate-400 uppercase tracking-wider text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr>
                      <td colSpan="5" className="py-10 text-center text-xs font-bold text-slate-400 animate-pulse">
                        Loading merchant orders...
                      </td>
                    </tr>
                  ) : filtered.length > 0 ? (
                    filtered.map((order) => (
                      <tr key={order._id} className="hover:bg-slate-50/30 transition-colors">
                        <td className="py-3 px-4 text-xs font-bold text-slate-900 font-mono">
                          #{order.orderNumber}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-slate-700">{order.buyer?.fullName || 'Customer'}</span>
                            <span className="text-[9px] text-slate-400 font-semibold">{order.buyer?.email}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-xs font-bold text-slate-800">
                          ${order.totalPrice.toFixed(2)}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-bold ${getStatusColor(order.orderStatus)}`}>
                            {order.orderStatus}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                          >
                            Details
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="py-10 text-center text-xs font-bold text-slate-400">
                        No orders found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Details Panel */}
        <div className="bg-white border border-slate-200 p-5 rounded-lg shadow-xs space-y-4">
          {selectedOrder ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Order Detail</h4>
                  <p className="text-[9px] font-mono text-slate-400 font-bold">#{selectedOrder.orderNumber}</p>
                </div>
                <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-bold ${getStatusColor(selectedOrder.orderStatus)}`}>
                  {selectedOrder.orderStatus}
                </span>
              </div>

              <div className="space-y-4 text-xs font-semibold">
                
                {/* Items */}
                <div>
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Purchased Item(s)</label>
                  <div className="bg-slate-50 border border-slate-100 rounded p-2.5 space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-[11px] font-bold text-slate-700">
                        <span>{item.title} <span className="text-slate-400">x{item.quantity}</span></span>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping info */}
                <div>
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Customer Delivery Details</label>
                  <div className="bg-slate-50 border border-slate-100 rounded p-2.5 text-[11px] text-slate-650 space-y-1">
                    <p className="font-bold text-slate-900">{selectedOrder.shippingAddress.fullName}</p>
                    <p>Phone: {selectedOrder.shippingAddress.phone}</p>
                    <p>Address: {selectedOrder.shippingAddress.address}, {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.country}</p>
                  </div>
                </div>

                {/* Paid Amount */}
                <div className="flex justify-between pt-2 border-t border-slate-50 text-slate-700">
                  <span>Pay Amount (COD):</span>
                  <span className="font-bold text-slate-900">${selectedOrder.totalPrice.toFixed(2)}</span>
                </div>

                {/* Update Status Buttons */}
                <div className="border-t border-slate-100 pt-4 space-y-3">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Dispatch Workflow</label>
                  <div className="grid grid-cols-2 gap-2 text-[10px] font-bold">
                    
                    {/* CONFIRM */}
                    <button 
                      onClick={() => handleUpdateStatus(selectedOrder._id, 'Confirmed')}
                      disabled={selectedOrder.orderStatus !== 'Pending'}
                      className="px-2 py-1.5 border border-slate-200 hover:border-slate-350 text-slate-600 bg-white hover:bg-slate-50 rounded-lg transition-all disabled:opacity-40 cursor-pointer"
                    >
                      Confirm Order
                    </button>

                    {/* PACK */}
                    <button 
                      onClick={() => handleUpdateStatus(selectedOrder._id, 'Packed')}
                      disabled={selectedOrder.orderStatus !== 'Confirmed'}
                      className="px-2 py-1.5 border border-slate-200 hover:border-slate-350 text-slate-600 bg-white hover:bg-slate-50 rounded-lg transition-all disabled:opacity-40 cursor-pointer"
                    >
                      Pack Items
                    </button>

                    {/* SHIP */}
                    <button 
                      onClick={() => handleUpdateStatus(selectedOrder._id, 'Shipped')}
                      disabled={selectedOrder.orderStatus !== 'Packed'}
                      className="px-2 py-1.5 border border-slate-200 hover:border-slate-350 text-slate-600 bg-white hover:bg-slate-50 rounded-lg transition-all disabled:opacity-40 cursor-pointer"
                    >
                      Ship Out
                    </button>

                    {/* OUT FOR DELIVERY */}
                    <button 
                      onClick={() => handleUpdateStatus(selectedOrder._id, 'Out For Delivery')}
                      disabled={selectedOrder.orderStatus !== 'Shipped'}
                      className="px-2 py-1.5 border border-slate-200 hover:border-slate-350 text-slate-600 bg-white hover:bg-slate-50 rounded-lg transition-all disabled:opacity-40 cursor-pointer"
                    >
                      Out for Delivery
                    </button>

                    {/* DELIVER */}
                    <button 
                      onClick={() => handleUpdateStatus(selectedOrder._id, 'Delivered')}
                      disabled={selectedOrder.orderStatus !== 'Out For Delivery'}
                      className="px-2 py-1.5 col-span-2 bg-slate-900 text-white hover:bg-slate-800 rounded-lg transition-all disabled:opacity-45 cursor-pointer"
                    >
                      Mark as Delivered
                    </button>

                    {/* REJECT */}
                    {['Pending', 'Confirmed'].includes(selectedOrder.orderStatus) && (
                      <button 
                        onClick={() => handleUpdateStatus(selectedOrder._id, 'Rejected')}
                        className="px-2 py-1.5 col-span-2 border border-rose-250 text-rose-600 bg-white hover:bg-rose-50 rounded-lg transition-all cursor-pointer"
                      >
                        Reject Order
                      </button>
                    )}

                  </div>
                </div>

              </div>
            </div>
          ) : (
            <div className="text-center py-10 space-y-2">
              <p className="text-slate-400 text-xs font-semibold leading-relaxed max-w-[160px] mx-auto">
                Select an order row to view transaction details and dispatch controls.
              </p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default OrdersManagement;
