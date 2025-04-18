"use client";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { logoutUser, setUser } from "../redux/store.js";

export default function Profile() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();
  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (!storedUser && !isLoggingOut) {
      router.push("/login");
    } else {
      const userData = JSON.parse(storedUser);
      if (userData) {
        dispatch(setUser(userData));
      }
    }
  }, [router, isLoggingOut, dispatch]);

  useEffect(() => {
    if (user?.userID) {
      const fetchUserProfile = async () => {
        try {
          const response = await fetch(
            `https://memories-gebqazega2facsa4.canadacentral-01.azurewebsites.net/api/users/${user.userID}`
          );

          if (!response.ok) {
            throw new Error(`Failed to fetch user data. Status: ${response.status}`);
          }

          const data = await response.json();
          console.log("Fetched User Data:", data);
          setProfileData(data);
        } catch (err) {
          console.error("Profile Fetch Error:", err);
          setError("Failed to fetch user data.");
        }
      };

      fetchUserProfile();
    }
  }, [user?.userID]);

  const handleLogout = () => {
    setIsLoggingOut(true);
    sessionStorage.removeItem("user");
    dispatch(logoutUser());
    router.push("/");
  };

  const handleGoHome = () => {
    router.push("/homePage");
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Welcome Back</h1>

      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md text-center">
        {/* Initials Avatar */}
        <div className="w-24 h-24 mx-auto mb-4 bg-blue-600 text-white rounded-full flex items-center justify-center text-3xl font-bold shadow-lg">
          {getInitials(user?.fullName)}
        </div>

        <h2 className="text-2xl font-semibold text-gray-800 mb-1">
          {user?.fullName || "Guest User"}
        </h2>
        <p className="text-gray-500 mb-2">{user?.email || "No email available"}</p>

        {user?.userID && (
          <p className="text-sm text-gray-400 mb-6">
            UID: <span className="font-mono">{user.userID}</span>
          </p>
        )}

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <div className="flex justify-center gap-4">
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white py-2 px-6 rounded hover:bg-red-600 transition"
          >
            Logout
          </button>
          <button
            onClick={handleGoHome}
            className="bg-blue-500 text-white py-2 px-6 rounded hover:bg-blue-600 transition"
          >
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
}
