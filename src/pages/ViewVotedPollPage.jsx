import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import CurrentRank from "../components/result/CurrentRank";
import YourRankList from "../components/result/YourRankList";
import { API_URL } from "../shared";

const ViewVotedPollPage = () => {
  const { id: pollId } = useParams();
  const [poll, setPoll] = useState(null);
  const [results, setResults] = useState(null);
  const [userVote, setUserVote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPollInfo = async () => {
    try {
      // 1. Get Poll metadata
      const pollRes = await axios.get(`${API_URL}/polls/${pollId}`, {
        withCredentials: true,
      });
      setPoll(pollRes.data);

      // 2. Get Ranked Results (IRV)
      const resultsRes = await axios.get(`${API_URL}/polls/${pollRes.data.id}/results`, {
        withCredentials: true,
      });
      setResults(resultsRes.data);

      // 3. Get User’s submitted vote
      const voteRes = await axios.get(`${API_URL}/polls/${pollRes.data.id}/vote`, {
        withCredentials: true,
      });
      setUserVote(voteRes.data);

    } catch (err) {
      console.error("Error loading poll data:", err);
      setError("Failed to load vote results.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPollInfo();
  }, [pollId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div className="result-container">
      <h2>{poll.title}</h2>
      <p><strong>Ends:</strong> {new Date(poll.deadline).toLocaleString()}</p>

      <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: "300px" }}>
          <h3>Current Rank List</h3>
          <CurrentRank results={results} />
        </div>

        <div style={{ flex: 1, minWidth: "300px" }}>
          <h3>Your Rank List</h3>
          <YourRankList vote={userVote} />
        </div>
      </div>
    </div>
  );
};

export default ViewVotedPollPage;
