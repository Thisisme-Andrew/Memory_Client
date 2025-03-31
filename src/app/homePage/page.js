"use client"; // Add this to indicate this is a Client Component

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import L from "leaflet";
import "leaflet/dist/leaflet.css"; // Import Leaflet styles

export default function CalgaryPage() {
  const router = useRouter();
  const [memories, setMemories] = useState([
    {
      memoryID: 22,
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
      memoryID: 23,
      creatorID: 47,
      longitude: "120.50000000000000",  // Moved marker to a different longitude
      latitude: "-2.50000000000000",  // Adjusted latitude slightly
      collaborators: [1, 49],
      imageURLs: [
        "https://seng513memory.blob.core.windows.net/images/1743429713485-4ywc19.jpg",
        "https://seng513memory.blob.core.windows.net/images/1743402206714-D_h3eDiXYAE0daG.jpeg"
      ]
    },
    // Adding Calgary as a memory
    {
      memoryID: 24,
      creatorID: 47,
      longitude: "-114.0719", // Calgary Longitude
      latitude: "51.0447",   // Calgary Latitude
      collaborators: [1, 49],
      imageURLs: [
        "https://seng513memory.blob.core.windows.net/images/1743429713485-4ywc19.jpg",
        "https://seng513memory.blob.core.windows.net/images/1743402206714-D_h3eDiXYAE0daG.jpeg"
      ]
    }
  ]);

  const mapContainerRef = useRef(null);
  const [map, setMap] = useState(null);

  useEffect(() => {
    const initializedMap = L.map(mapContainerRef.current, {
      center: [51.0447, -114.0719],  // Centered on Calgary
      zoom: 4,
      minZoom: 3, // Minimum zoom level
      maxZoom: 10, // Maximum zoom level
      worldCopyJump: true
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(initializedMap);

    setMap(initializedMap); // Set the map state to persist across renders

    // Cleanup the map when the component is unmounted
    return () => {
      initializedMap.remove();
    };
  }, []);

  useEffect(() => {
    if (map) {
      const starIcon = L.divIcon({
        className: 'leaflet-star-icon',
        html: '<div style="font-size: 32px; color: gold;">&#9733;</div>',
        iconSize: [40, 40],
        iconAnchor: [20, 20]
      });

      // Loop through the memories and create their markers
      memories.forEach(memory => {
        const marker = L.marker([parseFloat(memory.latitude), parseFloat(memory.longitude)], { icon: starIcon })
          .bindPopup(`<b>Memory ID: ${memory.memoryID}</b><br>Click to view`)
          .on('click', () => {
            router.push('/calgary'); // Redirects to the Calgary page
          });

        marker.addTo(map); // Add the memory markers to the map
      });
    }
  }, [memories, map, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 text-white p-8 relative">
      <a href="/profile" className="absolute top-4 right-4">
        <img
          src="https://via.placeholder.com/50"
          alt="Profile"
          className="w-12 h-12 rounded-full border-2 border-white shadow-lg hover:opacity-80 transition-opacity"
        />
      </a>
      <div className="absolute top-4 left-4 text-2xl font-semibold text-white">
        The Memory
      </div>
      <div className="absolute top-16 left-4">
        <button
          onClick={() => window.history.back()}
          className="bg-white text-blue-600 py-2 px-6 rounded-full text-lg font-semibold shadow-lg hover:bg-gray-100 transition"
        >
          Go Back
        </button>
      </div>
      <h1 className="text-4xl font-semibold mb-6 drop-shadow-lg">Memory</h1>
      <div ref={mapContainerRef} className="w-full max-w-3xl h-96 rounded-lg shadow-lg mb-6"></div>
    </div>
  );
}
