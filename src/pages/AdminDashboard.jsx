import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    // Basic security check: Redirect to login if no token is found
    if (!localStorage.getItem("admin_token")) navigate("/admin");
  }, [navigate]);

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Header - Now simplified without the duplicate Logout button */}
        <div style={styles.header}>
          <h1 style={styles.pageTitle}>Dashboard</h1>
        </div>

        {/* Cards Grid */}
        <div style={styles.grid}>
          
          {/* Card 1: Mathemania */}
          <Link to="/admin/mathemania" style={styles.card}>
            <div style={styles.cardIcon}>🏆</div>
            <h2 style={styles.cardTitle}>Mathemania</h2>
            <p style={styles.cardDesc}>
              Manage registrations, view team details, and upload event PDFs.
            </p>
            <span style={styles.linkText}>Manage Event →</span>
          </Link>

          {/* Card 2: Blog Editor */}
          <Link to="/admin/blogs" style={styles.card}>
            <div style={styles.cardIcon}>✍️</div>
            <h2 style={styles.cardTitle}>Blog Editor</h2>
            <p style={styles.cardDesc}>
              Write and publish new articles using Markdown and LaTeX support.
            </p>
            <span style={styles.linkText}>Open Editor →</span>
          </Link>
          
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#020617", // Very dark navy/black
    paddingTop: "120px",
    paddingBottom: "80px",
    color: "#fff",
  },
  container: {
    maxWidth: "1000px",
    margin: "0 auto",
    padding: "0 24px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "60px",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
    paddingBottom: "20px",
  },
  pageTitle: {
    fontSize: "2.5rem",
    fontWeight: "700",
  },
  // Logout button styles removed as requested
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "30px",
  },
  card: {
    background: "rgba(30, 41, 59, 0.5)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "16px",
    padding: "32px",
    textDecoration: "none",
    color: "inherit",
    transition: "transform 0.2s, background 0.2s",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
  cardIcon: {
    fontSize: "2rem",
    marginBottom: "16px",
    background: "rgba(123, 75, 255, 0.2)",
    width: "60px",
    height: "60px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "12px",
  },
  cardTitle: {
    fontSize: "1.5rem",
    fontWeight: "700",
    marginBottom: "10px",
  },
  cardDesc: {
    color: "#94a3b8",
    fontSize: "0.95rem",
    lineHeight: "1.6",
    marginBottom: "24px",
  },
  linkText: {
    color: "#a78bfa", // Light purple
    fontWeight: "600",
    marginTop: "auto",
  }
};
