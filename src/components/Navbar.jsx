import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Panel", end: true },
  { to: "/communities", label: "Comunidades",  },
  { to: "/neighbors", label: "Vecinos",  },
  { to: "/payments", label: "Pagos",  },
  { to: "/expenses", label: "Gastos",  },
  { to: "/incidents", label: "Incidencias",  },
  { to: "/actas", label: "Actas", },
];

function Navbar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="mark"></div>
        <div>
          <h2>Community</h2>
          <span>Manager</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <span>{link.icon}</span>
            {link.label}
          </NavLink>
        ))}
      </nav>

      
    </aside>
  );
}

export default Navbar;
