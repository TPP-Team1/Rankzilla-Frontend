import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div classname ="home-container">
      <h1>Welcome to Rankzilla</h1>
      <p>Rankzilla is a ranking poll platform that lets users vote with more nuance.Instead of just choosing one option, people rank choices, and Rankzilla figures out the winner—fairly.</p>
      <img className="react-logo" src="/react-logo.svg" alt="React Logo" />
      <button onClick={() => navigate("/login")}>Get Started</button>

    </div>
  );
};

export default Home;
