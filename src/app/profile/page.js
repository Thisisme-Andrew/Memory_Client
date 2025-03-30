"use client";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { logoutUser } from "../redux/store.js"; // Import logout action

export default function Profile() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const router = useRouter();
  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState(null);
  const defaultProfilePic = "https://picsum.photos/200";

  // Redirect to login if user is not logged in
  useEffect(() => {
    if (!user?.userID) {
      router.push("/login");
    }
  }, [user, router]);

  // Fetch user profile data when userID is available
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

  // Logout Function
  const handleLogout = () => {
    dispatch(logoutUser()); // Clear user from Redux state
    router.push("/"); // Redirect to home page
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start w-full max-w-sm">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">The Memory</h1>
        <h2 className="text-xl font-semibold">User Profile</h2>

        <div className="flex flex-col items-center gap-4 w-full">
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <img
            src={(profileData && profileData.profilePic) ? profileData.profilePic : defaultProfilePic}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
          />

          {profileData ? (
            <>
              <h2 className="text-lg font-bold">
                {`${profileData.firstName} ${profileData.lastName}`}
              </h2>
              <p className="text-gray-500">{profileData.email}</p>
            </>
          ) : (
            <p>Loading profile...</p>
          )}

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </main>
    </div>
  );
}