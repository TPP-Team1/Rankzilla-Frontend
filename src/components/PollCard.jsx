import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const PollCard = ({ poll, isOpen, onToggleMenu, currentUser }) => {
  const navigate = useNavigate();

  const timeLeft = (deadline) => {
    const now = new Date();
    const end = new Date(deadline);
    const diff = Math.max(0, end - now);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    return days === 0 ? "no end date" : `ends in ${days} day${days > 1 ? "s" : ""}`;
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    const confirmed = window.confirm("Are you sure you want to delete this poll?");
    if (!confirmed) return;
    try {
      await axios.delete(`http://localhost:8080/api/polls/${poll.id}`, {
        withCredentials: true,
      });
      console.log("✅ Poll deleted:", poll.id);
      window.location.reload();
    } catch (err) {
      console.error("❌ Failed to delete poll:", err);
      alert("Could not delete poll.");
    }
  };

  const handleClick = () => {
        if (!poll?.id) {
            console.error("Poll is missing ID:", poll);
            return;
        }

        // Check if user owns the poll and it's published - go to host view
        if (poll.status === "published" && poll.ownerId === currentUser?.id) {
            navigate(`/polls/host/${poll.id}`);
        } else if (poll.slug) {
            // Use slug if available
            navigate(`/polls/view/${poll.slug}`);
        } else {
            // Fall back to ID
            navigate(`/polls/view/${poll.id}`);
        }
        };


  return (
    <li className="poll-item" onClick={handleClick}>
      <div className="poll-body">
        <div className="poll-left">
          <div className="checkbox-placeholder" />
        </div>

        <div className="poll-main">
          <div className="poll-header">
            <strong>{poll.title}</strong>
            <button
              className="menu-button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleMenu(poll.id);
              }}
            >
              ⋯
            </button>
          </div>

          <p className="poll-date">{new Date(poll.createdAt).toLocaleDateString()}</p>

          <div className="poll-meta">
            <span className="participants">
              👤 {poll.participants || 0}
            </span>
            <span className="deadline">🕓 {timeLeft(poll.deadline)}</span>
            <span className={`badge ${poll.status}`}>{poll.status}</span>
          </div>
        </div>
      </div>

      {isOpen && (
        <ul className="poll-menu" onClick={(e) => e.stopPropagation()}>
          <li
            className={poll.participated ? "disabled" : ""}
            onClick={() => {
              if (!poll.participated) navigate(`/polls/edit/${poll.id}`);
            }}
          >Edit</li>
          <li onClick={() => console.log("Duplicate", poll.id)}>Duplicate</li>
          <li onClick={() => console.log("Invite", poll.id)}>Invite</li>
          <li onClick={() => navigate(`/polls/results/${poll.id}`)}>Results</li>
          <li onClick={handleDelete}>Delete</li>
        </ul>
      )}
    </li>
  );
};

export default PollCard;
