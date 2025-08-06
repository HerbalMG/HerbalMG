import { useLocation, useNavigate } from "react-router-dom";

const pathNameMap = {
  "/": "Dashboard",
  "/orders": "Orders",
  "/inventory": "Inventory",
  "/management": "Management",
  "/customers": "Customers",
  "/delivery-status": "Delivery Status",
  "/blogs": "Blogs",
  "/payment": "Payment",
  "/product-management": "Product Managment"
};

const Navbar = ({ onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const title = pathNameMap[location.pathname] || "Dashboard";
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        await fetch("http://localhost:3001/api/login/logout", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (err) {
        // Ignore network errors on logout
      }
    }
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    if (onLogout) onLogout();
    navigate("/");
  };

  return (
    <header className="w-full bg-white shadow px-6 py-4 flex justify-between items-center ml-2">
      <div className="text-lg font-semibold">{title}</div>
      <div className="flex items-center gap-4">
        {user.username && (
          <span className="text-gray-700 font-medium">{user.username}</span>
        )}
        <button 
          onClick={handleLogout} 
          className="bg-red-500 text-white p-2 rounded"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;
