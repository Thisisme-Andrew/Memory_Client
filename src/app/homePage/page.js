"use client";

import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { logoutUser, setUser } from "../redux/store.js";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("./map.js"), {
  ssr: false,
})

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

          let created = [];
          let collaborated = [];

          try {
            created = [...data.createdMemories];
          } catch (err) {
            created = [];
          }

          try {
            collaborated = [...data.collaboratedMemories];
          } catch (err) {
            collaborated = [];
          }

          const allMemories = [
            ...created,
            ...collaborated,
          ];

          setMemories(allMemories);
        } catch (err) {
          console.error("Error fetching memories:", err);
        }
      };

      fetchMemories();
    }
  }, [user?.userID]);

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
          onClick={() => router.push("/allgalleries")}
          className="bg-white text-blue-600 py-1.5 px-4 sm:py-2 sm:px-6 rounded-full text-sm sm:text-lg font-semibold shadow-lg hover:bg-gray-100 transition"
        >
          List View
        </button>
      </div>

      {/* Heading */}
      <h1 className="text-2xl sm:text-4xl font-semibold mb-4 sm:mb-6 drop-shadow-lg text-center">
        Galleries
      </h1>

      {/* Map */}
      <Map
        memories={memories}
        onMarkerClick={(id) => router.push(`/galleryview?memid=${id}`)}
      />

      {/* New Gallery Button */}
      <a
        href="../newgallery"
        className="fixed bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white py-2 px-4 sm:py-3 sm:px-6 rounded-full text-sm sm:text-lg font-semibold shadow-lg hover:bg-blue-700 transition duration-300"
      >
        New Gallery
      </a>
    </div>
  );
}
