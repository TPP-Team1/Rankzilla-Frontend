import React, { useState } from "react";
import MyPollsTab from "../components/admin/MyPollsTab";
import AdminUsersTab from "../components/admin/AdminUsersTab";
import AdminPollsTab from "../components/admin/AdminPollsTab";

const AdminDashboard = ({ user }) => {
  const [activeTab, setActiveTab] = useState("polls");

  return (
    <div className="admin-dashboard" style={{ padding: "2rem" }}>
      <h2>Admin Dashboard</h2>
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
        <button
          onClick={() => setActiveTab("polls")}
          className={activeTab === "polls" ? "active-tab" : ""}
        >
          All Polls
        </button>
        <button
          onClick={() => setActiveTab("users")}
          className={activeTab === "users" ? "active-tab" : ""}
        >
          All Users
        </button>
        <button
          onClick={() => setActiveTab("myPolls")}
          className={activeTab === "myPolls" ? "active-tab" : ""}
        >
          My Polls
        </button>
      </div>

      {activeTab === "polls" && (
        <div className="admin-tab-container">
          <AdminPollsTab />
        </div>
      )}

      {activeTab === "users" && (
        <div className="admin-tab-container">
          <AdminUsersTab />
        </div>
      )}

      {activeTab === "myPolls" && 
      <div>
      <MyPollsTab user={user} />
      </div>
      }

    </div>
  );
};

export default AdminDashboard;
