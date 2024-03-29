import React, { useState } from "react";
import LoginCSS from "./Login.module.css";
import { useAuth } from "../context/AuthContext";
import { FaEye, FaEyeSlash, FaLock } from "react-icons/fa";
import { IoMdMail } from "react-icons/io";
import { Link } from "react-router-dom";
const Login = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [showPassowrd, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/;

  const { isLoggedIn, login, updateAdmin } = useAuth();

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  const handleTogglePassword = (e) => {
    e.preventDefault();
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check for errors
    let newErrors = {};

    if (!credentials.email.trim()) {
      newErrors = {
        ...newErrors,
        email: "Email is required!",
      };
    } else if (!emailRegex.test(credentials.email.trim())) {
      newErrors = {
        ...newErrors,
        email: "Enter a valid email!",
      };
    }

    if (!credentials.password.trim()) {
      newErrors = {
        ...newErrors,
        password: "Password is required!",
      };
    }

    // Update the errors state
    setErrors(newErrors);

    // Perform actions after state update
    if (Object.keys(newErrors).length === 0) {
      try {
        const response = await fetch("http://localhost:8000/auth/login", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(credentials),
        });
        if (response.status == 200) {
          const responseData = await response.json();
          console.log(responseData);
          login();

          if (responseData.isAdmin) {
            // alert(isAdmin);
            updateAdmin(true);
          }
          // if (responseData.isAdmin) {
          //   // Redirect to admin page
          //   window.location.href = "/admin";
          // } else {
          // Redirect to user page
          console.log(isLoggedIn);
          window.location.href = "/user";
          // }
        } else {
          const data = await response.json();
          console.error("Login failed:", data.message);
          alert("Invalid Credentials ", data.message);
        }
      } catch (error) {
        console.error("Error during login:", error);
        alert(error);
      }
    }
  };

  return (
    <>
      <div className={LoginCSS.wrapper}>
        <div className={LoginCSS.container}>
          <div className={LoginCSS.header}>Login</div>
          <form className={LoginCSS.form} name="login">
            <div className={LoginCSS.email}>
              <label htmlFor="email" className={LoginCSS.label}>
                Email
              </label>
              <div className={LoginCSS.inputContainer}>
                <input
                  id="email"
                  name="email"
                  className={LoginCSS.input}
                  type="text"
                  onChange={handleChange}
                  autoComplete="true"
                  autoFocus
                />
                <span className={LoginCSS.icon}>
                  <IoMdMail />
                </span>
              </div>
              {errors.email && (
                <div className={LoginCSS.error}>{errors.email}</div>
              )}
            </div>
            <div className={LoginCSS.password}>
              <div>
                <label htmlFor="password" className={LoginCSS.label}>
                  Password
                </label>
                <button
                  className={LoginCSS.showPassowrd}
                  onClick={handleTogglePassword}
                >
                  {showPassowrd ? (
                    <FaEyeSlash size={20} />
                  ) : (
                    <FaEye size={20} />
                  )}
                </button>
              </div>
              <div className={LoginCSS.inputContainer}>
                <input
                  id="password"
                  name="password"
                  className={LoginCSS.input}
                  type={showPassowrd ? "text" : "password"}
                  onChange={handleChange}
                  autoComplete="true"
                />
                <span className={LoginCSS.icon}>
                  <FaLock />
                </span>
              </div>
              {errors.password && (
                <div className={LoginCSS.error}>{errors.password}</div>
              )}
            </div>
            <div className={LoginCSS.loginButton}>
              <button type="submit" onClick={handleSubmit}>
                LOGIN
              </button>
            </div>
            <div className={LoginCSS.registerLink}>
              <p>
                Don't have an account?{" "}
                <Link to="/signup" className={LoginCSS.link}>
                  Register
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
