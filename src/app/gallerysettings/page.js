"use client"; // Add this to indicate this is a Client Component

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function gallerysettings() {
  const router = useRouter();

  // Get the memory ID (memid) from the URL using router.query
  const { memid } = router.query;

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
            memoryID: memid,
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
            memoryID: memid,
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
            memoryID: memid,
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
            memoryID: memid,
            collaborators: newCollaborators
          }),
        }
      );

      console.log('Collaborators Added');
      router.push(`/galleryview?memid=${memid}`);
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
              memoryID: memid
            }),
          }
        );

        console.log('Memory Deleted');
        router.push(`/allgalleries`);
      } catch (error) {
        console.error('Error deleting gallery:', error);
      }
    }
  };

  useEffect(() => {
    if (!memid) return; // Wait until memid is available

    // Fetch memory from the database
    const fetchMemory = async () => {
      try {
        const response = await fetch(`https://memories-gebqazega2facsa4.canadacentral-01.azurewebsites.net/api/memories/${memid}`);
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
        setCollaborators(data.collaborators);
      } catch (error) {
        console.error("Error fetching memory:", error);
      }
    };

    fetchMemory();
  }, [memid]); // Use memid as a dependency to refetch if it changes

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
      <h1 className="text-4xl font-semibold mb-6 drop-shadow-lg">Gallery {memid} Settings</h1>

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
              className="bg-blue-600 py-2 px-8 rounded-full text-lg font-semibold shadow-lg hover:bg-blue-500 transition"
              onClick={() => setShowAddCollaboratorsModal(true)}>
              Add Collaborator
            </button>

            {/* Modal for Adding Collaborators */}
            {showAddCollaboratorsModal && (
            <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white rounded-lg p-8 space-y-4">
                <h3 className="text-2xl font-semibold">Add Collaborator</h3>
                <input 
                    type="text" 
                    placeholder="Enter User ID"
                    onChange={(e) => setModalCollaborators([e.target.value])}
                    className="border border-gray-300 rounded px-4 py-2 w-full"
                />
                <div className="flex justify-end space-x-4">
                <button 
                    className="bg-red-600 text-white py-2 px-6 rounded-full text-lg font-semibold hover:bg-red-500 transition"
                    onClick={() => setShowAddCollaboratorsModal(false)}>
                    Cancel
                </button>
                <button 
                    className="bg-blue-600 text-white py-2 px-6 rounded-full text-lg font-semibold hover:bg-blue-500 transition"
                    onClick={() => {
                    setNewCollaborators(prev => [...prev, ...modalCollaborators]);
                    setShowAddCollaboratorsModal(false);
                    }}>
                    Add
                </button>
                </div>
                </div>
            </div>
            )}

            {/* Save and Delete Buttons */}
            <div className="flex justify-between w-full mt-6">
                <button 
                  onClick={deleteGallery}
                  className="bg-red-600 text-white py-2 px-8 rounded-full text-lg font-semibold shadow-lg hover:bg-red-500 transition">
                  Delete Gallery
                </button>
                <button 
                  onClick={saveChanges}
                  className="bg-blue-600 text-white py-2 px-8 rounded-full text-lg font-semibold shadow-lg hover:bg-blue-500 transition">
                  Save Changes
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}
