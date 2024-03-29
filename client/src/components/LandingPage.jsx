import React, { useEffect } from "react";
import LandingPageCSS from "./LandingPage.module.css";
import Navbar from "./Navbar";
import Footer from "./Footer";
import arrow from "../assets/arrow.svg";
import hat from "../assets/hat.svg";
import todo from "../assets/todo.svg";
import group from "../assets/group.svg";
import learning from "../assets/learning.svg";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
function LandingPage() {
  const { logout } = useAuth();
  useEffect(() => {
    checkToken();
  }, []);

  const showToast = (message) => {
    if (message.success) toast.success(message.success);
    else if (message.error) toast.error(message.error);
  };

  const checkToken = async () => {
    try {
      const response = await fetch("http://localhost:5000/checkToken", {
        credentials: "include",
      });

      // console.log(response);
      const result = await response.json();
      if (response.status != 200) {
        // alert(result);
        logout();
      }
    } catch (error) {
      showToast({ error: error.message });
    }
  };

  return (
    <>
      <div className={LandingPageCSS.navbar}>
        <Navbar isLoggedIn={false} />
      </div>
      <div className={LandingPageCSS.heroContainer}>
        <div className={LandingPageCSS.herotext}>
          <p>
            The perfect way <br />
            to <span className={LandingPageCSS.highlight}>upskill </span>
            yourself
          </p>
        </div>
        <div>
          <p>
            Unlock your potential and future proof your career with our <br />
            cutting-edge training program designed to upskill you for <br />
            success
          </p>
        </div>
      </div>

      {/* Banner - would work better as component*/}
      <div className={LandingPageCSS.bannerContainer}>
        <img
          className={LandingPageCSS.arrowImg}
          src={arrow}
          alt="arrow pointing to left"
        />
        <div className={LandingPageCSS.banner}>
          <div className={LandingPageCSS.topic}>
            <div className={LandingPageCSS.imgFrame}>
              <img
                className={LandingPageCSS.img}
                src={hat}
                alt="blue scholar hat"
              />
            </div>
            <div className={LandingPageCSS.content}>
              <div className={LandingPageCSS.header}>
                <p>Learn The Latest Skills</p>
              </div>
              <div className={LandingPageCSS.body}>
                <p>
                  Stay ahead of the curve <br /> with cutting-edge knowledge
                </p>
              </div>
            </div>
          </div>
          <div className={LandingPageCSS.topic}>
            <div className={LandingPageCSS.imgFrame}>
              <img
                className={LandingPageCSS.img}
                src={todo}
                alt="blue todo list"
              />
            </div>
            <div className={LandingPageCSS.content}>
              <div className={LandingPageCSS.header}>
                <p>Get Ready for the Career</p>
              </div>
              <div className={LandingPageCSS.body}>
                <p>
                  Equip yourself for success with <br /> our comprehensive
                  training
                </p>
              </div>
            </div>
          </div>
          <div className={LandingPageCSS.topic}>
            <div className={LandingPageCSS.imgFrame}>
              <img
                className={LandingPageCSS.img}
                src={group}
                alt="group of people"
              />
            </div>
            <div className={LandingPageCSS.content}>
              <div className={LandingPageCSS.header}>
                <p>Connect More</p>
              </div>
              <div className={LandingPageCSS.body}>
                <p>
                  Network, collabrate and thrive in a <br />
                  dynamic community of like-minded professionals
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={LandingPageCSS.bottomContainer}>
        <img
          className={LandingPageCSS.img}
          src={learning}
          alt="a person learning on computer"
        />
        <div className={LandingPageCSS.content}>
          <div className={LandingPageCSS.header}>
            <h3>
              Premium Learning <br />
              Experience
            </h3>
          </div>
          <div className={LandingPageCSS.tags}>
            <p>Easily accessible</p>
            <p>Fun learning experience</p>
          </div>
        </div>
      </div>
      {/* Footer */}
      <Footer />
    </>
  );
}

export default LandingPage;
