import React, { useEffect, useRef, useState } from "react";
import {
  Chart,
  LineController,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/style.css";
import { Prediction } from "./Prediction.jsx";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

Chart.register(
  LineController,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const SpiroMeter = () => {
  const chartRef = useRef(null);
  const predictionRef = useRef(null);
  const chartInstanceRef = useRef(null);

  const [fev1Fvc, setFev1Fvc] = useState(null);
  const [smoker, setSmoker] = useState("");
  const [status, setStatus] = useState("OFFLINE");
  const [graphData, setGraphData] = useState([]);
  const [userData, setUserData] = useState({
    name: "",
    age: "",
    gender: "",
    smokerStatus: "",
  });

  const [inputRatio, setInputRatio] = useState("");
  const [inputSmokerStatus, setInputSmokerStatus] = useState("");
  const [inputCondition, setInputCondition] = useState("");
  const [inputRisk, setInputRisk] = useState("");

  const username = localStorage.getItem("username");
  const copdRef = useRef();
const asthmaRef = useRef();
const bronchitisRef = useRef();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/user/${username}`);
        const data = await res.json();
        if (res.ok) {
          setUserData(data);
          setSmoker(data.smokerStatus);
          if (data.fev1FvcData) {
            setGraphData(data.fev1FvcData);
            setFev1Fvc(data.fev1FvcData[data.fev1FvcData.length - 1]);
          }
        }
      } catch (err) {
        console.error("Error fetching user info:", err);
      }
    };
    if (username) fetchUser();
  }, [username]);

  useEffect(() => {
    if (!chartRef.current) return;
    const ctx = chartRef.current.getContext("2d");
    if (chartInstanceRef.current) chartInstanceRef.current.destroy();

    chartInstanceRef.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: ["Day1", "Day2", "Day3", "Day4", "Day5", "Day6", "Day7"],
        datasets: [
          {
            label: "FEV1/FVC Ratio",
            data: graphData,
            backgroundColor: "#e74c3c",
            borderColor: "#9b59b6",
            pointBorderColor: "#2c3e50",
            pointHoverBorderColor: "#2ecc71",
            pointHoverBackgroundColor: "#2ecc71",
            borderRadius: 3,
            tension: 0.5,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: "top" },
        },
        scales: {
          x: { title: { display: true, text: "Days" } },
          y: { title: { display: true, text: "FEV1/FVC Ratio" } },
        },
      },
    });

    return () => {
      if (chartInstanceRef.current) chartInstanceRef.current.destroy();
    };
  }, [graphData]);

  const handleAssessmentUpdate = async () => {
    if (!inputRatio || !inputSmokerStatus || !inputCondition || !inputRisk) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res1 = await fetch("http://localhost:5000/api/update-fev", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, ratio: parseFloat(inputRatio) }),
      });

      const res2 = await fetch("http://localhost:5000/api/form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          smokerStatus: inputSmokerStatus,
          condition: inputCondition,
          risk: inputRisk,
        }),
      });

      if (res1.ok && res2.ok) {
        const { fev1FvcData } = await res1.json();
        setGraphData(fev1FvcData);
        setFev1Fvc(fev1FvcData[fev1FvcData.length - 1]);
        setSmoker(inputSmokerStatus);
        setInputRatio("");
        setInputSmokerStatus("");
        setInputCondition("");
        setInputRisk("");
        alert("Assessment updated successfully");
      } else {
        alert("Failed to update data.");
      }
    } catch (err) {
      console.error("Update error:", err);
      alert("Error updating data.");
    }
  };

  const handleConnectWiFiDevice = async () => {
    try {
      setStatus("CONNECTING");
      await fetch("http://192.168.4.1/start");
      setTimeout(async () => {
        const response = await fetch("http://192.168.4.1/data");
        const json = await response.json();

        if (json.status === "waiting") {
          setStatus("WAITING");
          return;
        }

        const ratioValue = parseFloat(json.fev1_fvc);
        if (!isNaN(ratioValue)) {
          const updatedData = [...graphData.slice(1), ratioValue];
          setFev1Fvc(ratioValue);
          setSmoker(json.smokerStatus);
          setGraphData(updatedData);
          setStatus("ONLINE");
        }
      }, 10000);
    } catch (error) {
      console.error("WiFi fetch failed:", error);
      setStatus("OFFLINE");
    }
  };

  const handleDownloadReport = async () => {
    try {
      const canvasImage = await html2canvas(chartRef.current.parentNode);
      const chartImage = canvasImage.toDataURL("image/png");

      const predictionCanvas = await html2canvas(predictionRef.current);
      const predictionImage = predictionCanvas.toDataURL("image/png");

      const doc = new jsPDF();

      // Logo
      doc.addImage("src/img/spikit_Logo.png", "PNG", 10, 10, 30, 20);

      // Blue heading
      doc.setTextColor("blue");
      doc.setFontSize(20);
      doc.text("LUNG HEALTH MONITOR REPORT", 105, 20, { align: "center" });

      doc.setTextColor(0);
      doc.setFontSize(12);
      doc.text(`Name: ${userData.name}`, 10, 40);
      doc.text(`Age: ${userData.age}`, 10, 47);
      doc.text(`Gender: ${userData.gender}`, 10, 54);
      doc.text(`Smoker Status: ${smoker}`, 10, 61);
      doc.text(`Condition:  ${inputCondition}`, 10, 68);
      doc.text(`Lung Disease Risk: No ${inputRisk}`, 10, 75);
      doc.text(`FEV1/FVC Ratio: ${fev1Fvc}`, 10, 82);

      // Chart image
      doc.addImage(chartImage, "PNG", 10, 90, 190, 80);

      // Quote
      doc.setTextColor("green");
      doc.setFontSize(11);
      doc.text(
        "BREATHE EASY, LIVE HEALTHY - PRIORITIZE YOUR LUNGS!",
        105,
        175,
        { align: "center" }
      );

      // AI Prediction progress bars (side by side)
    {/*doc.addImage(copdImage, "PNG", 15, 185, 55, 55);
    doc.addImage(asthmaImage, "PNG", 75, 185, 55, 55);
    doc.addImage(bronchitisImage, "PNG", 135, 185, 55, 55);*/}


      // Footer Note
      doc.setTextColor("black");
      doc.setFontSize(10);
      doc.text(
        "Note: For further information consult your Doctor",
        105,
        270,
        { align: "center" }
      );

      // Save locally
      const pdfBlob = doc.output("blob");
      const formData = new FormData();
      formData.append("report", pdfBlob, `${username}_report.pdf`);
      formData.append("username", username);

      await fetch("http://localhost:5000/api/save-report", {
        method: "POST",
        body: formData,
      });

      doc.save(`${username}_Report.pdf`);
      alert("Report saved and downloaded!");
    } catch (err) {
      console.error("PDF generation error:", err);
      alert("Failed to create report.");
    }
  };

  return (
    <div>
      <nav className="navbar">
        <h3 style={{ paddingLeft: "15px" }}>LungHealth Monitor</h3>
        <div className="nav-cont" style={{ marginTop: "15px" }}>
          <p>Dashboard</p>
          <p>Reports</p>
          <p>Profile</p>
          <p
            style={{ cursor: "pointer" }}
            onClick={() => {
              localStorage.removeItem("username");
              window.location.href = "/login";
            }}
          >
            Logout
          </p>
        </div>
      </nav>

      <div className="container-full">
        <div className="device">
          <button className="btn btn-primary" onClick={handleConnectWiFiDevice}>
            Connect Device
          </button>
          <div className="connection">
            <span
              style={{
                backgroundColor: status === "ONLINE" ? "lime" : "red",
                padding: "5px",
                borderRadius: "4px",
                color: status === "ONLINE" ? "blue" : "whitesmoke",
              }}
            >
              {status}
            </span>
          </div>
        </div>
        <hr />

        <div className="container-pg">
          <div className="row1">
            <div className="user-info">
              <h5 className="border-bottom border-2 border-secondary">
                User Details
              </h5>
              <p>Name: {userData.name}</p>
              <p>Age: {userData.age}</p>
              <p>Gender: {userData.gender}</p>
              <p>Smoker Status: {smoker}</p>
              <p>Current FEV1/FVC: {fev1Fvc}</p>
            </div>

            <div className="graph">
              <h5 className="border-bottom border-2 border-secondary">
                FEV1/FVC Ratio (7 days)
              </h5>
              <div style={{ width: "100%", height: "250px" }}>
                <canvas ref={chartRef}></canvas>
              </div>
            </div>
          </div>

          <div className="row2">
            <div className="assessment">
              <h5 className="border-bottom border-2 border-secondary">
                Current Assessment
              </h5>
              <form className="upform" onSubmit={(e) => e.preventDefault()}>
                <label className="mt-2">Condition:</label>
                <input
                  type="text"
                  className="form-control"
                  value={inputCondition}
                  onChange={(e) => setInputCondition(e.target.value)}
                  required
                />

                <label className="mt-2">FEV1/FVC Ratio:</label>
                <input
                  type="text"
                  className="form-control"
                  value={inputRatio}
                  onChange={(e) => setInputRatio(e.target.value)}
                  required
                />

                <label className="mt-2">Smoker Status:</label>
                <select
                  className="form-control"
                  value={inputSmokerStatus}
                  onChange={(e) => setInputSmokerStatus(e.target.value)}
                  required
                >
                  <option value="">Select</option>
                  <option value="Smoker">Smoker</option>
                  <option value="Not a Smoker">Not a Smoker</option>
                </select>

                <label className="mt-2">Lung Disease Risk:</label>
                <input
                  type="text"
                  className="form-control"
                  value={inputRisk}
                  onChange={(e) => setInputRisk(e.target.value)}
                  required
                />
              </form>

              <hr />
              <center>
                <button
                  className="update btn btn-warning"
                  onClick={handleAssessmentUpdate}
                >
                  Submit & Update
                </button>
              </center>
            </div>

            <div className="prediction" ref={predictionRef}>
              <h5 className="border-bottom border-2 border-secondary">
                AI Prediction
              </h5>
              <Prediction ref={predictionRef} refs={{ copdRef, asthmaRef, bronchitisRef }} />

              <hr />
              <center>
                <button
                  className="download btn btn-success"
                  style={{ marginTop: "30px" }}
                  onClick={handleDownloadReport}
                >
                  Download Report
                </button>
              </center>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpiroMeter;
