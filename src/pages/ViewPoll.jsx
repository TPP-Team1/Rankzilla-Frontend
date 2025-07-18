import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ViewPoll = () => {
    navigate = useNavigate();
    const {slug} = useParams();
    const [poll, setPoll] = useState(null);
    const [isExpired, setIsExpired] = useState(false);

    useEffect(() => {
        const fetchPoll = async () => {
            try {
                const res = await axios.get(`http://localhost:8080/api/polls/${slug}`);
                setPoll(response.data);
            } catch (error) {
                console.error("Error fetching poll:", error);
                navigate("*");
            }
        };

        fetchPoll();
    }, [slug]);

    handleExpired = () => {
        const now = new Date();
        const deadline = new Date(poll.deadline);
        setIsExpired(now > deadline);
    }

  return (
    <div className="view-poll-page">
      <h2>{poll.title}</h2>
      <p>{poll.description}</p>
      {isExpired ? <p>This poll has ended.</p> : <p>Closes on: {poll.deadline}</p>}
      {/* Vote form placeholder */}
        <ul>
            {poll.options.map((option) => (
            <li key={option.id}>
                {option.text}
            </li>
            ))}
        </ul>
    </div>
  );
};

export default ViewPoll;
