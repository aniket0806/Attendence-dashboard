import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Loader2,  PhoneCall } from 'lucide-react';
import { loginSuccess } from '../features/auth/authSlice';
import { loginAPI } from '../features/auth/authAPI';
import LOGO from "../assets/image/logo.jpg"
import Company from "../assets/image/company.png"
const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
 
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password');
      return;
    }

    setLoading(true);
    setError('');
    // Call the login API
    try {
      const response = await loginAPI({ username, password });
      
      // Dispatch login success action
      dispatch(loginSuccess({ 
         user: response.user, //  Use real user data from backend
          token: response.token,
      }));

      // Redirect to dashboard or home page
      const role = response.user.usertype;
   
      const userName = response.user.username;
      if (role === "A") {
      navigate('/');
    } else if (role === "E" || "M") {
      navigate( `/employeedashboard/${userName}`);
    } else {
      setError('Unknown user role');
    }
    

      // navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Hero Section */}
      <div className="flex-1 relative bg-gradient-to-br from-orange-400 via-orange-500 to-red-500 overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 left-10 w-24 h-24 bg-yellow-300/30 rounded-full blur-lg"></div>
        <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-white/20 rounded-full blur-md"></div>
        
        {/* Hero Content */}
        <div className="relative z-10 flex flex-col justify-center h-full px-16 max-w-2xl">
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-white/20">
            <h1 className="text-5xl font-bold text-white mb-8 leading-tight">
              Empowering people through seamless Attendance management.
            </h1>
            
            {/* Team Image Placeholder */}
            <div className="mb-8 relative">
              <div className="bg-white/20 rounded-2xl p-8 backdrop-blur-sm">
                <div className="flex items-center justify-center space-x-4">
                  {/* Professional team silhouettes */}
                  <div className="w-16 h-16 bg-white/30 rounded-full flex items-center justify-center">
                    <div className="w-8 h-8 bg-white/50 rounded-full"></div>
                  </div>
                  <div className="w-16 h-16 bg-white/30 rounded-full flex items-center justify-center">
                    <div className="w-8 h-8 bg-white/50 rounded-full"></div>
                  </div>
                  <div className="w-16 h-16 bg-white/30 rounded-full flex items-center justify-center">
                    <div className="w-8 h-8 bg-white/50 rounded-full"></div>
                  </div>
                </div>
                <div className="mt-4 h-4 bg-white/20 rounded w-3/4 mx-auto"></div>
                <div className="mt-2 h-3 bg-white/15 rounded w-1/2 mx-auto"></div>
              </div>
            </div>
            
            <p className="text-white/90 text-lg font-medium">
              Efficiently manage your workforce, streamline operations effortlessly.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Sign In Form */}
      <div className="w-1/2   flex flex-col bg-white items-center">
        {/* Header */}
        <div className="p-2 pb-2">
          <div className="flex items-center justify-end mb-8">
            <div className="flex items-center space-x-2">
              <img className=' h-24' src={LOGO} alt='NHDC'  />
            </div>
          </div>
        </div>

        {/* Sign In Form */}
        <div className="flex-1 px-12 py-0 " >
          <div className="mb-3.5">
            <h2 className="text-sm font-bold text-gray-900 mb-2">Sign In</h2>
            <p className="text-gray-600 text-sm">Please enter your details to sign in</p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex">
                <div className="text-red-600 text-sm font-medium">
                  {error}
                </div>
              </div>
            </div>
          )}

          <div className="space-y-2">
            {/* Username Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={loading}
                  className="w-full px-8 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Enter your username"
                />
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="w-full px-8 py-3 pl-12 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Enter your password"
                />
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            {/* <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={loading}
                  className="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500 disabled:opacity-50"
                />
                <span className="ml-2 text-sm text-gray-600">Remember Me</span>
              </label>
              <button 
                className="text-sm text-orange-500 hover:text-orange-600 font-medium disabled:opacity-50"
                disabled={loading}
              >
                Forgot Password?
              </button>
            </div> */}

            {/* Sign In Button */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Logging in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </div>

          {/* Create Account Link */}
          {/* <div className="mt-6 text-center">
            <span className="text-gray-600">Don't have an account? </span>
            <button 
              className="text-orange-500 hover:text-orange-600 font-medium disabled:opacity-50"
              disabled={loading}
            >
              Create Account
            </button>
          </div> */}

          {/* Divider */}
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

            <div className="grid grid-cols-2 gap-2">
            <button 
              className="flex items-center justify-center py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              disabled={loading}
            >
             <img className='bg-black w-32' src= {Company} alt="Company Logo"  />
            </button>
            <button 
  className="flex flex-col items-start gap-1 py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
  disabled={loading}
>
  <span className="flex items-center gap-2 text-xs">
    <PhoneCall className="w-4 h-4" /> 77488-77488
  </span>
  <span className="flex items-center gap-2 text-xs">
    <Mail className="w-4 h-4" /> info@loksewak.in
  </span>
</button>

           
          </div>


          {/* Social Login Buttons */}
           {/* <div className="grid grid-cols-3 gap-3">
            <button 
              className="flex items-center justify-center py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              disabled={loading}
            >
              <svg className="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </button>
            <button 
              className="flex items-center justify-center py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              disabled={loading}
            >
              <svg className="w-5 h-5 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            </button>
            <button 
              className="flex items-center justify-center py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors bg-black text-white border-black disabled:opacity-50"
              disabled={loading}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.024-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.1.12.112.225.83.408-.09.402-.293 1.417-.332 1.614-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.748-1.378 0 0-.599 2.282-.744 2.840-.282 1.084-1.064 2.456-1.549 3.235C9.584 23.815 10.77 24.001 12.017 24.001c6.624 0 11.99-5.367 11.99-12.014C24.007 5.367 18.641.001 12.017.001z"/>
              </svg>
            </button>
          </div> */}
        </div>

        {/* Footer */}
        <div className="p-8 pt-4">
          <p className="text-center text-sm text-gray-500">
            Copyright © 2025 -Ram Dongre All right reserved 
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;