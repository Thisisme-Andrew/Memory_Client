"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter from next/navigation
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/store.js";

export default function Profile() {
  const user = useSelector((state) => state.auth.user);
  const router = useRouter();
  const dispatch = useDispatch();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    if (!user && !isLoggingOut) {
      router.push("/login"); // If no user, redirect to login
    }
  }, [user, isLoggingOut, router]);

  const handleLogout = () => {
    setIsLoggingOut(true);
    dispatch(logout()); // Dispatch logout action
    router.push("/"); // Redirect to home page after logout
  };

  const handleGoHome = () => {
    router.push("/homePage"); // Directly navigate to the home page
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-semibold text-gray-800 mb-4">User Profile</h1>
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-sm">
        <img
          src={user?.profilePic || "https://via.placeholder.com/150"}
          alt="Profile"
          className="w-32 h-32 rounded-full object-cover mb-4 mx-auto"
        />
        <h2 className="text-xl font-bold text-center mb-2">{user?.fullName || "Guest User"}</h2>
        <p className="text-center text-gray-500 mb-4">{user?.email || "No email available"}</p>

        <div className="flex justify-center gap-4">
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white py-2 px-6 rounded hover:bg-red-600 transition"
          >
            Logout
          </button>
          <button
            onClick={handleGoHome} // This button navigates to the home page
            className="bg-blue-500 text-white py-2 px-6 rounded hover:bg-blue-600 transition"
          >
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
}
