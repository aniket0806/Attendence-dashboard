import { Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

const Unauthorized = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-orange-50 px-4 text-center">
      <Lock className="text-orange-500 w-20 h-20 mb-4" />
      <h1 className="text-3xl sm:text-4xl font-bold text-orange-600 mb-2">Access Denied</h1>
      <p className="text-gray-600 mb-6">
        You don’t have permission to view this page.
      </p>
      <Link
        to="/login"
        className="px-6 py-3 bg-orange-500 text-white rounded-lg shadow hover:bg-orange-600 transition-colors"
      >
        Go to Login
      </Link>
    </div>
  );
};

export default Unauthorized;
