import React from 'react';
import { User, Shield, Mail, Calendar } from 'lucide-react';

const ProfileHeader = ({ user }) => {
  if (!user) return null;

  // Format creation date
  const memberSince = user.createdAt 
    ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) 
    : 'Recently';

  // Format role name
  const getRoleLabel = (role) => {
    switch (role) {
      case 'customer': return 'Buyer';
      case 'seller': return 'Seller';
      case 'admin': return 'Admin';
      default: return role;
    }
  };

  // Generate initials if no image is available
  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-center gap-6 select-none font-sans">
      
      {/* Profile Picture / Initials */}
      <div className="relative shrink-0">
        {user.profileImage ? (
          <img 
            src={user.profileImage} 
            alt={user.fullName} 
            className="w-20 h-20 rounded-full object-cover border-2 border-slate-100 bg-slate-50"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xl tracking-wide uppercase border border-slate-800">
            {getInitials(user.fullName)}
          </div>
        )}
        <span className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" title="Active Account" />
      </div>

      {/* Profile Header Details */}
      <div className="flex-grow text-center md:text-left space-y-2.5">
        <div>
          <h2 className="text-lg font-black text-slate-900 leading-tight">
            {user.fullName}
          </h2>
          <div className="flex items-center justify-center md:justify-start gap-1.5 text-xs text-slate-400 font-bold mt-0.5">
            <Mail className="w-3.5 h-3.5" />
            <span>{user.email}</span>
          </div>
        </div>

        {/* Badges/Tags Row */}
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-1">
          {/* Role badge */}
          <span className="inline-flex items-center gap-1 bg-slate-50 border border-slate-200 text-slate-700 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider">
            <Shield className="w-3 h-3 text-slate-500" />
            {getRoleLabel(user.role)}
          </span>

          {/* Status badge */}
          <span className="inline-flex items-center gap-0.5 bg-emerald-50 border border-emerald-100 text-emerald-700 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider">
            <CircleDot className="w-3.5 h-3.5" />
            {user.isBlocked ? 'Suspended' : 'Active'}
          </span>

          {/* Date badge */}
          <span className="inline-flex items-center gap-1 bg-slate-50 border border-slate-100 text-slate-500 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
            <Calendar className="w-3 h-3" />
            Member since {memberSince}
          </span>
        </div>
      </div>
    </div>
  );
};

// Internal mini-indicator
const CircleDot = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <circle cx="12" cy="12" r="6" />
  </svg>
);

export default ProfileHeader;
