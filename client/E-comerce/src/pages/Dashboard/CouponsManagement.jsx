import React, { useState } from 'react';

const CouponsManagement = () => {
  const [coupons, setCoupons] = useState([
    { id: 1, code: 'WELCOME10', type: 'Percentage', value: 10, minSpend: 50.00, expiry: 'Aug 30, 2026', status: 'Active' },
    { id: 2, code: 'CARTIFYPRO20', type: 'Percentage', value: 20, minSpend: 150.00, expiry: 'Sep 15, 2026', status: 'Active' },
    { id: 3, code: 'HOTSUMMER30', type: 'Percentage', value: 30, minSpend: 200.00, expiry: 'Jul 15, 2026', status: 'Expired' },
    { id: 4, code: 'FREESHIP', type: 'Percentage', value: 100, minSpend: 100.00, expiry: 'Dec 31, 2026', status: 'Active' }
  ]);

  const [code, setCode] = useState('');
  const [value, setValue] = useState('');
  const [minSpend, setMinSpend] = useState('');
  const [expiry, setExpiry] = useState('');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleCreate = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!code.trim() || !value || !minSpend || !expiry) {
      setError('Please fill in all discount coupon fields.');
      return;
    }

    const valueNum = parseFloat(value);
    const spendNum = parseFloat(minSpend);

    if (isNaN(valueNum) || valueNum <= 0 || valueNum > 100) {
      setError('Discount percentage must be between 1 and 100.');
      return;
    }

    if (isNaN(spendNum) || spendNum < 0) {
      setError('Minimum spend cannot be negative.');
      return;
    }

    const exists = coupons.find(c => c.code.toUpperCase() === code.toUpperCase().trim());
    if (exists) {
      setError('A coupon with this code already exists.');
      return;
    }

    const formattedExpiry = new Date(expiry).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit'
    });

    const newCoupon = {
      id: coupons.length + 1,
      code: code.trim().toUpperCase(),
      type: 'Percentage',
      value: valueNum,
      minSpend: spendNum,
      expiry: formattedExpiry,
      status: 'Active'
    };

    setCoupons([...coupons, newCoupon]);
    setCode('');
    setValue('');
    setMinSpend('');
    setExpiry('');
    setSuccess('Discount coupon registered successfully.');
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this coupon code?')) {
      setCoupons(coupons.filter(c => c.id !== id));
    }
  };

  return (
    <div className="space-y-6 select-none animate-fadeIn">
      
      {/* Title */}
      <div className="pb-4 border-b border-slate-200">
        <h2 className="text-lg font-bold text-slate-900 tracking-tight">Coupons Management</h2>
        <p className="text-xs text-slate-400 font-bold">Deploy store discount vouchers and manage marketing campaigns.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Create Form */}
        <div className="bg-white border border-slate-200 p-5 rounded-lg shadow-xs space-y-4">
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Create Coupon</h4>
            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Setup promotion parameters</p>
          </div>

          {error && <div className="bg-rose-50 border border-rose-100 text-rose-600 text-[10px] font-bold p-2.5 rounded-lg">{error}</div>}
          {success && <div className="bg-emerald-50 border border-emerald-100 text-emerald-600 text-[10px] font-bold p-2.5 rounded-lg">{success}</div>}

          <form onSubmit={handleCreate} className="space-y-3">
            <div>
              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Coupon Code</label>
              <input 
                type="text" 
                placeholder="e.g. FLASH50"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full px-3 py-1.5 text-xs font-bold border border-slate-200 focus:border-slate-400 bg-slate-50/50 rounded-lg focus:outline-none placeholder-slate-300 text-slate-700 font-mono"
                required
              />
            </div>

            <div>
              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Discount (%)</label>
              <input 
                type="number" 
                placeholder="e.g. 20"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full px-3 py-1.5 text-xs font-bold border border-slate-200 focus:border-slate-400 bg-slate-50/50 rounded-lg focus:outline-none placeholder-slate-300 text-slate-700"
                required
              />
            </div>

            <div>
              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Min Spend ($)</label>
              <input 
                type="number" 
                placeholder="e.g. 75"
                value={minSpend}
                onChange={(e) => setMinSpend(e.target.value)}
                className="w-full px-3 py-1.5 text-xs font-bold border border-slate-200 focus:border-slate-400 bg-slate-50/50 rounded-lg focus:outline-none placeholder-slate-300 text-slate-700"
                required
              />
            </div>

            <div>
              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Expiry Date</label>
              <input 
                type="date" 
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                className="w-full px-3 py-1.5 text-xs font-bold border border-slate-200 focus:border-slate-400 bg-slate-50/50 rounded-lg focus:outline-none text-slate-700 cursor-pointer"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg shadow-sm transition-all"
            >
              Deploy Coupon
            </button>
          </form>
        </div>

        {/* Coupon List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/50">
                    <th className="py-2.5 px-4 text-[9px] font-bold text-slate-400 uppercase tracking-wider">Code</th>
                    <th className="py-2.5 px-4 text-[9px] font-bold text-slate-400 uppercase tracking-wider">Discount</th>
                    <th className="py-2.5 px-4 text-[9px] font-bold text-slate-400 uppercase tracking-wider">Min Spend</th>
                    <th className="py-2.5 px-4 text-[9px] font-bold text-slate-400 uppercase tracking-wider">Expiry</th>
                    <th className="py-2.5 px-4 text-[9px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
                    <th className="py-2.5 px-4 text-[9px] font-bold text-slate-400 uppercase tracking-wider text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {coupons.map((coupon) => (
                    <tr key={coupon.id} className="hover:bg-slate-50/30 transition-colors">
                      <td className="py-3 px-4 text-xs font-bold text-slate-900 font-mono">{coupon.code}</td>
                      <td className="py-3 px-4 text-xs font-semibold text-slate-700">{coupon.value}% Off</td>
                      <td className="py-3 px-4 text-xs font-semibold text-slate-500">${coupon.minSpend.toFixed(2)}</td>
                      <td className="py-3 px-4 text-xs font-semibold text-slate-500">{coupon.expiry}</td>
                      <td className="py-3 px-4">
                        {coupon.status === 'Active' ? (
                          <span className="inline-block px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-50 text-emerald-600">
                            Active
                          </span>
                        ) : (
                          <span className="inline-block px-2 py-0.5 rounded text-[9px] font-bold bg-slate-100 text-slate-450">
                            Expired
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right text-xs font-bold">
                        <button 
                          onClick={() => handleDelete(coupon.id)}
                          className="text-rose-500 hover:text-rose-700 transition-colors cursor-pointer"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default CouponsManagement;
