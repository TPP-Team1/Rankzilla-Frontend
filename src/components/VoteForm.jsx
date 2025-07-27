import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../shared";
import "./VoteForm.css";

const VoteForm = ({ poll, user, email, setEmail, readOnly = false }) => {
  const navigate = useNavigate();
  const isGuest = !user;

  const [orderedOptions, setOrderedOptions] = useState([]);
  const [deletedOptions, setDeletedOptions] = useState(new Set());
  const [rankings, setRankings] = useState([]);
  const [draggedItem, setDraggedItem] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [movedOptionIds, setMovedOptionIds] = useState(new Set());
  const [voteId, setVoteId] = useState(null);

  const isValidEmail = (email) =>
    typeof email === "string" &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  useEffect(() => {
    if (poll?.pollOptions) {
      setOrderedOptions([...poll.pollOptions]);
    }
  }, [poll?.pollOptions]);

  useEffect(() => {
    const newRankings = orderedOptions.map((option, index) => {
      if (deletedOptions.has(option.id)) return { optionId: option.id, rank: null };
      const rank = orderedOptions
        .slice(0, index)
        .filter((opt) => !deletedOptions.has(opt.id)).length + 1;
      return { optionId: option.id, rank };
    });
    setRankings(newRankings);
  }, [orderedOptions, deletedOptions]);

  const handleDragStart = (e, index) => {
    setDraggedItem(index);
    e.dataTransfer.setDragImage(e.currentTarget, 0, 0);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedItem === null || draggedItem === index) return;
    const updated = [...orderedOptions];
    const dragged = updated.splice(draggedItem, 1)[0];
    updated.splice(index, 0, dragged);
    setOrderedOptions(updated);
    setDraggedItem(index);
    setMovedOptionIds((prev) => new Set(prev).add(dragged.id));
  };

  const handleDragEnd = () => setDraggedItem(null);

  const handleDeleteOption = (id) =>
    setDeletedOptions((prev) => new Set(prev).add(id));

  const handleRestoreOption = (id) =>
    setDeletedOptions((prev) => {
      const copy = new Set(prev);
      copy.delete(id);
      return copy;
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isGuest && !isValidEmail(email)) {
      alert("Please enter a valid email to submit your vote.");
      return;
    }
    setSubmitting(true);
    try {
      // Create vote first
      const createRes = await axios.post(
        `${API_URL}/api/polls/${poll.id}/vote`,
        { submitted: false, email },
        { withCredentials: true }
      );
      const newVoteId = createRes.data.id;
      setVoteId(newVoteId);

      // Submit it
      await axios.patch(
        `${API_URL}/api/polls/${poll.id}/vote/${newVoteId}`,
        { submitted: true, rankings },
        { withCredentials: true }
      );

      alert("Vote submitted successfully!");
      navigate("/thank-you");
    } catch (err) {
      console.error("Submit error:", err);
      alert("Failed to submit vote.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveDraft = async () => {
    if (isGuest || !voteId) return;
    try {
      await axios.patch(
        `${API_URL}/api/polls/${poll.id}/vote/${voteId}`,
        { submitted: false, rankings },
        { withCredentials: true }
      );
      alert("Draft saved.");
    } catch (err) {
      console.error("Save draft error:", err);
      alert("Could not save draft.");
    }
  };

  if (!poll) return <div className="vote-form">Loading poll...</div>;
  if (!poll.pollOptions?.length) return <div>No poll options provided.</div>;

  return (
    <form className="vote-form" onSubmit={handleSubmit}>
      {isGuest && (
        <div style={{ marginBottom: "1rem" }}>
          <label>
            Optional Email (required for guests):
            <input
              type="email"
              value={email || ""}
              onChange={(e) => setEmail?.(e.target.value)}
              placeholder="you@example.com"
              required={isGuest}
              style={{ marginLeft: "0.5rem" }}
            />
          </label>
        </div>
      )}
      <h4>Rank the options (top = highest rank):</h4>
      <div className="ranking-options">
        {orderedOptions.map((option, index) => {
          const isDeleted = deletedOptions.has(option.id);
          const rank = rankings.find(r => r.optionId === option.id)?.rank;
          return (
            <div
              key={option.id}
              className={`ranking-item ${draggedItem === index ? "dragging" : ""} ${isDeleted ? "deleted" : ""}`}
              draggable={!readOnly && !isDeleted}
              onDragStart={(e) => !isDeleted && handleDragStart(e, index)}
              onDragOver={(e) => !isDeleted && handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
            >
              <div className="ranking-content">
                {!isDeleted && <span className="drag-handle">⋮⋮</span>}
                <span className="option-text">{option.optionText}</span>
                {!isDeleted && rank && (
                  <span className="rank-badge">#{rank}</span>
                )}
              </div>
              <div className="option-actions">
                {isDeleted ? (
                  <button type="button" onClick={() => handleRestoreOption(option.id)}>Restore</button>
                ) : (
                  <button type="button" onClick={() => handleDeleteOption(option.id)}>✕</button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="rankings-summary">
        <p>Current Rankings:</p>
        <ul>
          {orderedOptions.map((option) => {
            const rank = rankings.find((r) => r.optionId === option.id)?.rank;
            return deletedOptions.has(option.id) ? (
              <li key={option.id}><strong>Unranked:</strong> {option.optionText}</li>
            ) : (
              <li key={option.id}><strong>#{rank}:</strong> {option.optionText}</li>
            );
          })}
        </ul>
      </div>

      {!readOnly && (
        <>
          <button type="submit" disabled={submitting}>
            Submit Vote
          </button>
          {!isGuest && (
            <button
              type="button"
              onClick={handleSaveDraft}
              disabled={movedOptionIds.size === 0 || submitting}
            >
              Save Draft
            </button>
          )}
        </>
      )}
    </form>
  );
};

export default VoteForm;
