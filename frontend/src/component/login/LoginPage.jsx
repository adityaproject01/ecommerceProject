import React from "react";
import "./login.css";
import eccomerce from "../../images/9579712.jpg";
import usericon from "../../images/us1.png";
import eyeicon from "../../images/padloc.png";
const LoginPage = () => {
  return (
    <div className="Login">
      <div className="bg-image"></div>
      <div className="blur-overlay">
        <div className="loginLeft">
          <img src={eccomerce} alt=" " className="loginLeftImage" />
          <div className="loginRight">
            <div className="loginRightHeadding">
              <h1>Login</h1>
            </div>
            <div className="loginRightInput">
              <input type="text" placeholder="Enter the Email" />
              <img src={usericon} alt="" className="loginUserIcon" />
            </div>
            <div className="loginRightInput">
              <input type="text" placeholder="Enter the password" />
              <img src={eyeicon} alt="" className="loginUserIcon" />
            </div>
            <div className="loginRightsub">
              <button className="loginButton">Login</button>
              <p>Signup</p>
              <p>ForgotPassword</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
