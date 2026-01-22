import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import "../styles/pages/mathemania.css";
import "../styles/pages/leaderboard.css";

// Initialize Supabase Client
const supabaseUrl = "https://xtcxaivsebyyswqognuf.supabase.co";
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function Leaderboard() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLeaderboard();
    }, []);

    const fetchLeaderboard = async () => {
        try {
            // Fetch teams sorted by Score (High to Low)
            const { data: records, error } = await supabase
                .from("quiz_responses")
                .select("team_name, score, created_at")
                .order("score", { ascending: false });

            if (error) throw error;

            setData(records);
        } catch (err) {
            console.error("Error fetching leaderboard:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="math-page-wrapper">
            <div className="math-hero-section">
                <h1 className="math-glitch-title">LEADERBOARD</h1>
                <div className="math-date-tag">Live Rankings</div>
            </div>

            <div className="math-content-grid" style={{ display: 'block', maxWidth: '900px', margin: '0 auto' }}>
                <div className="math-glass-card" style={{ padding: '0', overflow: 'hidden' }}>

                    {loading ? (
                        <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
                            Loading Rankings...
                        </div>
                    ) : (
                        <div className="leaderboard-table-wrapper">
                            <table className="leaderboard-table">
                                <thead>
                                    <tr>
                                        <th style={{ width: '80px', textAlign: 'center' }}>Rank</th>
                                        <th>Team Name</th>
                                        <th style={{ textAlign: 'right' }}>Score</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.length === 0 ? (
                                        <tr>
                                            <td colSpan="3" style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>
                                                No submissions yet. Be the first!
                                            </td>
                                        </tr>
                                    ) : (
                                        data.map((row, index) => (
                                            <tr key={index}>
                                                <td style={{ textAlign: 'center', fontWeight: 'bold', color: index < 3 ? '#fbbf24' : '#94a3b8' }}>
                                                    #{index + 1}
                                                </td>
                                                <td style={{ fontWeight: '500', color: 'white' }}>
                                                    {row.team_name}
                                                </td>
                                                <td style={{ textAlign: 'right', fontWeight: 'bold', color: '#4ade80' }}>
                                                    {row.score !== null ? row.score : "N/A"}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
