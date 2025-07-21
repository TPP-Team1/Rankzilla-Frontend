import React from "react";

const ThankYouPage = () => {
    return (
        <div style={{ padding: "2rem", textAlign: "center" }}>
            <h2>Thank you for voting!</h2>
            <p>Your response has been recorded.</p>
            <p>If you entered your email, you’ll receive results once the poll ends.</p>
            <a href="/dashboard">Return to Dashboard</a>
        </div>
    );
};

export default ThankYouPage;