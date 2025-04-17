"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router"; // Use next/router to access query parameters
import { Suspense } from "react";

export default function MemoryPage() {
  const router = useRouter();
  const { lat, lon } = router.query; // Extract lat and lon from query params
  
  const latM = parseFloat(lat) || 0;
  const lonM = parseFloat(lon) || 0;

  const [createdMemories, setCreatedMemories] = useState([]);
  const [collaboratedMemories, setCollaboratedMemories] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // State for search input
  const [filteredMemories, setFilteredMemories] = useState([]); // State for filtered memories
  const [userLocation, setUserLocation] = useState({ lat: 0, lon: 0 }); // State for user's location
  const [loading, setLoading] = useState(true); // State for loading status

  useEffect(() => {
    const fetchMemories = async () => {
      try {
        const response = await fetch(
          "https://memories-gebqazega2facsa4.canadacentral-01.azurewebsites.net/api/memories/getAllWithCollaboratedByUser?userID=47"
        );
        const data = await response.json();

        // Filter created and collaborated memories based on proximity
        const closeCreatedMemories = data.createdMemories.filter((memory) =>
          areCoordinatesSimilar(parseFloat(memory.latitude), parseFloat(memory.longitude), latM, lonM)
        );

        const closeCollaboratedMemories = data.collaboratedMemories.filter((memory) =>
          areCoordinatesSimilar(parseFloat(memory.latitude), parseFloat(memory.longitude), latM, lonM)
        );

        setCreatedMemories(closeCreatedMemories);
        setCollaboratedMemories(closeCollaboratedMemories);
      } catch (error) {
        console.error("Error fetching memories:", error);
      } finally {
        setLoading(false); // Set loading to false after data is fetched
      }
    };

    fetchMemories();
  }, [latM, lonM]);

  // Function to check if two coordinates are close
  const areCoordinatesSimilar = (lat1, lon1, lat2, lon2, threshold = 2) => {
    if (isNaN(lat1) || isNaN(lon1) || isNaN(lat2) || isNaN(lon2)) return false;
    const latDiff = Math.abs(lat1 - lat2);
    const lonDiff = Math.abs(lon1 - lon2);
    return latDiff < threshold && lonDiff < threshold;
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter memories by memoryID based on search query
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
      setFilteredMemories([]); // Reset search if query is empty
    }
  }, [searchQuery, createdMemories, collaboratedMemories]);

  // Get user's current location using geolocation
  useEffect(() => {
    if (latM === 0 && lonM === 0) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setUserLocation({ lat: latitude, lon: longitude });
          },
          (error) => {
            console.error("Error getting location", error);
            // Default to a specific location if geolocation fails
            setUserLocation({ lat: 0, lon: 0 });
          }
        );
      }
    } else {
      setUserLocation({ lat: latM, lon: lonM });
    }
  }, [latM, lonM]);

  // Render memory section
  const renderMemories = (memories, title) => (
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
    )
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 text-white p-8 relative">
      {/* Profile Picture */}
      <a href="/profile" className="absolute top-4 right-4">
        <img
          src="https://via.placeholder.com/50"
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
          onClick={() => window.history.back()}
          className="bg-white text-blue-600 py-2 px-6 rounded-full text-lg font-semibold shadow-lg hover:bg-gray-100 transition"
        >
          Go Back
        </button>
      </div>

      {/* Page Header */}
      <h1 className="text-4xl font-semibold mb-6 drop-shadow-lg">
        Memories Around You
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

      {/* Display Loading Spinner */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
        </div>
      )}

      {/* Display User's Location */}
      <p className="text-white mb-4">
        <strong>Your Location:</strong> Latitude: {userLocation.lat}, Longitude: {userLocation.lon}
      </p>

      {/* Memory Sections */}
      {searchQuery.trim() === "" ? (
        <>
          {renderMemories(createdMemories, "Your Memories")}
          {renderMemories(collaboratedMemories, "Collaborated Memories")}
        </>
      ) : (
        <>
          {filteredMemories.length === 0 ? (
            <p className="text-lg text-white">No matching memory found for ID: {searchQuery}</p>
          ) : (
            renderMemories(filteredMemories, "Search Results")
          )}
        </>
      )}

      {/* New Gallery Button */}
      <a
        href={`../newgallery`}
        className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white py-3 px-6 rounded-full text-lg font-semibold shadow-lg hover:bg-blue-700 transition duration-300"
      >
        New Gallery
      </a>

      {/* Footer (Copyright info) */}
      <footer className="absolute bottom-6 left-4 text-sm opacity-80 text-white">
        &copy; {new Date().getFullYear()} The Memory. All rights reserved.
      </footer>
    </div>
  );
}
