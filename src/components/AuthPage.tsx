import React, { useState, useEffect } from 'react';
import { Mail, Lock, User, Phone, MapPin, Eye, EyeOff, Chrome, AlertCircle, CheckCircle, Sparkles, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

type AuthMode = 'login' | 'signup' | 'forgot';

export const AuthPage: React.FC = () => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [capsLockOn, setCapsLockOn] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [loginData, setLoginData] = useState({
    usernameOrEmail: '',
    password: '',
  });

  const [signupData, setSignupData] = useState({
    username: '',
    fullName: '',
    email: '',
    phoneNumber: '',
    location: '',
    password: '',
    confirmPassword: '',
  });

  const [forgotEmail, setForgotEmail] = useState('');

  const { signIn, signUp, signInWithProvider, resetPassword } = useAuth();

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      setCapsLockOn(e.getModifierState('CapsLock'));
    };

    window.addEventListener('keydown', handleKeyPress);
    window.addEventListener('keyup', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      window.removeEventListener('keyup', handleKeyPress);
    };
  }, []);

  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    setPasswordStrength(strength);
  };

  const checkUsername = async (username: string) => {
    if (username.length < 3) {
      setUsernameAvailable(null);
      return;
    }

    const { checkUsernameAvailability } = await import('../lib/supabase');
    const { available } = await checkUsernameAvailability(username);
    setUsernameAvailable(available);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    const { error } = await signIn(loginData.usernameOrEmail, loginData.password);

    if (error) {
      setMessage({ type: 'error', text: typeof error === 'string' ? error : error.message });
    } else {
      setMessage({ type: 'success', text: 'Welcome back!' });
    }

    setIsLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (signupData.password !== signupData.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match!' });
      return;
    }

    if (signupData.password.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters!' });
      return;
    }

    if (signupData.username.length < 3) {
      setMessage({ type: 'error', text: 'Username must be at least 3 characters!' });
      return;
    }

    setIsLoading(true);

    const { error } = await signUp({
      username: signupData.username,
      fullName: signupData.fullName,
      email: signupData.email,
      phoneNumber: signupData.phoneNumber,
      location: signupData.location,
      password: signupData.password,
    });

    if (error) {
      setMessage({ type: 'error', text: typeof error === 'string' ? error : error.message });
    } else {
      setMessage({ type: 'success', text: 'Account created successfully! You can now sign in.' });
      setTimeout(() => setMode('login'), 2000);
      setSignupData({
        username: '',
        fullName: '',
        email: '',
        phoneNumber: '',
        location: '',
        password: '',
        confirmPassword: '',
      });
    }

    setIsLoading(false);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    const { error } = await resetPassword(forgotEmail);

    if (error) {
      setMessage({ type: 'error', text: error.message });
    } else {
      setMessage({ type: 'success', text: 'Password reset link sent to your email!' });
      setForgotEmail('');
    }

    setIsLoading(false);
  };

  const handleOAuthLogin = async (provider: 'google') => {
    setIsLoading(true);
    setMessage(null);

    const { error } = await signInWithProvider(provider);

    if (error) {
      setMessage({
        type: 'error',
        text: 'Google sign-in is not configured yet. Please use email/password authentication.'
      });
      setIsLoading(false);
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 1) return 'bg-red-500';
    if (passwordStrength <= 3) return 'bg-amber-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 1) return 'Weak';
    if (passwordStrength <= 3) return 'Medium';
    return 'Strong';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-gray-200/50">
          <div className="p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl mb-4 shadow-lg">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
                {mode === 'login' && 'Welcome Back'}
                {mode === 'signup' && 'Join Us Today'}
                {mode === 'forgot' && 'Reset Password'}
              </h1>
              <p className="text-gray-600 flex items-center justify-center gap-2">
                {mode === 'login' && (
                  <>
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    Sign in to access your account
                  </>
                )}
                {mode === 'signup' && (
                  <>
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    Create your account in seconds
                  </>
                )}
                {mode === 'forgot' && 'Enter your email to reset password'}
              </p>
            </div>

            {message && (
              <div
                className={`mb-6 p-4 rounded-xl animate-slide-down flex items-start gap-3 ${
                  message.type === 'success'
                    ? 'bg-green-50 text-green-800 border-2 border-green-200'
                    : 'bg-red-50 text-red-800 border-2 border-red-200'
                }`}
              >
                {message.type === 'success' ? (
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                )}
                <span className="text-sm font-medium">{message.text}</span>
              </div>
            )}

            {mode === 'login' && (
              <>
                <form onSubmit={handleLogin} className="space-y-5">
                  <div className="relative group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Username or Email
                    </label>
                    <User className="absolute left-4 top-[42px] transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                    <input
                      type="text"
                      placeholder="Enter username or email"
                      value={loginData.usernameOrEmail}
                      onChange={(e) => setLoginData({ ...loginData, usernameOrEmail: e.target.value })}
                      required
                      className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:ring-4 focus:ring-blue-100 focus:outline-none transition-all duration-300 hover:border-gray-300 bg-white"
                    />
                  </div>

                  <div className="relative group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Password
                    </label>
                    <Lock className="absolute left-4 top-[42px] transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      required
                      className="w-full pl-12 pr-12 py-3.5 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:ring-4 focus:ring-blue-100 focus:outline-none transition-all duration-300 hover:border-gray-300 bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-[42px] transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                    {capsLockOn && (
                      <div className="absolute -bottom-6 left-0 flex items-center gap-1 text-amber-600 text-xs font-medium">
                        <AlertCircle className="w-3 h-3" />
                        Caps Lock is ON
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-sm pt-2">
                    <label className="flex items-center cursor-pointer group">
                      <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer" />
                      <span className="ml-2 text-gray-600 group-hover:text-gray-800 font-medium">Remember me</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setMode('forgot')}
                      className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Signing in...
                      </span>
                    ) : (
                      'Sign In'
                    )}
                  </button>
                </form>

                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500 font-medium">Or continue with</span>
                  </div>
                </div>

                <button
                  onClick={() => handleOAuthLogin('google')}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-3 px-4 py-3.5 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-300 hover:border-blue-400 hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  <Chrome className="w-5 h-5 text-red-500" />
                  <span className="text-gray-700">Continue with Google</span>
                </button>

                <p className="mt-8 text-center text-gray-600">
                  Don't have an account?{' '}
                  <button
                    onClick={() => setMode('signup')}
                    className="text-blue-600 hover:text-blue-700 font-bold transition-colors"
                  >
                    Sign up
                  </button>
                </p>
              </>
            )}

            {mode === 'signup' && (
              <>
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="relative group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Username
                    </label>
                    <User className="absolute left-4 top-[42px] transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                    <input
                      type="text"
                      placeholder="Choose a unique username"
                      value={signupData.username}
                      onChange={(e) => {
                        const value = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '');
                        setSignupData({ ...signupData, username: value });
                        checkUsername(value);
                      }}
                      required
                      minLength={3}
                      className="w-full pl-12 pr-10 py-3.5 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:ring-4 focus:ring-blue-100 focus:outline-none transition-all duration-300 hover:border-gray-300 bg-white"
                    />
                    {usernameAvailable !== null && signupData.username.length >= 3 && (
                      <div className="absolute right-4 top-[42px] transform -translate-y-1/2">
                        {usernameAvailable ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-red-500" />
                        )}
                      </div>
                    )}
                    {signupData.username.length >= 3 && (
                      <p className={`text-xs mt-1 font-medium ${usernameAvailable ? 'text-green-600' : 'text-red-600'}`}>
                        {usernameAvailable ? 'Username available!' : 'Username already taken'}
                      </p>
                    )}
                  </div>

                  <div className="relative group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name
                    </label>
                    <User className="absolute left-4 top-[42px] transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                    <input
                      type="text"
                      placeholder="Enter your full name"
                      value={signupData.fullName}
                      onChange={(e) => setSignupData({ ...signupData, fullName: e.target.value })}
                      required
                      className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:ring-4 focus:ring-blue-100 focus:outline-none transition-all duration-300 hover:border-gray-300 bg-white"
                    />
                  </div>

                  <div className="relative group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address
                    </label>
                    <Mail className="absolute left-4 top-[42px] transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                    <input
                      type="email"
                      placeholder="your.email@example.com"
                      value={signupData.email}
                      onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                      required
                      className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:ring-4 focus:ring-blue-100 focus:outline-none transition-all duration-300 hover:border-gray-300 bg-white"
                    />
                  </div>

                  <div className="relative group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <Phone className="absolute left-4 top-[42px] transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                    <input
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      value={signupData.phoneNumber}
                      onChange={(e) => setSignupData({ ...signupData, phoneNumber: e.target.value })}
                      required
                      className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:ring-4 focus:ring-blue-100 focus:outline-none transition-all duration-300 hover:border-gray-300 bg-white"
                    />
                  </div>

                  <div className="relative group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Location
                    </label>
                    <MapPin className="absolute left-4 top-[42px] transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                    <input
                      type="text"
                      placeholder="City, Country"
                      value={signupData.location}
                      onChange={(e) => setSignupData({ ...signupData, location: e.target.value })}
                      required
                      className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:ring-4 focus:ring-blue-100 focus:outline-none transition-all duration-300 hover:border-gray-300 bg-white"
                    />
                  </div>

                  <div className="relative group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Password
                    </label>
                    <Lock className="absolute left-4 top-[42px] transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create a strong password"
                      value={signupData.password}
                      onChange={(e) => {
                        setSignupData({ ...signupData, password: e.target.value });
                        calculatePasswordStrength(e.target.value);
                      }}
                      required
                      className="w-full pl-12 pr-12 py-3.5 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:ring-4 focus:ring-blue-100 focus:outline-none transition-all duration-300 hover:border-gray-300 bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-[42px] transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                    {capsLockOn && (
                      <div className="absolute -bottom-6 left-0 flex items-center gap-1 text-amber-600 text-xs font-medium">
                        <AlertCircle className="w-3 h-3" />
                        Caps Lock is ON
                      </div>
                    )}
                    {signupData.password && (
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-gray-600 font-medium">Password strength:</span>
                          <span className={`font-bold ${passwordStrength <= 1 ? 'text-red-600' : passwordStrength <= 3 ? 'text-amber-600' : 'text-green-600'}`}>
                            {getPasswordStrengthText()}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                            style={{ width: `${(passwordStrength / 5) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="relative group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Confirm Password
                    </label>
                    <Lock className="absolute left-4 top-[42px] transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm your password"
                      value={signupData.confirmPassword}
                      onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                      required
                      className="w-full pl-12 pr-12 py-3.5 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:ring-4 focus:ring-blue-100 focus:outline-none transition-all duration-300 hover:border-gray-300 bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-[42px] transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                    {signupData.confirmPassword && (
                      <div className="absolute -bottom-6 left-0">
                        {signupData.password === signupData.confirmPassword ? (
                          <div className="flex items-center gap-1 text-green-600 text-xs font-medium">
                            <CheckCircle className="w-3 h-3" />
                            Passwords match
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-red-600 text-xs font-medium">
                            <AlertCircle className="w-3 h-3" />
                            Passwords don't match
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex items-start pt-4">
                    <input
                      type="checkbox"
                      required
                      className="w-4 h-4 mt-1 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                    />
                    <label className="ml-3 text-sm text-gray-700">
                      I agree to the{' '}
                      <a href="#" className="text-blue-600 hover:text-blue-700 font-semibold">
                        Terms of Service
                      </a>{' '}
                      and{' '}
                      <a href="#" className="text-blue-600 hover:text-blue-700 font-semibold">
                        Privacy Policy
                      </a>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || !usernameAvailable}
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg mt-2"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Creating account...
                      </span>
                    ) : (
                      'Create Account'
                    )}
                  </button>
                </form>

                <p className="mt-8 text-center text-gray-600">
                  Already have an account?{' '}
                  <button
                    onClick={() => setMode('login')}
                    className="text-blue-600 hover:text-blue-700 font-bold transition-colors"
                  >
                    Sign in
                  </button>
                </p>
              </>
            )}

            {mode === 'forgot' && (
              <>
                <form onSubmit={handleForgotPassword} className="space-y-5">
                  <div className="relative group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address
                    </label>
                    <Mail className="absolute left-4 top-[42px] transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                    <input
                      type="email"
                      placeholder="your.email@example.com"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      required
                      className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:ring-4 focus:ring-blue-100 focus:outline-none transition-all duration-300 hover:border-gray-300 bg-white"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Sending...
                      </span>
                    ) : (
                      'Send Reset Link'
                    )}
                  </button>
                </form>

                <p className="mt-8 text-center text-gray-600">
                  Remember your password?{' '}
                  <button
                    onClick={() => setMode('login')}
                    className="text-blue-600 hover:text-blue-700 font-bold transition-colors"
                  >
                    Sign in
                  </button>
                </p>
              </>
            )}
          </div>
        </div>

        <p className="text-center text-white/75 text-sm mt-6 flex items-center justify-center gap-2">
          <Shield className="w-4 h-4" />
          Secure authentication powered by Supabase
        </p>
      </div>
    </div>
  );
};
