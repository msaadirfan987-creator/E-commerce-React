import React, { useState } from 'react';
import userService from '../../services/userService';
import { User, Phone, Mail, Image, Edit2, Check, X, Loader2 } from 'lucide-react';

const ProfileInformation = ({ user, onProfileUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    profileImage: user?.profileImage || ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCancel = () => {
    setFormData({
      fullName: user?.fullName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      profileImage: user?.profileImage || ''
    });
    setError('');
    setIsEditing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await userService.updateUserProfile(formData);
      if (response.success) {
        setSuccess('Profile updated successfully!');
        if (onProfileUpdate) {
          onProfileUpdate(response.user);
        }
        setTimeout(() => {
          setSuccess('');
          setIsEditing(false);
        }, 1500);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to save changes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm select-none font-sans space-y-5">
      
      {/* Title block */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h3 className="font-bold text-sm text-slate-800 tracking-tight">Personal Info</h3>
          <p className="text-[10px] text-slate-400 font-bold">Manage your profile details and contact information.</p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-650 hover:text-slate-800 rounded-lg text-xs font-bold transition-all cursor-pointer"
          >
            <Edit2 className="w-3 h-3" />
            Edit Info
          </button>
        )}
      </div>

      {error && <div className="bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold p-3 rounded-lg">{error}</div>}
      {success && <div className="bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs font-bold p-3 rounded-lg">{success}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Full Name */}
          <div>
            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Full Name</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <User className="w-4 h-4" />
              </span>
              <input
                type="text"
                name="fullName"
                disabled={!isEditing || loading}
                value={formData.fullName}
                onChange={handleChange}
                required
                className="w-full pl-9 pr-3 py-2 text-xs font-bold border border-slate-200 focus:border-slate-450 bg-slate-50/50 disabled:bg-slate-50/20 rounded-lg focus:outline-none text-slate-700 disabled:text-slate-500"
              />
            </div>
          </div>

          {/* Email Address */}
          <div>
            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Email Address</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="email"
                name="email"
                disabled={!isEditing || loading}
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full pl-9 pr-3 py-2 text-xs font-bold border border-slate-200 focus:border-slate-450 bg-slate-50/50 disabled:bg-slate-50/20 rounded-lg focus:outline-none text-slate-700 disabled:text-slate-500"
              />
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Phone Number</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <Phone className="w-4 h-4" />
              </span>
              <input
                type="tel"
                name="phone"
                placeholder="e.g. +92 300 1234567"
                disabled={!isEditing || loading}
                value={formData.phone}
                onChange={handleChange}
                className="w-full pl-9 pr-3 py-2 text-xs font-bold border border-slate-200 focus:border-slate-450 bg-slate-50/50 disabled:bg-slate-50/20 rounded-lg focus:outline-none text-slate-700 disabled:text-slate-500 placeholder-slate-300"
              />
            </div>
          </div>

          {/* Profile Image URL */}
          <div>
            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Profile Photo URL</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <Image className="w-4 h-4" />
              </span>
              <input
                type="url"
                name="profileImage"
                placeholder="https://example.com/avatar.jpg"
                disabled={!isEditing || loading}
                value={formData.profileImage}
                onChange={handleChange}
                className="w-full pl-9 pr-3 py-2 text-xs font-bold border border-slate-200 focus:border-slate-450 bg-slate-50/50 disabled:bg-slate-50/20 rounded-lg focus:outline-none text-slate-700 disabled:text-slate-500 placeholder-slate-300"
              />
            </div>
          </div>

        </div>

        {/* Profile Image Preview */}
        {formData.profileImage && (
          <div className="pt-2">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Avatar Preview</span>
            <div className="w-14 h-14 rounded-full overflow-hidden border border-slate-200 bg-slate-50">
              <img 
                src={formData.profileImage} 
                alt="Profile Preview" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {isEditing && (
          <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={handleCancel}
              disabled={loading}
              className="flex items-center gap-1 px-3.5 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-700 rounded-lg text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
            >
              <X className="w-3.5 h-3.5" />
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold shadow-sm transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default ProfileInformation;
