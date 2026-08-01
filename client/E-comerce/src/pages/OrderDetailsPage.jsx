import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import orderService from '../services/orderService';
import ChatWindow from '../components/ChatWindow';
import ReviewModal from '../components/ReviewModal';
import { Calendar, ShieldAlert, CheckCircle, FileText, RefreshCw, MessageSquare, Star } from 'lucide-react';

const OrderDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [showReview, setShowReview] = useState(false);

  const fetchOrderDetails = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await orderService.getOrderDetails(id);
      if (data.success) {
        setOrder(data.order);
      }
    } catch (err) {
      console.error('Failed to load order details:', err);
      setError('Could not fetch transaction details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    } else {
      fetchOrderDetails();
    }
  }, [id, user, navigate]);

  const handleCancelOrder = async () => {
    const confirmCancel = window.confirm('Are you sure you want to cancel this order?');
    if (!confirmCancel) return;

    try {
      const data = await orderService.cancelOrder(id);
      if (data.success) {
        alert('Order cancelled successfully.');
        setOrder({ ...order, orderStatus: 'Cancelled' });
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel order.');
    }
  };

  const handleReorder = () => {
    if (!order || !order.items) return;
    
    order.items.forEach(item => {
      addToCart({
        id: item.product,
        _id: item.product,
        title: item.title,
        price: item.price,
        img: item.image,
        seller: order.seller
      }, item.quantity);
    });

    alert('Items added back to your cart.');
    navigate('/checkout'); // Redirect buyer to checkout immediately!
  };

  const handleDownloadInvoice = () => {
    if (!order) return;
    const printWindow = window.open('', '_blank');
    const invoiceHtml = `
      <html>
        <head>
          <title>Invoice - ${order.orderNumber}</title>
          <style>
            body { font-family: sans-serif; padding: 40px; color: #333; line-height: 1.5; }
            .header { border-bottom: 2px solid #eee; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; }
            .title { font-size: 26px; font-weight: 900; }
            .meta { text-align: right; font-size: 12px; color: #666; }
            .meta p { margin: 2px 0; }
            .details { margin-bottom: 30px; display: flex; gap: 40px; }
            .detail-col { flex: 1; font-size: 13px; }
            .table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            .table th, .table td { border-bottom: 1px solid #eee; padding: 12px; text-align: left; font-size: 13px; }
            .table th { background-color: #f9f9f9; font-weight: bold; text-transform: uppercase; font-size: 10px; tracking: 1px; }
            .totals { float: right; width: 300px; font-size: 13px; }
            .totals-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f9f9f9; }
            .bold { font-weight: bold; color: #000; }
            .total-bill { font-size: 16px; border-top: 1px solid #eee; padding-top: 10px; margin-top: 10px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="title">CARTIFY INVOICE</div>
              <p style="font-size:12px; color:#999; margin:4px 0 0 0;">Transaction details slip</p>
            </div>
            <div class="meta">
              <p>Invoice #: INV-${order.orderNumber}</p>
              <p>Date: ${new Date(order.createdAt).toLocaleDateString()}</p>
              <p>Status: ${order.paymentStatus} / ${order.orderStatus}</p>
            </div>
          </div>
          <div class="details">
            <div class="detail-col">
              <strong>Billed To:</strong><br/>
              ${order.shippingAddress.fullName}<br/>
              ${order.shippingAddress.address}<br/>
              ${order.shippingAddress.city}, ${order.shippingAddress.postalCode}<br/>
              Phone: ${order.shippingAddress.phone}<br/>
              Email: ${order.shippingAddress.email}
            </div>
            <div class="detail-col">
              <strong>Merchant:</strong><br/>
              ${order.seller?.fullName || 'Platform Seller'}<br/>
              Contact: ${order.seller?.email || 'N/A'}<br/>
              Payment Method: ${order.paymentMethod}
            </div>
          </div>
          <table class="table">
            <thead>
              <tr>
                <th>Product description</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${order.items.map(item => `
                <tr>
                  <td>${item.title}</td>
                  <td>$${item.price.toFixed(2)}</td>
                  <td>${item.quantity}</td>
                  <td>$${(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="totals">
            <div class="totals-row"><span>Items Subtotal:</span><span>$${order.totalPrice.toFixed(2)}</span></div>
            <div class="totals-row"><span>Shipping & Handling:</span><span>$15.00</span></div>
            <div class="totals-row bold total-bill"><span>Total Amount (Paid via COD):</span><span>$${(order.totalPrice + 15).toFixed(2)}</span></div>
          </div>
          <script>
            window.onload = function() {
              window.print();
              window.close();
            }
          </script>
        </body>
      </html>
    `;
    printWindow.document.write(invoiceHtml);
    printWindow.document.close();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-slate-100 text-slate-700';
      case 'Confirmed':
        return 'bg-blue-50 text-blue-700';
      case 'Packed':
      case 'Processing':
        return 'bg-amber-50 text-amber-700';
      case 'Shipped':
        return 'bg-indigo-50 text-indigo-700';
      case 'Out For Delivery':
        return 'bg-purple-50 text-purple-700';
      case 'Delivered':
        return 'bg-emerald-50 text-emerald-700';
      case 'Cancelled':
      case 'Rejected':
        return 'bg-rose-50 text-rose-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center select-none">
        <p className="text-slate-400 font-bold text-xs animate-pulse">Loading order details...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center select-none text-center">
        <p className="text-rose-500 font-bold text-xs">{error || 'Order record not found.'}</p>
        <Link to="/my-orders" className="text-slate-900 text-xs font-bold underline mt-4">Back to My Orders</Link>
      </div>
    );
  }

  const isPendingOrConfirmed = order.orderStatus === 'Pending' || order.orderStatus === 'Confirmed';
  const isDelivered = order.orderStatus === 'Delivered';
  const isCancelled = order.orderStatus === 'Cancelled' || order.orderStatus === 'Rejected';

  const shippingCost = 15.00;
  const subtotal = order.totalPrice;
  const total = subtotal + shippingCost;
  const sellerName = order.seller?.fullName || 'Vendor';

  // Estimate delivery date: 7 days after placement
  const estimatedDelivery = new Date(new Date(order.createdAt).getTime() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Steps mapping
  const timelineSteps = ["Pending", "Confirmed", "Processing", "Shipped", "Out For Delivery", "Delivered"];
  // Map Packed -> Processing for timeline visualization
  const currentFulfillmentStatus = order.orderStatus === 'Packed' ? 'Processing' : order.orderStatus;
  const currentStepIdx = timelineSteps.indexOf(currentFulfillmentStatus);

  return (
    <div className="min-h-screen bg-slate-50 py-10 font-sans select-none animate-fadeIn">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Header toolbar */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-200 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-bold text-slate-400 font-mono">#{order.orderNumber}</span>
              <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold ${getStatusColor(order.orderStatus)}`}>
                {order.orderStatus}
              </span>
            </div>
            <h1 className="text-base font-black text-slate-900 uppercase tracking-tight">Order Invoice Details</h1>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link 
              to="/my-orders" 
              className="px-3 py-1.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-650 font-bold text-xs rounded-lg transition-colors cursor-pointer"
            >
              Back to List
            </Link>
            
            {isPendingOrConfirmed && (
              <button 
                onClick={handleCancelOrder}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
              >
                Cancel Order
              </button>
            )}

            <button 
              onClick={handleDownloadInvoice}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 border border-slate-250"
            >
              <FileText className="w-3.5 h-3.5" />
              Download Invoice
            </button>

            <button 
              onClick={handleReorder}
              className="px-3 py-1.5 bg-slate-950 hover:bg-slate-850 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reorder
            </button>
          </div>
        </div>

        {/* 1. Track Order Timeline */}
        {!isCancelled ? (
          <div className="bg-white border border-slate-200 p-5 rounded-lg mb-6 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-850 uppercase tracking-wider">
              <Calendar className="w-4 h-4 text-slate-500" />
              <span>Fulfillment Timeline Tracking</span>
            </div>

            {/* Horizontal Timeline */}
            <div className="relative pt-6 pb-2">
              {/* Progress bar line */}
              <div className="absolute top-8 left-0 w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                <div 
                  className="bg-slate-900 h-full transition-all duration-500" 
                  style={{ width: `${(Math.max(0, currentStepIdx) / (timelineSteps.length - 1)) * 100}%` }}
                />
              </div>

              {/* Steps Dots */}
              <div className="relative flex justify-between">
                {timelineSteps.map((step, idx) => {
                  const isDone = idx <= currentStepIdx;
                  const isCurrent = idx === currentStepIdx;
                  return (
                    <div key={idx} className="flex flex-col items-center space-y-2">
                      <div 
                        className={`w-5 h-5 rounded-full flex items-center justify-center border text-[9px] font-bold z-10 transition-all ${
                          isCurrent 
                            ? 'bg-slate-900 text-white border-slate-900 ring-4 ring-slate-100' 
                            : isDone 
                              ? 'bg-slate-800 text-white border-slate-800' 
                              : 'bg-white text-slate-300 border-slate-200'
                        }`}
                      >
                        {isDone ? '✓' : idx + 1}
                      </div>
                      <span className={`text-[8px] font-bold uppercase tracking-wider ${isCurrent ? 'text-slate-900' : 'text-slate-400'}`}>
                        {step}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="bg-slate-50 p-3 rounded text-[10px] font-bold text-slate-500 flex justify-between">
              <span>Estimated Delivery: {estimatedDelivery}</span>
              <span className="text-emerald-600">Standard Shipping Split</span>
            </div>
          </div>
        ) : (
          <div className="bg-rose-50 border border-rose-100 text-rose-750 p-4 rounded-lg flex items-center gap-3 mb-6">
            <ShieldAlert className="w-5 h-5 text-rose-550 shrink-0" />
            <div className="text-xs font-semibold">
              <p className="font-bold">This order has been cancelled.</p>
              <p className="text-[10px] text-rose-450 mt-0.5">Inventory values have been adjusted. You can reorder the items at any time using the Reorder action.</p>
            </div>
          </div>
        )}

        {/* 2. Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          
          {/* LEFT/CENTER DETAILS: Products & Costs */}
          <div className="md:col-span-2 space-y-6">
            
            {/* Products Card */}
            <div className="bg-white border border-slate-200 p-5 rounded-lg space-y-4">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2">
                Ordered Products
              </h3>

              <div className="divide-y divide-slate-100">
                {order.items.map((item, idx) => (
                  <div key={idx} className="py-3.5 flex items-center gap-4 first:pt-0 last:pb-0">
                    <img 
                      src={item.image || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=100&q=80'} 
                      alt={item.title} 
                      className="w-12 h-12 rounded object-cover border border-slate-200 shrink-0 bg-slate-50"
                      onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=100&q=80'; }}
                    />
                    <div className="flex-grow min-w-0">
                      <h4 className="text-xs font-bold text-slate-800 truncate">{item.title}</h4>
                      <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Quantity: {item.quantity} <span className="text-slate-250">|</span> Unit: ${item.price.toFixed(2)}</p>
                    </div>
                    <span className="text-xs font-black text-slate-900 shrink-0">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Calculations Card */}
            <div className="bg-white border border-slate-200 p-5 rounded-lg space-y-3.5 text-xs font-semibold text-slate-500 shadow-xs">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2">
                Cost Breakdown
              </h3>
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-slate-800 font-bold">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping Cost</span>
                <span className="text-slate-800 font-bold">${shippingCost.toFixed(2)}</span>
              </div>
              <div className="border-t border-slate-150 pt-2.5 flex justify-between text-sm font-bold text-slate-900">
                <span>Total Bill ({order.paymentMethod})</span>
                <span className="text-base font-black text-slate-950">${total.toFixed(2)}</span>
              </div>
            </div>

          </div>

          {/* RIGHT DETAILS: Shipping Address & Merchant info */}
          <div className="md:col-span-1 space-y-6">
            
            {/* Delivery address */}
            <div className="bg-white border border-slate-200 p-5 rounded-lg space-y-3 shadow-xs">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2">
                Delivery Address
              </h3>
              
              <div className="text-xs font-semibold text-slate-650 space-y-2 leading-relaxed">
                <div>
                  <p className="font-bold text-slate-900">{order.shippingAddress.fullName}</p>
                  <p>{order.shippingAddress.phone}</p>
                  <p className="text-slate-400 text-[10px]">{order.shippingAddress.email}</p>
                </div>
                <div className="pt-2 border-t border-slate-50 text-[11px]">
                  <p>{order.shippingAddress.address}</p>
                  <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                  <p>{order.shippingAddress.country}</p>
                </div>
              </div>
            </div>

            {/* Merchant Details & Action buttons */}
            <div className="bg-white border border-slate-200 p-5 rounded-lg space-y-3 text-xs font-semibold text-slate-500 shadow-xs">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2">
                Merchant Info
              </h3>
              <div>
                <p className="text-slate-800 font-bold">{sellerName}</p>
                <p className="text-[9px] text-slate-400 font-medium">{order.seller?.email}</p>
              </div>

              {/* Chat and Review Triggers */}
              <div className="pt-2 flex flex-col gap-2">
                <Link
                  to={`/messages?sellerId=${order.seller?._id || order.seller}&productId=${order.items[0]?.product?._id || order.items[0]?.product}&orderId=${order._id}`}
                  className="w-full py-2 bg-slate-950 hover:bg-slate-800 text-white rounded-lg font-bold text-xs text-center flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  Message Seller
                </Link>

                {isDelivered && (
                  <button
                    onClick={() => setShowReview(true)}
                    className="w-full py-2 border border-slate-200 hover:bg-slate-50 text-slate-850 rounded-lg font-bold text-xs text-center flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    Leave Product Review
                  </button>
                )}
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Floats / Modals */}
      {showChat && (
        <ChatWindow 
          orderId={order._id}
          sellerName={sellerName}
          onClose={() => setShowChat(false)}
        />
      )}

      {showReview && (
        <ReviewModal 
          order={order}
          onClose={() => setShowReview(false)}
          onSuccess={fetchOrderDetails}
        />
      )}

    </div>
  );
};

export default OrderDetailsPage;
