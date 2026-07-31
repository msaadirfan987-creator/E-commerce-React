import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import reviewService from '../../services/reviewService';
import { useAuth } from '../../context/AuthContext';

const ReviewsManagement = () => {
  const { token } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [ratingFilter, setRatingFilter] = useState('All');

  const fetchSellerReviews = async () => {
    try {
      setLoading(true);
      const data = await reviewService.getSellerReviews();
      if (data.success) {
        setReviews(data.reviews || []);
      }
    } catch (err) {
      console.error('Failed to load merchant reviews:', err);
      setError('Could not fetch reviews history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchSellerReviews();
    }
  }, [token]);

  const handleDelete = async (id) => {
    if (window.confirm('Delete this customer review permanently?')) {
      try {
        const data = await reviewService.deleteReview(id);
        if (data.success) {
          alert('Review deleted/hidden successfully.');
          setReviews(reviews.filter(r => r._id !== id));
        }
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to moderate review.');
      }
    }
  };

  const filtered = reviews.filter(r => {
    if (ratingFilter === 'All') return true;
    if (ratingFilter === 'Low') return r.rating <= 3;
    return r.rating === parseInt(ratingFilter);
  });

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center select-none font-sans">
        <p className="text-slate-400 font-bold text-xs animate-pulse">Retrieving customer feedback...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 select-none animate-fadeIn font-sans">
      
      {/* Title */}
      <div className="pb-4 border-b border-slate-200">
        <h2 className="text-sm font-black text-slate-900 tracking-tight uppercase">Review Moderation</h2>
        <p className="text-xs text-slate-400 font-semibold">Moderate customer feedback submissions and analyze product ratings.</p>
      </div>

      {/* Controls */}
      <div className="bg-white border border-slate-200 p-4 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Filter rating:</span>

        <div className="bg-slate-100 p-0.5 rounded flex gap-0.5 border border-slate-200/50">
          {['All', '5', '4', 'Low'].map((r) => (
            <button 
              key={r}
              onClick={() => setRatingFilter(r)}
              className={`px-3 py-1 text-[9px] font-bold rounded transition-all cursor-pointer ${
                ratingFilter === r ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              {r === 'Low' ? 'Low (≤3★)' : `${r} Star`}
            </button>
          ))}
        </div>
      </div>

      {/* Reviews list */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((rev) => (
            <div 
              key={rev._id} 
              className="bg-white border border-slate-200 p-5 rounded-lg shadow-xs flex flex-col justify-between gap-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">{rev.buyer?.fullName || 'Anonymous'}</h5>
                    <span className="text-[9px] text-slate-400 font-bold block mt-0.5">
                      {new Date(rev.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-1 text-amber-500 font-bold text-xs bg-amber-50 px-2.5 py-0.5 rounded-full">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500 shrink-0" />
                    <span>{rev.rating}</span>
                  </div>
                </div>

                <span className="inline-block text-[9px] font-black text-slate-500 bg-slate-100 px-2 py-0.5 rounded uppercase font-mono">
                  {rev.product?.title || 'Unknown Product'}
                </span>

                <p className="text-xs text-slate-550 font-semibold leading-relaxed pt-1 italic">
                  "{rev.comment}"
                </p>
              </div>

              <div className="flex items-center justify-end border-t border-slate-100 pt-3">
                <button
                  onClick={() => handleDelete(rev._id)}
                  className="text-rose-500 hover:text-rose-700 text-xs font-bold transition-colors cursor-pointer"
                >
                  Delete Review
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-slate-250 p-12 text-center rounded-lg">
          <p className="text-slate-400 text-xs font-bold">No Reviews Found</p>
          <p className="text-[10px] text-slate-400 mt-1">Submit product reviews after order delivery to display them here.</p>
        </div>
      )}

    </div>
  );
};

export default ReviewsManagement;
