import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ViewPoll = () => {
    navigate = useNavigate();
    const {slug} = useParams();
    const [poll, setPoll] = useState(null);

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



  return (
    <div className="view-poll-page">
      <h2>{poll.title}</h2>
      <p>{poll.deadline}</p>
      <p>{poll.description}</p>
    </div>
  );
};

export default ViewPoll;
