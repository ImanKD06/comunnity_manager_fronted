import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Dashboard", end: true },
  { to: "/communities", label: "Communities",  },
  { to: "/neighbors", label: "Neighbors",  },
  { to: "/payments", label: "Payments",  },
  { to: "/expenses", label: "Expenses",  },
  { to: "/incidents", label: "Incidents",  },
  { to: "/actas", label: "Actas", },
];

function Navbar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="mark">🌿</div>
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

      <div className="sidebar-foot">Conectado a la API en :8000</div>
    </aside>
  );
}

export default Navbar;
