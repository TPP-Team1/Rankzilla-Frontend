import axios from "axios";
import React, { useState, useEffect, use } from "react";
import { API_URL } from "../shared";

const VoteForm = ({ poll, readOnly = false }) => {
  const [rankings, setRankings] = useState({});
  console.log("this is rankins---->", rankings);
  const [submitting, setSubmitting] = useState(false);
  const [orderedOptions, setOrderedOptions] = useState([]);
  console.log("this is ordered options", orderedOptions);
  const [draggedItem, setDraggedItem] = useState(null);
  console.log("dragged--->", draggedItem);
  const [deletedOptions, setDeletedOptions] = useState(new Set());
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [voteId, setVoteId] = useState(null);
  const [movedOptionIds, setMovedOptionIds] = useState(new Set());


  console.log("VoteForm rendered with poll:", poll);
  console.log("Poll options:", poll?.pollOptions);

  // Initialize ordered options when poll changes
  useEffect(() => {
    if (poll?.pollOptions && orderedOptions.length === 0) {
      setOrderedOptions([...poll.pollOptions]);
    }
  }, [poll?.pollOptions]);

  // Update rankings whenever the order changes
  useEffect(() => {
    const newRankings = {};
  let currentRank = 1;

  orderedOptions.forEach((option) => {
    if (deletedOptions.has(option.id)) {
      newRankings[option.id] = null;
    } else {
      newRankings[option.id] = currentRank++;
    }
  });
      
    setRankings(newRankings);
  }, [orderedOptions, deletedOptions]);

  useEffect(() => {
    const fetchOrCreateVote = async () => {
      if (!poll?.id || readOnly) return;

      try {
        // Try to fetch vote
        const res = await axios.get(`${API_URL}/api/polls/${poll.id}/vote`, {
          withCredentials: true,
        });

        const voteData = res.data;
        setVoteId(voteData.id);

        // Restore saved rankings if they exist
        if (voteData.votingRanks) {
          const restored = voteData.votingRanks.map((rank) => ({
            optionId: rank.pollOptionId,
            rank: rank.rank,
          }));
        
          const restoredMap = {};
          restored.forEach((r) => {
            restoredMap[r.optionId] = r.rank;
          });
        
          setRankings(restoredMap);

          // Set ordered options based on restored rankings
        
          if (poll?.pollOptions) {
            const sortedOptions = [...poll.pollOptions]
              .filter(opt => restoredMap[opt.id] !== undefined && restoredMap[opt.id] !== null)
              .sort((a, b) => restoredMap[a.id] - restoredMap[b.id]);
        
            const unranked = poll.pollOptions.filter(opt => restoredMap[opt.id] === undefined);
        
            setOrderedOptions([...sortedOptions, ...unranked]);
        
            const deleted = new Set(
              poll.pollOptions
                .filter(opt => restoredMap[opt.id] === null)
                .map(opt => opt.id)
            );
            setDeletedOptions(deleted);
          }
        }
        
      } catch (err) {
        // Vote doesn't exist, so create it
        try {
          const createRes = await axios.post(
            `${API_URL}/api/polls/${poll.id}/vote`,
            {
              submitted: false,
              rankings: [],
            },
            { withCredentials: true }
          );

          setVoteId(createRes.data.id);
        } catch (createErr) {
          console.error("Failed to create vote:", createErr);
        }
      }
    };

    fetchOrCreateVote();
  }, [poll?.id, readOnly]);

  if (!poll) {
    return <div className="vote-form">Loading poll data...</div>;
  }

  if (!poll.pollOptions || poll.pollOptions.length === 0) {
    return (
      <div className="vote-form">
        <p>No poll options available.</p>
        <p style={{ fontSize: "12px", color: "#666" }}>
          Debug: Poll data = {JSON.stringify(poll, null, 2)}
        </p>
      </div>
    );
  }

  const handleRankChange = (optionId, rank) => {
    setRankings((prev) => {
      const updated = { ...prev };
      // Remove this rank from any other option
      for (const key in updated) {
        if (updated[key] === rank) {
          updated[key] = "";
        }
      }
      // Assign the rank to this option
      updated[optionId] = rank;
      return updated;
    });
  };

  const handleDragStart = (e, index) => {
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", e.target.parentNode);
    e.dataTransfer.setDragImage(e.target.parentNode, 20, 20);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedItem === null) return;

    if (draggedItem !== index) {
      const newOrderedOptions = [...orderedOptions];
      const draggedOption = newOrderedOptions[draggedItem];

      // Remove the dragged item
      newOrderedOptions.splice(draggedItem, 1);

      // Insert at new position
      newOrderedOptions.splice(index, 0, draggedOption);

      setOrderedOptions(newOrderedOptions);
      setDraggedItem(index);

      setMovedOptionIds((prev) => {
        const updated = new Set(prev);
        if (!updated.has(draggedOption.id)) {
          console.log(`Option "${draggedOption.optionText}" (id: ${draggedOption.id}) moved for the first time`);
        }
        updated.add(draggedOption.id);
        return updated;
      });
      
    }
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const handleDeleteOption = (optionId) => {
    setDeletedOptions((prev) => new Set([...prev, optionId]));
  };

  const handleRestoreOption = (optionId) => {
    setDeletedOptions((prev) => {
      const newSet = new Set(prev);
      newSet.delete(optionId);
      return newSet;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await fetch(`${API_URL}/api/polls/${poll.id}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          pollId: poll.id,
          rankings: rankings,
        }),
      });
      // await axios.post("http://localhost:8080/api/:pollId/vote",
      //   rankings,
      //   {withCredentials: true}
      //  )

      alert("Vote submitted!");
      setSubmitted(true); //to freeze ui
      setRankings({});
    } catch (err) {
      console.error("Failed to submit vote", err);
      setError("Failed to submit vote. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveDraft = async (e) => {
    e.preventDefault();
    if (!voteId) {
      setError("No voteId – cannot save draft.");
      return;
    }

    try {
      const formattedRankings = orderedOptions
        .filter((opt) => !deletedOptions.has(opt.id))
        .map((opt, index) => ({
          optionId: opt.id,
          rank: index + 1,
        }));

      await axios.patch(
        `${API_URL}/api/polls/${poll.id}/vote/${voteId}`,
        {
          submitted: false,
          rankings: formattedRankings,
        },
        { withCredentials: true }
      );

      alert("Draft saved successfully!");
      setSubmitted(false);
    } catch (err) {
      console.error("Failed to save draft:", err);
      setError("Failed to save draft. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="vote-form">
      <h4>
        Drag to rank the options (top = highest rank). Click X to remove options
        from ranking:
      </h4>
      <div className="ranking-options">
        {orderedOptions?.map((option, index) => {
          const isDeleted = deletedOptions.has(option.id);
          const currentRank = rankings[option.id];

          return (
            <div
              key={option.id}
              className={`ranking-item ${
                draggedItem === index ? "dragging" : ""
              } ${isDeleted ? "deleted" : ""}`}
              draggable={!readOnly && !isDeleted && !submitted}
              onDragStart={(e) => !isDeleted && handleDragStart(e, index)}
              onDragOver={(e) => !isDeleted && handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
            >
              <div className="ranking-content">
                {!isDeleted && <span className="drag-handle">⋮⋮</span>}
                <span className="option-text">{option.optionText}</span>
                {!isDeleted && currentRank && (
                  <span className="rank-badge">#{currentRank}</span>
                )}
              </div>
              <div className="option-actions">
                {isDeleted ? (
                  <button
                    type="button"
                    onClick={() => handleRestoreOption(option.id)}
                    disabled={readOnly}
                  >
                    Restore
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleDeleteOption(option.id)}
                    disabled={readOnly}
                  >
                    ✕
                  </button>
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
            const rank = rankings[option.id];
            const isDeleted = deletedOptions.has(option.id);

            return (
              <li key={option.id}>
                {isDeleted ? (
                  <span>
                    <strong>Unranked</strong>: {option.optionText} (excluded)
                  </span>
                ) : (
                  <span>
                    <strong>#{rank}</strong>: {option.optionText}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
        <p>
          <small>
            Note: Deleted options are sent as null/unranked for RCV processing
          </small>
        </p>
      </div>

      {error && (
        <div className="submit-error" style={{ color: "red" }}>
          {error}
        </div>
      )}

      <button type="submit" disabled={readOnly || submitting || submitted}>
        Submit Vote
      </button>

      <button onClick={handleSaveDraft} disabled={movedOptionIds.size === 0}>Save Draft</button>
    </form>
  );
};

export default VoteForm;
