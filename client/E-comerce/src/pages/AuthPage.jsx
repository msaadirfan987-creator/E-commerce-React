import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const AuthPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  // Mode & Form state
  const [isSignUp, setIsSignUp] = useState(false);
  const [role, setRole] = useState('shop'); // 'shop' (customer) or 'sell' (seller)

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [signupFullName, setSignupFullName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleToggleMode = (signUpMode) => {
    setIsSignUp(signUpMode);
    setError('');
    setSuccess('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!loginEmail || !loginPassword) {
      setError('Please fill in all email and password fields.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        login(data.token, data.user);
        let targetRoute = '/';
        let targetName = 'Home Page';
        
        if (data.user.role === 'admin') {
          targetRoute = '/admin/dashboard';
          targetName = 'Admin Dashboard';
        } else if (data.user.role === 'seller') {
          targetRoute = '/dashboard';
          targetName = 'Seller Dashboard';
        }

        setSuccess(`Login successful. Redirecting to ${targetName}...`);
        setTimeout(() => {
          setLoading(false);
          navigate(targetRoute);
        }, 1500);
      } else {
        setLoading(false);
        setError(data.message || 'Login failed. Verify email and password.');
      }
    } catch (err) {
      setLoading(false);
      setError('Connection error: Could not reach the authentication server.');
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!signupFullName || !signupEmail || !signupPassword || !signupConfirmPassword) {
      setError('Please fill in all required fields (Name, Email, Password).');
      setLoading(false);
      return;
    }

    if (signupPassword !== signupConfirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    if (signupPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      setLoading(false);
      return;
    }

    const mappedRole = role === 'shop' ? 'customer' : 'seller';

    try {
      const response = await fetch(`${API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: signupFullName,
          email: signupEmail,
          password: signupPassword,
          role: mappedRole,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        login(data.token, data.user);
        let targetRoute = '/';
        let targetName = 'Home Page';
        
        if (data.user.role === 'admin') {
          targetRoute = '/admin/dashboard';
          targetName = 'Admin Dashboard';
        } else if (data.user.role === 'seller') {
          targetRoute = '/dashboard';
          targetName = 'Seller Dashboard';
        }

        setSuccess(`Registration successful. Redirecting to ${targetName}...`);
        setTimeout(() => {
          setLoading(false);
          navigate(targetRoute);
        }, 1500);
      } else {
        setLoading(false);
        setError(data.message || 'Registration failed.');
      }
    } catch (err) {
      setLoading(false);
      setError('Connection error: Could not reach the registration server.');
    }
  };

  return (
    <div className="min-h-[85vh] bg-slate-50 flex items-center justify-center p-4 font-sans select-none">
      
      {/* Central Login Card Container */}
      <div className="bg-white w-full max-w-4xl min-h-[500px] rounded-xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col md:flex-row relative">
        
        {/* Left Side: Brand Panel */}
        <div className="w-full md:w-1/2 bg-slate-900 text-slate-300 p-10 flex flex-col justify-between items-start">
          <Link to="/">
            <img src={logo} alt="Cartify Logo" className="h-8 w-auto object-contain filter brightness-0 invert" />
          </Link>

          <div className="space-y-3.5 my-8">
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              {isSignUp ? 'Create your merchant or buyer account' : 'Welcome back to your workspace'}
            </h2>
            <p className="text-[11px] leading-relaxed text-slate-400 font-semibold max-w-[280px]">
              {isSignUp 
                ? 'Join Cartify to access verified products, custom invoices, and catalog integrations.' 
                : 'Access your secure client orders dashboard or manage storefront listings.'}
            </p>
          </div>

          <div className="text-[10px] text-slate-500 font-bold tracking-wider uppercase">
            Cartify secure authentication
          </div>
        </div>

        {/* Right Side: Form Layout */}
        <div className="w-full md:w-1/2 p-8 sm:p-10 flex flex-col justify-center bg-white">
          <div className="w-full max-w-xs mx-auto space-y-4">
            
            {/* Header info */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 tracking-wider uppercase">
                {isSignUp ? 'Sign Up' : 'Sign In'}
              </h3>
              <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                {isSignUp ? 'Setup your client profile' : 'Access your merchant console'}
              </p>
            </div>

            {/* Error / Success alerts */}
            {error && (
              <div className="bg-rose-50 border border-rose-100 text-rose-600 text-[10px] font-bold p-3 rounded-lg">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-emerald-50 border border-emerald-100 text-emerald-600 text-[10px] font-bold p-3 rounded-lg">
                {success}
              </div>
            )}

            {isSignUp ? (
              /* Signup Form */
              <form onSubmit={handleSignup} className="space-y-3">
                <div>
                  <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Full Name</label>
                  <input
                    type="text"
                    value={signupFullName}
                    onChange={(e) => setSignupFullName(e.target.value)}
                    placeholder="e.g. John Doe"
                    className="w-full px-3 py-1.5 text-xs font-bold border border-slate-200 focus:border-slate-400 bg-slate-50/50 rounded-lg focus:outline-none placeholder-slate-300 text-slate-700"
                    required
                  />
                </div>

                <div>
                  <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Email Address</label>
                  <input
                    type="email"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    placeholder="e.g. john@example.com"
                    className="w-full px-3 py-1.5 text-xs font-bold border border-slate-200 focus:border-slate-400 bg-slate-50/50 rounded-lg focus:outline-none placeholder-slate-300 text-slate-700"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Password</label>
                    <input
                      type="password"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3 py-1.5 text-xs font-bold border border-slate-200 focus:border-slate-400 bg-slate-50/50 rounded-lg focus:outline-none placeholder-slate-300 text-slate-700"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Confirm</label>
                    <input
                      type="password"
                      value={signupConfirmPassword}
                      onChange={(e) => setSignupConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3 py-1.5 text-xs font-bold border border-slate-200 focus:border-slate-400 bg-slate-50/50 rounded-lg focus:outline-none placeholder-slate-300 text-slate-700"
                      required
                    />
                  </div>
                </div>

                {/* Role Switcher */}
                <div className="bg-slate-50 border border-slate-100 p-2 rounded-lg flex items-center justify-around">
                  <label className="flex items-center gap-1.5 text-[10px] font-bold text-slate-600 cursor-pointer">
                    <input
                      type="radio"
                      name="userRole"
                      checked={role === 'shop'}
                      onChange={() => setRole('shop')}
                      className="text-slate-800 focus:ring-0"
                    /> Shop Products
                  </label>
                  <label className="flex items-center gap-1.5 text-[10px] font-bold text-slate-600 cursor-pointer">
                    <input
                      type="radio"
                      name="userRole"
                      checked={role === 'sell'}
                      onChange={() => setRole('sell')}
                      className="text-slate-800 focus:ring-0"
                    /> Sell Products
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2.5 rounded-lg transition-all disabled:opacity-50"
                >
                  {loading ? 'Creating account...' : 'Create Account'}
                </button>

                <p className="text-center text-[10px] font-bold text-slate-400 pt-1">
                  Already have an account?{' '}
                  <button type="button" onClick={() => handleToggleMode(false)} className="text-slate-800 hover:underline">Sign In</button>
                </p>
              </form>
            ) : (
              /* Login Form */
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Email Address</label>
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="john@example.com"
                    className="w-full px-3.5 py-2.5 text-xs font-bold border border-slate-200 focus:border-slate-400 bg-slate-50/50 rounded-lg focus:outline-none placeholder-slate-300 text-slate-700"
                    required
                  />
                </div>

                <div>
                  <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Password</label>
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 text-xs font-bold border border-slate-200 focus:border-slate-400 bg-slate-50/50 rounded-lg focus:outline-none placeholder-slate-300 text-slate-700"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2.5 rounded-lg transition-all disabled:opacity-50"
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>

                <p className="text-center text-[10px] font-bold text-slate-400 pt-1">
                  Don't have an account?{' '}
                  <button type="button" onClick={() => handleToggleMode(true)} className="text-slate-800 hover:underline">Create Account</button>
                </p>
              </form>
            )}

          </div>
        </div>

      </div>

    </div>
  );
};

export default AuthPage;