import React, { useEffect, useState } from 'react';
import { quizService } from '../services/quizService';
import '../styles/pages/leaderboard.css';

const Leaderboard = () => {
  const [rankedTeams, setRankedTeams] = useState([]);
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    // Example modification for Leaderboard.jsx
    const fetchAndSync = async () => {
        try {
          setIsProcessing(true);
    // Add a retry or longer timeout logic if needed for Render's cold start
          const data = await quizService.syncLeaderboard();
          setRankedTeams(data);
        } catch (err) {
        console.error("Sync Error:", err.message);
    // Tip: If it fails, wait 5 seconds and try once more automatically
    } finally {
    setIsProcessing(false);
  }
};
    fetchAndSync();
  }, []);

  return (
    <div className="leaderboard-container">
      <h1 className="glitch-title">LEADERBOARD: Round 1</h1>
      
      {isProcessing ? (
        <div className="loading-wrapper">
          <div className="spinner"></div>
          <p>Calculating scores securely...</p>
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