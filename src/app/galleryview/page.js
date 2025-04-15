"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function GalleryView() {
  const searchParams = useSearchParams();
  const currentid = parseInt(searchParams.get("memid"));
  const [memories, setMemories] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchMemories = async () => {
      try {
        const response = await fetch("https://memories-gebqazega2facsa4.canadacentral-01.azurewebsites.net/api/memories/getAllByUser?creatorID=47");
        const data = await response.json();
        setMemories(data);

        const memory = data.find((m) => m.memoryID === currentid);
        if (memory && memory.imageURLs.length > 0) {
          setSelectedImage(memory.imageURLs[0]);
        }
      } catch (error) {
        console.error("Error fetching memories:", error);
      }
    };

    fetchMemories();
  }, [currentid]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 text-white p-8 relative overflow-x-hidden">
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

      <h1 className="text-4xl font-semibold mb-6 drop-shadow-lg">Gallery {currentid}</h1>

      <div className="flex w-full max-w-6xl items-start space-x-8 overflow-x-hidden flex-wrap">
        {/* Sidebar Buttons */}
        <div className="flex flex-col space-y-4">
          <button className="bg-transparent border-2 border-white text-white py-2 px-4 rounded-lg shadow-lg hover:bg-white hover:text-blue-600 transition">
            Add Images
          </button>
          <button className="bg-transparent border-2 border-white text-white py-2 px-4 rounded-lg shadow-lg hover:bg-white hover:text-blue-600 transition">
            Remove Images
          </button>
          <button className="bg-transparent border-2 border-white text-white py-2 px-4 rounded-lg shadow-lg hover:bg-white hover:text-blue-600 transition">
            Gallery Settings
          </button>
          <button className="bg-transparent border-2 border-white text-white py-2 px-4 rounded-lg shadow-lg hover:bg-white hover:text-blue-600 transition">
            Share Gallery
          </button>
        </div>

        {/* Main Content */}
        {memories.length > 0 &&
          memories.map((memory) => {
            if (memory.memoryID === currentid) {
              return (
                <div key={memory.memoryID} className="flex space-x-2 overflow-x-hidden">
                  {/* Main Selected Image */}
                  <div className="w-[500px] h-[500px] rounded-lg shadow-xl border-4 border-white flex items-center justify-center bg-white">
                    {selectedImage && (
                      <img
                        src={selectedImage}
                        alt="Selected Memory"
                        className="object-contain max-w-full max-h-full rounded-lg"
                      />
                    )}
                  </div>

                  {/* Scrollable Thumbnails */}
                  <div className="w-40 h-[500px]">
                    <div className="space-y-4">
                      {memory.imageURLs.map((url, index) => (
                        <img
                          key={index}
                          src={url}
                          alt={`Thumbnail ${index}`}
                          onClick={() => setSelectedImage(url)}
                          className={`w-full h-24 rounded-lg border-2 shadow-md cursor-pointer transition-transform duration-200 ${
                            selectedImage === url ? "border-yellow-400 scale-105" : "border-white"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              );
            }
            return null;
          })}
      </div>

      <footer className="absolute bottom-6 left-4 text-sm opacity-80 text-white">
        &copy; {new Date().getFullYear()} The Memory. All rights reserved.
      </footer>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #4c6ef5;
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #2b4ca1;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f0f0f0;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}
