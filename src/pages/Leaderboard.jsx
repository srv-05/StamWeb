import React, { useEffect, useState } from 'react';
import { quizService } from '../services/quizService';
import '../styles/pages/leaderboard.css';

const ANSWER_KEY = {
  1: ["A", "B"], 2: ["C"], 3: ["A", "D"], 4: ["B", "C", "D"], 5: ["A"],
  // Add remaining up to 25 based on examination details
};

const Leaderboard = () => {
  const [rankedTeams, setRankedTeams] = useState([]);
  const [isProcessing, setIsProcessing] = useState(true);

  const calculateScore = (userAnswers) => {
    let totalScore = 0;
    Object.keys(ANSWER_KEY).forEach((qId) => {
      const correct = ANSWER_KEY[qId];
      const user = userAnswers[qId] || [];
      if (user.length === 0) return;

      const hasIncorrect = user.some(opt => !correct.includes(opt));
      const isPerfect = correct.length === user.length && user.every(opt => correct.includes(opt));

      if (hasIncorrect) totalScore -= 1; // Any incorrect: -1
      else if (isPerfect) totalScore += 3; // All correct: +3
      else totalScore += 1; // Partial correct: +1
    });
    return totalScore;
  };

  // Leaderboard.jsx (Partial Update)

useEffect(() => {
  const runFullSync = async () => {
    try {
      setIsProcessing(true);
      const rawData = await quizService.getRawResponses();
      
      // Ensure we only process the first submission from each team if duplicates exist
      const uniqueTeams = Array.from(new Map(rawData.map(r => [r.team_name, r])).values());
      
      await Promise.all(uniqueTeams.map(async (team) => {
        const score = calculateScore(team.answers);
        // Pass submitted_at to use as the ranking tie-breaker
        await quizService.saveToLeaderboard(
          team.team_name, 
          score, 
          team.institute || "IIT Kanpur", 
          team.submitted_at 
        );
      }));

      const finalLeaderboard = await quizService.fetchLeaderboard();
      setRankedTeams(finalLeaderboard);
    } catch (err) {
      console.error("Sync Error:", err.message);
    } finally {
      setIsProcessing(false);
    }
  };
  runFullSync();
}, []);

  return (
    <div className="leaderboard-container">
      <h1 className="glitch-title">LEADERBOARD: Round 1</h1>
      
      {isProcessing ? (
        <div className="loading-wrapper">
          <div className="spinner"></div>
          <p>Syncing Mathematical Excellence...</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th>RANK</th>
                <th>TEAM</th>
                <th>COLLEGE</th>
                <th>SCORE</th>
              </tr>
            </thead>
            <tbody>
              {rankedTeams.map((team, idx) => (
                <tr key={team.team_name} className={`rank-row rank-${idx + 1}`}>
                  <td className="rank-cell">
                    {idx < 3 ? <span className="medal">{['🥇', '🥈', '🥉'][idx]}</span> : idx + 1}
                  </td>
                  <td className="team-name">{team.team_name}</td>
                  <td className="college-name">{team.college}</td>
                  <td className="score-cell">{team.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;