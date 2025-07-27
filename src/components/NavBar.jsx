import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import PollFormModal from "./PollFormModal";
import "./NavBarStyles.css";

const NavBar = ({ user, onLogout }) => {
  const [isPollModalOpen, setIsPollModalOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <img src="https://i.imgur.com/yn48odO.png" alt="Rankzilla Logo" className="logo-img" />
        <Link to={user ? "/dashboard" : "/"} className={`logo-link${location.pathname === "/dashboard" ? " active" : ""}`}>
          <span className="brand-text">Rankzilla</span>
        </Link>
        <Link to="/demo" className={`nav-link${location.pathname === "/demo" ? " active" : ""}`}>Demo</Link>
      </div>

      <div className="nav-links">
        {user ? (
          <div className="user-section">
            {/* ✅ Show modal trigger if user is logged in and not a guest */}
            {user.username && (
              <>
                <button
                  className={`createbutton-nav nav-link${location.pathname === "/polls/new" ? " active" : ""}`}
                  onClick={() => setIsPollModalOpen(true)}
                >
                  + Create a poll
                </button>
                <PollFormModal
                  isOpen={isPollModalOpen}
                  onClose={() => setIsPollModalOpen(false)}
                />
              </>
            )}

            <button
              className={`profile-nav-btn nav-link${location.pathname === `/users/${user.id}` ? " active" : ""}`}
              onClick={() => window.location.href = `/users/${user.id}`}
              type="button"
            >
              {`Welcome, ${user.username}!`}
            </button>
            <button onClick={onLogout} className="logout-btn">
              Logout
            </button>
          </div>
        ) : (
          <div className="auth-links">
            <Link to="/login" className={`nav-link${location.pathname === "/login" ? " active" : ""}`}>
              Login
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;