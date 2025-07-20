import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/login");
      return;
    }

    fetch("http://localhost:8000/users/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => {
        setUser(data);
        setLoading(false);
      })
      .catch(() => {
        localStorage.removeItem("access_token");
        navigate("/login");
      });
  }, []);

  const updatePassword = async () => {
    if (!newPassword.trim()) return;

    const token = localStorage.getItem("access_token");
    try {
      const res = await fetch("http://localhost:8000/users/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: user.email,
          new_password: newPassword,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("✅ Password updated successfully.");
        setNewPassword("");
      } else {
        alert(data.detail || "❌ Failed to update password.");
      }
    } catch (err) {
      alert("❌ Error updating password.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen p-6 bg-gray-100 dark:bg-black text-black dark:text-white">
        <h1 className="text-2xl font-bold">Loading profile...</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-100 dark:bg-black text-black dark:text-white">
      <h1 className="text-3xl font-bold mb-4">👤 Profile Settings</h1>

      <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-md max-w-xl">
        <h2 className="text-xl font-semibold mb-4">Account Info</h2>

        <div className="mb-4">
          <label htmlFor="username" className="block text-sm font-medium mb-1">
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            disabled
            value={user.name}
            className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            disabled
            value={user.email}
            className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white"
          />
        </div>

        <hr className="my-6 border-gray-300 dark:border-gray-600" />

        <h2 className="text-xl font-semibold mb-4">Change Password</h2>
        <label htmlFor="newPassword" className="block text-sm font-medium mb-1">
          New Password
        </label>
        <input
          type="password"
          id="newPassword"
          name="newPassword"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full px-3 py-2 mb-4 border rounded dark:bg-gray-700 dark:text-white"
          autoComplete="new-password"
          required
        />
        <button
          onClick={updatePassword}
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
        >
          🔄 Update Password
        </button>

        <hr className="my-6 border-gray-300 dark:border-gray-600" />

        <button
          onClick={handleLogout}
          className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 mt-2"
        >
          🔒 Logout
        </button>
      </div>
    </div>
  );
}
