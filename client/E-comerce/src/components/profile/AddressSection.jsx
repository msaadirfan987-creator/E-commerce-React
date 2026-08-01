import React, { useState, useEffect } from 'react';
import userService from '../../services/userService';
import AddressCard from './AddressCard';
import AddressForm from './AddressForm';
import { Plus, MapPin, Loader2 } from 'lucide-react';

const AddressSection = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [loadingId, setLoadingId] = useState(null);
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form toggle states
  const [showForm, setShowForm] = useState(false);
  const [editAddress, setEditAddress] = useState(null);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const response = await userService.getAddresses();
      if (response.success) {
        setAddresses(response.addresses || []);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load address list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleFormSubmit = async (formData) => {
    setActionLoading(true);
    setError('');
    setSuccess('');

    try {
      if (editAddress) {
        // Edit mode
        const response = await userService.updateAddress(editAddress._id, formData);
        if (response.success) {
          setAddresses(response.addresses);
          setSuccess('Address updated successfully!');
          setShowForm(false);
          setEditAddress(null);
        }
      } else {
        // Create mode
        const response = await userService.addAddress(formData);
        if (response.success) {
          setAddresses(response.addresses);
          setSuccess('Address added successfully!');
          setShowForm(false);
        }
      }
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to save address details.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditClick = (address) => {
    setEditAddress(address);
    setShowForm(true);
  };

  const handleDeleteClick = async (id) => {
    if (!window.confirm("Are you sure you want to delete this address?")) {
      return;
    }

    setLoadingId(id);
    setError('');
    setSuccess('');

    try {
      const response = await userService.deleteAddress(id);
      if (response.success) {
        setAddresses(response.addresses);
        setSuccess('Address deleted successfully!');
        setTimeout(() => setSuccess(''), 2000);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to delete address.');
    } finally {
      setLoadingId(null);
    }
  };

  const handleSetDefault = async (id) => {
    setLoadingId(id);
    setError('');
    setSuccess('');

    try {
      const response = await userService.setDefaultAddress(id);
      if (response.success) {
        setAddresses(response.addresses);
        setSuccess('Default address updated!');
        setTimeout(() => setSuccess(''), 2000);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to set default address.');
    } finally {
      setLoadingId(null);
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditAddress(null);
    setError('');
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm select-none font-sans space-y-5 animate-fadeIn">
      
      {/* Header section */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h3 className="font-bold text-sm text-slate-800 tracking-tight">Shipping Addresses</h3>
          <p className="text-[10px] text-slate-400 font-bold">Manage your shipping destinations and billing locations.</p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-all cursor-pointer shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Address
          </button>
        )}
      </div>

      {error && <div className="bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold p-3 rounded-lg">{error}</div>}
      {success && <div className="bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs font-bold p-3 rounded-lg">{success}</div>}

      {/* Address Form */}
      {showForm && (
        <AddressForm
          initialAddress={editAddress}
          onSubmit={handleFormSubmit}
          onCancel={handleCancelForm}
          loading={actionLoading}
        />
      )}

      {/* Main content area */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12 gap-2 text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin text-slate-500" />
          <span className="text-xs font-semibold">Loading address data...</span>
        </div>
      ) : addresses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <AddressCard
              key={address._id}
              address={address}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
              onSetDefault={handleSetDefault}
              loadingId={loadingId}
            />
          ))}
        </div>
      ) : (
        !showForm && (
          <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-slate-200 rounded-xl space-y-3">
            <div className="p-2.5 bg-slate-50 rounded-full border border-slate-100 text-slate-400">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-700">No Addresses Found</p>
              <p className="text-[10px] text-slate-400 font-semibold max-w-xs mt-0.5">
                Register a default shipping address to enable rapid, direct checkout checkouts during shopping.
              </p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-750 font-bold text-[10px] rounded-lg transition-colors cursor-pointer block uppercase tracking-wider"
            >
              Add Address
            </button>
          </div>
        )
      )}
    </div>
  );
};

export default AddressSection;
