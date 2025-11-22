import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const Navbar = () => {
  // Name displayed in "Welcome <name>"
  const [displayName, setDisplayName] = useState(null);

  // Read token + role from localStorage to know login state & role
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const navigate = useNavigate();

  // Whenever token changes (login/logout), update displayName
  useEffect(() => {
    if (!token) {
      setDisplayName(null);
      return;
    }
    const storedUsername = localStorage.getItem("username");
    setDisplayName(storedUsername || "User");
  }, [token]);

  // Logout: clear all auth data and redirect to login
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg" style={{ background: "#6f00ff" }}>
      <div className="container-fluid px-3">
        {/* Brand title: Navkar Finance */}
        <NavLink
          className="navbar-brand text-light"
          to={role === "ROLE_ADMIN" ? "/admin" : "/"}
          style={{ fontFamily: "Fugaz One, cursive", fontSize: 24 }}
        >
          Navkar Finance
        </NavLink>

        <div className="collapse navbar-collapse" id="navbarMainMenu">
          {/* Center area: Show Admin link only if logged-in user is admin */}
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
            {token && role === "ROLE_ADMIN" && (
              <li className="nav-item">
                <NavLink className="nav-link text-light" to="/admin">
                  Admin
                </NavLink>
              </li>
            )}
          </ul>

          {/* Right side: Welcome text + Login/Register or Logout */}
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            {/* Only show Welcome if user is logged in */}
            {token && (
              <li className="nav-item me-3">
                <span className="nav-link text-light">
                  Welcome {displayName ? displayName : "User"}
                </span>
              </li>
            )}

            {/* If no token => show Login & Register */}
            {!token ? (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link text-light" to="/login">
                    Login
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link text-light" to="/register">
                    Register
                  </NavLink>
                </li>
              </>
            ) : (
              // Else show Logout button
              <li className="nav-item">
                <button className="btn btn-sm btn-light" onClick={logout}>
                  Logout
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
