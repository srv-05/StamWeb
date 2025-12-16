import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { BlogProvider } from './context/BlogContext' // <--- IMPORT THIS

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <BlogProvider> {/* <--- WRAP EVERYTHING INSIDE THIS */}
        <App />
      </BlogProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
