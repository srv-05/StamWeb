import React, { useState, useEffect } from "react";
import { quizService } from "../services/quizService";
import "../styles/pages/mathemania.css";
import "../styles/pages/math-quiz.css";

export default function MathQuiz() {
  const [uniqueCode, setUniqueCode] = useState("");
  const [userAnswers, setUserAnswers] = useState(() => {
    const saved = localStorage.getItem("mathemania_progress");
    return saved ? JSON.parse(saved) : {};
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: '', msg: '' });

  useEffect(() => {
    localStorage.setItem("mathemania_progress", JSON.stringify(userAnswers));
  }, [userAnswers]);

  const handleToggleOption = (qId, option) => {
    setUserAnswers(prev => {
      const currentAnswers = prev[qId] || [];
      if (currentAnswers.includes(option)) {
        return { ...prev, [qId]: currentAnswers.filter(item => item !== option) };
      } else {
        return { ...prev, [qId]: [...currentAnswers, option].sort() };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: '', msg: '' });

    try {
      // Step 1: Verify code AND check for existing leaderboard entry
      // This will throw an error if the team has already submitted.
      const team = await quizService.verifyTeamStatus(uniqueCode);

      // Step 2: Only proceeds if Step 1 succeeds (no existing leaderboard entry)
      await quizService.submitResponse(team.team_name, team.institute, userAnswers);

      localStorage.removeItem("mathemania_progress");
      alert("Round 1 Submission Successful!");
      window.location.href = "/leaderboard";
      
    } catch (err) {
      // Displays the "Access Denied" or "Invalid Code" error in the UI
      setStatus({ type: 'error', msg: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <h1 className="glitch-title">MATHEMANIA 2025</h1>
        <div className="save-indicator">
          <span className="pulse-dot"></span> Progress Auto-Saving
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {[...Array(20)].map((_, i) => {
          const qId = i + 1;
          const selectedOptions = userAnswers[qId] || [];

          return (
            <div key={qId} className="question-card">
              <div className="q-circle">{qId}</div>
              <div className="q-header-flex">
                <h3>Question {qId}</h3>
                <span className="msq-badge">Multiple Correct Possible</span>
              </div>
              
              <div className="options-grid">
                {['A', 'B', 'C', 'D'].map(opt => {
                  const isSelected = selectedOptions.includes(opt);
                  return (
                    <button 
                      type="button"
                      key={opt}
                      onClick={() => handleToggleOption(qId, opt)}
                      className={`option-btn ${isSelected ? "selected" : ""}`}
                    >
                      <div className={`checkbox ${isSelected ? "checked" : ""}`}>
                        {isSelected && "✓"}
                      </div>
                      <span className="opt-char">{opt}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}

        <div className="submission-gate-container">
          <div className="submission-divider">
            <span>End of Examination</span>
          </div>

          <div className="auth-card submission-card">
            <div className="submission-header">
              <h2 className="submit-title">ROUND 1 SUBMISSION</h2>
              <p>Enter your team's unique code to finalize your responses.</p>
            </div>

            <div className="input-group">
              <input 
                type="text" 
                className="code-input"
                value={uniqueCode} 
                onChange={(e) => setUniqueCode(e.target.value.toUpperCase())}
                placeholder="e.g. 1MA0DLLFX"
                required
              />
              <label className="input-label">Unique Team Code</label>
            </div>
            
            {status.msg && (
              <div className={`status-message ${status.type}`}>
                {status.type === 'error' ? '❌' : '✅'} {status.msg}
              </div>
            )}

            <button 
              type="submit" 
              className="math-submit-btn" 
              disabled={isSubmitting}
            >
              {isSubmitting ? "Verifying..." : "SUBMIT ALL RESPONSES"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}