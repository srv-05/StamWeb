import React, { useState } from "react";
import { GOOGLE_SCRIPT_URL } from "../config"; // Ensure this file exists as discussed before

import "../styles/pages/contact.css"; // ← ONLY ADDITION

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  
  const [status, setStatus] = useState(""); 

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setStatus("Sending...");

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors", // This is important for Google Apps Script
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
        body: JSON.stringify(formData),
      });

      // Since mode is no-cors, we assume success if no network error occurred
      setStatus("Message Sent! We will get back to you soon.");
      setFormData({ name: "", email: "", message: "" }); // Clear form

    } catch (error) {
      console.error("Error:", error);
      setStatus("Failed to send. Please try again.");
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Contact Us</h1>
      <p style={styles.subHeader}>Have a question? Drop us a message!</p>

      <div style={styles.formCard}>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              style={styles.input}
              placeholder="Your Name"
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={styles.input}
              placeholder="your@email.com"
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              style={{ ...styles.input, height: "120px" }}
              placeholder="How can we help?"
            />
          </div>

          <button type="submit" style={styles.button}>
            Send Message
          </button>

          {/* Status Message */}
          {status && (
            <p style={status.includes("Failed") ? styles.errorMsg : styles.successMsg}>
              {status}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

// Consistent Dark Theme Styles
const styles = {
  container: {
    padding: "120px 20px 80px",
    maxWidth: "600px",
    margin: "0 auto",
    color: "white",
    textAlign: "center",
    minHeight: "100vh",
  },
  header: { fontSize: "3rem", marginBottom: "10px", fontWeight: "bold" },
  subHeader: { color: "#aaa", marginBottom: "40px", fontSize: "1.1rem" },
  formCard: {
    backgroundColor: "#111",
    padding: "30px",
    borderRadius: "15px",
    border: "1px solid #333",
  },
  form: { display: "flex", flexDirection: "column", gap: "20px" },
  inputGroup: { textAlign: "left" },
  label: { display: "block", marginBottom: "8px", color: "#ccc", fontSize: "0.9rem" },
  input: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#222",
    border: "1px solid #444",
    borderRadius: "8px",
    color: "white",
    fontSize: "1rem",
    outline: "none",
  },
  button: {
    padding: "14px",
    backgroundColor: "#7b4bff", // Stamatics Purple
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "1.1rem",
    cursor: "pointer",
    fontWeight: "bold",
    marginTop: "10px",
    transition: "background 0.3s",
  },
  successMsg: { marginTop: "15px", color: "#4caf50", fontWeight: "bold" },
  errorMsg: { marginTop: "15px", color: "#ff4b4b", fontWeight: "bold" },
};

export default Contact;
