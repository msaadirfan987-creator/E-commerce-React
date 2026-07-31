import React from 'react';

const EarningsPage = () => {
  const payouts = [
    { id: 'PAY-8924', date: 'Jul 28, 2026', amount: 4890.00, method: 'Direct Deposit (•••• 4920)', status: 'Processed' },
    { id: 'PAY-8923', date: 'Jun 28, 2026', amount: 3950.00, method: 'Direct Deposit (•••• 4920)', status: 'Processed' },
    { id: 'PAY-8922', date: 'May 28, 2026', amount: 5210.00, method: 'Direct Deposit (•••• 4920)', status: 'Processed' },
    { id: 'PAY-8921', date: 'Apr 28, 2026', amount: 4120.00, method: 'Direct Deposit (•••• 4920)', status: 'Processed' }
  ];

  return (
    <div className="space-y-6 select-none animate-fadeIn">
      
      {/* Title */}
      <div className="pb-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-0.5">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Earnings Registry</h2>
          <p className="text-xs text-slate-400 font-bold">Monitor merchant balance ledgers and processed bank payouts.</p>
        </div>

        <button 
          onClick={() => alert('Payout triggered successfully.')}
          className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition-all self-start sm:self-auto cursor-pointer"
        >
          Withdraw Funds
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Balance Card */}
        <div className="bg-slate-900 text-slate-350 p-6 rounded-lg flex flex-col justify-between h-40">
          <div>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Available Balance</span>
            <h3 className="text-2xl font-bold text-white tracking-tight mt-1">$6,240.00</h3>
          </div>

          <div className="text-[9px] font-bold text-slate-400 border-t border-slate-800 pt-3">
            Payout account: Chase Bank (•••• 4920)
          </div>
        </div>

        {/* Payout Metric Card */}
        <div className="bg-white border border-slate-200 p-6 rounded-lg flex flex-col justify-between h-40">
          <div>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Total Paid Out</span>
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">$18,170.00</h3>
          </div>

          <div className="text-[9px] font-bold text-slate-400 border-t border-slate-100 pt-3">
            Last payout: Jul 28, 2026 ($4,890.00)
          </div>
        </div>

        {/* Pending Card */}
        <div className="bg-white border border-slate-250 p-6 rounded-lg flex flex-col justify-between h-40">
          <div>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Pending Escrow</span>
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">$1,480.00</h3>
          </div>

          <div className="text-[9px] font-bold text-slate-400 border-t border-slate-100 pt-3">
            To be settled on Aug 05, 2026
          </div>
        </div>
      </div>

      {/* Payout History logs */}
      <div className="bg-white border border-slate-200 p-5 rounded-lg shadow-xs space-y-4">
        <div className="pb-2 border-b border-slate-100">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Settled Bank Payouts</h4>
          <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Chronological record of balance settlements</p>
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse text-xs font-semibold">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 text-[9px] font-bold uppercase tracking-wider">
                <th className="py-2.5 px-3">Reference ID</th>
                <th className="py-2.5 px-3">Transfer Date</th>
                <th className="py-2.5 px-3">Settle Method</th>
                <th className="py-2.5 px-3">Amount</th>
                <th className="py-2.5 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {payouts.map((p, i) => (
                <tr key={i} className="hover:bg-slate-50/50">
                  <td className="py-3 px-3 font-mono font-bold text-slate-900">#{p.id}</td>
                  <td className="py-3 px-3">{p.date}</td>
                  <td className="py-3 px-3 text-slate-500">{p.method}</td>
                  <td className="py-3 px-3 font-bold text-slate-900">${p.amount.toFixed(2)}</td>
                  <td className="py-3 px-3 text-right">
                    <span className="inline-block px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-50 text-emerald-600">
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default EarningsPage;
