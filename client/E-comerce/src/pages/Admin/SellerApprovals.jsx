import React, { useState, useEffect } from 'react';
import { Search, UserCheck, ShieldAlert, Check, X, RotateCcw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const SellerApprovals = () => {
  const { token } = useAuth();
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [activeTab, setActiveTab] = useState('Pending');
  const [search, setSearch] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const fetchSellers = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_URL}/api/admin/users?role=seller`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setSellers(data.users || []);
      } else {
        setError(data.message || 'Failed to load sellers.');
      }
    } catch (err) {
      setError('Connection issues reaching administration server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchSellers();
    }
  }, [token]);

  const handleApprove = async (id) => {
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`${API_URL}/api/admin/sellers/${id}/approve`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setSuccess('Seller approved successfully.');
        setTimeout(() => setSuccess(''), 2000);
        
        // Update local list
        setSellers(sellers.map(s => s._id === id ? { 
          ...s, 
          sellerStatus: 'Approved',
          isBlocked: false
        } : s));
      } else {
        alert(data.message || 'Failed to approve seller.');
      }
    } catch (err) {
      alert('Error during seller approval.');
    }
  };

  const handleReject = async (id) => {
    const confirmReject = window.confirm('Are you sure you want to reject this seller request?');
    if (!confirmReject) return;

    setError('');
    setSuccess('');

    try {
      const response = await fetch(`${API_URL}/api/admin/sellers/${id}/reject`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setSuccess('Seller account rejected.');
        setTimeout(() => setSuccess(''), 2000);
        
        setSellers(sellers.map(s => s._id === id ? { 
          ...s, 
          sellerStatus: 'Rejected' 
        } : s));
      } else {
        alert(data.message || 'Failed to reject seller.');
      }
    } catch (err) {
      alert('Error rejecting seller.');
    }
  };

  const handleSuspend = async (id) => {
    const confirmSuspend = window.confirm('Are you sure you want to suspend this seller account? All their products will remain hidden from storefront.');
    if (!confirmSuspend) return;

    try {
      const response = await fetch(`${API_URL}/api/admin/users/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ isBlocked: true }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setSuccess('Seller suspended successfully.');
        setTimeout(() => setSuccess(''), 2000);

        setSellers(sellers.map(s => s._id === id ? { 
          ...s, 
          sellerStatus: 'Suspended', 
          isBlocked: true 
        } : s));
      } else {
        alert(data.message || 'Failed to suspend seller.');
      }
    } catch (err) {
      alert('Error suspending seller.');
    }
  };

  const handleActivate = async (id) => {
    try {
      const response = await fetch(`${API_URL}/api/admin/users/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ isBlocked: false }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setSuccess('Seller re-activated successfully.');
        setTimeout(() => setSuccess(''), 2000);

        setSellers(sellers.map(s => s._id === id ? { 
          ...s, 
          sellerStatus: 'Approved', 
          isBlocked: false 
        } : s));
      } else {
        alert(data.message || 'Failed to activate seller.');
      }
    } catch (err) {
      alert('Error activating seller.');
    }
  };

  const filtered = sellers.filter((s) => {
    // Map status filters
    const matchesSearch = s.fullName.toLowerCase().includes(search.toLowerCase()) ||
                          s.email.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = (activeTab === 'Pending' && s.sellerStatus === 'Pending') ||
                          (activeTab === 'Approved' && s.sellerStatus === 'Approved') ||
                          (activeTab === 'Rejected' && s.sellerStatus === 'Rejected') ||
                          (activeTab === 'Suspended' && s.sellerStatus === 'Suspended');

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 select-none animate-fadeIn">
      
      {/* Title */}
      <div className="pb-4 border-b border-slate-200">
        <h2 className="text-base font-black text-slate-900 tracking-tight uppercase">Seller Moderation</h2>
        <p className="text-xs text-slate-400 font-bold">Review pending merchant logs, activate profiles, or revoke selling capabilities.</p>
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

      {/* Tabs list & Search Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200">
        
        <div className="flex gap-4">
          {['Pending', 'Approved', 'Rejected', 'Suspended'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 text-xs font-bold transition-all relative border-b-2 cursor-pointer ${
                activeTab === tab 
                  ? 'border-slate-900 text-slate-950' 
                  : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="w-full sm:max-w-xs flex items-center rounded-lg border border-slate-250/80 bg-white px-2.5 py-1 mb-2 focus-within:border-slate-400">
          <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <input 
            type="text" 
            placeholder="Search by merchant name..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-2 text-xs font-semibold focus:outline-none text-slate-700 placeholder-slate-400"
          />
        </div>

      </div>

      {/* Table list */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/50">
                <th className="py-2.5 px-4 text-[9px] font-bold text-slate-400 uppercase tracking-wider">Merchant Info</th>
                <th className="py-2.5 px-4 text-[9px] font-bold text-slate-400 uppercase tracking-wider">Registered</th>
                <th className="py-2.5 px-4 text-[9px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="py-2.5 px-4 text-[9px] font-bold text-slate-400 uppercase tracking-wider text-right">Moderations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="4" className="py-10 text-center text-xs font-bold text-slate-400 animate-pulse">
                    Retrieving merchant directory...
                  </td>
                </tr>
              ) : filtered.length > 0 ? (
                filtered.map((seller) => (
                  <tr key={seller._id} className="hover:bg-slate-50/30 transition-colors">
                    
                    {/* Info */}
                    <td className="py-3 px-4">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-800">{seller.fullName}</span>
                        <span className="text-[10px] text-slate-400 font-semibold">{seller.email}</span>
                      </div>
                    </td>

                    {/* Reg Date */}
                    <td className="py-3 px-4 text-[11px] font-semibold text-slate-500">
                      {new Date(seller.createdAt).toLocaleDateString()}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-bold ${
                        seller.sellerStatus === 'Approved' ? 'bg-emerald-50 text-emerald-700' :
                        seller.sellerStatus === 'Rejected' ? 'bg-rose-50 text-rose-700' :
                        seller.sellerStatus === 'Suspended' ? 'bg-amber-50 text-amber-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {seller.sellerStatus}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-3 text-xs font-bold">
                        
                        {seller.sellerStatus === 'Pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(seller._id)}
                              className="text-emerald-600 hover:text-emerald-800 flex items-center gap-0.5 cursor-pointer"
                            >
                              <Check className="w-3.5 h-3.5" /> Approve
                            </button>
                            <button
                              onClick={() => handleReject(seller._id)}
                              className="text-rose-500 hover:text-rose-700 flex items-center gap-0.5 cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" /> Reject
                            </button>
                          </>
                        )}

                        {seller.sellerStatus === 'Approved' && (
                          <button
                            onClick={() => handleSuspend(seller._id)}
                            className="text-rose-500 hover:text-rose-700 cursor-pointer"
                          >
                            Suspend
                          </button>
                        )}

                        {seller.sellerStatus === 'Suspended' && (
                          <button
                            onClick={() => handleActivate(seller._id)}
                            className="text-emerald-600 hover:text-emerald-800 cursor-pointer"
                          >
                            Re-activate
                          </button>
                        )}

                        {seller.sellerStatus === 'Rejected' && (
                          <button
                            onClick={() => handleApprove(seller._id)}
                            className="text-slate-500 hover:text-slate-900 flex items-center gap-0.5 cursor-pointer"
                          >
                            <RotateCcw className="w-3.5 h-3.5" /> Re-consider
                          </button>
                        )}

                      </div>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="py-10 text-center text-xs font-bold text-slate-400">
                    No merchants listed in this category.
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

export default SellerApprovals;
