import { motion } from "framer-motion";
import { LogOut } from "lucide-react";
import { useNavigate } from 'react-router-dom';

const LogOutSection = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('user-info');
    navigate('/');
  };

  return (
    <motion.div
      className=" bg-opacity-50 backdrop-blur-lg shadow-xl rounded-xl p-6 border border-red-800 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="flex items-center mb-4">
        <LogOut className="text-red-100 mr-3" size={24} />
        <h2 className="text-xl font-semibold text-gray-100 tracking-tight">LogOut <span role="img" aria-label="wave">👋</span></h2>
      </div>
      <p className="text-gray-300 mb-4 text-sm">
        By clicking this button, you will be logged out of your account. <strong>Are you sure?</strong>
      </p>
      <button
        onClick={handleLogout}
        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg 
          transition duration-300 ease-in-out transform hover:scale-105 shadow-md"
      >
        LogOut
      </button>
    </motion.div>
  );
};

export default LogOutSection;
