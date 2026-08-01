import React from 'react';
import { MapPin, Phone, Trash2, Edit, Check } from 'lucide-react';

const AddressCard = ({ address, onEdit, onDelete, onSetDefault, loadingId }) => {
  const isUpdating = loadingId === address._id;

  return (
    <div className={`bg-white border rounded-xl p-4 transition-all relative select-none font-sans flex flex-col justify-between h-full ${
      address.isDefault ? 'border-slate-800 ring-1 ring-slate-800' : 'border-slate-200 hover:border-slate-350'
    }`}>
      
      {/* Top Section */}
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-0.5">
            <h4 className="font-bold text-xs text-slate-800 flex items-center gap-1.5 truncate">
              {address.fullName}
              {address.isDefault && (
                <span className="bg-slate-900 text-white text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full shrink-0">
                  Default
                </span>
              )}
            </h4>
            <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold">
              <Phone className="w-3 h-3 text-slate-350" />
              <span>{address.phone}</span>
            </div>
          </div>
          
          {/* Action Toolbar */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => onEdit(address)}
              disabled={isUpdating}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
              title="Edit Address"
            >
              <Edit className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete(address._id)}
              disabled={isUpdating}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50/50 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
              title="Delete Address"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Address Location Info */}
        <div className="text-slate-550 text-[11px] font-medium leading-relaxed flex items-start gap-1.5 pt-1">
          <MapPin className="w-3.5 h-3.5 text-slate-350 shrink-0 mt-0.5" />
          <div>
            <p className="text-slate-700 font-semibold">{address.completeAddress}</p>
            <p>{address.area}, {address.city}</p>
            <p>{address.country} - {address.postalCode}</p>
          </div>
        </div>
      </div>

      {/* Bottom Default Button Action */}
      {!address.isDefault && (
        <div className="pt-3 border-t border-slate-100 mt-4">
          <button
            onClick={() => onSetDefault(address._id)}
            disabled={isUpdating}
            className="w-full text-center text-[10px] font-black text-slate-500 hover:text-slate-900 py-1 border border-slate-200 hover:border-slate-400 rounded-lg transition-all cursor-pointer disabled:opacity-50 block uppercase tracking-wider"
          >
            {isUpdating ? 'Setting...' : 'Set as Default'}
          </button>
        </div>
      )}
    </div>
  );
};

export default AddressCard;
