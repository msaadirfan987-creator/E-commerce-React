import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, X } from 'lucide-react';

const VerificationCodeModal = ({ isOpen, code, onClose, onContinue }) => {
  const [copyStatus, setCopyStatus] = useState(null); // null | 'success' | 'error'

  const handleCopyCode = async () => {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      setCopyStatus('success');
      setTimeout(() => setCopyStatus(null), 3000);
    } catch (err) {
      setCopyStatus('error');
      setTimeout(() => setCopyStatus(null), 4000);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Dark Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
          />

          {/* Modal Box */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="rounded-2xl max-w-sm w-full p-6 shadow-2xl relative z-10 space-y-6 text-center select-none font-sans"
            style={{ backgroundColor: '#ffffff', border: '1px solid #f1f5f9' }}
          >
            {/* Close Button ('X') */}
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer p-1"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Icon & Heading */}
            <div className="space-y-2">
              <div className="mx-auto w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 animate-bounce">
                <span className="text-xl">🎉</span>
              </div>
              <h3 className="text-xl font-extrabold tracking-tight" style={{ color: '#0f172a' }}>Account Created! 🎉</h3>
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#64748b' }}>
                Your Verification Code
              </p>
            </div>

            {/* Code Display Box */}
            <div className="rounded-xl py-4 px-6 flex flex-col items-center justify-center gap-1.5 shadow-inner" style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <span className="text-3xl font-extrabold tracking-widest select-all font-mono" style={{ color: '#0f172a' }}>
                {code}
              </span>
            </div>

            <p className="text-xs max-w-xs mx-auto leading-relaxed font-medium" style={{ color: '#475569' }}>
              Enter this code on the next screen to verify your account.
            </p>

            {/* Copy Code & Continue Buttons */}
            <div className="flex flex-col gap-2 pt-2">
              <button
                type="button"
                onClick={handleCopyCode}
                className="w-full border border-slate-200 hover:bg-slate-50 active:bg-slate-100 text-slate-700 font-bold text-xs py-2.5 px-4 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Copy className="w-4 h-4 text-slate-500" />
                {copyStatus === 'success' && 'Code copied successfully!'}
                {copyStatus === 'error' && 'Unable to copy automatically. Please copy the code manually.'}
                {copyStatus === null && 'Copy Code'}
              </button>
              <button
                type="button"
                onClick={onContinue}
                className="w-full bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white font-bold text-xs py-2.5 px-4 rounded-lg transition-colors cursor-pointer shadow-xs"
              >
                Continue
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default VerificationCodeModal;
