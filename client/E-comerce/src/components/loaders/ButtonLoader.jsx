import React from 'react';
import Spinner from './Spinner';

const ButtonLoader = ({ loading, label, loadingLabel, className = '', type = 'button', disabled, onClick }) => {
  const isDisabled = disabled || loading;
  return (
    <button
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition-all duration-150 ${className} ${isDisabled ? 'opacity-70 cursor-not-allowed' : ''}`}
    >
      {loading ? <Spinner size={18} className="text-white" /> : null}
      <span>{loading ? loadingLabel || 'Please wait...' : label}</span>
    </button>
  );
};

export default ButtonLoader;
