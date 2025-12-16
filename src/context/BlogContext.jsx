import React, { createContext, useState, useEffect } from "react";
import { GOOGLE_SCRIPT_URL } from "../config";
import cachedData from "../data/cachedBlogs.json"; // <--- IMPORT LOCAL DATA

export const BlogContext = createContext();

export const BlogProvider = ({ children }) => {
  // 1. Initialize from Cache (priority: localStorage > JSON file > empty)
  const [blogs, setBlogs] = useState(() => {
    // Try browser storage first (most up to date)
    const local = localStorage.getItem("stamatics_blogs");
    if (local) return JSON.parse(local);
    
    // Fallback to build-time cached data (Instant load for new users)
    return Array.isArray(cachedData) ? cachedData : [];
  });

  // 2. Loading is false if we have ANY data
  const [loading, setLoading] = useState(() => {
    return blogs.length === 0;
  });

  useEffect(() => {
    // 3. Silent Update: Fetch fresh data in the background
    const fetchBlogsBackground = async () => {
      try {
        const response = await fetch(`${GOOGLE_SCRIPT_URL}?action=get_blogs`);
        const data = await response.json();
        
        if (Array.isArray(data) && data.length > 0) {
          setBlogs(data);
          localStorage.setItem("stamatics_blogs", JSON.stringify(data));
        }
      } catch (error) {
        console.error("Background update failed. Keeping existing data.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogsBackground();
  }, []);

  return (
    <BlogContext.Provider value={{ blogs, loading }}>
      {children}
    </BlogContext.Provider>
  );
};
