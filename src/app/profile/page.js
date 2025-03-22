"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/store.js";

export default function Profile() {
  const user = useSelector((state) => state.auth.user);
  const router = useRouter();
  const dispatch = useDispatch();
  const [isLoggingOut, setIsLoggingOut] = useState(false); // Track logout state

  useEffect(() => {
    if (!user && !isLoggingOut) {
      router.push("/login");
    }
  }, [user, isLoggingOut, router]);

  const handleLogout = () => {
    setIsLoggingOut(true); // Prevent immediate redirect to /login
    dispatch(logout()); 
    router.push("/"); // Redirect to home page
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start w-full max-w-sm">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">The Memory</h1>
        <h2 className="text-xl font-semibold">User Profile</h2>

        <div className="flex flex-col items-center gap-4 w-full">
          <img 
            src={user?.profilePic || "https://via.placeholder.com/150"} 
            alt="Profile" 
            className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
          />
          <h2 className="text-lg font-bold">{user?.fullName || "Guest User"}</h2>
          <p className="text-gray-500">{user?.email || "No email available"}</p>

          <button 
            onClick={handleLogout} 
            className="bg-red-500 text-white rounded px-4 py-2 hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </main>
    </div>
  );
}