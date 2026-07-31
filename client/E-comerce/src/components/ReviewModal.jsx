import React, { useState } from 'react';
import { Star, X } from 'lucide-react';
import reviewService from '../services/reviewService';

const ReviewModal = ({ order, onClose, onSuccess }) => {
  const [selectedProductId, setSelectedProductId] = useState(
    order.items && order.items.length > 0 ? order.items[0].product : ''
  );
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProductId) {
      setError('Please select a product to review.');
      return;
    }
    if (!comment.trim()) {
      setError('Please write a review comment.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const response = await reviewService.createReview({
        productId: selectedProductId,
        orderId: order._id,
        rating,
        comment: comment.trim(),
      });

      if (response.success) {
        alert('Thank you! Your feedback review has been submitted successfully.');
        if (onSuccess) onSuccess();
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 select-none font-sans animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="bg-slate-950 text-white p-4 flex items-center justify-between">
          <h3 className="text-xs font-black uppercase tracking-wider">Leave Product Review</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white cursor-pointer transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 flex-1">
          {error && (
            <div className="bg-rose-50 text-rose-600 text-[10px] font-bold p-3 rounded border border-rose-100">
              {error}
            </div>
          )}

          {/* Product selector if multiple items exist */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-slate-400 block">Select Product</label>
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg focus:outline-none focus:border-slate-400 text-slate-700"
            >
              {order.items.map((item, idx) => (
                <option key={idx} value={item.product}>
                  {item.title} (${item.price.toFixed(2)})
                </option>
              ))}
            </select>
          </div>

          {/* Star Rating Selection */}
          <div className="space-y-1.5 text-center py-2">
            <label className="text-[10px] uppercase font-bold text-slate-400 block text-left">Rating</label>
            <div className="flex items-center justify-center gap-2 mt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className="cursor-pointer transition-transform hover:scale-110 focus:outline-none"
                >
                  <Star
                    className={`w-7 h-7 ${
                      star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Comment */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-slate-400 block">Your Review</label>
            <textarea
              rows="4"
              placeholder="What did you think of the product? Share details about quality, packaging, or delivery..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full px-3 py-2.5 text-xs font-semibold border border-slate-200 bg-slate-50 focus:border-slate-400 rounded-lg focus:outline-none placeholder-slate-350 text-slate-800"
            />
          </div>

          {/* Submit */}
          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 border border-slate-200 text-slate-650 hover:bg-slate-50 text-xs font-bold rounded-lg cursor-pointer transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-slate-950 hover:bg-slate-800 text-white text-xs font-bold rounded-lg shadow-sm cursor-pointer transition-all disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

export default ReviewModal;
