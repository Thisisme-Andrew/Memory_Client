"use client";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { logoutUser, setUser } from "../redux/store.js";

/*Profile Page, allows users to view and edit their profile information*/
export default function Profile() {
  {/*State Variables For Redux And User Session*/}
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();
  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState(null);
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [isEditing, setIsEditing] = useState(false);
  const [showReloginMessage, setShowReloginMessage] = useState(false);

  {/*Check if user is logged in*/}
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

  {/*Fetch User Data*/}
  useEffect(() => {
    {/*Check if user is logged in*/}
    if (user?.userID) {

      {/*API call to fetch user data in backend*/}
      const fetchUserProfile = async () => {
        try {
          const response = await fetch(
            `https://memories-gebqazega2facsa4.canadacentral-01.azurewebsites.net/api/users/${user.userID}`
          );

          if (!response.ok) {
            throw new Error(`Failed to fetch user data. Status: ${response.status}`);
          }

          {/*Handle API Response*/}
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

  {/*Handle Logout*/}
  const handleLogout = () => {
    sessionStorage.removeItem("user");
    dispatch(logoutUser());
    router.push("/login");
  };

  {/*Handle Logout After Update*/}
  const handleLogoutAfterUpdate = () => {
    sessionStorage.removeItem("user");
    dispatch(logoutUser());
    setShowReloginMessage(true);
  };

  {/*Handle Go Home*/}
  const handleGoHome = () => {
    router.push("/homePage");
  };

  {/*Handle Save Changes*/}
  const handleSaveChanges = async () => {
    {/*Error Checking For Empty Fields*/}
    if (firstName.trim().length < 1 || lastName.trim().length < 1) {
      setError("First and Last name must be at least 1 character long.");
      return;
    }

    {/*Update User Data In Backend*/}
    const updatedUserData = {
      firstName,
      lastName,
      email: user?.email,
      userID: user?.userID,
    };

    {/*API call to update user data in backend*/}
    try {
      const response = await fetch(
        `https://memories-gebqazega2facsa4.canadacentral-01.azurewebsites.net/api/users/edit`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedUserData),
        }
      );

      {/*Error Checking For Update Failure*/}
      if (!response.ok) {
        throw new Error("Failed to update user data");
      }

      {/*Handle API Response*/}
      const data = await response.json();
      console.log("Updated User Data:", data);
      sessionStorage.setItem("user", JSON.stringify(data));
      dispatch(setUser(data));
      handleLogoutAfterUpdate();
    } catch (err) {
      console.error("Error saving changes:", err);
      setError("Failed to save changes.");
    }
  };

  {/*Get User Initials*/}
  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  
  return (
    //main container, defines the gradient background and center content
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 text-white p-8">
      <h1 className="text-4xl font-bold text-white drop-shadow-lg mb-6">Welcome Back</h1>
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md text-center">
        {/*Profile*/}
        <div className="w-24 h-24 mx-auto mb-4 bg-blue-600 text-white rounded-full flex items-center justify-center text-3xl font-bold shadow-lg">
          {getInitials(user?.fullName)}
        </div>

        {/*Edit Profile*/}
        {isEditing ? (
          <div>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="text-lg font-semibold text-gray-800 mb-2 w-full p-2 border border-gray-300 rounded"
              placeholder="First Name"
            />
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="text-lg font-semibold text-gray-800 mb-2 w-full p-2 border border-gray-300 rounded"
              placeholder="Last Name"
            />
            <button
              onClick={handleSaveChanges}
              className="bg-green-500 text-white py-2 px-6 rounded mt-4 hover:bg-green-600 transition"
            >
              Save Changes
            </button>
          </div>
        ) : (
          <> {/*View Profile*/}
            <h2 className="text-2xl font-semibold text-gray-800 mb-1">
              {user?.fullName || "Guest User"}
            </h2>
            <p className="text-gray-500 mb-2">{user?.email || "No email available"}</p>

            {/*User ID, IMPORTANT*/}
            {user?.userID && (
              <p className="text-sm text-gray-400 mb-6">
                UID: <span className="font-mono">{user.userID}</span>
              </p>
            )}

            {/*Buttons*/}
            <div className="flex flex-col justify-center gap-4">
              <button
                onClick={handleGoHome}
                className="bg-blue-600 text-white border border-blue-600 px-6 py-3 rounded text-lg font-semibold shadow-lg hover:bg-white hover:text-blue-600 transition"
              >
                Galleries
              </button>
              <button
                onClick={() => setIsEditing(true)}
                className="bg-white text-blue-600 border border-blue-600 px-6 py-3 rounded text-lg font-semibold shadow-lg hover:bg-blue-600 hover:text-white transition"
              >
                Edit Name
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-700 text-white border border-red-700 px-6 py-3 rounded text-lg font-semibold shadow-lg hover:bg-white hover:text-red-700 transition"
              >
                Log Out
              </button>
            </div>
          </>
        )}

      {/*Error Message*/}
        {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
      </div>

      {/*Show relogin message*/}
      {showReloginMessage && (
        <div className="fixed top-0 left-0 right-0 bg-red-600 text-white text-center py-3">
          <p>Your information has been updated. Please log in again.</p>
          <button
            onClick={() => router.push("/login")}
            className="mt-2 bg-white text-red-600 py-2 px-6 rounded hover:bg-gray-200"
          >
            Go to Login
          </button>
        </div>
      )}
    </div>
  );
}
