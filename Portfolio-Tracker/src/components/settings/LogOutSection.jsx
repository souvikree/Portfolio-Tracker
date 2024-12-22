import { motion } from "framer-motion";
import {  LogOut} from "lucide-react";

const LogOutSection = () => {
	return (
		<motion.div
			className='bg-red-900 bg-opacity-50 backdrop-filter backdrop-blur-lg shadow-lg rounded-xl p-6 border border-red-700 mb-8'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5, delay: 0.2 }}
		>
			<div className='flex items-center mb-4'>
				<LogOut className='text-red-400 mr-3' size={24} />
				<h2 className='text-xl font-semibold text-gray-100'>LogOut</h2>
			</div>
			<p className='text-gray-300 mb-4'>By clicking this button you will be logged out of your account</p>
			<button
				className='bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded 
      transition duration-200'
			>
				LogOut
			</button>
		</motion.div>
	);
};
export default LogOutSection;
