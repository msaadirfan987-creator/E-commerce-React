import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const EarningsPage = () => {
  const { user, token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchEarningsHistory = async () => {
      try {
        const response = await fetch(`${API_URL}/api/orders/seller`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (response.ok && data.success) {
          setOrders(data.orders || []);
        } else {
          setError(data.message || 'Failed to load earnings records.');
        }
      } catch (err) {
        setError('Error reaching backend APIs.');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchEarningsHistory();
    }
  }, [token]);

  // Filter for delivered orders to calculate transaction history
  const deliveredOrders = orders.filter(o => o.orderStatus === 'Delivered');

  // Sum total revenue dynamically to compare with profile balance
  const totalRevenue = deliveredOrders.reduce((acc, curr) => acc + (curr.totalPrice * 0.90), 0);

  // Profile-based available revenue balance (or fallback to calculated)
  const availableBalance = user && user.revenue !== undefined ? user.revenue : totalRevenue;

  const handleWithdrawFunds = () => {
    if (availableBalance <= 0) {
      alert("No Revenue Yet. You cannot withdraw funds with a zero balance.");
      return;
    }
    alert(`payout of $${availableBalance.toFixed(2)} requested successfully.`);
  };

  return (
    <div className="space-y-6 select-none animate-fadeIn font-sans">
      
      {/* Title */}
      <div className="pb-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-0.5">
          <h2 className="text-sm font-black text-slate-900 tracking-tight uppercase">Earnings Registry</h2>
          <p className="text-xs text-slate-400 font-semibold">Monitor merchant balance ledgers and transaction history.</p>
        </div>

        <button 
          onClick={handleWithdrawFunds}
          className="px-3.5 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          Withdraw Funds
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Balance Card */}
        <div className="bg-slate-900 text-slate-350 p-6 rounded-lg flex flex-col justify-between h-36">
          <div>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Available Balance</span>
            <h3 className="text-2xl font-bold text-white tracking-tight mt-1">${availableBalance.toFixed(2)}</h3>
          </div>
          <div className="text-[9px] font-bold text-slate-400 border-t border-slate-800 pt-3">
            Payout method: Direct Deposit (Pending Configuration)
          </div>
        </div>

        {/* Total Earned Card */}
        <div className="bg-white border border-slate-200 p-6 rounded-lg flex flex-col justify-between h-36">
          <div>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Total Revenue Earned</span>
            <h3 className="text-2xl font-bold text-slate-950 tracking-tight mt-1">${totalRevenue.toFixed(2)}</h3>
          </div>
          <div className="text-[9px] font-bold text-slate-450 border-t border-slate-100 pt-3">
            Delivered orders count: {deliveredOrders.length}
          </div>
        </div>

      </div>

      {/* History Ledger */}
      <div className="bg-white border border-slate-200 p-5 rounded-lg shadow-xs space-y-4">
        <div className="pb-2 border-b border-slate-100">
          <h4 className="text-xs font-bold text-slate-850 uppercase tracking-wider">Settled Order Transactions</h4>
          <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Chronological record of completed delivery sales (90% seller split)</p>
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse text-xs font-semibold">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 text-[9px] font-bold uppercase tracking-wider bg-slate-50/50">
                <th className="py-2.5 px-3">Order ID</th>
                <th className="py-2.5 px-3">Delivery Date</th>
                <th className="py-2.5 px-3">Gross Total</th>
                <th className="py-2.5 px-3">Seller Split (90%)</th>
                <th className="py-2.5 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-xs font-bold text-slate-400 animate-pulse">
                    Retrieving ledger items...
                  </td>
                </tr>
              ) : deliveredOrders.length > 0 ? (
                deliveredOrders.map((order, i) => (
                  <tr key={i} className="hover:bg-slate-50/30 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-slate-950">#{order.orderNumber}</td>
                    <td className="py-3 px-3">{new Date(order.updatedAt).toLocaleDateString()}</td>
                    <td className="py-3 px-3 text-slate-500">${order.totalPrice.toFixed(2)}</td>
                    <td className="py-3 px-3 font-bold text-slate-900">${(order.totalPrice * 0.90).toFixed(2)}</td>
                    <td className="py-3 px-3 text-right">
                      <span className="inline-block px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-50 text-emerald-600">
                        Processed
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-10 text-center text-xs font-bold text-slate-400">
                    No Revenue Yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default EarningsPage;
