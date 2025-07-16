import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/signup.css";
import { useNavigate } from "react-router-dom";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";

library.add(fas, far, fab);

export const SignUp = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Account created successfully!");
        localStorage.setItem("username", username);
        navigate("/form");
      } else {
        alert(data.message || "Signup failed.");
      }
    } catch (err) {
      console.error("Signup error:", err);
      alert("Signup failed. Check your backend connection.");
    }
  };

  return (
    <div
      className="page"
      style={{
        backgroundImage: "url('src/img/lung_bg (1) 1 (1) (1).png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        width: "100%",
        height: "100vh",
      }}
    >
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
        <div className="fs-3 m-1 p-2 text-light">
          <p>Create Your Account</p>
        </div>
        <form onSubmit={handleRegister}>
          <div>
            <label htmlFor="username" className="mb-2 text-light">Username:</label>
            <input
              type="text"
              id="username"
              className="form-control"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="mt-2">
            <label htmlFor="password" className="mb-2 text-light">Password:</label>
            <input
              type="password"
              id="password"
              className="form-control"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="mt-2">
            <label htmlFor="confirmPassword" className="mb-2 text-light">Confirm Password:</label>
            <input
              type="password"
              id="confirmPassword"
              className="form-control"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <center className="mt-4">
            <div className="sign-in">
              <button type="submit" className="btn btn-primary">Create Account</button>
            </div>
            <div style={{ marginTop: "10px" }}>
              <a href="/login" style={{ textDecoration: "none", color: "whitesmoke" }}>
                <p className="text-hover">Already have an account? Log in</p>
              </a>
            </div>
          </center>
        </form>
      </div>
    </div>
  );
};
