import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/form.css";

export const FormPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    smokerStatus: "",
  });

  const navigate = useNavigate();
  const username = localStorage.getItem("username");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, ...formData }),
      });

      if (res.ok) {
        alert("Form submitted successfully!");
        navigate("/spiro");
      } else {
        alert("Failed to submit user data.");
      }
    } catch (error) {
      console.error("Form error:", error);
    }
  };

  return (
    <div className="page" style={{
      backgroundImage: "url('src/img/lung_bg (1) 1 (1) (1).png')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      width: "100%",
      height: "100vh",
    }}>
      <nav className="navbar">
        <h3>LungHealth Monitor</h3>
        <div className="nav-cont" style={{ marginTop: "15px" }}>
          <p>Dashboard</p>
          <p>Reports</p>
          <p>Profile</p>
        </div>
      </nav>

      <div className="containerFull">
        <div className="user">
          <center>
            <p style={{ marginTop: "15px", fontSize: "20px" }}>Create User Details</p>
            <hr />
          </center>
        </div>
        <div className="form">
          <form onSubmit={handleSubmit}>
            <div className="mt-2">
              <label htmlFor="name" className="mb-2">Name:</label>
              <input type="text" id="name" className="form-control" placeholder="Enter Your Name"
                value={formData.name} onChange={handleChange} required />
            </div>
            <div className="mt-3">
              <label htmlFor="age" className="mb-2">Age:</label>
              <input type="text" id="age" className="form-control" placeholder="Enter Your Age"
                value={formData.age} onChange={handleChange} required />
            </div>
            <div className="mt-3">
              <label htmlFor="gender" className="mb-2">Gender:</label>
              <select id="gender" className="form-select"
                value={formData.gender} onChange={handleChange} required>
                <option value="" disabled>Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Others">Others</option>
              </select>
            </div>
            <div className="mt-3">
              <label htmlFor="smokerStatus" className="mb-2">Smoking Status:</label>
              <select id="smokerStatus" className="form-select"
                value={formData.smokerStatus} onChange={handleChange} required>
                <option value="" disabled>Select</option>
                <option value="Not a Smoker">Not a Smoker</option>
                <option value="Smoker">Smoker</option>
              </select>
            </div>
            <center>
              <button type="submit" className="btn btn-warning m-3" style={{ width: "200px" }}>
                Submit
              </button>
            </center>
          </form>
        </div>
      </div>
    </div>
  );
};
