import React, { useState, useEffect } from 'react';
import { Loader2, Plus, Check, X } from 'lucide-react';

const AddressForm = ({ initialAddress, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    country: '',
    city: '',
    area: '',
    completeAddress: '',
    postalCode: '',
    isDefault: false
  });

  useEffect(() => {
    if (initialAddress) {
      setFormData({
        fullName: initialAddress.fullName || '',
        phone: initialAddress.phone || '',
        country: initialAddress.country || '',
        city: initialAddress.city || '',
        area: initialAddress.area || '',
        completeAddress: initialAddress.completeAddress || '',
        postalCode: initialAddress.postalCode || '',
        isDefault: initialAddress.isDefault || false
      });
    }
  }, [initialAddress]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 select-none font-sans bg-slate-50/50 border border-slate-200 rounded-xl p-4 animate-fadeIn">
      <h4 className="font-bold text-xs text-slate-800 border-b border-slate-200 pb-2 uppercase tracking-wide">
        {initialAddress ? 'Modify Address' : 'Register New Address'}
      </h4>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        
        {/* Full Name */}
        <div>
          <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Recipient Name</label>
          <input
            type="text"
            name="fullName"
            required
            value={formData.fullName}
            onChange={handleChange}
            placeholder="e.g. Muhammad Saad"
            className="w-full px-3 py-1.5 text-xs font-bold border border-slate-200 focus:border-slate-450 bg-white rounded-lg focus:outline-none text-slate-700 placeholder-slate-300"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Contact Phone</label>
          <input
            type="tel"
            name="phone"
            required
            value={formData.phone}
            onChange={handleChange}
            placeholder="e.g. +92 300 1234567"
            className="w-full px-3 py-1.5 text-xs font-bold border border-slate-200 focus:border-slate-450 bg-white rounded-lg focus:outline-none text-slate-700 placeholder-slate-300"
          />
        </div>

        {/* Country */}
        <div>
          <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Country</label>
          <input
            type="text"
            name="country"
            required
            value={formData.country}
            onChange={handleChange}
            placeholder="e.g. Pakistan"
            className="w-full px-3 py-1.5 text-xs font-bold border border-slate-200 focus:border-slate-450 bg-white rounded-lg focus:outline-none text-slate-700 placeholder-slate-300"
          />
        </div>

        {/* City */}
        <div>
          <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">City</label>
          <input
            type="text"
            name="city"
            required
            value={formData.city}
            onChange={handleChange}
            placeholder="e.g. Lahore"
            className="w-full px-3 py-1.5 text-xs font-bold border border-slate-200 focus:border-slate-450 bg-white rounded-lg focus:outline-none text-slate-700 placeholder-slate-300"
          />
        </div>

        {/* Area / Neighborhood */}
        <div>
          <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Area / Neighborhood</label>
          <input
            type="text"
            name="area"
            required
            value={formData.area}
            onChange={handleChange}
            placeholder="e.g. Gulberg III"
            className="w-full px-3 py-1.5 text-xs font-bold border border-slate-200 focus:border-slate-450 bg-white rounded-lg focus:outline-none text-slate-700 placeholder-slate-300"
          />
        </div>

        {/* Postal Code */}
        <div>
          <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Postal Code</label>
          <input
            type="text"
            name="postalCode"
            required
            value={formData.postalCode}
            onChange={handleChange}
            placeholder="e.g. 54000"
            className="w-full px-3 py-1.5 text-xs font-bold border border-slate-200 focus:border-slate-450 bg-white rounded-lg focus:outline-none text-slate-700 placeholder-slate-300"
          />
        </div>

        {/* Complete Street Address */}
        <div className="sm:col-span-2">
          <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Street Address</label>
          <input
            type="text"
            name="completeAddress"
            required
            value={formData.completeAddress}
            onChange={handleChange}
            placeholder="e.g. House 42, Block B, Street 5"
            className="w-full px-3 py-1.5 text-xs font-bold border border-slate-200 focus:border-slate-450 bg-white rounded-lg focus:outline-none text-slate-700 placeholder-slate-300"
          />
        </div>

        {/* Set as default checkbox */}
        <div className="sm:col-span-2">
          <label className="flex items-center gap-2 text-xs font-bold text-slate-600 cursor-pointer pt-1.5">
            <input
              type="checkbox"
              name="isDefault"
              checked={formData.isDefault}
              onChange={handleChange}
              className="rounded text-slate-900 border-slate-250 focus:ring-0 w-3.5 h-3.5"
            />
            Make this my default shipping address
          </label>
        </div>

      </div>

      {/* Form CTA Toolbar */}
      <div className="flex justify-end gap-2 border-t border-slate-200 pt-3.5 mt-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="flex items-center gap-1 px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-700 rounded-lg text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
        >
          <X className="w-3.5 h-3.5" />
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-1 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold shadow-sm transition-all cursor-pointer disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              {initialAddress ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
              {initialAddress ? 'Update' : 'Register'}
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default AddressForm;
