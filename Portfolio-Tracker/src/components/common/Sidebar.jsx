import { LayoutDashboard, Menu, UserRound, ChartNoAxesCombined } from "lucide-react";  
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";

const SIDEBAR_ITEMS = [
  {
    name: "Overview",
    icon: LayoutDashboard,
    color: "#6366f1",
    href: "/",
  },
  { name: "Current Stocks", icon: ChartNoAxesCombined, color: "#8B5CF6", href: "/current-stocks" },
  { name: "Profile", icon: UserRound, color: "#6EE7B7", href: "/profile" },
];

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Detect window width and adjust sidebar state accordingly
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // Define mobile breakpoint (768px)
    };

    handleResize(); // Set initial state based on window size
    window.addEventListener("resize", handleResize); // Add event listener to track window resizing

    return () => {
      window.removeEventListener("resize", handleResize); // Clean up event listener on component unmount
    };
  }, []);

  // Ensure the sidebar is closed on mobile
  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false); // Force sidebar to close on mobile
    }
  }, [isMobile]);

  return (
    <motion.div
      className={`relative z-10 transition-all duration-300 ease-in-out flex-shrink-0 ${
        isSidebarOpen ? "w-64" : "w-20"
      }`}
      animate={{ width: isSidebarOpen ? 256 : 80 }}
    >
      <div className='h-full bg-gray-800 bg-opacity-50 backdrop-blur-md p-4 flex flex-col border-r border-gray-700 rounded-r-3xl'>
        {!isMobile && ( // Show menu button only on larger screens
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className='p-2 rounded-full hover:bg-gray-700 transition-colors max-w-fit'
          >
            <Menu size={24} />
          </motion.button>
        )}

        <nav className='mt-8 flex-grow  '>
          {SIDEBAR_ITEMS.map((item) => (
            <Link key={item.href} to={item.href}>
              <motion.div className='flex items-center p-4 text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors mb-2'>
                <item.icon size={20} style={{ color: item.color, minWidth: "20px" }} />
                <AnimatePresence>
                  {isSidebarOpen && (
                    <motion.span
                      className='ml-4 whitespace-nowrap'
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2, delay: 0.3 }}
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </Link>
          ))}
        </nav>
      </div>
    </motion.div>
  );
};

export default Sidebar;
