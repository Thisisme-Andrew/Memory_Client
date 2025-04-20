"use client";

import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { logoutUser, setUser } from "../redux/store.js";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default function CalgaryPage() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();
  const [memories, setMemories] = useState([]);
  const mapContainerRef = useRef(null);
  const [map, setMap] = useState(null);

  // Helper to extract initials from full name
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
    }
  }, [user?.userID]);

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
        const { memoryID, latitude, longitude, name } = memory;
        if (latitude && longitude) {
          const marker = L.marker(
            [parseFloat(latitude), parseFloat(longitude)],
            { icon: starIcon }
          )
            .bindTooltip(`<b>${name}</b><br>Click to view`)
            .on("click", () =>
              router.push(`/galleryview?memid=${memoryID}`)
            );

          marker.addTo(map);
        }
      });
    }
  }, [memories, map, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 text-white p-4 sm:p-8 relative">

      {/* Initials Avatar Link to Profile */}
      <a href="/profile" className="absolute top-4 right-4">
        <div className="w-9 h-9 sm:w-12 sm:h-12 bg-white text-blue-600 rounded-full flex items-center justify-center font-bold text-sm sm:text-lg shadow-lg border-2 border-white hover:opacity-80 transition-opacity">
          {getInitials(user?.fullName)}
        </div>
      </a>

      {/* Page Title */}
      <div className="absolute top-4 left-4 text-lg sm:text-2xl font-semibold text-white">
        The Memory
      </div>

      {/* Back Button */}
      <div className="absolute top-14 sm:top-16 left-4">
        <button
          onClick={() => window.history.back()}
          className="bg-white text-blue-600 py-1.5 px-4 sm:py-2 sm:px-6 rounded-full text-sm sm:text-lg font-semibold shadow-lg hover:bg-gray-100 transition"
        >
          Go Back
        </button>
      </div>

      {/* Heading */}
      <h1 className="text-2xl sm:text-4xl font-semibold mb-4 sm:mb-6 drop-shadow-lg text-center">
        Memory
      </h1>

      {/* Map */}
      <div
        ref={mapContainerRef}
        className="w-full h-64 sm:h-96 max-w-full sm:max-w-3xl rounded-lg shadow-lg mb-6"
      ></div>

      {/* New Gallery Button */}
      <a
        href="../newgallery"
        className="fixed bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white py-2 px-4 sm:py-3 sm:px-6 rounded-full text-sm sm:text-lg font-semibold shadow-lg hover:bg-blue-700 transition duration-300"
      >
        New Gallery
      </a>

      {/* View All Galleries Button */}
      <div className="absolute top-14 sm:top-20 right-4">
        <a
          href="../allgalleries"
          className="bg-white text-blue-600 py-1.5 px-4 sm:py-2 sm:px-6 rounded-full text-sm sm:text-lg font-semibold shadow-lg hover:bg-gray-100 transition"
        >
          View All Galleries
        </a>
      </div>
    </div>
  );
}
