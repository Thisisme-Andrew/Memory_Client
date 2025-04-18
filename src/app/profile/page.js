"use client";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { logoutUser, setUser } from "../redux/store.js"; // Redux actions

export default function Profile() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();
  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState(null);
  const defaultProfilePic = "https://picsum.photos/200";

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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-semibold text-gray-800 mb-4">User Profile</h1>
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-sm">
        <img
          src={user?.profilePic || defaultProfilePic}
          alt="Profile"
          className="w-32 h-32 rounded-full object-cover mb-4 mx-auto"
        />
        <h2 className="text-xl font-bold text-center mb-1">{user?.fullName || "Guest User"}</h2>
        <p className="text-center text-gray-500 mb-1">{user?.email || "No email available"}</p>

        {/* 🆔 Display UID Here */}
        {user?.userID && (
          <p className="text-center text-sm text-gray-400 mb-4">
            UID: <span className="font-mono">{user.userID}</span>
          </p>
        )}

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
