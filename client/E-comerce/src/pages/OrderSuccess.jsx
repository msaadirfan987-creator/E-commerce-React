import React from 'react';
import { useParams, Link } from 'react-router-dom';

const OrderSuccess = () => {
  const { orderNumber } = useParams();

  const estDate = new Date();
  estDate.setDate(estDate.getDate() + 4); // 4 days estimate
  const formattedEstDate = estDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Split order number list if multiple vendor orders were placed
  const orderList = orderNumber ? orderNumber.split(',') : [];

  return (
    <div className="min-h-[75vh] bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 select-none font-sans animate-fadeIn">
      <div className="bg-white border border-slate-200 p-8 rounded-lg max-w-md w-full shadow-xs text-center space-y-6">
        
        {/* Success Icon */}
        <div className="mx-auto w-12 h-12 bg-emerald-50 rounded-full border border-emerald-100 flex items-center justify-center text-emerald-500">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
        </div>

        {/* Message */}
        <div className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 tracking-tight">Order Placed Successfully</h2>
          <p className="text-xs text-slate-400 font-bold">Thank you for shopping with Cartify! We are preparing your shipment.</p>
        </div>

        {/* Order Details box */}
        <div className="bg-slate-50 border border-slate-100 p-4 rounded-lg text-left text-xs font-semibold space-y-3">
          <div>
            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Order Reference Number(s)</label>
            <div className="space-y-1">
              {orderList.map((num, idx) => (
                <p key={idx} className="font-mono text-slate-800 font-bold bg-white px-2 py-1 rounded border border-slate-150 inline-block mr-1.5 mb-1.5">
                  #{num}
                </p>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-150/60 pt-3 flex justify-between items-center">
            <span className="text-slate-400 text-[10px] uppercase tracking-wider">Estimated Delivery</span>
            <span className="text-slate-800 font-bold text-right text-[11px]">{formattedEstDate}</span>
          </div>
        </div>

        {/* Buttons Stack */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Link 
            to="/shop" 
            className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-2.5 rounded-lg border border-slate-200 transition-colors text-center block"
          >
            Continue Shopping
          </Link>
          <Link 
            to="/my-orders" 
            className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2.5 rounded-lg transition-colors text-center block"
          >
            View My Orders
          </Link>
        </div>

      </div>
    </div>
  );
};

export default OrderSuccess;
