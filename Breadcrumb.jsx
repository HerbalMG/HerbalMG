import { useLocation, Link } from "react-router-dom";

export default function Breadcrumb() {
  const location = useLocation();

  // Split path and filter empty parts
  const pathnames = location.pathname.split("/").filter(Boolean);

  return (
    <nav style={{ marginBottom: "1rem" }}>
      <Link to="/">home</Link>
      {pathnames.length > 0 &&
        pathnames.map((name, index) => {
          const routeTo = "/" + pathnames.slice(0, index + 1).join("/");
          return (
            <span key={routeTo}>
              {" > "}
              <Link to={routeTo}>{name.charAt(0).toUpperCase() + name.slice(1)}</Link>
            </span>
          );
        })}
    </nav>
  );
}
