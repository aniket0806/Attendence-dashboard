import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Loader2, PhoneCall } from 'lucide-react';
import { loginSuccess } from '../features/auth/authSlice';
import { loginAPI } from '../features/auth/authAPI';
import LOGO from "../assets/image/logo.jpg";
import Company from "../assets/image/company.png";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, user } = useSelector((state) => state.auth);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Auto-redirect if already logged in
  useEffect(() => {
    if (token && user) {
      const role = user.usertype;
      const userName = user.username;
      if (role === 'A') {
        navigate('/');
      } else if (role === 'E' || role === 'M') {
        navigate(`/employeedashboard/${userName}`);
      }
    }
  }, [token, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await loginAPI({ username, password });

      dispatch(loginSuccess({
        user: response.user,
        token: response.token,
      }));

      const role = response.user.usertype;
      const userName = response.user.username;

      if (role === 'A') {
        navigate('/');
      } else if (role === 'E' || role === 'M') {
        navigate(`/employeedashboard/${userName}`);
      } else {
        setError('Unknown user role');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSubmit(e);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Side */}
      <div className="flex-1 relative bg-gradient-to-br from-orange-400 via-orange-500 to-red-500 overflow-hidden min-h-[40vh] lg:min-h-screen">
        <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 left-10 w-24 h-24 bg-yellow-300/30 rounded-full blur-lg"></div>
        <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-white/20 rounded-full blur-md"></div>

        <div className="relative z-10 flex flex-col justify-center h-full px-6 sm:px-8 lg:px-16 max-w-2xl">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl lg:rounded-3xl p-6 sm:p-8 lg:p-12 shadow-2xl border border-white/20">
            <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-white mb-4 lg:mb-8 leading-tight">
              Empowering people through seamless Attendance management.
            </h1>
            <div className="mb-4 lg:mb-8 relative">
              <div className="bg-white/20 rounded-xl lg:rounded-2xl p-4 lg:p-8 backdrop-blur-sm">
                <div className="flex items-center justify-center space-x-2 sm:space-x-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="w-12 h-12 sm:w-16 sm:h-16 bg-white/30 rounded-full flex items-center justify-center">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white/50 rounded-full"></div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 h-3 lg:h-4 bg-white/20 rounded w-3/4 mx-auto"></div>
                <div className="mt-2 h-2 lg:h-3 bg-white/15 rounded w-1/2 mx-auto"></div>
              </div>
            </div>
            <p className="text-white/90 text-sm sm:text-base lg:text-lg font-medium">
              Efficiently manage your workforce, streamline operations effortlessly.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="w-full lg:w-1/2 flex flex-col bg-white">
        <div className="p-4 sm:p-6 lg:p-4 pb-2">
          <div className="flex items-center justify-center mb-4 lg:mb-8">
            <img className="h-16 sm:h-20 lg:h-24" src={LOGO} alt="NHDC" />
          </div>
        </div>

        <div className="flex-1 px-6 sm:px-8 lg:px-12 py-0">
          <div className="mb-4 lg:mb-6">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Sign In</h2>
            <p className="text-gray-600 text-sm sm:text-base">Please enter your details to sign in</p>
          </div>

          {error && (
            <div className="mb-4 lg:mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={loading}
                  className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all disabled:opacity-50 text-sm sm:text-base"
                  placeholder="Enter your username"
                  autoComplete="username"
                />
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={loading}
                  className="w-full px-4 py-3 pl-12 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all disabled:opacity-50 text-sm sm:text-base"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-lg shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center justify-center text-sm sm:text-base"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Logging in...
                </>
              ) : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 mb-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Developed By</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button className="flex items-center justify-center py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors" disabled={loading}>
              <img className="bg-black w-24 sm:w-32 h-auto" src={Company} alt="Company Logo" />
            </button>
            <button className="flex flex-col items-start gap-1 py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors" disabled={loading}>
              <span className="flex items-center gap-2 text-xs">
                <PhoneCall className="w-4 h-4" /> 77488-77488
              </span>
              <span className="flex items-center gap-2 text-xs">
                <Mail className="w-4 h-4" /> info@loksewak.in
              </span>
            </button>
          </div>
        </div>

        <div className="p-6 sm:p-8 pt-4">
          <p className="text-center text-xs sm:text-sm text-gray-500">
            Copyright © 2025 - Ram Dongre. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
