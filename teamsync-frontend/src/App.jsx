import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Tasks from "./pages/Tasks";
import Members from "./pages/Members";
import Analytics from "./pages/Analytics";
import Profile from "./pages/Profile";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/tasks/:projectId" element={<Tasks />} />
      <Route path="/members/:projectId" element={<Members />} />
      <Route path="/analytics/:projectId" element={<Analytics />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
}
