import React, {  useState } from "react";
import "./login.css";
import { useNavigate } from 'react-router-dom';
import eccomerce from "../../images/9579712.jpg";
import usericon from "../../images/us1.png";
import eyeicon from "../../images/padloc.png";
import axios from "axios";
const LoginPage = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const navigate = useNavigate();
  const loginDetails= async(e)=>{
    e.preventDefault()
    try {
      const response = await axios.post(
        'http://localhost:5000/api/auth/login',{
          email:email,
          password:password
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('Success:', response.data);
      const { token } = response.data;
      localStorage.setItem('token', token);
      const loginToken = localStorage.getItem('token');
    console.log('Stored Token:', loginToken);
    if(loginToken){
      navigate('/home');
    }

    } catch (error) {
      console.error('Error:', error);
    }
  }

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
            <form className="loginForm" onSubmit={loginDetails}>

            <div className="loginRightInput">
              <input
                type="text"
                placeholder="Enter the Email"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
              <img src={usericon} alt="" className="loginUserIcon" />
            </div>
            <div className="loginRightInput">
              <input type="text" placeholder="Enter the password"  onChange={(e) => {
                  setPassword(e.target.value);
                }} />
              <img src={eyeicon} alt="" className="loginUserIcon" />
            </div>
            <div className="loginRightsub">
              <button className="loginButton">Login</button>
              <p>Signup</p>
              <p>ForgotPassword</p>
            </div>
            </form>

          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
