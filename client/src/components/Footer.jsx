import React from "react";
import FooterCSS from "./Footer.module.css";
import logo from "../assets/logo.png";

const Footer = () => {
  {
    /* change some of these into links */
  }
  return (
    <>
      <div className={FooterCSS.topContainer}>
        <div className={FooterCSS.branding}>
          <img src={logo} alt="training tracker logo" />
          <h3>Training Tracker</h3>
        </div>
        <div className={FooterCSS.links}>
          <h3>Company</h3>
          <p>About us</p>
        </div>
        <div className={FooterCSS.links}>
          <h3>Support</h3>
          <p>Contact us</p>
        </div>
      </div>
      <div className={FooterCSS.bottomContainer}>
        <p>AltF4 All Rights Reserved 2024</p>
      </div>
    </>
  );
};

export default Footer;
