"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function MemoryPage() {
  const [isClient, setIsClient] = useState(false); // State to check if we're on the client-side
  const [latM, setLatM] = useState(0);
  const [lonM, setLonM] = useState(0);
  
  const router = useRouter();
  
  // Ensure useRouter only runs on the client side
  useEffect(() => {
    setIsClient(true); // Set the client-side flag to true once mounted
  }, []);

  useEffect(() => {
    if (isClient) {
      const { lat, lon } = router.query;
      setLatM(parseFloat(lat) || 0);
      setLonM(parseFloat(lon) || 0);
    }
  }, [router.query, isClient]);

  const [createdMemories, setCreatedMemories] = useState([]);
  const [collaboratedMemories, setCollaboratedMemories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredMemories, setFilteredMemories] = useState([]);
  const [userLocation, setUserLocation] = useState({ lat: 0, lon: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMemories = async () => {
      try {
        const response = await fetch(
          "https://memories-gebqazega2facsa4.canadacentral-01.azurewebsites.net/api/memories/getAllWithCollaboratedByUser?userID=47"
        );
        const data = await response.json();

        const closeCreatedMemories = data.createdMemories;
        const closeCollaboratedMemories = data.collaboratedMemories;

        setCreatedMemories(closeCreatedMemories);
        setCollaboratedMemories(closeCollaboratedMemories);
      } catch (error) {
        console.error("Error fetching memories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMemories();
  }, [latM, lonM]);

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
            setUserLocation({ lat: 0, lon: 0 });
          }
        );
      }
    } else {
      setUserLocation({ lat: latM, lon: lonM });
    }
  }, [latM, lonM]);

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
    isClient && (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 text-white p-8 relative">
        {/* Rest of your JSX content */}
      </div>
    )
  );
}
