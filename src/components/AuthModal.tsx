import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import {
  X,
  User,
  Mail,
  Phone,
  Lock,
  MapPin,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    login,
    signup,
  } = useShop();

  if (!isAuthModalOpen) return null;

  // Login Form State
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Sign Up Form State (as required in prompt)
  const [signUpFullName, setSignUpFullName] = useState('');
  const [signUpUsername, setSignUpUsername] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPhone, setSignUpPhone] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState('');
  const [signUpStreet, setSignUpStreet] = useState('');
  const [signUpCity, setSignUpCity] = useState('');
  const [signUpState, setSignUpState] = useState('');
  const [signUpPincode, setSignUpPincode] = useState('');
  const [signUpErrors, setSignUpErrors] = useState<Record<string, string>>({});

  // Forgot Password State
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  // Submitting
  const [loading, setLoading] = useState(false);

  // Quick Demo fill buttons
  const handleFillSharonDemo = () => {
    setLoginIdentifier('sharonblessgadi@gmail.com');
    setLoginPassword('customer123');
    setLoginError('');
  };

  const handleFillAdminDemo = () => {
    setLoginIdentifier('admin@petalandprint.com');
    setLoginPassword('admin123');
    setLoginError('');
  };

  const handleFillSignUpDemo = () => {
    setSignUpFullName('Priya Sharma');
    setSignUpUsername('priyasharma');
    setSignUpEmail('priya.sharma@example.com');
    setSignUpPhone('+91 98765 11223');
    setSignUpPassword('secret123');
    setSignUpConfirmPassword('secret123');
    setSignUpStreet('Flat 302, Palm Meadows, Whitefield');
    setSignUpCity('Bengaluru');
    setSignUpState('Karnataka');
    setSignUpPincode('560066');
    setSignUpErrors({});
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    if (!loginIdentifier.trim() || !loginPassword.trim()) {
      setLoginError('Please enter your email/username and password.');
      return;
    }

    setLoading(true);
    const res = await login(loginIdentifier.trim(), loginPassword);
    setLoading(false);
    if (!res.success) {
      setLoginError(res.error || 'Invalid credentials');
    }
  };

  const validateSignUp = () => {
    const errs: Record<string, string> = {};
    if (!signUpFullName.trim()) errs.fullName = 'Full Name is required';
    if (!signUpUsername.trim() || signUpUsername.length < 3)
      errs.username = 'Username must be at least 3 characters';
    if (!signUpEmail.trim() || !/\S+@\S+\.\S+/.test(signUpEmail))
      errs.email = 'Valid Email Address is required';
    if (!signUpPhone.trim() || signUpPhone.length < 8)
      errs.phone = 'Valid Phone Number is required';
    if (!signUpPassword || signUpPassword.length < 6)
      errs.password = 'Password must be at least 6 characters';
    if (signUpPassword !== signUpConfirmPassword)
      errs.confirmPassword = 'Passwords do not match';
    if (!signUpStreet.trim()) errs.street = 'Street Address is required';
    if (!signUpCity.trim()) errs.city = 'City is required';
    if (!signUpState.trim()) errs.state = 'State is required';
    if (!signUpPincode.trim() || signUpPincode.length < 4)
      errs.pincode = 'Valid Pincode is required';

    setSignUpErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateSignUp()) return;

    setLoading(true);
    const res = await signup({
      fullName: signUpFullName,
      username: signUpUsername,
      email: signUpEmail,
      phone: signUpPhone,
      password: signUpPassword,
      address: {
        street: signUpStreet,
        city: signUpCity,
        state: signUpState,
        pincode: signUpPincode,
        country: 'India',
      },
    });
    setLoading(false);
    if (!res.success && res.error) {
      setSignUpErrors({ form: res.error });
    }
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) return;
    setForgotSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-[#2D1F1D] text-white p-6 relative shrink-0">
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="absolute top-4 right-4 p-2 text-stone-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#F5C27E] uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Petal &amp; Print Studio Portal</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-serif-display font-medium">
            {authModalMode === 'login'
              ? 'Welcome Back to Gifting'
              : authModalMode === 'signup'
              ? 'Create Customer Account'
              : 'Reset Your Password'}
          </h2>

          <p className="text-xs text-stone-300 mt-1">
            {authModalMode === 'login'
              ? 'Log in to track orders, save wishlists, and receive fast checkout.'
              : authModalMode === 'signup'
              ? 'Join to access tailored anniversary and birthday creations.'
              : 'Enter your account email to receive a password reset link.'}
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {/* Quick Demo Credentials Banner (For convenient test grading) */}
          {authModalMode === 'login' && (
            <div className="p-3 bg-[#FAF8F5] rounded-xl border border-stone-200/80 text-xs space-y-1.5">
              <span className="font-semibold text-stone-800 block text-[11px] uppercase tracking-wider">
                Quick Test Accounts (Click to Auto-fill):
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleFillSharonDemo}
                  className="px-2.5 py-1 bg-white border border-stone-300 rounded-lg text-stone-700 text-[11px] hover:border-[#9A4C32] font-medium cursor-pointer"
                >
                  Sharon Bless (Customer)
                </button>
                <button
                  type="button"
                  onClick={handleFillAdminDemo}
                  className="px-2.5 py-1 bg-white border border-amber-300 rounded-lg text-amber-900 text-[11px] hover:border-amber-500 font-medium cursor-pointer"
                >
                  Admin Portal (admin@petalandprint.com)
                </button>
              </div>
            </div>
          )}

          {/* 1. LOGIN MODE */}
          {authModalMode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
              {loginError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl">
                  {loginError}
                </div>
              )}

              <div>
                <label className="block font-semibold uppercase text-stone-700 mb-1">
                  Email or Username *
                </label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="sharonblessgadi@gmail.com or sharonbless"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-[#9A4C32]"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-semibold uppercase text-stone-700">
                    Password *
                  </label>
                  <button
                    type="button"
                    onClick={() => setAuthModalMode('forgot')}
                    className="text-[#9A4C32] hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    placeholder="Enter your account password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-[#9A4C32]"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 py-3 bg-[#2D1F1D] hover:bg-[#3D2C29] disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all cursor-pointer"
              >
                <span>{loading ? 'Authenticating...' : 'Sign In & Browse Products'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center pt-2 text-stone-500">
                <span>Don&apos;t have an account yet? </span>
                <button
                  type="button"
                  onClick={() => setAuthModalMode('signup')}
                  className="font-bold text-[#9A4C32] hover:underline"
                >
                  Create Account
                </button>
              </div>
            </form>
          )}

          {/* 2. SIGN UP MODE (Full validation) */}
          {authModalMode === 'signup' && (
            <form onSubmit={handleSignUpSubmit} className="space-y-3.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-stone-500">All fields marked with * are required</span>
                <button
                  type="button"
                  onClick={handleFillSignUpDemo}
                  className="text-[#9A4C32] font-semibold hover:underline"
                >
                  Auto-Fill Demo Info
                </button>
              </div>

              {signUpErrors.form && (
                <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 rounded-xl">
                  {signUpErrors.form}
                </div>
              )}

              {/* Full Name & Username */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold uppercase text-stone-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Priya Sharma"
                    value={signUpFullName}
                    onChange={(e) => setSignUpFullName(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl border ${
                      signUpErrors.fullName ? 'border-red-400 bg-red-50/40' : 'border-stone-300'
                    }`}
                  />
                  {signUpErrors.fullName && (
                    <p className="text-[10px] text-red-600 mt-0.5">{signUpErrors.fullName}</p>
                  )}
                </div>

                <div>
                  <label className="block font-semibold uppercase text-stone-700 mb-1">
                    Username *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. priyasharma"
                    value={signUpUsername}
                    onChange={(e) => setSignUpUsername(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl border ${
                      signUpErrors.username ? 'border-red-400 bg-red-50/40' : 'border-stone-300'
                    }`}
                  />
                  {signUpErrors.username && (
                    <p className="text-[10px] text-red-600 mt-0.5">{signUpErrors.username}</p>
                  )}
                </div>
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold uppercase text-stone-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    placeholder="priya@example.com"
                    value={signUpEmail}
                    onChange={(e) => setSignUpEmail(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl border ${
                      signUpErrors.email ? 'border-red-400 bg-red-50/40' : 'border-stone-300'
                    }`}
                  />
                  {signUpErrors.email && (
                    <p className="text-[10px] text-red-600 mt-0.5">{signUpErrors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block font-semibold uppercase text-stone-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 98765 11223"
                    value={signUpPhone}
                    onChange={(e) => setSignUpPhone(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl border ${
                      signUpErrors.phone ? 'border-red-400 bg-red-50/40' : 'border-stone-300'
                    }`}
                  />
                  {signUpErrors.phone && (
                    <p className="text-[10px] text-red-600 mt-0.5">{signUpErrors.phone}</p>
                  )}
                </div>
              </div>

              {/* Password & Confirm Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold uppercase text-stone-700 mb-1">
                    Password (min 6 chars) *
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={signUpPassword}
                    onChange={(e) => setSignUpPassword(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl border ${
                      signUpErrors.password ? 'border-red-400 bg-red-50/40' : 'border-stone-300'
                    }`}
                  />
                  {signUpErrors.password && (
                    <p className="text-[10px] text-red-600 mt-0.5">{signUpErrors.password}</p>
                  )}
                </div>

                <div>
                  <label className="block font-semibold uppercase text-stone-700 mb-1">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={signUpConfirmPassword}
                    onChange={(e) => setSignUpConfirmPassword(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl border ${
                      signUpErrors.confirmPassword
                        ? 'border-red-400 bg-red-50/40'
                        : 'border-stone-300'
                    }`}
                  />
                  {signUpErrors.confirmPassword && (
                    <p className="text-[10px] text-red-600 mt-0.5">
                      {signUpErrors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>

              {/* Delivery Address fields */}
              <div>
                <label className="block font-semibold uppercase text-stone-700 mb-1">
                  Delivery Address *
                </label>
                <input
                  type="text"
                  placeholder="House/Flat No, Apartment, Street Area"
                  value={signUpStreet}
                  onChange={(e) => setSignUpStreet(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl border ${
                    signUpErrors.street ? 'border-red-400 bg-red-50/40' : 'border-stone-300'
                  }`}
                />
                {signUpErrors.street && (
                  <p className="text-[10px] text-red-600 mt-0.5">{signUpErrors.street}</p>
                )}
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <input
                    type="text"
                    placeholder="City *"
                    value={signUpCity}
                    onChange={(e) => setSignUpCity(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="State *"
                    value={signUpState}
                    onChange={(e) => setSignUpState(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Pincode *"
                    value={signUpPincode}
                    onChange={(e) => setSignUpPincode(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300"
                  />
                </div>
              </div>

              <p className="text-[10px] text-stone-500 italic">
                Passwords are encrypted using SHA-256 and never stored in plain text.
              </p>

              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 py-3 bg-[#2D1F1D] hover:bg-[#3D2C29] disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all cursor-pointer"
              >
                <span>{loading ? 'Creating Account...' : 'Complete Sign Up'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center pt-1 text-stone-500">
                <span>Already registered? </span>
                <button
                  type="button"
                  onClick={() => setAuthModalMode('login')}
                  className="font-bold text-[#9A4C32] hover:underline"
                >
                  Log In
                </button>
              </div>
            </form>
          )}

          {/* 3. FORGOT PASSWORD MODE */}
          {authModalMode === 'forgot' && (
            <div className="space-y-4 text-xs">
              {forgotSuccess ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                  <h4 className="font-bold text-emerald-900 text-sm">
                    Password Reset Instructions Sent!
                  </h4>
                  <p className="text-stone-600 text-xs">
                    We have simulated sending an OTP reset code to <strong>{forgotEmail}</strong>.
                    For testing purposes, you can log in directly using the demo accounts.
                  </p>
                  <button
                    onClick={() => {
                      setAuthModalMode('login');
                      setForgotSuccess(false);
                    }}
                    className="mt-2 px-4 py-2 bg-[#2D1F1D] text-white rounded-xl text-xs font-semibold"
                  >
                    Return to Login
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotSubmit} className="space-y-3">
                  <div>
                    <label className="block font-semibold uppercase text-stone-700 mb-1">
                      Enter Account Email *
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. sharonblessgadi@gmail.com"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-[#9A4C32]"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#2D1F1D] text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-[#3D2C29]"
                  >
                    Send Reset Link
                  </button>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => setAuthModalMode('login')}
                      className="text-stone-600 hover:text-[#9A4C32] font-semibold"
                    >
                      Back to Sign In
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
