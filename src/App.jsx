import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import axios from "axios";
import "./AppStyles.css";
import NavBar from "./components/NavBar";
import { BrowserRouter, HashRouter, Routes, Route, useNavigate } from "react-router-dom";
import NotFound from "./components/NotFound";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import SmartDashboardRedirect from "./components/SmartDashboardRedirect";
import AdminDashboard from "./pages/AdminDashboard";
import EditPoll from "./pages/EditPoll";
import CreatePoll from "./pages/CreatePoll";
import VotePollPage from "./pages/VotePollPage";
import HostPollView from "./pages/HostPollView";
import ThankYouPage from "./pages/Thankyou";
//import Demo from "./pages/Demo";

import { API_URL } from "./shared";

import ViewResultsPage from "./pages/ViewResultsPage";


//import SmartPollView from "./pages/SmartPollView";
import PollFormModal from "./components/PollFormModal";
import UserProfile from "./pages/UserProfile";

// const RouterComponent = process.env.NODE_ENV === 'development' ? BrowserRouter : HashRouter;

const App = () => {
  const [user, setUser] = useState(null);
  const [isCreatePollOpen, setIsCreatePollOpen] = useState(false);
  const navigate = useNavigate();

  const cleanupExpiredGuestSession = () => {
    const savedGuestSession = localStorage.getItem('guestSession');
    if (savedGuestSession) {
      try {
        const guestUser = JSON.parse(savedGuestSession);
        const now = Date.now();
        const sessionAge = now - (guestUser.loginTime || 0);
        const maxAge = 24 * 60 * 60 * 1000; // 24 hours 

        // Kick out expired guest sessions 
        if (sessionAge > maxAge) {
          localStorage.removeItem('guestSession');
          return true;
        }
      } catch (e) {
        // If the data is corrupted or weird, just delete it
        localStorage.removeItem('guestSession');
        return true; // Cleaned up the mess
      }
    }
    return false; //nothing to clean up
  };
  console.log("Current user:", user);

  const checkAuth = async () => {
    // Clean up any old guest sessions first
    cleanupExpiredGuestSession();

    // Check if user is logged in as a guest (from localStorage)
    const savedGuestSession = localStorage.getItem("guestSession");
    if (savedGuestSession) {
      try {
        const guestUser = JSON.parse(savedGuestSession);
        if (guestUser.isGuest) {
          //Guest found in localStorage, use it
          setUser(guestUser);
          return; // Skip server auth check
        }
      } catch (e) {
        // If stored data is corrupt, remove it
        localStorage.removeItem("guestSession");
      }
    }

    // Check with server if user is logged in (JWT session)
    try {
      const response = await axios.get(`${API_URL}/auth/me`, {
        withCredentials: true,
      });

      // Authenticated user found
      setUser(response.data.user);

      // Clean up guest session if one existed
      localStorage.removeItem("guestSession");

    } catch (err) {
      if (err.response?.status === 401) {
        // Not authenticated → treat as guest
        console.log("Guest user detected (unauthenticated)");
        setUser(null);
      } else {
        // Unexpected server or network error
        console.error("Unexpected auth error:", err);
      }
    }
  };

  // Check who's logged in when the app first loads
  useEffect(() => {
    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      // If they're just a guest, just clear their browser data 
      if (user?.isGuest) {
        localStorage.removeItem('guestSession');
        setUser(null);
        navigate("/");
        return;
      }
      await axios.post(
        `${API_URL}/auth/logout`,
        {},
        {
          withCredentials: true,
        }
      );
      setUser(null);
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleOpenCreatePoll = () => {
    setIsCreatePollOpen(true);
  };
  const handleCloseCreatePoll = () => {
    setIsCreatePollOpen(false);
  };

  return (
    <div>
      <NavBar user={user} onLogout={handleLogout} onOpenCreatePoll={handleOpenCreatePoll} />
      <div className="app">
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/login" element={<Login setUser={setUser} />} />

          {/* Demo route (optional) */}
          {/* <Route path="/demo" element={<Demo />} /> */}

          {/* Smart redirect based on admin status */}
          <Route path="/dashboard" element={<SmartDashboardRedirect user={user} />} />
          <Route path="/dashboard/main" element={<Dashboard user={user} />} />
          <Route path="/admin" element={<AdminDashboard user={user} />} />

          {/* Poll CRUD */}
          <Route path="/polls/new" element={<CreatePoll />} />
          <Route path="/polls/edit/:id" element={<EditPoll />} />

          {/* Voting and hosting */}
          <Route path="/polls/view/:identifier" element={<VotePollPage user={user} />} />
          <Route path="/polls/host/:id" element={<HostPollView />} />

          {/* Results (fixes path param) */}
          <Route path="/polls/results/:id" element={<ViewResultsPage user={user} />} />

          {/* User profile */}
          <Route path="/users/:userId" element={<UserProfile />} />

          {/* Optional fallback */}
          <Route path="*" element={<NotFound />} />
          <Route path="/thank-you" element={<ThankYouPage />} />
        </Routes>
      </div>
      {isCreatePollOpen && (
        <PollFormModal isOpen={isCreatePollOpen} onClose={handleCloseCreatePoll} />
      )}
    </div>
  );
};

const Root = () => {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
};

const root = createRoot(document.getElementById("root"));
root.render(<Root />);