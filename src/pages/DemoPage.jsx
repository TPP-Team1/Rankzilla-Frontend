import React, { useState } from "react";
import "./DemoPage.css";

const StaticPollFormDemo = () => (
  <div className="modal-content">
    <h2>Create a Poll</h2>
    <h2>Title</h2>
    <input placeholder="Title" disabled value="" />
    <h2>Description</h2>
    <textarea placeholder="Description (1–3 sentences)" disabled value="" />
    <h3>Options</h3>
    <div className="poll-options">
      <div className="option-row">
        <input placeholder="Option 1" disabled value="" />
      </div>
      <div className="option-row">
        <input placeholder="Option 2" disabled value="" />
      </div>
      <button className="add-option-btn" disabled>+ Add option</button>
    </div>
    <h3>Settings</h3>
    <div className="checkbox-row">
      <label><input type="checkbox" disabled /> Allow guest voters</label>
      <label><input type="checkbox" disabled /> End date/time</label>
      <label><input type="checkbox" disabled /> Allow shared links</label>
    </div>
    <div className="modal-buttons">
      <button className="publish" disabled>Publish</button>
      <button className="draft" disabled>Save as draft</button>
    </div>
  </div>
);

const StaticVoteFormDemo = () => {
  const [options, setOptions] = React.useState([
    { id: 1, text: "Rankzilla" },
    { id: 2, text: "Google Form" },
    { id: 3, text: "Poll Everywhere" },
    { id: 4, text: "Typeform" },
  ]);
  const [draggedIdx, setDraggedIdx] = React.useState(null);
  const [rankings, setRankings] = React.useState(options.map((opt, idx) => ({ optionId: opt.id, rank: idx + 1 })));

  React.useEffect(() => {
    setRankings(options.map((opt, idx) => ({ optionId: opt.id, rank: idx + 1 })));
  }, [options]);

  const handleDragStart = (idx) => setDraggedIdx(idx);
  const handleDragOver = (idx) => {
    if (draggedIdx === null || draggedIdx === idx) return;
    const updated = [...options];
    const dragged = updated.splice(draggedIdx, 1)[0];
    updated.splice(idx, 0, dragged);
    setOptions(updated);
    setDraggedIdx(idx);
  };
  const handleDragEnd = () => setDraggedIdx(null);

  return (
    <div className="modal-content">
      <h2>Vote on Poll</h2>
      <h2>What is the best website for polling?</h2>
      <input placeholder="Poll Title" disabled value="What is the best website for polling?" />
      <h2>Description</h2>
      <textarea placeholder="Choose your favorite polling platform and rank them." disabled value="" />
      <h3>Options</h3>
      <div className="ranking-options">
        {options.map((option, idx) => (
          <div
            key={option.id}
            className={`ranking-item${draggedIdx === idx ? " dragging" : ""}`}
            draggable
            onDragStart={() => handleDragStart(idx)}
            onDragOver={() => handleDragOver(idx)}
            onDragEnd={handleDragEnd}
          >
            <div className="ranking-content">
              <span className="drag-handle">⋮⋮</span>
              <span className="option-text">{option.text}</span>
              <span className="rank-badge">#{idx + 1}</span>
            </div>
            <div className="option-actions">
              <button type="button" disabled>✕</button>
            </div>
          </div>
        ))}
      </div>
      <div className="rankings-summary">
        <p>Current Rankings:</p>
        <ul>
          {rankings.map((r) => {
            const option = options.find(opt => opt.id === r.optionId);
            return <li key={r.optionId}><strong>#{r.rank}:</strong> {option.text}</li>;
          })}
        </ul>
      </div>
      <div className="modal-buttons">
        <button className="publish" disabled>Submit Vote</button>
        <button className="draft" disabled>Save Draft</button>
      </div>
    </div>
  );
};

const StaticBreakdownDemo = ({ show, onToggle }) => (
  <div>
    <button className="breakdown-toggle" onClick={onToggle}>
      {show ? "Hide Breakdown" : "Show Breakdown"}
    </button>
    {show && (
      <div>
        <div className="breakdown-section">
          <div className="breakdown-title">Round 1</div>
          <table className="breakdown-table">
            <thead>
              <tr>
                <th>Option</th>
                <th>Votes</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Rankzilla</td><td>60</td><td className="remaining-status">✓ Remaining</td></tr>
              <tr><td>Google Form</td><td>30</td><td className="remaining-status">✓ Remaining</td></tr>
              <tr><td>Poll Everywhere</td><td>20</td><td className="remaining-status">✓ Remaining</td></tr>
              <tr><td>Typeform</td><td>10</td><td className="remaining-status">✓ Remaining</td></tr>
            </tbody>
          </table>
        </div>
        <div className="breakdown-section">
          <div className="breakdown-title">Round 2</div>
          <table className="breakdown-table">
            <thead>
              <tr>
                <th>Option</th>
                <th>Votes</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Rankzilla</td><td>60</td><td className="remaining-status">✓ Remaining</td></tr>
              <tr><td>Google Form</td><td>30</td><td className="remaining-status">✓ Remaining</td></tr>
              <tr><td>Poll Everywhere</td><td>20</td><td className="remaining-status">✓ Remaining</td></tr>
              <tr><td className="eliminated">Typeform</td><td className="eliminated">10</td><td className="eliminated-status">✗ Eliminated</td></tr>
            </tbody>
          </table>
        </div>
        <div className="breakdown-section">
          <div className="breakdown-title">Round 3</div>
          <table className="breakdown-table">
            <thead>
              <tr>
                <th>Option</th>
                <th>Votes</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Rankzilla</td><td>60</td><td className="remaining-status">✓ Remaining</td></tr>
              <tr><td>Google Form</td><td>30</td><td className="remaining-status">✓ Remaining</td></tr>
              <tr><td className="eliminated">Poll Everywhere</td><td className="eliminated">20</td><td className="eliminated-status">✗ Eliminated</td></tr>
            </tbody>
          </table>
        </div>
        <div className="breakdown-section">
          <div className="breakdown-title">Round 4</div>
          <table className="breakdown-table">
            <thead>
              <tr>
                <th>Option</th>
                <th>Votes</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Rankzilla</td><td>60</td><td className="remaining-status">✓ Winner</td></tr>
              <tr><td className="eliminated">Google Form</td><td className="eliminated">30</td><td className="eliminated-status">✗ Eliminated</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    )}
  </div>
);

const StaticResultsDemo = () => {
  const [showBreakdown, setShowBreakdown] = React.useState(false);
  return (
    <div className="modal-content">
      <h2>Poll Results</h2>
      <h2>What is the best website for polling?</h2>
      <input placeholder="Poll Title" disabled value="What is the best website for polling?" />
      <h2>Description</h2>
      <textarea placeholder="Choose your favorite polling platform and rank them." disabled value="" />
      <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: "300px" }}>
          <h3>Final Results</h3>
          <div className="current-rank-list">
            <div className="ranking-item winner">
              <span className="option-text">Rankzilla</span>
              <span className="rank-badge">#1</span>
              <span className="vote-count">60 votes</span>
              <span className="winner-badge" role="img" aria-label="Winner">🏆 Winner</span>
              <div className="final-result-bar" style={{ width: "100%" }}></div>
            </div>
            <div className="ranking-item">
              <span className="option-text">Google Form</span>
              <span className="rank-badge">#2</span>
              <span className="vote-count">30 votes</span>
              <div className="final-result-bar" style={{ width: "80%" }}></div>
            </div>
            <div className="ranking-item">
              <span className="option-text">Poll Everywhere</span>
              <span className="rank-badge">#3</span>
              <span className="vote-count">20 votes</span>
              <div className="final-result-bar" style={{ width: "60%" }}></div>
            </div>
            <div className="ranking-item">
              <span className="option-text">Typeform</span>
              <span className="rank-badge">#4</span>
              <span className="vote-count">10 votes</span>
              <div className="final-result-bar" style={{ width: "40%" }}></div>
            </div>
          </div>
        </div>
        <div style={{ flex: 1, minWidth: "300px" }}>
          <h3>Your Ranking</h3>
          <div className="your-rank-list">
            <div className="ranking-item winner">
              <span className="option-text">Rankzilla</span>
              <span className="rank-badge">#1</span>
            </div>
            <div className="ranking-item">
              <span className="option-text">Google Form</span>
              <span className="rank-badge">#2</span>
            </div>
            <div className="ranking-item">
              <span className="option-text">Poll Everywhere</span>
              <span className="rank-badge">#3</span>
            </div>
            <div className="ranking-item">
              <span className="option-text">Typeform</span>
              <span className="rank-badge">#4</span>
            </div>
          </div>
        </div>
      </div>
      <StaticBreakdownDemo show={showBreakdown} onToggle={() => setShowBreakdown(!showBreakdown)} />
    </div>
  );
};

const formViews = [
  { label: "Create Poll", component: <StaticPollFormDemo /> },
  { label: "Vote Form", component: <StaticVoteFormDemo /> },
  { label: "Results", component: <StaticResultsDemo /> },
];

const featureIntros = [
  "Create polls with custom options, set an end date, and let anyone vote—even guests!",
  "Drag to rank your favorite options. Easy and fun!",
  "See live results and a breakdown of each voting round."
];

const DemoPage = () => {
  const [viewIdx, setViewIdx] = React.useState(0);
  const viewFeatureMap = [
    "Create polls with custom options, set an end date, and let anyone vote—even guests!",
    "Drag to rank your favorite options. Easy and fun!",
    "See live results and a breakdown of each voting round. Results use the instant run-off algorithm for fair winner selection."
  ];
  return (
    <div className="demo-page" style={{ padding: "2rem", textAlign: "center" }}>
      <div className="feature-highlight-box">
        {viewFeatureMap[viewIdx]}
      </div>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "2rem", marginTop: "2rem" }}>
        <button
          style={{ fontSize: "2rem", background: "none", border: "none", color: "#5ea0f2", cursor: "pointer" }}
          onClick={() => setViewIdx((viewIdx - 1 + formViews.length) % formViews.length)}
          aria-label="Previous"
        >
          ←
        </button>
        <div style={{ flex: 1 }}>{formViews[viewIdx].component}</div>
        <button
          style={{ fontSize: "2rem", background: "none", border: "none", color: "#5ea0f2", cursor: "pointer" }}
          onClick={() => setViewIdx((viewIdx + 1) % formViews.length)}
          aria-label="Next"
        >
          →
        </button>
      </div>
      <div style={{ marginTop: "1rem", color: "#5ea0f2", fontWeight: 600, fontSize: "1.1rem" }}>{formViews[viewIdx].label}</div>
    </div>
  );
};

export default DemoPage;
