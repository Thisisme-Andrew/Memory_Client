"use client";

import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/store.js"; // Import logout action

export default function Profile() {
  const user = useSelector((state) => state.auth.user); // Get user data from Redux
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(logout()); // Clear Redux state
    router.push("/"); // Redirect to the main page
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start w-full max-w-sm">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">The Memory</h1>
        <h2 className="text-xl font-semibold">User Profile</h2>

        <div className="flex flex-col items-center gap-4 w-full">
          <img 
            src={user.profilePic || "https://via.placeholder.com/150"} 
            alt="Profile" 
            className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
          />
          <h2 className="text-lg font-bold">{user.fullName || "Guest User"}</h2>
          <p className="text-gray-500">{user.email || "No email available"}</p>

          <button 
            onClick={handleLogout} 
            className="bg-red-500 text-white rounded px-4 py-2 hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
        <div className="w-full">
          <h3 className="text-lg font-semibold">Your Photos</h3>
          <div className="grid grid-cols-3 gap-4 mt-2">
            {["https://picsum.photos/200", "https://picsum.photos/200", "https://picsum.photos/200"].map((photo, index) => (
              <img key={index} src={photo} alt="User Photo" className="w-24 h-24 rounded-lg object-cover" />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}