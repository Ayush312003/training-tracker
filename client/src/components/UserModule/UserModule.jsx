import React, { useState, useEffect, useRef } from "react";
import style from "./UserModule.module.css";
import Navbar from "../Navbar";
import mySvg from "../../images/img_isolationmode.svg";
import Card from "../Card";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Footer from "../Footer";
import { useAuth } from "../../context/AuthContext";
import { Base64 } from "js-base64";
import TrainingsTable from "./TrainingsTable";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const UserModule = () => {
  const { isLoggedIn, logout } = useAuth(); // Use the useAuth hook to access authentication state and functions
  const [name, setName] = useState("");

  const navigate = useNavigate();
  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 1024 },
      items: 5,
      slidesToSlide: 2,
    },
    desktop: {
      breakpoint: { max: 1024, min: 800 },
      items: 4,
    },
    tablet: {
      breakpoint: { max: 800, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  const [appliedTrainings, setAppliedTrainings] = useState([]);
  const [unEnrolledTrainings, setUnEnrolledTrainings] = useState([]);
  const [interestedTrainings, setInterestedTrainings] = useState([]);

  const [showEnroll, setShowEnroll] = useState(true);
  const [showInterest, setShowInterest] = useState(false);

  const trainingsTableRef = useRef(null);

  const scrollToTable = () => {
    if (trainingsTableRef.current)
      trainingsTableRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const showEnrolled = () => {
    setShowEnroll(true);
    setShowInterest(false);
  };

  const showInterested = () => {
    setShowEnroll(false);
    setShowInterest(true);
  };

  const showToast = (message) => {
    if (message.success) toast.success(message.success);
    else if (message.error) toast.error(message.error);
  };

  // fetches all trainings user applied to
  useEffect(() => {
    fetchAppliedTrainings();
    fetchUnEnrolledTraining();
    fetchInterestedTraining();

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
      console.log(JSON.parse(jsonPayload));
    }
  }, []);

  const fetchAppliedTrainings = async () => {
    try {
      const response = await fetch("http://localhost:5000/checkToken", {
        credentials: "include",
      });

      // console.log(response);
      const result = await response.json();
      if (response.status != 200) {
        // alert(result);
        logout();
        showToast({ success: result });
        navigate("/login");
      } else {
        fetch("http://localhost:5000/user/getUserApplied", {
          credentials: "include",
        })
          .then((response) => {
            if (response.ok) {
              return response.json();
            } else {
              console.error(
                "Failed to fetch user's training IDs:",
                response.status
              );
              return [];
            }
          })
          .then((data) => {
            setAppliedTrainings(data);
          })
          .catch((error) => {
            console.error("Error fetching user's training IDs:", error);
          });
      }
    } catch (error) {
      showToast({ error: error.message });
    }
  };

  const fetchUnEnrolledTraining = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/user/getUserUnEnrolledTraining",
        {
          credentials: "include",
        }
      );
      const result = await response.json();

      if (response.status == 200) {
        console.log(result);
        setUnEnrolledTrainings(result);
      }
    } catch (error) {}
  };

  const fetchInterestedTraining = () => {
    fetch("http://localhost:5000/user/getUserInterested", {
      credentials: "include",
    })
      .then((response) => {
        if (response.ok) {
          console.log(response.json);
          return response.json();
        } else {
          console.error(
            "Failed to fetch user's training IDs:",
            response.status
          );
          return [];
        }
      })
      .then((data) => {
        setInterestedTrainings(data);
      })
      .catch((error) => {
        console.error("Error fetching user's training IDs:", error);
      });
  };
  return (
    <div>
      <Navbar isLoggedIn={isLoggedIn} scrollToTable={scrollToTable} />
      {isLoggedIn ? (
        <div>
          <div className={style.welcome}>
            <p>Welcome, {name}!</p>
          </div>
          <div className={style.container}>
            <div className={style.rectangle}>
              <div className={style.text}>
                Get Involved – Join a Training Today!
              </div>
              <div className={style.subText}>
                Explore your interests and meet like-minded community by joining
                one of our many trainings.
              </div>
              <button className={style.button}>Learn More</button>
            </div>
            <img src={mySvg} className={style.svgImage} alt="SVG Image" />
          </div>
          <div className={style.carouselContainer}>
            <div className={style.carouselHeader}>Available Trainings</div>
            <Carousel showDots={true} responsive={responsive}>
              {unEnrolledTrainings.length == 0 ? (
                <div className={style.emptyCarousel}>
                  Looks like you've caught up with everything &#x2713;
                </div>
              ) : (
                unEnrolledTrainings
                  .filter((training) => {
                    const startsAtTime = new Date(training.date_time_start);
                    const currentTime = new Date();
                    return startsAtTime > currentTime;
                  })
                  .map((training) => (
                    <Card
                      key={training.id}
                      trainingData={training}
                      fetchAppliedTrainings={fetchAppliedTrainings}
                      fetchUnEnrolledTraining={fetchUnEnrolledTraining}
                      fetchInterestedTraining={fetchInterestedTraining}
                    />
                  ))
              )}
            </Carousel>
          </div>
          <div ref={trainingsTableRef} className={style.tableButtons}>
            <button
              onClick={showEnrolled}
              className={
                showEnroll ? `${style.activeButton}` : `${style.inactiveButton}`
              }
            >
              Enrolled Trainings
            </button>
            <button
              onClick={showInterested}
              className={
                showInterest
                  ? `${style.activeButton}`
                  : `${style.inactiveButton}`
              }
            >
              Interested Trainings
            </button>
          </div>
          <div className={style.tainingTable}>
            {showEnroll && <TrainingsTable fetchedData={appliedTrainings} />}
            {showInterest && (
              <TrainingsTable fetchedData={interestedTrainings} />
            )}
          </div>
          <Footer />
        </div>
      ) : (
        <div className={style.unauthorizedAccessContainer}>
          <div className={style.errorCode}>401 &#x1F61E;</div>
          <div className={style.errorText}>
            Unauthorized Access, please login first
          </div>
          <Link to="/login">
            <button className={style.okButton}>OK</button>
          </Link>
        </div>
      )}
    </div>
  );
};
export default UserModule;
