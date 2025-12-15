// src/pages/Blogs.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import "../styles/pages/blogs.css"; // ← NEW

function Blogs() {
  // 1. State to hold the fetched blogs
  const [blogs, setBlogs] = useState([]);
  // 2. State to show loading status
  const [loading, setLoading] = useState(true);

  // 3. Fetch data when the page loads
  useEffect(() => {
    const fetchBlogs = async () => {
      // REPLACE THIS WITH YOUR ACTUAL GOOGLE APPS SCRIPT WEB APP URL
      const GOOGLE_SCRIPT_URL =
        "https://script.google.com/macros/s/AKfycbypAkKF8AFwLmnvhD51elhdrWe_gubzspuuq5TnFRaeIrIqpbrdTqiDFnVfXEDLp5hL/exec";

      try {
        const response = await fetch(`${GOOGLE_SCRIPT_URL}?action=get_blogs`);
        const data = await response.json();
        setBlogs(data);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <div className="blogs-page">
      <h1 className="blogs-header">All Articles</h1>
      <p className="blogs-subheader">
        Explore our latest thoughts on Mathematics, Statistics, and logic.
      </p>

      {loading ? (
        <p className="blogs-loading">Loading articles...</p>
      ) : (
        <div className="blogs-grid">
          {blogs.length === 0 ? (
            <p className="blogs-empty">No articles found yet.</p>
          ) : (
            blogs.map((blog) => (
              <article key={blog.id} className="blogs-card">
                <div className="blogs-thumbnail">
                  <div className="blogs-placeholder-img" />
                </div>

                <div className="blogs-card-content">
                  <h2 className="blogs-card-title">{blog.title}</h2>
                  <p className="blogs-meta">
                    {blog.author} ·{" "}
                    {blog.date
                      ? new Date(blog.date).toLocaleDateString()
                      : ""}
                  </p>
                  <Link to={`/blogs/${blog.id}`} className="blogs-link">
                    Read Article →
                  </Link>
                </div>
              </article>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default Blogs;
