import { useLocation, useNavigate } from "react-router-dom";

const pathNameMap = {
  "/": "Dashboard",
  "/orders": "Orders",
  "/inventory": "Inventory",
  "/products": "Products",
  "/customers": "Customers",
  "/delivery-status": "Delivery Status",
  "/blogs": "Blogs",
  "/payment": "Payment",
};

const Navbar = ({ onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const title = pathNameMap[location.pathname] || "Dashboard";

  const handleLogout = () => {
    localStorage.removeItem("user");
    if (onLogout) onLogout();
    navigate("/");
  };

  return (
    <header className="w-full bg-white shadow px-6 py-4 flex justify-between items-center">
      <div className="text-lg font-semibold">{title}</div>
      <button 
        onClick={handleLogout} 
        className="bg-red-500 text-white p-2 rounded"
      >
        Logout
      </button>
    </header>
  );
};

export default Navbar;
