import React, { useEffect, useState } from "react";
import NavabrCSS from "./Navbar.module.css";
import logo from "../assets/logo.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ConfirmationModal from "./ConfirmationModal";

const Navbar = ({ scrollToTable }) => {
  const { isLoggedIn, logout, isAdmin } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const navigateTo = useNavigate(); // Initialize history
  const location = useLocation();

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };

  const handleLogout = () => {
    logout(); // Call logout function
    // No need to manually clear token or redirect, as logout function should handle that

    // Redirect to landing page
    window.location.href = "/";
  };
  const handleLogin = () => {
    // Perform login logic (e.g., show login form, navigate to login page)
    // Call the login function from the authentication context
    navigateTo("/login");
  };

  const handleToggle = () => {
    if (location.pathname.startsWith("/admin")) navigateTo("/user");
    else navigateTo("/admin");
  };
  return (
    <>
      <div className={NavabrCSS.container}>
        <Link to="/">
          <div className={NavabrCSS.logo}>
            <img
              src={logo}
              alt="Training Tracker logo"
              height={64}
              width={64}
            />
            <p>Training Tracker</p>
          </div>
        </Link>
        <div className={NavabrCSS.leftSide}>
          <div className={NavabrCSS.links}>
            {isLoggedIn ? (
              <Link to="/user">Home</Link>
            ) : (
              <Link to="/">Home</Link>
            )}
            {location.pathname == "/user" ? (
              <Link onClick={scrollToTable}>Trainings</Link>
            ) : (
              ""
            )}
          </div>

          {isLoggedIn ? (
            <div className={NavabrCSS.buttons}>
              {isAdmin && (
                <button className={NavabrCSS.login} onClick={handleToggle}>
                  {location.pathname.startsWith("/admin") ? "User" : "Admin"}
                </button>
              )}
              <button className={NavabrCSS.logout} onClick={handleLogoutClick}>
                Logout
              </button>
              <ConfirmationModal
                isOpen={showLogoutModal}
                text={`Do you want to Logout?`}
                onConfirm={handleLogout}
                onCancel={handleLogoutCancel}
              />
            </div>
          ) : (
            <div className={NavabrCSS.buttons}>
              <button className={NavabrCSS.login} onClick={handleLogin}>
                Log In
              </button>
              <Link to="/signup">
                <button className={NavabrCSS.signup}>SignUp</button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
