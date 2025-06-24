// components/Navbar.jsx
import { useLocation } from "react-router-dom";

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

const Navbar = () => {
  const location = useLocation();
  const title = pathNameMap[location.pathname] || "Dashboard";

  return (
    <header className="w-full bg-white shadow px-6 py-4 flex justify-between items-center">
      <div className="text-lg font-semibold">{title}</div>
      <button className="bg-red-500 text-white p-2 rounded">Logout</button>
    </header>
  );
};

export default Navbar;
