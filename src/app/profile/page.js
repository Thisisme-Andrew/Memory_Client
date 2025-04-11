"use client";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { setUser, logoutUser } from "../redux/store.js"; // Import actions

export default function Profile() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const router = useRouter();

  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const defaultProfilePic = "https://ui-avatars.com/api/?name=User&background=random";

  // Wait for Redux to determine if user exists before redirecting
  useEffect(() => {
    if (!user && !isLoggingOut) {
      router.push("/login");
    } else {
      setCheckingAuth(false);
    }
  }, [user, isLoggingOut, router]);

  // Fetch profile data if user is valid
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
    dispatch(logoutUser());
    router.push("/");
  };

  const handleGoHome = () => {
    if (profileData?.userID && profileData?.firstName && profileData?.lastName) {
      const updatedUser = {
        userID: profileData.userID,
        fullName: `${profileData.firstName} ${profileData.lastName}`,
        email: profileData.email,
        profilePic: profileData.profilePic || defaultProfilePic,
      };

      dispatch(setUser(updatedUser));
    }

    router.push("/homePage");
  };

  if (checkingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 text-gray-700">
        <p className="text-xl font-medium">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-semibold text-gray-800 mb-4">User Profile</h1>
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-sm">
        <img
          src={profileData?.profilePic || defaultProfilePic}
          alt="Profile"
          className="w-32 h-32 rounded-full object-cover mb-4 mx-auto"
        />
        <h2 className="text-xl font-bold text-center mb-2">
          {`${profileData?.firstName || "Guest"} ${profileData?.lastName || ""}`}
        </h2>
        <p className="text-center text-gray-500 mb-4">
          {profileData?.email || "No email available"}
        </p>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

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