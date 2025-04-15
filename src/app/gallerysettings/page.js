"use client"; // Add this to indicate this is a Client Component

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function galleryview() {
  const searchParams = useSearchParams();
  const currentid = parseInt(searchParams.get("memid"));
  const [memories, setMemories] = useState([]);

  useEffect(() => {
    // Fetch memories from the database
    const fetchMemories = async () => {
      try {
        const response = await fetch("https://memories-gebqazega2facsa4.canadacentral-01.azurewebsites.net/api/memories/getAllByUser?creatorID=47");
        const data = await response.json();
        setMemories(data);
      } catch (error) {
        console.error("Error fetching memories:", error);
      }
    };

    fetchMemories();
  }, []);

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

      {console.log("memory is", memories.length)}
      

      {/* Main Image Section */}
      <div className="flex flex-col w-full max-w-4xl items-center space-x-8 space-y-8">
        {/* Left Sidebar (Buttons) */}
        <div className="flex w-full flex-col space-y-4">

            {/* Gallery Title */}
            <h2 className="text-2xl font-semibold drop-shadow-lg">Gallery Title</h2>
            <input
            type="text"
            placeholder="Title"
            className="border border-gray-300 rounded px-4 py-2 w-full text-black"
            />

            {/* Gallery Members */}
            <h2 className="text-2xl font-semibold drop-shadow-lg">Members</h2>
            <div className="w-full h-40 overflow-y-auto border border-white-300 rounded px-4 py-2 space-y-2 custom-scrollbar">
                {/* Row 1 */}
                <div className="flex justify-between items-center">
                    <span className="text-white">bobby@gmail.com</span>
                    <select className="border border-white-300 px-4 py-2 rounded text-white text-center bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-400">
                        <option className="text-black">Admin</option>
                        <option className="text-black">Collaborator</option>
                        <option className="text-black">Remove Member</option>
                    </select>
                </div>

                {/* Row 2 */}
                <div className="flex justify-between items-center">
                    <span className="text-white">gmail@bobby.com</span>
                    <select className="border border-white px-4 py-2 rounded text-white text-center bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-400">
                        <option className="text-black">Admin</option>
                        <option className="text-black">Collaborator</option>
                        <option className="text-black">Remove Member</option>
                    </select>
                </div>

                {/* Row 3 */}
                <div className="flex justify-between items-center">
                    <span className="text-white">com@bobby.gmail</span>
                    <select className="border border-white px-4 py-2 rounded text-white text-center bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-400">
                        <option className="text-black">Admin</option>
                        <option className="text-black">Collaborator</option>
                        <option className="text-black">Remove Member</option>
                    </select>
                </div>

                {/* Row 4 */}
                <div className="flex justify-between items-center">
                    <span className="text-white">bobby@com.gmail</span>
                    <select className="border border-white px-4 py-2 rounded text-white text-center bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-400">
                        <option className="text-black">Admin</option>
                        <option className="text-black">Collaborator</option>
                        <option className="text-black">Remove Member</option>
                    </select>
                </div>       
            </div>
            <button className="bg-white text-blue-600 px-6 py-3 rounded text-lg font-semibold shadow-lg hover:bg-gray-100 transition">
                Add Member
            </button>

            {/* Save Changes and Cancel Buttons */}
            <div className="flex w-full space-x-4">
                <button className="w-1/2 bg-white text-blue-600 px-6 py-3 rounded text-lg font-semibold shadow-lg hover:bg-gray-100 transition">
                    Save Changes
                </button>
                <button className="w-1/2 bg-transparent text-white border border-white px-6 py-3 rounded text-lg font-semibold shadow-lg hover:bg-white hover:text-blue-600 transition">
                    Cancel
                </button>
            </div>
        </div>

        <button className="self-end mt-2 bg-red-600 text-white px-4 py-2 text-sm rounded shadow hover:bg-red-700 transition">
            Delete Gallery
        </button>


      </div>

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
