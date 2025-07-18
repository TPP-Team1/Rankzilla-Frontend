import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ViewPoll = () => {
    const navigate = useNavigate();
    const {slug} = useParams();
    const [poll, setPoll] = useState(null);
    const [isExpired, setIsExpired] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const fetchPoll = async () => {
            try {
                const res = await axios.get(`http://localhost:8080/api/polls/${slug}`);
                setPoll(res.data);
            } catch (error) {
                setError("Failed to fetch poll data.");
                console.error(error);
                //navigate("*");
            }
            finally {
                setLoading(false);
            }
        };

        fetchPoll();
    }, [slug]);

    const handleExpired = () => {
        const now = new Date();
        const deadline = new Date(poll.deadline);
        setIsExpired(now > deadline);
    }

    useEffect(() => {
        if (poll) {
            handleExpired();
        }
    }, [poll]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

  return (
    <div className="view-poll-page">
      <h2>{poll.title}</h2>
      <p>{poll.description}</p>
      {isExpired ? (
        <p>This poll has ended.</p>
      ) : (
        <p>Closes on: {poll.deadline}</p>
      )}
      {/* Vote form placeholder */}
      <ul>
        {poll.pollOptions.map((option) => (
          <li key={option.id}>{option.optionText}</li>
        ))}
      </ul>

      <button
        disabled={copied}
        onClick={() => {
          navigator.clipboard.writeText(window.location.href);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }}
      >
        {copied ? "Copied!" : "Copy Link"}
      </button>
    </div>
  );
};

export default ViewPoll;
