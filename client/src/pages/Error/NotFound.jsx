import { AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 px-4 text-center">
      <AlertTriangle className="text-red-500 w-20 h-20 mb-4" />
      <h1 className="text-3xl sm:text-4xl font-bold text-red-600 mb-2">404 - Page Not Found</h1>
      <p className="text-gray-600 mb-6">
        Sorry, the page you’re looking for doesn’t exist.
      </p>
      <Link
        to="/login"
        className="px-6 py-3 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition-colors"
      >
        Go Home 
      </Link>
    </div>
  );
};

export default NotFound;
