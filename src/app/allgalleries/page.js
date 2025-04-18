"use client";

import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { logoutUser, setUser } from "../redux/store.js";

export default function MemoryPage() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const latM = parseFloat(searchParams.get("lat")) || 0;
  const lonM = parseFloat(searchParams.get("lon")) || 0;
  const [createdMemories, setCreatedMemories] = useState([]);
  const [collaboratedMemories, setCollaboratedMemories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredMemories, setFilteredMemories] = useState([]);
  const [loading, setLoading] = useState(true);

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

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
      const fetchMemories = async () => {
        try {
          const response = await fetch(
            `https://memories-gebqazega2facsa4.canadacentral-01.azurewebsites.net/api/memories/getAllWithCollaboratedByUser?userID=${user.userID}`
          );
          const data = await response.json();

          setCreatedMemories(data.createdMemories);
          setCollaboratedMemories(data.collaboratedMemories);
        } catch (error) {
          console.error("Error fetching memories:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchMemories();
    }
  }, [latM, lonM, user?.userID]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    if (searchQuery.trim() !== "") {
      const searchMemoryID = parseInt(searchQuery);
      const filteredCreatedMemories = createdMemories.filter(
        (memory) => memory.memoryID === searchMemoryID
      );
      const filteredCollaboratedMemories = collaboratedMemories.filter(
        (memory) => memory.memoryID === searchMemoryID
      );
      setFilteredMemories([
        ...filteredCreatedMemories,
        ...filteredCollaboratedMemories,
      ]);
    } else {
      setFilteredMemories([]);
    }
  }, [searchQuery, createdMemories, collaboratedMemories]);

  const renderMemories = (memories, title) =>
    memories.length > 0 && (
      <div className="w-full max-w-2xl mb-10">
        <h2 className="text-2xl font-semibold mb-4">{title}</h2>
        {memories.map((memory) => (
          <div key={memory.memoryID} className="w-full mb-6">
            <a
              className="text-2xl font-semibold text-white mb-4 text-left w-full"
              href={`../galleryview?memid=${memory.memoryID}`}
            >
              Memory ID: {memory.memoryID}
            </a>
            <div className="w-full overflow-x-auto custom-scrollbar">
              <div className="flex space-x-4 min-w-max">
                {memory.imageURLs.map((url, index) => (
                  <img
                    key={index}
                    src={url}
                    alt={`Memory ${memory.memoryID} - Image ${index}`}
                    className="w-48 h-48 rounded-lg shadow-lg border-2 border-white"
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 text-white p-8 relative">
      {/* Initials Badge */}
      <a href="/profile" className="absolute top-4 right-4">
        <div className="w-12 h-12 bg-white text-blue-600 rounded-full flex items-center justify-center font-bold text-lg shadow-lg border-2 border-white hover:opacity-80 transition-opacity">
          {getInitials(user?.fullName)}
        </div>
      </a>

      {/* "The Memory" Text */}
      <div className="absolute top-4 left-4 text-2xl font-semibold text-white">
        The Memory
      </div>

      {/* Go Back Button */}
      <div className="absolute top-16 left-4">
        <button
          onClick={() => window.history.back()}
          className="bg-white text-blue-600 py-2 px-6 rounded-full text-lg font-semibold shadow-lg hover:bg-gray-100 transition"
        >
          Go Back
        </button>
      </div>

      <h1 className="text-4xl font-semibold mb-6 drop-shadow-lg">
        All Memories
      </h1>

      {/* Search Box */}
      <div className="bg-white text-blue-600 shadow-lg rounded-lg p-4 w-full max-w-lg text-center mb-6">
        <input
          type="text"
          placeholder="Search by Memory ID..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full p-3 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
        </div>
      )}

      {searchQuery.trim() === "" ? (
        <>
          {renderMemories(createdMemories, "Your Memories")}
          {renderMemories(collaboratedMemories, "Collaborated Memories")}
        </>
      ) : filteredMemories.length === 0 ? (
        <p className="text-lg text-white">
          No matching memory found for ID: {searchQuery}
        </p>
      ) : (
        renderMemories(filteredMemories, "Search Results")
      )}

      {/* New Gallery Button */}
      <a
        href={`../newgallery`}
        className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white py-3 px-6 rounded-full text-lg font-semibold shadow-lg hover:bg-blue-700 transition duration-300"
      >
        New Gallery
      </a>

      {/* Footer */}
      <footer className="absolute bottom-6 left-4 text-sm opacity-80 text-white">
        &copy; {new Date().getFullYear()} The Memory. All rights reserved.
      </footer>
    </div>
  );
}
