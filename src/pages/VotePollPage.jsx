import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import VoteForm from "../components/VoteForm";
import { API_URL } from "../shared";

const VotePollPage = () => {
  const { id, slug } = useParams();
  const navigate = useNavigate();
  const [poll, setPoll] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        let url;
        if (slug) {
          url = `${API_URL}/api/polls/slug/${slug}`;
        } else if (id) {
          url = `${API_URL}/api/polls/${id}`;  // Backend expects /api/polls/:pollId
        } else {
          setError("No poll ID or slug provided");
          setLoading(false);
          return;
        }

        const response = await fetch(url, {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch poll: ${response.statusText}`);
        }

        const pollData = await response.json();
        setPoll(pollData);
      } catch (err) {
        console.error("Error fetching poll:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPoll();
  }, [id, slug]);

  useEffect(() => {
    const checkIfVoted = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/polls/${id}/vote`, {
          withCredentials: true,
        });
        if (res.data) {setHasVoted(true); }
      } catch (error) {
        if (error.response?.status === 404){
          setHasVoted(false); //no vote found
        } else {
          console.error("Error checking vote status:", error);
        }
      }finally {
        setLoading(false);
      }
    };
    checkIfVoted();
  }, [id]);

  if (loading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <p>Loading poll...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "2rem", textAlign: "center", color: "red" }}>
        <h2>Error</h2>
        <p>{error}</p>
        <button 
          onClick={() => navigate("/dashboard")}
          style={{ 
            marginTop: "1rem", 
            padding: "0.5rem 1rem", 
            background: "#007bff", 
            color: "white", 
            border: "none", 
            borderRadius: "4px",
            cursor: "pointer" 
          }}
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  if (!poll) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <p>Poll not found</p>
        <button 
          onClick={() => navigate("/dashboard")}
          style={{ 
            marginTop: "1rem", 
            padding: "0.5rem 1rem", 
            background: "#007bff", 
            color: "white", 
            border: "none", 
            borderRadius: "4px",
            cursor: "pointer" 
          }}
        >
          Back to Dashboard
        </button>
      </div>
    );
  }
  // If the user has already voted, show a thank you message
  // and a button to go back to the dashboard
  if (hasVoted) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h2>Thank You!</h2>
        <p>You have already voted on this poll.</p> 
        {/* add: "results will be released when poll closes on : {poll.deadline}" */}
        <button 
          onClick={() => navigate("/dashboard")}
          style={{ 
            marginTop: "1rem", 
            padding: "0.5rem 1rem", 
            background: "#007bff", 
            color: "white", 
            border: "none", 
            borderRadius: "4px",
            cursor: "pointer" 
          }}
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div
      className="vote-page"
      style={{
        padding: "2rem",
        maxWidth: "800px",
        margin: "0 auto",
      }}
    >
      <h2>Vote on Poll</h2>
      <div style={{ 
        marginBottom: "2rem", 
        padding: "1rem", 
        background: "#f8f9fa", 
        borderRadius: "8px" 
      }}>
        <h3>{poll.question}</h3>
        {poll.description && <p>{poll.description}</p>}
      </div>

      <VoteForm poll={poll} />

      <div style={{ marginTop: "2rem", textAlign: "center" }}>
        <button 
          onClick={() => navigate("/dashboard")}
          style={{ 
            padding: "0.5rem 1rem", 
            background: "#6c757d", 
            color: "white", 
            border: "none", 
            borderRadius: "4px",
            cursor: "pointer" 
          }}
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default VotePollPage;
