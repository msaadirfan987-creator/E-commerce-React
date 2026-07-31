import React, { useState } from 'react';
import { Star } from 'lucide-react';

const ReviewsManagement = () => {
  const [reviews, setReviews] = useState([
    { id: 1, customer: 'John Doe', email: 'john@example.com', product: 'Pro Wireless Headphones', rating: 5, comment: 'Absolutely amazing sound output! Active noise cancellation is class-leading.', date: 'Jul 31, 2026', isApproved: true },
    { id: 2, customer: 'Alice Smith', email: 'alice@example.com', product: 'Minimalist Leather Watch', rating: 4, comment: 'Elegant style, fits nicely. The strap is slightly stiff at first but gets comfortable.', date: 'Jul 30, 2026', isApproved: false },
    { id: 3, customer: 'Bob Johnson', email: 'bob@example.com', product: 'Ergonomic Mechanical Keyboard', rating: 5, comment: 'The typing feel is highly tactile and satisfying. RGB lights are very bright.', date: 'Jul 29, 2026', isApproved: true },
    { id: 4, customer: 'Clara Oswald', email: 'clara@example.com', product: 'Premium Hydro Skincare Serum', rating: 5, comment: 'Works wonders on dry skin! I noticed significant differences in texture within days.', date: 'Jul 28, 2026', isApproved: true },
    { id: 5, customer: 'Danny Pink', email: 'danny@example.com', product: 'Smart Fitness Tracker v4', rating: 2, comment: 'Battery backup is fine, but the sleep tracking metrics seem slightly inaccurate.', date: 'Jul 27, 2026', isApproved: true }
  ]);

  const [ratingFilter, setRatingFilter] = useState('All');

  const handleApprove = (id) => {
    setReviews(reviews.map(r => r.id === id ? { ...r, isApproved: true } : r));
  };

  const handleDelete = (id) => {
    if (window.confirm('Hide this review?')) {
      setReviews(reviews.filter(r => r.id !== id));
    }
  };

  const filtered = reviews.filter(r => {
    if (ratingFilter === 'All') return true;
    if (ratingFilter === 'Low') return r.rating <= 3;
    return r.rating === parseInt(ratingFilter);
  });

  return (
    <div className="space-y-6 select-none animate-fadeIn">
      
      {/* Title */}
      <div className="pb-4 border-b border-slate-200">
        <h2 className="text-lg font-bold text-slate-900 tracking-tight">Review Moderation</h2>
        <p className="text-xs text-slate-400 font-bold">Moderate customer feedback submissions and approve ratings.</p>
      </div>

      {/* Controls */}
      <div className="bg-white border border-slate-200 p-4 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-xs font-bold text-slate-400">Filter rating:</span>

        <div className="bg-slate-100 p-0.5 rounded flex gap-0.5 border border-slate-200/50">
          {['All', '5', '4', 'Low'].map((r) => (
            <button 
              key={r}
              onClick={() => setRatingFilter(r)}
              className={`px-3 py-1 text-[9px] font-bold rounded transition-all ${
                ratingFilter === r ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              {r === 'Low' ? 'Low (≤3★)' : `${r} Star`}
            </button>
          ))}
        </div>
      </div>

      {/* Reviews list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((rev) => (
          <div 
            key={rev.id} 
            className="bg-white border border-slate-200 p-5 rounded-lg shadow-xs flex flex-col justify-between gap-4"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="text-xs font-bold text-slate-800">{rev.customer}</h5>
                  <span className="text-[9px] text-slate-400 font-semibold">{rev.date}</span>
                </div>
                
                <div className="flex items-center gap-0.5 text-amber-400 font-bold text-xs">
                  ★ {rev.rating}
                </div>
              </div>

              <span className="inline-block text-[9px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded uppercase">
                {rev.product}
              </span>

              <p className="text-xs text-slate-500 font-semibold leading-relaxed pt-1">
                "{rev.comment}"
              </p>
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 pt-3">
              <div>
                {rev.isApproved ? (
                  <span className="inline-block text-[8px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                    APPROVED
                  </span>
                ) : (
                  <span className="inline-block text-[8px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                    PENDING
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3 text-xs font-bold">
                {!rev.isApproved && (
                  <button
                    onClick={() => handleApprove(rev.id)}
                    className="text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                  >
                    Approve
                  </button>
                )}
                <button
                  onClick={() => handleDelete(rev.id)}
                  className="text-rose-500 hover:text-rose-700 transition-colors cursor-pointer"
                >
                  Hide
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default ReviewsManagement;
