import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css"; 
import { useNavigate } from "react-router-dom";

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
    <div style={styles.page}>
      <div style={styles.container}>
        
        {/* HEADER */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Blog Editor</h1>
            <p style={styles.subtitle}>Markdown + LaTeX Supported</p>
          </div>
          <div style={styles.btnGroup}>
            <button onClick={() => navigate("/admin/dashboard")} style={styles.secondaryBtn}>Cancel</button>
            <button onClick={handleSave} style={styles.primaryBtn}>Publish</button>
          </div>
        </div>

        {/* EDITOR LAYOUT */}
        <div style={styles.editorGrid}>
          
          {/* LEFT: INPUTS */}
          <div style={styles.inputCol}>
            <input 
              name="title" 
              placeholder="Post Title" 
              value={blogData.title} 
              onChange={handleChange} 
              style={styles.titleInput}
            />
            <input 
              name="author" 
              placeholder="Author Name" 
              value={blogData.author} 
              onChange={handleChange} 
              style={styles.metaInput}
            />
            <textarea 
              name="content" 
              value={blogData.content} 
              onChange={handleChange} 
              style={styles.contentInput}
            />
          </div>

          {/* RIGHT: PREVIEW */}
          <div style={styles.previewCol}>
            <div style={styles.previewHeader}>Preview</div>
            <div style={styles.previewScroll}>
              <h1 style={styles.prevTitle}>{blogData.title || "Untitled"}</h1>
              <p style={styles.prevMeta}>{blogData.author || "Author"} • {new Date().toLocaleDateString()}</p>
              <div style={styles.markdownBody}>
                <ReactMarkdown children={blogData.content} remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]} />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", background: "#020617", paddingTop: "100px", paddingBottom: "40px", color: "white" },
  container: { maxWidth: "1400px", margin: "0 auto", padding: "0 24px" },
  
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" },
  title: { fontSize: "2rem", fontWeight: "700" },
  subtitle: { color: "#94a3b8", fontSize: "0.9rem" },
  
  btnGroup: { display: "flex", gap: "12px" },
  secondaryBtn: { background: "none", border: "1px solid #334155", color: "#cbd5e1", padding: "10px 20px", borderRadius: "8px", cursor: "pointer" },
  primaryBtn: { background: "#7b4bff", border: "none", color: "white", padding: "10px 24px", borderRadius: "8px", fontWeight: "600", cursor: "pointer" },

  editorGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", height: "70vh" },
  
  inputCol: { display: "flex", flexDirection: "column", gap: "16px" },
  titleInput: { background: "#1e293b", border: "1px solid #334155", padding: "16px", borderRadius: "8px", fontSize: "1.2rem", color: "white", fontWeight: "600" },
  metaInput: { background: "#1e293b", border: "1px solid #334155", padding: "14px", borderRadius: "8px", fontSize: "1rem", color: "white" },
  contentInput: { flex: 1, background: "#1e293b", border: "1px solid #334155", padding: "16px", borderRadius: "8px", fontSize: "1rem", color: "#e2e8f0", fontFamily: "monospace", resize: "none", lineHeight: "1.5" },

  previewCol: { background: "#0f172a", border: "1px solid #334155", borderRadius: "12px", display: "flex", flexDirection: "column", overflow: "hidden" },
  previewHeader: { background: "#1e293b", padding: "10px 20px", fontSize: "0.8rem", fontWeight: "600", textTransform: "uppercase", color: "#94a3b8", borderBottom: "1px solid #334155" },
  previewScroll: { padding: "30px", overflowY: "auto", flex: 1 },
  prevTitle: { fontSize: "2rem", marginBottom: "8px", lineHeight: "1.2" },
  prevMeta: { color: "#64748b", fontSize: "0.9rem", marginBottom: "24px" },
  markdownBody: { lineHeight: "1.7", color: "#cbd5e1", fontSize: "1.05rem" },
};
