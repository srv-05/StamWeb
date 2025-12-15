import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import { useNavigate } from "react-router-dom";

import "../styles/pages/blog-admin.css"; // ← NEW

const initialBlog = { title: "", author: "", content: "# New Post\n\nStart writing..." };

export default function BlogAdmin() {
  const [blogData, setBlogData] = useState(initialBlog);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("admin_token")) navigate("/admin");
  }, [navigate]);

  const handleChange = (e) => setBlogData({ ...blogData, [e.target.name]: e.target.value });

 const handleSave = async () => {
  if (!blogData.title || !blogData.content) {
    alert("Please enter a Title and Content.");
    return;
  }

  const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbypAkKF8AFwLmnvhD51elhdrWe_gubzspuuq5TnFRaeIrIqpbrdTqiDFnVfXEDLp5hL/exec"; 

  const payload = {
    action: "create_blog",
    sheet: "Blogs",
    id: blogData.title.toLowerCase().replace(/ /g, "-") + "-" + Date.now(),
    title: blogData.title,
    author: blogData.author,
    content: blogData.content
  };

  try {
    await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors", // Standard for GAS POST requests
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
    });

    alert("Success! Blog published to database.");
    setBlogData(initialBlog); // Clear form
  } catch (error) {
    console.error("Error:", error);
    alert("Failed to save.");
  }
};

  return (
    <div className="blog-admin-page">
      <div className="blog-admin-container">
        
        {/* HEADER */}
        <div className="blog-admin-header">
          <div>
            <h1 className="blog-admin-title">Blog Editor</h1>
            <p className="blog-admin-subtitle">Markdown + LaTeX Supported</p>
          </div>
          <div className="blog-admin-btn-group">
            <button onClick={() => navigate("/admin/dashboard")} className="blog-admin-secondary-btn">Cancel</button>
            <button onClick={handleSave} className="blog-admin-primary-btn">Publish</button>
          </div>
        </div>

        {/* EDITOR LAYOUT */}
        <div className="blog-admin-editor-grid">
          
          {/* LEFT: INPUTS */}
          <div className="blog-admin-input-col">
            <input 
              name="title" 
              placeholder="Post Title" 
              value={blogData.title} 
              onChange={handleChange} 
              className="blog-admin-title-input"
            />
            <input 
              name="author" 
              placeholder="Author Name" 
              value={blogData.author} 
              onChange={handleChange} 
              className="blog-admin-meta-input"
            />
            <textarea 
              name="content" 
              value={blogData.content} 
              onChange={handleChange} 
              className="blog-admin-content-input"
            />
          </div>

          {/* RIGHT: PREVIEW */}
          <div className="blog-admin-preview-col">
            <div className="blog-admin-preview-header">Preview</div>
            <div className="blog-admin-preview-scroll">
              <h1 className="blog-admin-prev-title">{blogData.title || "Untitled"}</h1>
              <p className="blog-admin-prev-meta">{blogData.author || "Author"} • {new Date().toLocaleDateString()}</p>
              <div className="blog-admin-markdown-body">
                <ReactMarkdown children={blogData.content} remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]} />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
