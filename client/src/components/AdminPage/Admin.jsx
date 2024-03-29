import styles from "./Admin.module.css";
import MyCalendar from "./MyCalendar";
import TrainingProgramList from "./TrainingProgramList";
import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import Footer from "../Footer";
import Navbar from "../Navbar";
import { useAuth } from "../../context/AuthContext";
import { Base64 } from "js-base64";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
function Admin() {
  const { isLoggedIn, logout } = useAuth();
  const [name, setName] = useState("");

  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

  const handleCreateTrainingClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const [trainings, setTrainings] = useState([]);
  const [userCount, setUserCount] = useState(0);

  useEffect(() => {
    fetchData();
    fetchCount();

    const token = document.cookie;
    if (token) {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        Base64.atob(base64)
          .split("")
          .map(function (c) {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join("")
      );
      const payload = JSON.parse(jsonPayload);
      setName(payload.name);
    }
  }, []);

  const showToast = (message) => {
    if (message.success) toast.success(message.success);
    else if (message.error) toast.error(message.error);
  };

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:8000/checkToken", {
        credentials: "include",
      });

      // console.log(response);
      const result = await response.json();
      if (response.status != 200) {
        logout();
        showToast({ success: result });
        navigate("/login");
      } else {
        fetch("http://localhost:8000/admin/trainings", {
          credentials: "include",
        })
          .then((response) => response.json())
          .then((data) => {
            setTrainings(data);
          })
          .catch((error) => console.error("Error fetching trainings:", error));
      }
    } catch (error) {
      showToast({ error: error.message });
    }
  };

  const fetchCount = () => {
    fetch("http://localhost:8000/admin/usercount", {
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        setUserCount(data);
      })
      .catch((error) => console.error("Error fetching trainings:", error));
  };

  return (
    <>
      <div className={styles.adminBody}>
        <div className={styles.navbar}>
          <Navbar />
        </div>
        {isLoggedIn ? (
          <div>
            <MyCalendar />
            <header>
              <p id={styles.welcomeTxt}>Welcome, {name}</p>
            </header>
            <div className={styles.userCount}>Total Users : {userCount}</div>
            <div id={styles.trainingDiv}>
              {Array.isArray(trainings) ? (
                <TrainingProgramList
                  trainings={trainings}
                  fetchData={fetchData}
                />
              ) : (
                <p>Loading trainings...</p>
              )}
            </div>

            <div>
              <button
                className={styles.createTrainingButton}
                onClick={handleCreateTrainingClick}
              >
                Create Training
              </button>

              <Modal
                show={showModal}
                fetchData={fetchData}
                handleClose={handleCloseModal}
              />
            </div>
            <div className={styles.adminFooter}>
              <Footer />
            </div>
          </div>
        ) : (
          <div className={styles.unauthorizedAccessContainer}>
            <div className={styles.errorCode}>401 &#x1F61E;</div>
            <div className={styles.errorText}>
              Unauthorized Access, please login first
            </div>
            <Link to="/login">
              <button className={styles.okButton}>OK</button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}

export default Admin;
