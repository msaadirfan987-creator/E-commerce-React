import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ButtonLoader from '../components/loaders/ButtonLoader';
import { Key, X, Copy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const VerifyEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { verifyEmail, resendCode, user } = useAuth();

  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [activeCode, setActiveCode] = useState(() => localStorage.getItem('temp_verification_code') || '');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copyStatus, setCopyStatus] = useState(null); // null | 'success' | 'error'
  const [modalTitle, setModalTitle] = useState('Account Created! 🎉');
  const [codeDigits, setCodeDigits] = useState(['', '', '', '', '', '']);
  const inputRefs = [
    React.useRef(null),
    React.useRef(null),
    React.useRef(null),
    React.useRef(null),
    React.useRef(null),
    React.useRef(null)
  ];

  // Sync digits array to single code string
  useEffect(() => {
    setCode(codeDigits.join(''));
  }, [codeDigits]);

  const handleDigitChange = (index, val) => {
    const cleanVal = val.replace(/\D/g, '').slice(-1);
    const newDigits = [...codeDigits];
    newDigits[index] = cleanVal;
    setCodeDigits(newDigits);

    if (cleanVal && index < 5) {
      inputRefs[index + 1].current.focus();
    }
  };

  const handleDigitKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (!codeDigits[index] && index > 0) {
        inputRefs[index - 1].current.focus();
        const newDigits = [...codeDigits];
        newDigits[index - 1] = '';
        setCodeDigits(newDigits);
      }
    }
  };

  const handleDigitPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pastedData.length === 6) {
      const newDigits = pastedData.split('');
      setCodeDigits(newDigits);
      inputRefs[5].current.focus();
    }
  };

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    // Redirect if already logged in and verified
    if (user && user.isVerified) {
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (user.role === 'seller') {
        navigate('/dashboard');
      } else {
        navigate('/');
      }
      return;
    }

    // Extract email from navigation state or query params
    const stateEmail = location.state?.email;
    const queryEmail = new URLSearchParams(location.search).get('email');
    const targetEmail = stateEmail || queryEmail || localStorage.getItem('unverified_email');

    if (!targetEmail) {
      setError('No email address provided. Please return to login page.');
    } else {
      setEmail(targetEmail);
      localStorage.setItem('unverified_email', targetEmail);
    }
  }, [location, user, navigate]);

  useEffect(() => {
    const storedCode = localStorage.getItem('temp_verification_code');
    if (storedCode) {
      setActiveCode(storedCode);
    }
  }, [location]);

  const handleCopyCode = async () => {
    if (!activeCode) return;
    try {
      await navigator.clipboard.writeText(activeCode);
      setCopyStatus('success');
      setTimeout(() => setCopyStatus(null), 3000);
    } catch (err) {
      setCopyStatus('error');
      setTimeout(() => setCopyStatus(null), 4000);
    }
  };

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!code || code.length !== 6) {
      setError('Please enter a valid 6-digit verification code.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const result = await verifyEmail(email, code);
      if (result.success) {
        setSuccess('Account verified successfully!');
        localStorage.removeItem('unverified_email');
        localStorage.removeItem('temp_verification_code');
        setIsModalOpen(false);
        
        const verifiedUser = result.user;
        
        // Redirect based on role
        setTimeout(() => {
          if (verifiedUser) {
            if (verifiedUser.role === 'admin') {
              navigate('/admin/dashboard');
            } else if (verifiedUser.role === 'seller') {
              navigate('/dashboard');
            } else {
              navigate('/');
            }
          } else {
            navigate('/');
          }
        }, 1500);

      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('An error occurred during verification. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;

    setError('');
    setSuccess('');

    try {
      const result = await resendCode(email);
      if (result.success) {
        setSuccess('Verification code regenerated successfully.');
        setResendCooldown(60); // 60 seconds cooldown
        if (result.verificationCode) {
          setActiveCode(result.verificationCode);
          localStorage.setItem('temp_verification_code', result.verificationCode);
          setModalTitle('New Code Generated! 🔑');
          setIsModalOpen(true);
        }
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Failed to resend verification code.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 select-none font-sans animate-fadeIn">
      {/* Verification Code Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Dark Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-slate-100 relative z-10 space-y-6 text-center select-none font-sans"
            >
              {/* Close Button ('X') */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer p-1"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Icon & Heading */}
              <div className="space-y-2">
                <div className="mx-auto w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center text-amber-600">
                  <Key className="w-6 h-6 animate-pulse" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">{modalTitle}</h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                  Your verification code is generated. Please enter this code below to verify your account.
                </p>
              </div>

              {/* Code Display Box */}
              <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-4 flex flex-col items-center justify-center gap-1.5 shadow-inner">
                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-extrabold">Verification Code</span>
                <span className="text-3xl font-extrabold tracking-widest text-slate-900 select-all font-mono">
                  {activeCode}
                </span>
              </div>

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
                  onClick={() => setIsModalOpen(false)}
                  className="w-full bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white font-bold text-xs py-2.5 px-4 rounded-lg transition-colors cursor-pointer shadow-xs"
                >
                  Continue
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="bg-white border border-slate-200 p-8 rounded-lg max-w-md w-full shadow-xs space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h2 className="text-base font-bold text-slate-900 tracking-tight">Verify Your Account</h2>
          <p className="text-xs text-slate-400 font-bold max-w-xs mx-auto">
            Enter the 6-digit verification code:
          </p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold p-3 rounded-lg">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs font-bold p-3 rounded-lg">
            {success}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleVerify} className="space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block text-center">
              Enter 6-Digit Code
            </label>
            <div className="flex justify-between items-center gap-2" onPaste={handleDigitPaste}>
              {codeDigits.map((digit, index) => (
                <input
                  key={index}
                  ref={inputRefs[index]}
                  type="text"
                  maxLength="1"
                  value={digit}
                  placeholder=""
                  autoComplete="off"
                  onChange={(e) => handleDigitChange(index, e.target.value)}
                  onKeyDown={(e) => handleDigitKeyDown(index, e)}
                  className="w-12 h-12 text-center text-xl font-extrabold border border-slate-200 focus:border-slate-850 bg-slate-50/50 rounded-xl focus:outline-none transition-all"
                  required
                />
              ))}
            </div>
          </div>

          <ButtonLoader
            type="submit"
            loading={loading}
            disabled={!email || code.length !== 6}
            label="Verify Account"
            loadingLabel="Verifying Account..."
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2.5 rounded-lg transition-colors cursor-pointer"
          />
        </form>

        {/* Resend & Actions */}
        <div className="text-center space-y-3 pt-2 text-xs font-semibold">
          {email && (
            <button 
              onClick={handleResend}
              disabled={resendCooldown > 0}
              className={`text-slate-500 hover:text-slate-900 transition-colors cursor-pointer ${
                resendCooldown > 0 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {resendCooldown > 0 ? `Generate New Code in ${resendCooldown}s` : 'Generate New Code'}
            </button>
          )}
          
          <div className="border-t border-slate-100 pt-3">
            <Link 
              to="/auth" 
              className="text-slate-400 hover:text-slate-700 transition-colors block"
            >
              Back to Login Page
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default VerifyEmail;
