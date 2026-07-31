import React from 'react';
import { Link } from 'react-router-dom';

const Notifications = ({ onClose }) => {
  const alerts = [
    {
      id: 1,
      title: 'New Order Received',
      desc: 'Order #4829 placed by Sarah J. ($189.00)',
      time: '3 mins ago',
      path: '/dashboard/orders',
    },
    {
      id: 2,
      title: 'Out of Stock Warning',
      desc: '"Minimalist Leather Watch" has hit 0 units.',
      time: '2 hours ago',
      path: '/dashboard/inventory',
      isWarning: true
    },
    {
      id: 3,
      title: 'New Product Review',
      desc: 'Danny gave 5 stars to "Wireless Headphones".',
      time: '5 hours ago',
      path: '/dashboard/reviews',
    },
  ];

  return (
    <div className="absolute right-0 mt-2.5 w-72 bg-white rounded-lg border border-slate-200 shadow-lg overflow-hidden z-50 p-2">
      {/* Header header */}
      <div className="px-2.5 py-1.5 border-b border-slate-100 flex items-center justify-between mb-2">
        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Alerts</h4>
        <button 
          onClick={onClose}
          className="text-[10px] font-bold text-slate-500 hover:text-slate-900 cursor-pointer"
        >
          Clear
        </button>
      </div>

      {/* Notifications list */}
      <div className="space-y-1 max-h-60 overflow-y-auto">
        {alerts.map((alert) => (
          <Link
            key={alert.id}
            to={alert.path}
            onClick={onClose}
            className="p-2 rounded hover:bg-slate-50 block text-left"
          >
            <div className="flex items-center justify-between">
              <span className={`text-[10px] font-bold ${alert.isWarning ? 'text-rose-600' : 'text-slate-800'}`}>
                {alert.title}
              </span>
              <span className="text-[8px] text-slate-400 font-semibold">{alert.time}</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1 leading-normal font-medium">
              {alert.desc}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
