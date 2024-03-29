import React, { useState } from "react";
import axios from "axios";
import SignupCSS from "./Signup.module.css";
import { FaEye, FaEyeSlash, FaLock, FaUser } from "react-icons/fa";
import { IoMdMail } from "react-icons/io";
import { Link } from "react-router-dom";

const Signup = () => {
  const [credentials, setCredentials] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassowrd, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/;

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

    let newErrors = {};

    if (!credentials.name.trim()) {
      newErrors = {
        ...newErrors,
        name: "Name is required!",
      };
    }

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

    if (credentials.confirmPassword.trim() != credentials.password.trim()) {
      newErrors = {
        ...newErrors,
        confirmPassword: "Password must match!",
      };
    }

    // Update the errors state
    setErrors(newErrors);
    console.log(credentials);

    if (Object.keys(newErrors).length === 0) {
      try {
        const response = await axios.post(
          "http://localhost:8000/auth/signup",
          credentials,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.status === 200) {
          console.log("Signup successful:", response.data);
          window.location.href = "/login"; // Redirect to login page after successful signup
        } else {
          console.error("Signup failed:", response.data.error);
          alert("Signup failed:", response.data.error);
          // Display an alert with the error message
          alert(response.data.error);
        }
      } catch (error) {
        console.error("Error:", error);
        console.error("Response data:", error.response.data);
        alert("Error:", error);
      }
    }
  };

  return (
    <>
      <div className={SignupCSS.wrapper}>
        <div className={SignupCSS.container}>
          <div className={SignupCSS.header}>Sign Up</div>
          <form className={SignupCSS.form} name="signup">
            <div className={SignupCSS.name}>
              <label htmlFor="name" className={SignupCSS.label}>
                Name
              </label>
              <div className={SignupCSS.inputContainer}>
                <input
                  id="name"
                  name="name"
                  className={SignupCSS.input}
                  type="text"
                  onChange={handleChange}
                  autoComplete="true"
                  autoFocus
                />
                <span className={SignupCSS.icon}>
                  <FaUser />
                </span>
              </div>
              {errors.name && (
                <div className={SignupCSS.error}>{errors.name}</div>
              )}
            </div>
            <div className={SignupCSS.email}>
              <label htmlFor="email" className={SignupCSS.label}>
                Email
              </label>
              <div className={SignupCSS.inputContainer}>
                <input
                  id="email"
                  name="email"
                  className={SignupCSS.input}
                  type="text"
                  onChange={handleChange}
                  autoComplete="true"
                />
                <span className={SignupCSS.icon}>
                  <IoMdMail />
                </span>
              </div>
              {errors.email && (
                <div className={SignupCSS.error}>{errors.email}</div>
              )}
            </div>
            <div className={SignupCSS.password}>
              <div>
                <label htmlFor="password" className={SignupCSS.label}>
                  Password
                </label>
                <button
                  className={SignupCSS.showPassowrd}
                  onClick={handleTogglePassword}
                >
                  {showPassowrd ? (
                    <FaEyeSlash size={20} />
                  ) : (
                    <FaEye size={20} />
                  )}
                </button>
              </div>
              <div className={SignupCSS.inputContainer}>
                <input
                  id="password"
                  name="password"
                  className={SignupCSS.input}
                  type={showPassowrd ? "text" : "password"}
                  onChange={handleChange}
                  autoComplete="true"
                />
                <span className={SignupCSS.icon}>
                  <FaLock />
                </span>
              </div>
              {errors.password && (
                <div className={SignupCSS.error}>{errors.password}</div>
              )}
            </div>
            <div className={SignupCSS.password}>
              <div>
                <label htmlFor="confirmPassword" className={SignupCSS.label}>
                  Confirm Password
                </label>
                <button className={SignupCSS.showPassowrd}></button>
              </div>
              <div className={SignupCSS.inputContainer}>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  className={SignupCSS.input}
                  type={showPassowrd ? "text" : "password"}
                  onChange={handleChange}
                  autoComplete="true"
                />
                <span className={SignupCSS.icon}>
                  <FaLock />
                </span>
              </div>
              {errors.confirmPassword && (
                <div className={SignupCSS.error}>{errors.confirmPassword}</div>
              )}
            </div>
            <div className={SignupCSS.signupButton}>
              <button type="submit" onClick={handleSubmit}>
                SIGN UP
              </button>
            </div>
            <div className={SignupCSS.loginLink}>
              <p>
                Already have an account?{" "}
                <Link to="/login" className={SignupCSS.link}>
                  Login
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Signup;
