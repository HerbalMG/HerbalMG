// components/Sidebar.jsx
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const links = ["Dashboard", "Orders", "Inventory", "Products", "Customers", "Delivery Status", "Blogs","Payment"];
  return (
    <aside className="w-58 bg-white shadow h-screen fixed">
      <div className="p-6 font-bold text-xl">HerbalMG Admin</div>
      <nav className="flex flex-col gap-4 p-4">
        {links.map(link => (
          <NavLink
            key={link}
            to={`/${link.toLowerCase().replace(/\s/g, "-")}`}
            className={({ isActive }) =>
              `px-3 py-2 rounded hover:bg-gray-100 ${isActive ? "bg-gray-200" : ""}`
            }
          >
            {link}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
