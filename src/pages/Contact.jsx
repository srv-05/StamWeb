import React, { useState } from "react";
import { GOOGLE_SCRIPT_URL } from "../config";
import "../styles/pages/contact.css";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
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
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(formData),
      });

      setStatus("Message Sent! We will get back to you soon.");
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      console.error("Error:", error);
      setStatus("Failed to send. Please try again.");
    }
  };

  return (
    <section className="contact-page">
      <div className="contact-canvas">
        <div className="contact-box">
          {/* LEFT COLUMN */}
          <div className="contact-left">
            <h1 className="contact-title">Get in Touch</h1>
            <p className="contact-tagline">We'd like to hear from you!</p>

            <p className="contact-text">
              If you have any inquiries or just want to say hi, please use the
              contact form!
            </p>

            <div className="contact-footer">
              <div className="contact-email">
                <svg viewBox="0 0 24 24" fill="none">
                  <path
                    d="M4 7.5A2.5 2.5 0 0 1 6.5 5h11A2.5 2.5 0 0 1 20 7.5v9A2.5 2.5 0 0 1 17.5 19h-11A2.5 2.5 0 0 1 4 16.5v-9Z"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />
                  <path
                    d="m6 8 6 5 6-5"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />
                </svg>
                <span>stamatics@iitk.ac.in</span>
              </div>

              <div className="contact-socials">
                <a
                  href="https://www.instagram.com/stamatics_iitk/"
                  target="_blank"
                  rel="noreferrer"
                >
                  IG
                </a>
                <a
                  href="https://www.youtube.com/@stamaticsiitkanpur5236"
                  target="_blank"
                  rel="noreferrer"
                >
                  YT
                </a>
                <a
                  href="https://www.linkedin.com/company/stamatics-iit-kanpur/?originalSubdomain=in"
                  target="_blank"
                  rel="noreferrer"
                >
                  IN
                </a>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="contact-right">
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="contact-field">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="contact-field">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="contact-field">
                <label>Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  required
                />
              </div>

              <div className="contact-actions">
                <button type="submit">Send</button>
              </div>

              {status && (
                <p
                  className={`contact-status ${
                    status.includes("Failed") ? "error" : "success"
                  }`}
                >
                  {status}
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;
