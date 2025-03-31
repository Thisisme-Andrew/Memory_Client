"use client"; // Add this to indicate this is a Client Component

import { useEffect, useState } from "react";

export default function CalgaryPage() {
  const [memories, setMemories] = useState([
    {
      memoryID: 22,
      creatorID: 47,
      longitude: "123.23000000000000",
      latitude: "-1.20000000000000",
      collaborators: [1, 49],
      imageURLs: [
        "https://seng513memory.blob.core.windows.net/images/1743429713485-4ywc19.jpg",
        "https://seng513memory.blob.core.windows.net/images/1743429713485-4ywc19.jpg",
        "https://seng513memory.blob.core.windows.net/images/1743429713485-4ywc19.jpg",
        "https://seng513memory.blob.core.windows.net/images/1743429713485-4ywc19.jpg",
        "https://seng513memory.blob.core.windows.net/images/1743429713485-4ywc19.jpg",
        "https://seng513memory.blob.core.windows.net/images/1743429713485-4ywc19.jpg",
        "https://seng513memory.blob.core.windows.net/images/1743429713485-4ywc19.jpg",
        "https://seng513memory.blob.core.windows.net/images/1743429713485-4ywc19.jpg",
        "https://seng513memory.blob.core.windows.net/images/1743429713485-4ywc19.jpg",
        "https://seng513memory.blob.core.windows.net/images/1743429713485-4ywc19.jpg",
        "https://seng513memory.blob.core.windows.net/images/1743429713485-4ywc19.jpg",
        "https://seng513memory.blob.core.windows.net/images/1743429713485-4ywc19.jpg",
        "https://seng513memory.blob.core.windows.net/images/1743402206714-D_h3eDiXYAE0daG.jpeg"
      ]
    },
    {
      memoryID: 23,
      creatorID: 47,
      longitude: "123.23000000000000",
      latitude: "-1.20000000000000",
      collaborators: [1, 49],
      imageURLs: [
        "https://seng513memory.blob.core.windows.net/images/1743429713485-4ywc19.jpg",
        "https://seng513memory.blob.core.windows.net/images/1743402206714-D_h3eDiXYAE0daG.jpeg"
      ]
    },
    {
      memoryID: 24,
      creatorID: 47,
      longitude: "-114.0719", // Calgary's Longitude
      latitude: "51.0447",   // Calgary's Latitude
      collaborators: [1, 49],
      imageURLs: [
        "https://seng513memory.blob.core.windows.net/images/1743429713485-4ywc19.jpg",
        "https://seng513memory.blob.core.windows.net/images/1743402206714-D_h3eDiXYAE0daG.jpeg"
      ]
    }
  ]);

  // Function to check if latitude and longitude are similar
  const areCoordinatesSimilar = (lat1, lon1, lat2, lon2, threshold = 0.1) => {
    const latDiff = Math.abs(lat1 - lat2);
    const lonDiff = Math.abs(lon1 - lon2);
    return latDiff < threshold && lonDiff < threshold;
  };

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
      <h1 className="text-4xl font-semibold mb-6 drop-shadow-lg">Calgary</h1>
      
      {/* Search Box */}
      <div className="bg-white text-blue-600 shadow-lg rounded-lg p-4 w-full max-w-lg text-center mb-6">
        <input
          type="text"
          placeholder="Search for something in Calgary..."
          className="w-full p-3 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Memory Galleries */}
      {memories.length > 0 &&
        memories.map((memory) => {
          // Extract coordinates for comparison
          const lat = parseFloat(memory.latitude);
          const lon = parseFloat(memory.longitude);

          // Check if this memory should be displayed based on the coordinates of memory 24 (Calgary)
          if (areCoordinatesSimilar(lat, lon, -1.20000000000000, 123.23000000000000)) {
            return (
              <div key={memory.memoryID} className="w-full mb-6">
                <h2 className="text-2xl font-semibold text-white mb-4 text-left w-full">
                  Memory ID: {memory.memoryID}
                </h2>
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
            );
          }

          return null; // Don't display this memory if coordinates are not similar
        })}
      
      {/* New Gallery Button */}
      <a
        href="#gallery-section"
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
