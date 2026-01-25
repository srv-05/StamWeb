import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xtcxaivsebyyswqognuf.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const FetchRes = () => {
  const [data, setData] = useState([]);

  useEffect(() => {

    const fetchAllData = async () => {
  try {
    const { data: responses, error } = await supabase
      .from('quiz_responses')
      .select('*')
      .order('submitted_at', { ascending: false });

    if (error) {
      console.error("Supabase Error:", error.message);
    } else {
      // Filter for unique team names (keeps the first occurrence, which is the latest due to .order)
      const uniqueData = Array.from(
        new Map(responses.map(item => [item.team_name, item])).values()
      );

      console.log("Unique Responses:", uniqueData);
      setData(uniqueData);
    }
  } catch (err) {
    console.error("Unexpected Error:", err);
  }
};
    fetchAllData();
  }, []);

  return (
    <div style={{ padding: "20px", color: "white" }}>
      <h2>Data Fetching Status: {data.length > 0 ? 'Success' : 'Loading/No Data'}</h2>
      <p>Check the browser console to see the 2 database entries from 'quiz_responses'.</p>
      
      {/* Optional: Simple list of Team Names to verify on-screen */}
      {data.map(item => (
        <div key={item.id} style={{ margin: '10px 0', borderBottom: '1px solid #333' }}>
          Team: <strong>{item.team_name}</strong>
        </div>
      ))}
    </div>
  );
};

export default FetchRes;