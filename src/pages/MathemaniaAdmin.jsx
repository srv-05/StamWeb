import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "../styles/pages/mathemania-admin.css"; // ← NEW

export default function MathemaniaAdmin() {
  const navigate = useNavigate();
  
  // Data States
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);

  // Upload States
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Announcement States (NEW)
  const [announcement, setAnnouncement] = useState("");

  // --- CONFIGURATION ---
  // ⚠️ CRITICAL: PASTE YOUR NEW WEB APP URL HERE
  const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbypAkKF8AFwLmnvhD51elhdrWe_gubzspuuq5TnFRaeIrIqpbrdTqiDFnVfXEDLp5hL/exec"; 

  // 1. Check Auth & Fetch Data on Load
  useEffect(() => {
    if (!localStorage.getItem("admin_token")) {
      navigate("/admin");
    } else {
      fetchRegistrations();
    }
  }, [navigate]);

  // 2. Fetch Registrations Function
  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${GOOGLE_SCRIPT_URL}?action=get_registrations`);
      const data = await response.json();
      setRegistrations(data);
    } catch (error) {
      console.error("Error fetching registrations:", error);
      alert("Failed to load data. (If using localhost, try Incognito mode!)");
    } finally {
      setLoading(false);
    }
  };

  // 3. File Upload Function (Updated: Checks for REAL success)
  const handleUpload = async () => {
    if (!file) return alert("Please choose a file first!");
    
    setUploading(true); 

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Raw = reader.result.split(",")[1];

      const payload = {
        action: "upload_file",
        fileName: file.name,
        mimeType: file.type,
        fileData: base64Raw,
      };

      try {
        const response = await fetch(GOOGLE_SCRIPT_URL, {
          method: "POST",
          body: JSON.stringify(payload),
        });

        // READ THE SERVER RESPONSE
        const result = await response.json();

        if (result.status === "success") {
          alert("Real Success! File uploaded to Drive.");
          setFile(null);
          document.getElementById("fileInput").value = ""; 
        } else {
          // Show the ACTUAL error from Google
          alert("Google Error: " + result.error);
          console.error(result);
        }

      } catch (error) {
        console.error("Upload error:", error);
        alert("Network/Code Error: " + error.message);
      }
      setUploading(false);
    };
  };

  // 4. Publish Announcement Function (NEW)
  const handlePublish = async () => {
    if (!announcement) return alert("Please type a message!");
    
    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        body: JSON.stringify({ action: "update_announcement", text: announcement }),
      });
      alert("Announcement Published!");
      setAnnouncement("");
    } catch (error) {
      console.error(error);
      alert("Failed to publish update.");
    }
  };

  return (
    <div className="mathemania-admin-page">
      <div className="mathemania-admin-container">
        
        {/* HEADER */}
        <div className="mathemania-admin-header">
          <h1 className="mathemania-admin-title">Mathemania Admin</h1>
          <button onClick={() => navigate("/admin/dashboard")} className="mathemania-admin-back-btn">← Dashboard</button>
        </div>

        {/* CONTROLS SECTION */}
        <div className="mathemania-admin-controls-grid">
          {/* Upload Card */}
          <div className="mathemania-admin-card">
            <h3 className="mathemania-admin-card-title">Upload Materials</h3>
            <p className="mathemania-admin-card-desc">Question papers & solutions (PDF)</p>
            
            <div className="mathemania-admin-file-wrapper">
              <input 
                id="fileInput"
                type="file" 
                className="mathemania-admin-file-input"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </div>

            <button 
              className={`mathemania-admin-action-btn ${uploading ? "mathemania-admin-action-btn--uploading" : ""}`}
              onClick={handleUpload}
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Upload to Drive"}
            </button>
          </div>

          {/* Announcement Card */}
          <div className="mathemania-admin-card">
            <h3 className="mathemania-admin-card-title">Announcements</h3>
            <p className="mathemania-admin-card-desc">Update the event page marquee</p>
            <textarea 
              className="mathemania-admin-text-area"
              placeholder="Type update here..." 
              value={announcement}
              onChange={(e) => setAnnouncement(e.target.value)}
            />
            <button className="mathemania-admin-action-btn" onClick={handlePublish}>
              Publish Update
            </button>
          </div>
        </div>

        {/* TABLE SECTION */}
        <div className="mathemania-admin-table-card">
          <div className="mathemania-admin-table-header">
            <h3 className="mathemania-admin-card-title">Registrations</h3>
            <button onClick={fetchRegistrations} className="mathemania-admin-refresh-btn">
              {loading ? "Loading..." : "↻ Refresh Data"}
            </button>
          </div>
          
          <div className="mathemania-admin-table-wrapper">
            <table className="mathemania-admin-table">
              <thead>
                <tr className="mathemania-admin-th-row">
                  <th className="mathemania-admin-th">Team Name</th>
                  <th className="mathemania-admin-th">Leader</th>
                  <th className="mathemania-admin-th">Email</th>
                  <th className="mathemania-admin-th">Institute</th>
                  <th className="mathemania-admin-th">Status</th>
                </tr>
              </thead>
              <tbody>
                {registrations.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="mathemania-admin-td mathemania-admin-td--empty">
                      {loading ? "Fetching data..." : "No registrations found yet."}
                    </td>
                  </tr>
                ) : (
                  registrations.map((row, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? "mathemania-admin-tr-even" : "mathemania-admin-tr-odd"}>
                      <td className="mathemania-admin-td-bold">{row.team}</td>
                      <td className="mathemania-admin-td">{row.leader}</td>
                      <td className="mathemania-admin-td">{row.email}</td>
                      <td className="mathemania-admin-td">{row.inst}</td>
                      <td className="mathemania-admin-td">
                        <span className={row.status === "Paid" ? "mathemania-admin-badge-green" : "mathemania-admin-badge-yellow"}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
