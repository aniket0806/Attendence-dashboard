// components/AddButton.jsx
import { Plus } from "lucide-react";

const AddButton = ({ onClick, text, className = "" }) => {
  return (
    <button 
      className={`inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm ${className}`}
      onClick={onClick}
    >
      <Plus size={16} className="mr-2" />
      {text}
    </button>
  );
};

export default AddButton;