import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/Login.css";
import { useNavigate, Link } from "react-router-dom";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";

library.add(fas, far, fab);

export const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        localStorage.setItem("username", username);
        navigate("/form");
      } else {
        alert("Invalid username or password");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Login failed. Please check your backend.");
    }
  };

  return (
    <div className="page"
      style={{
        backgroundImage: "url('src/img/lung_bg (1) 1 (1) (1).png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        width: "100%",
        height: "100vh",
      }}>
      <div className="head">
        <div className="logo">
          <div className="ms-3">
            <img src="src/img/spikit_Logo.png" alt="Logo" style={{ height: "80px" }} />
          </div>
          <div>
            <button className="btn border-btn">
              <img src="src/img/SPI-KIT-unscreen.gif" alt="GIF" style={{ width: "100px" }} />
            </button>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <img
            src="src/img/home-button.png"
            alt="Home"
            onClick={() => navigate("/")}
            style={{
              height: "50px",
              borderRadius: "150%",
              margin: "20px",
              cursor: "pointer",
              borderStyle: "ridge",
            }}
          />
          <p style={{ margin: "0px 25px", color: "whitesmoke" }}>Home</p>
        </div>
      </div>

      <div className="login">
        <div className="fs-3 m-1 p-2">
          <p>Sign Into Your Account</p>
        </div>
        <form onSubmit={handleLogin}>
          <div>
            <label htmlFor="username" className="mb-3">User Name</label>
            <div className="input-group">
              <input
                type="text"
                id="username"
                className="form-control"
                placeholder="Username or E-mail"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="mt-4">
            <label htmlFor="password" className="mb-3">Password</label>
            <div className="input-group">
              <input
                type="password"
                id="password"
                className="form-control"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <center className="mt-4">
            <div className="sign-in">
              <button type="submit" className="btn btn-primary">Sign in</button>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }} className="border-bottom">
              <a href="#" style={{ textDecoration: "none", color: "whitesmoke" }}>
                <p className="text-hover">Forgot Password?</p>
              </a>
              {/* 👇 FIX: Use Link instead of <a>, and correct path to "/sign" */}
              <Link to="/sign" style={{ textDecoration: "none", color: "whitesmoke" }}>
                <p className="text-hover">Sign up</p>
              </Link>
            </div>
          </center>

          <div className="sign-opt">
            <p style={{ textAlign: "center", color: "whitesmoke", opacity: "0.8" }}>
              or you can sign up with
            </p>
            <center className="m-3">
              <div>
                <button><img src="src/img/google.png" alt="Google" style={{ width: "30px" }} /></button>
                <p>Google</p>
              </div>
              <div>
                <button><img src="src/img/microsoft.png" alt="Microsoft" style={{ width: "30px" }} /></button>
                <p>Microsoft</p>
              </div>
            </center>
          </div>
        </form>
      </div>
    </div>
  );
};
