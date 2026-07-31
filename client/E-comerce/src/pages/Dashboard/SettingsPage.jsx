import React, { useState } from 'react';

const SettingsPage = () => {
  const [storeName, setStoreName] = useState('Cartify Premium Store');
  const [supportEmail, setSupportEmail] = useState('support@cartify.com');
  
  const [notifyOrder, setNotifyOrder] = useState(true);
  const [notifyStock, setNotifyStock] = useState(true);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSave = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!storeName.trim() || !supportEmail.trim()) {
      setError('Please fill in all required settings fields.');
      return;
    }

    setSuccess('Merchant configuration saved successfully.');
    setTimeout(() => setSuccess(''), 2000);
  };

  return (
    <div className="space-y-6 max-w-2xl select-none animate-fadeIn">
      
      {/* Title */}
      <div className="pb-4 border-b border-slate-200">
        <h2 className="text-lg font-bold text-slate-900 tracking-tight">Console Configuration</h2>
        <p className="text-xs text-slate-400 font-bold">Configure store metadata details and alert thresholds.</p>
      </div>

      {error && <div className="bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold p-3 rounded-lg">{error}</div>}
      {success && <div className="bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs font-bold p-3 rounded-lg">{success}</div>}

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Core details */}
        <div className="bg-white border border-slate-200 p-5 rounded-lg shadow-xs space-y-4">
          <div className="pb-2 border-b border-slate-100">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Store Details</h4>
            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Your official merchant identity parameters</p>
          </div>

          <div className="space-y-3.5">
            <div>
              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Store Name</label>
              <input 
                type="text" 
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full px-3 py-1.5 text-xs font-bold border border-slate-200 focus:border-slate-400 bg-slate-50/50 rounded-lg focus:outline-none placeholder-slate-350 text-slate-700"
                required
              />
            </div>

            <div>
              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Support Email</label>
              <input 
                type="email" 
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="w-full px-3 py-1.5 text-xs font-bold border border-slate-200 focus:border-slate-400 bg-slate-50/50 rounded-lg focus:outline-none placeholder-slate-350 text-slate-700"
                required
              />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white border border-slate-200 p-5 rounded-lg shadow-xs space-y-4">
          <div className="pb-2 border-b border-slate-100">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Notification Subscriptions</h4>
            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Alert preferences for store activity</p>
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-3 text-xs font-semibold text-slate-650 cursor-pointer">
              <input 
                type="checkbox" 
                checked={notifyOrder}
                onChange={(e) => setNotifyOrder(e.target.checked)}
                className="rounded text-slate-900 border-slate-200 focus:ring-0"
              />
              Notify on incoming customer order receipts
            </label>

            <label className="flex items-center gap-3 text-xs font-semibold text-slate-650 cursor-pointer">
              <input 
                type="checkbox" 
                checked={notifyStock}
                onChange={(e) => setNotifyStock(e.target.checked)}
                className="rounded text-slate-900 border-slate-200 focus:ring-0"
              />
              Warn when product units fall below threshold (10 units)
            </label>
          </div>
        </div>

        {/* Save button */}
        <div className="flex items-center justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            Save Settings
          </button>
        </div>

      </form>

    </div>
  );
};

export default SettingsPage;
