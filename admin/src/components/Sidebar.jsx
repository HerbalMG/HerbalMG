import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const links = [
    { label: 'Dashboard', path: '/dashboard', roles: ['admin'] },
    { label: 'Inventory', path: '/inventory', roles: ['admin','limited_admin'] },
    { label: 'Management', path: '/management', roles: ['admin', 'limited_admin'] },
    { label: 'Product Management', path: '/product-management', roles: ['admin', 'limited_admin'] },
    { label: 'Orders', path: '/orders', roles: ['admin'] },
    { label: 'Customers', path: '/customers', roles: ['admin'] },
    { label: 'Delivery Status', path: '/delivery-status', roles: ['admin'] },
    { label: 'Blogs', path: '/blogs', roles: ['admin', 'limited_admin'] },
    { label: 'Payment', path: '/payment', roles: ['admin'] },
  ];
  return (
    <aside className="w-58 bg-white shadow h-screen fixed">
      <div className="p-6 font-bold text-xl">HerbalMG Admin Panel</div>
      <nav className="flex flex-col gap-4 p-4">
        {links.filter(link => link.roles.includes(user.role)).map(link => (
          <NavLink
            key={link.label}
            to={link.path}
            className={({ isActive }) =>
              `px-3 py-2 rounded hover:bg-gray-100 ${isActive ? "bg-gray-200" : ""}`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
