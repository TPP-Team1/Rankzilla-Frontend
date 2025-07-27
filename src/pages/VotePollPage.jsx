import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import VoteForm from "../components/VoteForm";
import { API_URL } from "../shared";
import "./VotePollPage.css";

const VotePollPage = ({ user }) => {
  const { identifier } = useParams();
  const navigate = useNavigate();
  const [poll, setPoll] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hasVoted, setHasVoted] = useState(false);
  const [email, setEmail] = useState("");
  const isGuest = !user;

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        let url;
        if (isNaN(Number(identifier))) {
          url = `${API_URL}/api/polls/slug/${identifier}`;
        } else {
          url = `${API_URL}/api/polls/${identifier}`;
        }

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to fetch poll: ${response.statusText}`);
        }

        const pollData = await response.json();
        setPoll(pollData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPoll();
  }, [identifier]);

  useEffect(() => {
    const fetchUserVote = async () => {
      if (!poll || isGuest) return;
      try {
        const res = await fetch(`${API_URL}/api/polls/${poll.id}/vote`, {
          credentials: "include",
        });
        if (res.ok) {
          setHasVoted(true);
        }
      } catch {}
    };
    fetchUserVote();
  }, [poll, isGuest]);

  if (loading) {
    return <div className="vote-loading">Loading poll...</div>;
  }

  if (error) {
    return (
      <div className="vote-error">
        <h2>Error</h2>
        <p>{error}</p>
        {user && (
          <button onClick={() => navigate("/dashboard")} className="back-btn">
            Back to Dashboard
          </button>
        )}
      </div>
    );
  }

  if (!poll) {
    return (
      <div className="vote-error">
        <p>Poll not found.</p>
        {user && (
          <button onClick={() => navigate("/dashboard")} className="back-btn">
            Back to Dashboard
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="vote-poll-overlay">
      <div className="vote-poll-page">
        <h2>Vote on Poll</h2>
        <div className="poll-meta">
          <h3>{poll.title}</h3>
          {poll.description && <p>{poll.description}</p>}
        </div>

        {poll.status === "ended" ? (
          <p className="vote-ended">
            <em>This poll has ended. Voting is disabled.</em>
          </p>
        ) : hasVoted ? (
          <div className="already-voted">
            <h4>✅ You’ve already voted on this poll.</h4>
            <p>Your vote has been recorded. Thank you!</p>
          </div>
        ) : (
          <div className="vote-form-wrapper">
            <VoteForm poll={poll} user={user} email={email} setEmail={setEmail} />
          </div>
        )}

        {user && (
          <div className="back-btn-wrapper">
            <button onClick={() => navigate("/dashboard")} className="back-btn">
              Back to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VotePollPage;
