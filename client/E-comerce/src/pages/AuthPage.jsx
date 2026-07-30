// Import React and standard state management hooks
import React, { useState } from 'react';
// Import motion from framer-motion for smooth sliding card transitions
import { motion } from 'framer-motion';
// Import useNavigate to handle client-side page routing after signup or login
import { useNavigate } from 'react-router-dom';
// Import the branding logo image from assets
import logo from '../assets/logo.png';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const AuthPage = () => {
  // Hook to programmatically redirect the user to other routes
  const navigate = useNavigate();

  // State to toggle between Signup form (true) and Login form (false)
  const [isSignUp, setIsSignUp] = useState(false);
  // State for merchant vs customer selector, defaults to 'shop' (customer)
  const [role, setRole] = useState('shop'); // 'shop' (customer) or 'sell' (seller)

  // State variables for capturing user inputs in the Login form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // State variables for capturing user inputs in the Signup form
  const [signupFullName, setSignupFullName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState(''); // Optional phone number
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');

  // Password visibility toggle states
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showSignupConfirmPassword, setShowSignupConfirmPassword] = useState(false);

  // State to manage and display validation or server error messages to the user
  const [error, setError] = useState('');
  // State to manage and display operation success messages to the user
  const [success, setSuccess] = useState('');
  // State to handle button loading and disabling state during active API requests
  const [loading, setLoading] = useState(false);

  // Define brand colors system for consistent UI elements styling
  const theme = {
    deepTwilight: '#03045e',
    brightTealBlue: '#0077b6',
    lightCyan: '#caf0f8',
  };

  // High-Quality background photos representing shopping and storefront settings
  const loginBgImage = "https://images.unsplash.com/photo-1563013544-824ae1d704d3?q=80&w=600&auto=format&fit=crop";
  const signupBgImage = "https://images.unsplash.com/photo-1472851294608-062f824d29cc?q=80&w=600&auto=format&fit=crop";

  // Reset errors and success states when switching between Login and Signup modes
  const handleToggleMode = (signUpMode) => {
    setIsSignUp(signUpMode);
    setError('');
    setSuccess('');
  };

  /**
   * Submit handler for user login
   */
  const handleLogin = async (e) => {
    // Prevent default browser form reloading on form submission
    e.preventDefault();
    // Clear previous error messages
    setError('');
    // Clear previous success messages
    setSuccess('');
    // Set loading indicator to true to disable buttons and show progress spinner
    setLoading(true);

    // Basic client-side validation check
    if (!loginEmail || !loginPassword) {
      setError('Please fill in all email and password fields.');
      setLoading(false);
      return;
    }

    try {
      // Send a POST request using native fetch API to login endpoint with email and password payload
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

      // Parse the JSON response body
      const data = await response.json();

      // Verify if the API response status is OK and reports success
      if (response.ok && data.success) {
        // Display login success message
        setSuccess('Login successful! Redirecting you to home page...');

        // Save the JWT token to browser's Local Storage for persistence
        localStorage.setItem('token', data.token);
        // Save the serialized user metadata to browser's Local Storage
        localStorage.setItem('user', JSON.stringify(data.user));

        // Use a short timeout to let the user see the success alert before routing
        setTimeout(() => {
          setLoading(false);
          // Navigate back to the home page '/'
          navigate('/');
        }, 1500);
      } else {
        // Re-enable interactive states
        setLoading(false);
        // Display the error message returned from the backend or custom fallback
        setError(data.message || 'Login failed. Please verify your email and password.');
      }
    } catch (err) {
      // Re-enable interactive states
      setLoading(false);
      // Handle connection failure
      setError('Connection error: Could not reach the authentication server.');
    }
  };

  /**
   * Submit handler for user signup/registration
   */
  const handleSignup = async (e) => {
    // Prevent default browser form reloading on form submission
    e.preventDefault();
    // Clear previous error messages
    setError('');
    // Clear previous success messages
    setSuccess('');
    // Set loading indicator to true to disable buttons
    setLoading(true);

    // Ensure all mandatory input fields are filled out
    if (!signupFullName || !signupEmail || !signupPassword || !signupConfirmPassword) {
      setError('Please fill in all required fields (Name, Email, Password).');
      setLoading(false);
      return;
    }

    // Verify if the password matches the confirm password field
    if (signupPassword !== signupConfirmPassword) {
      setError('Passwords do not match. Please verify your confirm password.');
      setLoading(false);
      return;
    }

    // Enforce password strength minimum length constraint
    if (signupPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      setLoading(false);
      return;
    }

    // Map UI role selector ('shop' or 'sell') to backend database schema roles ('customer' or 'seller')
    const mappedRole = role === 'shop' ? 'customer' : 'seller';

    try {
      // Send a POST request using native fetch API to signup endpoint with user payload
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

      // Parse the JSON response body
      const data = await response.json();

      // Verify if the API response status is OK and reports success
      if (response.ok && data.success) {
        // Display registration success message
        setSuccess('Registration successful! Logging you in automatically...');

        // Save the JWT token returned by signup response to Local Storage
        localStorage.setItem('token', data.token);
        // Save the serialized user metadata to Local Storage
        localStorage.setItem('user', JSON.stringify(data.user));

        // Use a short timeout to let the user see the success alert before routing
        setTimeout(() => {
          setLoading(false);
          // Navigate to the home page '/'
          navigate('/');
        }, 1500);
      } else {
        // Re-enable interactive states
        setLoading(false);
        // Display the error message returned from the backend or custom fallback
        setError(data.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      // Re-enable interactive states
      setLoading(false);
      // Handle connection failure
      setError('Connection error: Could not reach the registration server.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-0 sm:p-4 overflow-x-hidden font-sans select-none">

      {/* 1. MAIN CARD CONTAINER */}
      <div className="bg-white w-full max-w-4xl h-screen sm:h-[620px] sm:rounded-3xl shadow-xl overflow-y-auto sm:overflow-hidden flex flex-col md:flex-row relative border border-slate-100">

        {/* ======================================================= */}
        {/* --- DESKTOP SLIDING BRANDING CONTAINER (WITH IMAGES) --- */}
        {/* ======================================================= */}
        <motion.div
          animate={{ x: isSignUp ? '0%' : '100%' }}
          transition={{ type: 'spring', stiffness: 90, damping: 16 }}
          className="absolute top-0 bottom-0 left-0 w-1/2 hidden md:flex flex-col justify-center items-center p-12 text-center z-20 shadow-2xl overflow-hidden text-white"
        >
          {/* Background Image Layer Layer with Dark Overlay overlay effect */}
          <motion.div
            key={isSignUp ? 'signup-img' : 'login-img'}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 z-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${isSignUp ? signupBgImage : loginBgImage})` }}
          />
          <div className="absolute inset-0 bg-[#03045e]/85 backdrop-blur-[2px] z-10" />

          {/* Core Content Layer */}
          <div className="relative z-30 flex flex-col items-center">
            {/* Website Logo Logo */}
            <img src={logo} alt="PressMart Logo" className="h-12 w-auto mb-6 object-contain filter brightness-0 invert" />

            <h2 className="text-xl font-black mb-2 tracking-wide">
              {isSignUp ? "Create Your Account" : "Welcome Back 👋"}
            </h2>
            <p className="text-[11px] font-medium leading-relaxed max-w-[280px]" style={{ color: theme.lightCyan }}>
              {isSignUp
                ? "Discover premium custom prints or open your own customized digital store instantly."
                : "Login to continue shopping high-quality assets or manage your dashboard."}
            </p>
            <div className="w-16 h-1 rounded-full mt-6" style={{ backgroundColor: theme.brightTealBlue }} />
          </div>
        </motion.div>

        {/* ======================================================= */}
        {/* --- PANEL 1: LOGIN FORM BLOCK (LEFT SIDE) --- */}
        {/* ======================================================= */}
        <form onSubmit={handleLogin} className={`w-full md:w-1/2 min-h-full p-8 sm:p-12 flex flex-col justify-center bg-white transition-all ${isSignUp ? 'hidden md:flex' : 'flex'}`}>
          <div className="max-w-sm w-full mx-auto space-y-5 py-6">

            {/* Mobile Header: Logo elements showing only on mobile screens */}
            <div className="flex flex-col items-center md:hidden mb-2">
              <img src={logo} alt="PressMart Logo" className="h-10 w-auto mb-3 object-contain" />
              <h2 className="text-base font-black text-slate-800">Welcome Back 👋</h2>
            </div>

            <div className="hidden md:block">
              <h3 className="text-lg font-black" style={{ color: theme.deepTwilight }}>Login Account</h3>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">Please fill your details to proceed.</p>
            </div>

            {/* Error Message Alert Banner */}
            {error && !isSignUp && (
              <div className="bg-red-50 text-red-600 text-xs p-3 rounded-xl border border-red-100 font-semibold animate-pulse">
                ⚠️ {error}
              </div>
            )}

            {/* Success Message Alert Banner */}
            {success && !isSignUp && (
              <div className="bg-emerald-50 text-emerald-600 text-xs p-3 rounded-xl border border-emerald-100 font-semibold">
                ✅ {success}
              </div>
            )}

            <div className="space-y-3.5">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Email Address</label>
                <input
                  type="email"
                  name="email"
                  autoComplete="username email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-[#0077b6] bg-slate-50/50 font-medium"
                  required
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showLoginPassword ? "text" : "password"}
                    name="password"
                    autoComplete="current-password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-3.5 pr-10 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-[#0077b6] bg-slate-50/50 font-medium"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none cursor-pointer flex items-center justify-center"
                  >
                    {showLoginPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] font-bold">
              <label className="flex items-center gap-2 cursor-pointer text-slate-500">
                <input type="checkbox" className="rounded text-[#0077b6] focus:ring-0" /> Remember Me
              </label>
              <button type="button" style={{ color: theme.brightTealBlue }} className="hover:underline">Forgot Password?</button>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{ backgroundColor: theme.brightTealBlue }}
              className="w-full text-white text-xs font-bold py-3 rounded-xl shadow-sm hover:opacity-95 active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing In...' : 'Login'}
            </button>

            <button type="button" className="w-full bg-white border border-slate-200 text-slate-600 text-xs font-bold py-2.5 rounded-xl shadow-sm hover:bg-slate-50 flex items-center justify-center gap-2 transition-all">
              Google Account
            </button>

            <p className="text-center text-[11px] font-medium text-slate-400 pt-2">
              Don't have an account?{' '}
              <button type="button" onClick={() => handleToggleMode(true)} style={{ color: theme.brightTealBlue }} className="font-bold hover:underline">Create Account</button>
            </p>
          </div>
        </form>

        {/* ======================================================= */}
        {/* --- PANEL 2: SIGN UP FORM BLOCK (RIGHT SIDE) --- */}
        {/* ======================================================= */}
        <form onSubmit={handleSignup} className={`w-full md:w-1/2 min-h-full p-8 sm:p-10 flex flex-col justify-center bg-white transition-all ${!isSignUp ? 'hidden md:flex' : 'flex'}`}>
          <div className="max-w-sm w-full mx-auto space-y-4 py-6">

            {/* Mobile Header for SignUp screen */}
            <div className="flex flex-col items-center md:hidden mb-2">
              <img src={logo} alt="PressMart Logo" className="h-10 w-auto mb-3 object-contain" />
              <h2 className="text-base font-black text-slate-800">Create Account</h2>
            </div>

            <div className="hidden md:block">
              <h3 className="text-lg font-black" style={{ color: theme.deepTwilight }}>Sign Up</h3>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">Setup your consumer or merchant profile.</p>
            </div>

            {/* Error Message Alert Banner */}
            {error && isSignUp && (
              <div className="bg-red-50 text-red-600 text-xs p-3 rounded-xl border border-red-100 font-semibold animate-pulse">
                ⚠️ {error}
              </div>
            )}

            {/* Success Message Alert Banner */}
            {success && isSignUp && (
              <div className="bg-emerald-50 text-emerald-600 text-xs p-3 rounded-xl border border-emerald-100 font-semibold">
                ✅ {success}
              </div>
            )}

            <div className="space-y-2.5">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-0.5">Full Name</label>
                <input
                  type="text"
                  name="name"
                  autoComplete="name"
                  value={signupFullName}
                  onChange={(e) => setSignupFullName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-[#0077b6] bg-slate-50/50 font-medium"
                  required
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-0.5">Email Address</label>
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-[#0077b6] bg-slate-50/50 font-medium"
                  required
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-0.5">Phone Number</label>
                <input
                  type="tel"
                  value={signupPhone}
                  onChange={(e) => setSignupPhone(e.target.value)}
                  placeholder="+92 300 1234567"
                  className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-[#0077b6] bg-slate-50/50 font-medium"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-0.5">Password</label>
                  <div className="relative">
                    <input
                      type={showSignupPassword ? "text" : "password"}
                      name="password"
                      autoComplete="new-password"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-3 pr-8 py-1.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-[#0077b6] bg-slate-50/50 font-medium"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignupPassword(!showSignupPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none cursor-pointer flex items-center justify-center"
                    >
                      {showSignupPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-0.5">Confirm</label>
                  <div className="relative">
                    <input
                      type={showSignupConfirmPassword ? "text" : "password"}
                      name="confirm-password"
                      autoComplete="new-password"
                      value={signupConfirmPassword}
                      onChange={(e) => setSignupConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-3 pr-8 py-1.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-[#0077b6] bg-slate-50/50 font-medium"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignupConfirmPassword(!showSignupConfirmPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none cursor-pointer flex items-center justify-center"
                    >
                      {showSignupConfirmPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Role Selector Radio Components */}
            <div className="bg-slate-50 p-2 rounded-xl flex items-center justify-around border border-slate-100">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-600 cursor-pointer">
                <input
                  type="radio"
                  name="userRole"
                  checked={role === 'shop'}
                  onChange={() => setRole('shop')}
                  className="text-[#0077b6] focus:ring-0"
                /> Shop Products
              </label>
              <label className="flex items-center gap-2 text-xs font-bold text-slate-600 cursor-pointer">
                <input
                  type="radio"
                  name="userRole"
                  checked={role === 'sell'}
                  onChange={() => setRole('sell')}
                  className="text-[#0077b6] focus:ring-0"
                /> Sell Products
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{ backgroundColor: theme.deepTwilight }}
              className="w-full text-white text-xs font-bold py-3 rounded-xl shadow-sm hover:opacity-95 active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>

            <p className="text-center text-[11px] font-medium text-slate-400 pt-1">
              Already have an account?{' '}
              <button type="button" onClick={() => handleToggleMode(false)} style={{ color: theme.brightTealBlue }} className="font-bold hover:underline">Login</button>
            </p>
          </div>
        </form>

      </div>
    </div>
  );
};

// Export AuthPage component for router mapping in App.jsx
export default AuthPage;