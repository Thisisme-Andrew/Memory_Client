"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default function CalgaryPage() {
  const router = useRouter();
  const [memories, setMemories] = useState([]);
  const mapContainerRef = useRef(null);
  const [map, setMap] = useState(null);

  useEffect(() => {
    const fetchMemories = async () => {
      try {
        const response = await fetch(
          "https://memories-gebqazega2facsa4.canadacentral-01.azurewebsites.net/api/memories/getAllWithCollaboratedByUser?userID=47"
        );
        const data = await response.json();

        // Merging both createdMemories and collaboratedMemories
        const allMemories = [
          ...(data.createdMemories || []),
          ...(data.collaboratedMemories || []),
        ];

        setMemories(allMemories);
      } catch (err) {
        console.error("Error fetching memories:", err);
      }
    };

    fetchMemories();
  }, []);

  useEffect(() => {
    const initializedMap = L.map(mapContainerRef.current, {
      center: [51.0447, -114.0719],
      zoom: 4,
      minZoom: 3,
      maxZoom: 10,
      worldCopyJump: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(initializedMap);

    setMap(initializedMap);

    return () => {
      initializedMap.remove();
    };
  }, []);

  useEffect(() => {
    if (map && memories.length) {
      const starIcon = L.divIcon({
        className: "leaflet-star-icon",
        html: '<div style="font-size: 32px; color: gold;">&#9733;</div>',
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      });

      memories.forEach((memory) => {
        const { memoryID, latitude, longitude } = memory;
        if (latitude && longitude) {
          const marker = L.marker([parseFloat(latitude), parseFloat(longitude)], { icon: starIcon })
            .bindPopup(`<b>Memory ID: ${memoryID}</b><br>Click to view`)
            .on("click", () => router.push(`/calgary?lat=${latitude}&lon=${longitude}`));

          marker.addTo(map);
        }
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
      <div className="absolute top-4 left-4 text-2xl font-semibold text-white">The Memory</div>
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
      {/* New Gallery Button */}
      <a
        href={`../newgallery`}
        className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white py-3 px-6 rounded-full text-lg font-semibold shadow-lg hover:bg-blue-700 transition duration-300"
      >
        New Gallery
      </a>
      <div className="absolute top-16 right-4">
      <a
        href={`../allgalleries`}
        className="bg-white text-blue-600 py-2 px-6 rounded-full text-lg font-semibold shadow-lg hover:bg-gray-100 transition">
        View All Galleries
      </a>
      </div>
    </div>
  );
}
