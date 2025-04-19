"use client"; // Add this to indicate this is a Client Component

import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { logoutUser } from "../redux/store.js"; // Import logout action
import { setUser } from "../redux/store.js"; // Redux actions
import { useSearchParams } from "next/navigation";

export default function gallerysettings() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentid = parseInt(searchParams.get("memid"));

  // Title
  const [title, setTitle] = useState("Untitled Gallery");
  const [newTitle, setNewTitle] = useState("");

  // Coordinates
  const [latitude, setLatitude] = useState("");
  const [newLatitude, setNewLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [newLongitude, setNewLongitude] = useState("");

  // Owner
  const [owner, setOwner] = useState("");

  // Collaborators
  const [collaborators, setCollaborators] = useState([]);
  const [newCollaborators, setNewCollaborators] = useState([]);
  const [toRemove, setToRemove] = useState([]);
  const [showAddCollaboratorsModal, setShowAddCollaboratorsModal] = useState(false);
  const [modalCollaborators, setModalCollaborators] = useState([]);
  
  const saveChanges = async () => {
    try {

      await fetch(
        "https://memories-gebqazega2facsa4.canadacentral-01.azurewebsites.net/api/memories/editTitle",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            memoryID: currentid,
            title: newTitle
          }),
        }
      );
      console.log('Title Updated');


      await fetch(
        "https://memories-gebqazega2facsa4.canadacentral-01.azurewebsites.net/api/memories/editLongitudeLatitude",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            memoryID: currentid,
            longitude: parseFloat(newLongitude),
            latitude: parseFloat(newLatitude)
          }),
        }
      );

      console.log('Coordinates Updated');

      await fetch(
        "https://memories-gebqazega2facsa4.canadacentral-01.azurewebsites.net/api/memories/removeCollaborators",
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            memoryID: currentid,
            collaborators: toRemove
          }),
        }
      );

      console.log('Collaborators Removed');

      await fetch(
        "https://memories-gebqazega2facsa4.canadacentral-01.azurewebsites.net/api/memories/addCollaborators",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            memoryID: currentid,
            collaborators: newCollaborators
          }),
        }
      );
  
      console.log('Collaborators Added');
      router.push(`/galleryview?memid=${currentid}`);
    } catch (error) {
      console.error('Error saving changes:', error);
    }
  };

  const deleteGallery = async () => {
    if (confirm("Are you sure you want to delete this gallery?")) {
      try {
        await fetch(
          "https://memories-gebqazega2facsa4.canadacentral-01.azurewebsites.net/api/memories/removeMemory",
          {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              memoryID: currentid
            }),
          }
        );
    
        console.log('Memory Deleted');
        router.push(`/allgalleries`);
      } catch (error) {
        console.error('Error deleting gallery:', error)
      }
    }
  }

  useEffect(() => {
      const storedUser = sessionStorage.getItem("user");
      if (!storedUser && !isLoggingOut) {
        router.push("/login"); // If no user, redirect to login
      } else {
        const userData = JSON.parse(storedUser);
        if (userData) {
          dispatch(setUser(userData)); // Set the Redux state if user data is available
      }
    }
  }, [router, isLoggingOut, dispatch]);

  useEffect(() => {
    if (user === null) return;

    // Fetch memory from the database
    const fetchMemory = async () => {
      try {
        const response = await fetch(`https://memories-gebqazega2facsa4.canadacentral-01.azurewebsites.net/api/memories/${currentid}`);
        const data = await response.json();
        console.log(data);
        if (data.name !== "") {
          setTitle(data.name);
          setNewTitle(data.name);
        }
        setLatitude(data.latitude);
        setNewLatitude(data.latitude);
        setLongitude(data.longitude);
        setNewLongitude(data.longitude);
        setOwner(data.creatorID);
        console.log("creatorID from API:", data.creatorID);
        console.log("user from Redux:", user);
        if (data.creatorID !== user.userID) router.push("/homePage");
        setCollaborators(data.collaborators);
      } catch (error) {
        console.error("Error fetching memory:", error);
      }
    };

    fetchMemory();
  }, [user, currentid]);


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 text-white p-8 relative">
      {/* Profile Picture */}
      <a href="/profile" className="absolute top-4 right-4">
        <img
          src="https://via.placeholder.com/50" // Replace this with the actual URL of the profile picture
          alt="Profile"
          className="w-12 h-12 rounded-full border-2 border-white shadow-lg hover:opacity-80 transition-opacity"
        />
      </a>

      {/* "The Memory" Text */}
      <div className="absolute top-4 left-4 text-2xl font-semibold text-white">
        The Memory
      </div>

      {/* Go Back Button */}
      <div className="absolute top-16 left-4">
        <button
          onClick={() => window.history.back()} // Go back to the previous page
          className="bg-white text-blue-600 py-2 px-6 rounded-full text-lg font-semibold shadow-lg hover:bg-gray-100 transition"
        >
          Go Back
        </button>
      </div>

      {/* Page Header */}
      <h1 className="text-4xl font-semibold mb-6 drop-shadow-lg">Gallery {currentid} Settings</h1>
      

      <div className="flex flex-col w-full max-w-4xl items-center space-x-8 space-y-8">
        <div className="flex w-full flex-col space-y-4">

            {/* Gallery Title */}
            <h2 className="text-2xl font-semibold drop-shadow-lg">Gallery Title</h2>
            <input
            type="text"
            placeholder={title}
            onChange={(e) => setNewTitle(e.target.value)}
            className="border border-gray-300 rounded px-4 py-2 w-full text-black"
            />

            {/* Gallery Coordinates */}
            <h2 className="text-2xl font-semibold drop-shadow-lg">Gallery Coordinates</h2>
            <div className="flex w-full space-x-4">

              {/* Latitude */}
              <div className="flex flex-col w-full">
                <h2 className="text-1xl font-semibold drop-shadow-lg">Latitude</h2>
                <input
                type="text"
                defaultValue={newLatitude}
                placeholder={latitude}
                onChange={(e) => setNewLatitude(e.target.value)}
                className="border border-gray-300 rounded px-4 py-2 w-full text-black"
                />
              </div>

              {/* Longitude */}
              <div className="flex flex-col w-full">
                <h2 className="text-1xl font-semibold drop-shadow-lg">Longitude</h2>
                <input
                type="text"
                defaultValue={newLongitude}
                placeholder={longitude}
                onChange={(e) => setNewLongitude(e.target.value)}
                className="border border-gray-300 rounded px-4 py-2 w-full text-black"
                />
              </div>
            </div>

            {/* Gallery Members */}
            <h2 className="text-2xl font-semibold drop-shadow-lg">Members</h2>
            <div className="w-full h-40 overflow-y-auto border border-white-300 rounded px-4 py-2 space-y-2 custom-scrollbar">
                
                {/* Owner */}
                <div className="flex justify-between items-center">
                    <span className="text-white">User {owner}</span>
                    <h3 className="px-4 py-2 text-center w-[190px]">Owner</h3>
                </div>

                {/* Original Collaborators */}
                {collaborators.filter(collaborator => !toRemove.includes(collaborator)).map((collaborator) => (
                <div className="flex justify-between items-center" key={`original-${collaborator}`}>
                    <span className="text-white">User {collaborator}</span>
                    <button 
                    className="border border-white px-4 py-2 rounded text-white text-center bg-transparent shadow-lg hover:bg-white hover:text-blue-600 transition"
                    onClick={() => setToRemove((prev) => (prev.includes(collaborator) ? prev : [...prev, collaborator]))}>
                        Remove Collaborator
                    </button>
                </div>
                ))}

                {/* Added Collaborators */}
                {newCollaborators.map((collaborator) => (
                <div className="flex justify-between items-center" key={`new-${collaborator}`}>
                    <span className="text-white">User {collaborator}</span>
                    <button 
                    className="border border-white px-4 py-2 rounded text-white text-center bg-transparent shadow-lg hover:bg-white hover:text-blue-600 transition"
                    onClick={() => setNewCollaborators(prev => prev.filter(c => c !== collaborator))}>
                        Remove Collaborator
                    </button>
                </div>
                ))}   
            </div>
            <button 
              className="bg-white text-blue-600 px-6 py-3 rounded text-lg font-semibold shadow-lg hover:bg-gray-100 transition"
              onClick={() => setShowAddCollaboratorsModal(true)}>
                Add Collaborators
            </button>

            {/* Save Changes and Cancel Buttons */}
            <div className="flex w-full space-x-4">
                <button className="w-1/2 bg-white text-blue-600 px-6 py-3 rounded text-lg font-semibold shadow-lg hover:bg-gray-100 transition" onClick={() => saveChanges()}>
                    Save Changes and Exit
                </button>
                <button className="w-1/2 bg-transparent text-white border border-white px-6 py-3 rounded text-lg font-semibold shadow-lg hover:bg-white hover:text-blue-600 transition" onClick={() => router.push(`/galleryview?memid=${currentid}`)}>
                    Exit Without Saving
                </button>
            </div>
        </div>

        <button className="self-end mt-2 bg-red-600 text-white px-4 py-2 text-sm rounded shadow hover:bg-red-700 transition" onClick={() => deleteGallery()}>
            Delete Gallery
        </button>


      </div>


      {showAddCollaboratorsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-purple-600 to-blue-500 text-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold drop-shadow-lg mb-4">Add Collaborators</h2>
            <input
              type="text"
              value={modalCollaborators}
              onChange={(e) => setModalCollaborators(e.target.value)}
              placeholder="Enter Collaborator IDs Seperated by Commas"
              className="w-full px-4 py-2 border border-gray-300 rounded text-black mb-4"
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  // Add collaborator logic
                  setNewCollaborators((prev) => [
                    ...new Set([
                      ...prev,
                      ...modalCollaborators
                        .split(",") // Split input by commas
                        .map((id) => id.trim()) // Trim any extra spaces around the IDs
                        .map((id) => parseInt(id)) // Convert to numbers
                        .filter((id) => !isNaN(id)), // Filter out any non-number values,
                    ])
                  ]);
                  setModalCollaborators("");
                  setShowAddCollaboratorsModal(false);
                  
                }}
                className="w-1/2 bg-white text-blue-600 px-6 py-3 rounded text-lg font-semibold shadow-lg hover:bg-gray-100 transition"
              >
                Add
              </button>
              <button
                onClick={() => {
                  setModalCollaborators("");
                  setShowAddCollaboratorsModal(false);
                }}
                className="w-1/2 bg-transparent text-white border border-white px-6 py-3 rounded text-lg font-semibold shadow-lg hover:bg-white hover:text-blue-600 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Footer (Copyright info) */}
      <footer className="absolute bottom-6 left-4 text-sm opacity-80 text-white">
        &copy; {new Date().getFullYear()} The Memory. All rights reserved.
      </footer>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`

        .custom-scrollbar {
            scrollbar-width: thin; /* Makes the scrollbar thinner */
            scrollbar-color: #4c6ef5 #f0f0f0; /* thumb color and track color */
        }
            
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px; /* Width of the scrollbar */
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #4c6ef5; /* Thumb color */
          border-radius: 10px; /* Rounded corners */
          transition: background-color 0.3s ease; /* Smooth transition for hover effect */
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #2b4ca1; /* Darker color on hover */
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f0f0f0; /* Track color */
          border-radius: 10px; /* Rounded corners */
        }
      `}</style>
    </div>
  );
}
