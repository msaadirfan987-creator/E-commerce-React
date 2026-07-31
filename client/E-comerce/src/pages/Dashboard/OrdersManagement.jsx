import React, { useState } from 'react';
import { Search } from 'lucide-react';

const OrdersManagement = () => {
  const [orders, setOrders] = useState([
    { id: 'ORD-9842', customer: 'John Doe', email: 'john@example.com', date: 'Jul 31, 2026', items: 'Pro Wireless Headphones (x1)', amount: 129.00, status: 'Pending', statusColor: 'bg-slate-100 text-slate-700' },
    { id: 'ORD-9841', customer: 'Alice Smith', email: 'alice@example.com', date: 'Jul 30, 2026', items: 'Minimalist Leather Watch (x1), Mechanical Keyboard (x1)', amount: 288.00, status: 'Shipped', statusColor: 'bg-blue-50 text-blue-700' },
    { id: 'ORD-9840', customer: 'Bob Johnson', email: 'bob@example.com', date: 'Jul 29, 2026', items: 'Ergonomic Mechanical Keyboard (x1)', amount: 89.00, status: 'Completed', statusColor: 'bg-emerald-50 text-emerald-700' },
    { id: 'ORD-9839', customer: 'Clara Oswald', email: 'clara@example.com', date: 'Jul 28, 2026', items: 'Premium Hydro Skincare Serum (x1)', amount: 45.00, status: 'Completed', statusColor: 'bg-emerald-50 text-emerald-700' },
    { id: 'ORD-9838', customer: 'Danny Pink', email: 'danny@example.com', date: 'Jul 27, 2026', items: 'Pro Wireless Headphones (x1), Smart Fitness Tracker (x1)', amount: 208.00, status: 'Cancelled', statusColor: 'bg-rose-50 text-rose-700' },
    { id: 'ORD-9837', customer: 'Susan Foreman', email: 'susan@example.com', date: 'Jul 26, 2026', items: 'Ultra HD Action Camera (x1)', amount: 249.00, status: 'Completed', statusColor: 'bg-emerald-50 text-emerald-700' }
  ]);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleUpdateStatus = (orderId, newStatus) => {
    const statusMap = {
      Pending: { statusColor: 'bg-slate-100 text-slate-700' },
      Shipped: { statusColor: 'bg-blue-50 text-blue-700' },
      Completed: { statusColor: 'bg-emerald-50 text-emerald-700' },
      Cancelled: { statusColor: 'bg-rose-50 text-rose-700' }
    };

    setOrders(orders.map(order => {
      if (order.id === orderId) {
        return {
          ...order,
          status: newStatus,
          statusColor: statusMap[newStatus].statusColor
        };
      }
      return order;
    }));

    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({
        ...selectedOrder,
        status: newStatus,
        statusColor: statusMap[newStatus].statusColor
      });
    }
  };

  const filtered = orders.filter(o => {
    const matchesSearch = o.id.toLowerCase().includes(search.toLowerCase()) || o.customer.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 select-none animate-fadeIn">
      
      {/* Title */}
      <div className="pb-4 border-b border-slate-200">
        <h2 className="text-lg font-bold text-slate-900 tracking-tight">Orders Registry</h2>
        <p className="text-xs text-slate-400 font-bold">Process order tracking, dispatch parcels, or moderate invoice receipts.</p>
      </div>

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
                {['All', 'Pending', 'Shipped', 'Completed'].map((s) => (
                  <button 
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={`px-2.5 py-1 text-[9px] font-bold rounded transition-all ${
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
                  <tr className="border-b border-slate-250 bg-slate-50/50">
                    <th className="py-2.5 px-4 text-[9px] font-bold text-slate-400 uppercase tracking-wider">ID</th>
                    <th className="py-2.5 px-4 text-[9px] font-bold text-slate-400 uppercase tracking-wider">Customer</th>
                    <th className="py-2.5 px-4 text-[9px] font-bold text-slate-400 uppercase tracking-wider">Amount</th>
                    <th className="py-2.5 px-4 text-[9px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
                    <th className="py-2.5 px-4 text-[9px] font-bold text-slate-400 uppercase tracking-wider text-right">View</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50/30 transition-colors">
                      <td className="py-3 px-4 text-xs font-bold text-slate-900">#{order.id}</td>
                      <td className="py-3 px-4">
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-slate-700">{order.customer}</span>
                          <span className="text-[9px] text-slate-400 font-semibold">{order.email}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-xs font-bold text-slate-800">${order.amount.toFixed(2)}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-bold ${order.statusColor}`}>
                          {order.status}
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
                  ))}
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
                  <p className="text-[9px] font-mono text-slate-400 font-bold">#{selectedOrder.id}</p>
                </div>
                <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-bold ${selectedOrder.statusColor}`}>
                  {selectedOrder.status}
                </span>
              </div>

              <div className="space-y-3.5 text-xs font-semibold">
                <div>
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Purchased Item(s)</label>
                  <p className="text-xs font-semibold text-slate-700 leading-relaxed bg-slate-50 p-2.5 rounded border border-slate-100">
                    {selectedOrder.items}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Invoice Date</label>
                    <p className="text-xs font-bold text-slate-700">{selectedOrder.date}</p>
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Paid Amount</label>
                    <p className="text-xs font-bold text-slate-800">${selectedOrder.amount.toFixed(2)}</p>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-4 space-y-3">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Update Status</label>
                  <div className="grid grid-cols-2 gap-2 text-[10px] font-bold">
                    <button 
                      onClick={() => handleUpdateStatus(selectedOrder.id, 'Shipped')}
                      disabled={selectedOrder.status === 'Shipped' || selectedOrder.status === 'Completed' || selectedOrder.status === 'Cancelled'}
                      className="px-2.5 py-1.5 border border-slate-200 hover:border-slate-350 text-slate-600 bg-white hover:bg-slate-50 rounded-lg transition-all disabled:opacity-40 cursor-pointer"
                    >
                      Ship Order
                    </button>
                    <button 
                      onClick={() => handleUpdateStatus(selectedOrder.id, 'Completed')}
                      disabled={selectedOrder.status === 'Completed' || selectedOrder.status === 'Cancelled'}
                      className="px-2.5 py-1.5 border border-slate-200 hover:border-slate-350 text-slate-600 bg-white hover:bg-slate-50 rounded-lg transition-all disabled:opacity-40 cursor-pointer"
                    >
                      Complete
                    </button>
                    <button 
                      onClick={() => handleUpdateStatus(selectedOrder.id, 'Cancelled')}
                      disabled={selectedOrder.status === 'Completed' || selectedOrder.status === 'Cancelled'}
                      className="px-2.5 py-1.5 col-span-2 border border-slate-200 hover:border-slate-350 text-rose-600 bg-white hover:bg-slate-50 rounded-lg transition-all disabled:opacity-40 cursor-pointer"
                    >
                      Cancel Order
                    </button>
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
