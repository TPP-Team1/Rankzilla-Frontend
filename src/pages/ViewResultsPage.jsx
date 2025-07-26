import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CurrentRank from "../components/result/CurrentRank";
import YourRankList from "../components/result/YourRankList";
import { API_URL } from "../shared";

const ViewResultsPage = ({ user }) => {
  const { id } = useParams(); // or slug, depending on your router
  const [poll, setPoll] = useState(null);
  const [rankedResults, setRankedResults] = useState([]);
  const [userRanking, setUserRanking] = useState([]);
  const [isPollEnded, setIsPollEnded] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const pollRes = await fetch(`${API_URL}/polls/${poll.id}`, {
          credentials: "include",
        });
        const pollData = await pollRes.json();
        setPoll(pollData);

        const resultsRes = await fetch(`${API_URL}/polls/${poll.id}/results`, {
          credentials: "include",
        });
        const resultsData = await resultsRes.json();
        setRankedResults(resultsData);

        const userVoteRes = await fetch(`${API_URL}/polls/${poll.id}/vote`, {
          credentials: "include",
        });
        const userVote = await userVoteRes.json();
        setUserRanking(userVote.ranking || []);

        // set up countdown
        const deadline = new Date(pollData.deadline);
        const interval = setInterval(() => {
          const now = new Date();
          const diff = deadline - now;

          if (diff <= 0) {
            setIsPollEnded(true);
            setTimeLeft("Poll has ended.");
            clearInterval(interval);
          } else {
            const d = Math.floor(diff / (1000 * 60 * 60 * 24));
            const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const s = Math.floor((diff % (1000 * 60)) / 1000);
            setTimeLeft(`${d}d ${h}h ${m}m ${s}s`);
          }
        }, 1000);

        return () => clearInterval(interval);
      } catch (err) {
        console.error("Failed to fetch results:", err);
      }
    };

    fetchResults();
  }, [id]);

  if (!poll) return <p>Loading...</p>;

  return (
    <div className="view-results-page" style={{ padding: "2rem" }}>
      <h2>{poll.title}</h2>
      <p>
        Poll ends: {new Date(poll.deadline).toLocaleString()}
        <br />
        {isPollEnded ? (
          <strong style={{ color: "green" }}>Poll has ended</strong>
        ) : (
          <span style={{ color: "#888" }}>Time left: {timeLeft}</span>
        )}
      </p>

      <div style={{ display: "flex", gap: "2rem", marginTop: "2rem", flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: "300px" }}>
          <h3>{isPollEnded ? "Final Results" : "Live Results"}</h3>
          <CurrentRank data={rankedResults} poll={poll} />
        </div>

        <div style={{ flex: 1, minWidth: "300px" }}>
          <h3>Your Ranking</h3>
          <YourRankList ranking={userRanking} />
        </div>
      </div>
    </div>
  );
};

export default ViewResultsPage;
