import React, { useState } from "react";
import "../styles/pages/mathemania.css";

// 🔗 Replace with the keys from your Supabase API settings

import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://xtcxaivsebyyswqognuf.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

// 🔑 Placeholder Answer Key (Waiting for User Input)
// 🔑 Placeholder Answer Key (Waiting for User Input)
// 🔑 CORRECT ANSWER KEY (The Master Key for Grading)
const CORRECT_ANSWER_KEY = {
  1: "A",
  2: "B",
  3: "C",
  // ... FILL THIS WITH THE CORRECT ANSWERS
};

// 🧮 Grading Algorithm
// Standard: +4 for Correct, -1 for Wrong, 0 for Unattempted
// (Adjustable based on user feedback)
const calculateScore = (userAnswers) => {
  let score = 0;

  // Iterate through 20 questions
  for (let i = 1; i <= 20; i++) {
    const correctAns = CORRECT_ANSWER_KEY[i];
    const userAns = userAnswers[i]; // This might be an array ["A", "B"] or string

    if (!correctAns) continue; // Skip if key not defined yet

    // Case: Unattempted
    if (!userAns || userAns.length === 0) {
      score += 0;
      continue;
    }

    // Case: Correct (Assuming single choice for now, adjust for multiselect if needed)
    // If userAns is an array like ["A"], take the first element
    const actualAns = Array.isArray(userAns) ? userAns[0] : userAns;

    if (actualAns === correctAns) {
      score += 4; // Correct
    } else {
      score -= 1; // Wrong
    }
  }
  return score;
};

export default function MathQuiz() {
  const [teamName, setTeamName] = useState("");
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Generate 20 questions
  const quizQuestions = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    text: `Question #${i + 1}: What is the derivative of x^${i + 2}?`,
    numOptions: (i % 3 === 0) ? 5 : 4, // Mixed 4 and 5 options
  }));

  const handleSelect = (qId, choice) => {
    setAnswers(prev => {
      const currentSelections = prev[qId] || []; // Get existing array or start new

      if (currentSelections.includes(choice)) {
        // Remove if already selected (Uncheck)
        return {
          ...prev,
          [qId]: currentSelections.filter(item => item !== choice)
        };
      } else {
        // Add to the array of selections
        // Note: For single choice grading, we might want to enforce limit 1 here?
        // But the UI allows multiple. I will assume for now user selects one best answer.
        return {
          ...prev,
          [qId]: [...currentSelections, choice]
        };
      }
    });
  };

  const submitQuiz = async (e) => {
    e.preventDefault();

    if (!teamName.trim()) return alert("Please enter your Team Name!");

    setIsSubmitting(true);

    try {
      // 1. Calculate Score
      const finalScore = calculateScore(answers);
      console.log("Calculated Score:", finalScore);

      // 2. Submit to Supabase
      const { error } = await supabase
        .from("quiz_responses")
        .insert([{
          team_name: teamName,
          answers: answers,
          score: finalScore // <--- Added Score field
        }]);

      if (error) throw error;

      alert(`✅ MCQ Submitted Successfully! Your Score: ${finalScore}`);
      window.location.href = "/";
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="math-page-wrapper">
      <h1 className="math-glitch-title">MCQ ROUND</h1>
      <form onSubmit={submitQuiz} className="math-content-grid" style={{ display: 'block', maxWidth: '800px', margin: '0 auto' }}>

        <div className="math-glass-card" style={{ marginBottom: '20px' }}>
          <label style={{ color: '#94a3b8' }}>Team Name</label>
          <input
            className="admin-login-input"
            required
            value={teamName} // Add this
            onChange={(e) => setTeamName(e.target.value)}
          />
        </div>

        {quizQuestions.map(q => (
          <div key={q.id} className="math-glass-card" style={{ marginBottom: '15px' }}>
            <p style={{ fontWeight: '700' }}>Q{q.id}. {q.text}</p>
            <p style={{ fontSize: '0.8rem', color: '#7b4bff', marginBottom: '10px' }}>
              (Select best answer)
            </p>
            <div style={{ display: 'grid', gap: '10px', marginTop: '10px' }}>
              {Array.from({ length: q.numOptions }, (_, idx) => {
                const char = String.fromCharCode(65 + idx);
                // Check if this specific character is inside the array for this question
                const isSelected = (answers[q.id] || []).includes(char);

                return (
                  <button
                    type="button"
                    key={char}
                    onClick={() => handleSelect(q.id, char)}
                    style={{
                      padding: '10px',
                      background: isSelected ? '#7b4bff' : 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      color: 'white',
                      textAlign: 'left',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px'
                    }}
                  >
                    <div style={{
                      width: '16px',
                      height: '16px',
                      border: '1px solid white',
                      borderRadius: '3px',
                      background: isSelected ? 'white' : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#7b4bff',
                      fontSize: '12px'
                    }}>
                      {isSelected ? '✓' : ''}
                    </div>
                    {char}. Sample Option
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        <button type="submit" className="math-submit-btn" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Answers"}
        </button>
      </form>
    </div>
  );
}