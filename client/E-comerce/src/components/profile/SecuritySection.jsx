import React, { useState } from 'react';
import userService from '../../services/userService';
import { Key, Eye, EyeOff, Loader2 } from 'lucide-react';

const SecuritySection = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Visibility States
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const { currentPassword, newPassword, confirmNewPassword } = formData;

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError('New password and password confirmation do not match.');
      return;
    }

    setLoading(true);

    try {
      const response = await userService.changePassword({ currentPassword, newPassword });
      if (response.success) {
        setSuccess('Password updated successfully!');
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmNewPassword: ''
        });
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to update password. Verify current password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm select-none font-sans space-y-5 animate-fadeIn">
      
      {/* Title Header */}
      <div className="border-b border-slate-100 pb-3">
        <h3 className="font-bold text-sm text-slate-800 tracking-tight">Account Security</h3>
        <p className="text-[10px] text-slate-400 font-bold">Update credentials to ensure your account remains secure.</p>
      </div>

      {error && <div className="bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold p-3 rounded-lg">{error}</div>}
      {success && <div className="bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs font-bold p-3 rounded-lg">{success}</div>}

      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        
        {/* Current Password */}
        <div>
          <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Current Password</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <Key className="w-4 h-4" />
            </span>
            <input
              type={showCurrent ? 'text' : 'password'}
              name="currentPassword"
              disabled={loading}
              value={formData.currentPassword}
              onChange={handleChange}
              required
              className="w-full pl-9 pr-10 py-2 text-xs font-bold border border-slate-200 focus:border-slate-450 bg-slate-50/50 rounded-lg focus:outline-none text-slate-700"
            />
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-650 cursor-pointer"
            >
              {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* New Password */}
        <div>
          <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">New Password</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <Key className="w-4 h-4" />
            </span>
            <input
              type={showNew ? 'text' : 'password'}
              name="newPassword"
              disabled={loading}
              value={formData.newPassword}
              onChange={handleChange}
              required
              className="w-full pl-9 pr-10 py-2 text-xs font-bold border border-slate-200 focus:border-slate-450 bg-slate-50/50 rounded-lg focus:outline-none text-slate-700"
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-650 cursor-pointer"
            >
              {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Confirm New Password */}
        <div>
          <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Confirm New Password</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <Key className="w-4 h-4" />
            </span>
            <input
              type={showConfirm ? 'text' : 'password'}
              name="confirmNewPassword"
              disabled={loading}
              value={formData.confirmNewPassword}
              onChange={handleChange}
              required
              className="w-full pl-9 pr-10 py-2 text-xs font-bold border border-slate-200 focus:border-slate-450 bg-slate-50/50 rounded-lg focus:outline-none text-slate-700"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-650 cursor-pointer"
            >
              {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-1.5 px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold shadow-sm transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Updating...
              </>
            ) : (
              'Change Password'
            )}
          </button>
        </div>

      </form>
    </div>
  );
};

export default SecuritySection;
