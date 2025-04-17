"use client"; // Ensures this component is only rendered client-side

import { MapContainer, TileLayer } from "react-leaflet";
import { useState, useEffect } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet"; // Import Leaflet directly to use its methods

export default function Home() {
  const [clickedLocation, setClickedLocation] = useState(null);
  const [mapInstance, setMapInstance] = useState(null);
  const [isClient, setIsClient] = useState(false); // Add state to track client-side rendering

  // Function to handle map click event
  const handleMapClick = (event) => {
    if (mapInstance) {
      mapInstance.dragging.disable(); // Disable map dragging on click
    }
    setClickedLocation(event.latlng); // Set clicked coordinates
  };

  // Initialize the map instance and set it to state
  const handleMapCreated = (map) => {
    setMapInstance(map);
  };

  useEffect(() => {
    // Only run this effect on the client-side
    setIsClient(true);
  }, []);

  if (!isClient) {
    // Return null or a loading component if the component is rendered on the server
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-4">The Memory - Explore Your Memories</h1>
      <div className="relative flex items-center justify-center w-full h-[500px] max-w-4xl">
        {/* Left side image */}
        <div
          className="absolute left-0"
          style={{
            top: "50%",
            transform: "translateY(-50%)",
            width: "150px", // Adjust width of the image
            height: "150px", // Adjust height of the image
            backgroundColor: "#e0e0e0", // Placeholder background
          }}
        >
          {/* Placeholder image on the left */}
          <div className="w-full h-full flex justify-center items-center text-lg">Left Image</div>
        </div>

        {/* Map Container */}
        <MapContainer
          center={[37.7749, -122.4194]} // Default location (San Francisco, change as needed)
          zoom={10}
          scrollWheelZoom={true}
          className="w-full h-full rounded-lg shadow-lg"
          onClick={handleMapClick}
          whenCreated={handleMapCreated} // Get map instance after it's created
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
        </MapContainer>

        {/* Right side image */}
        <div
          className="absolute right-0"
          style={{
            top: "50%",
            transform: "translateY(-50%)",
            width: "150px", // Adjust width of the image
            height: "150px", // Adjust height of the image
            backgroundColor: "#e0e0e0", // Placeholder background
          }}
        >
          {/* Placeholder image on the right */}
          <div className="w-full h-full flex justify-center items-center text-lg">Right Image</div>
        </div>

        {/* Display images outside the map when clicked */}
        {clickedLocation && (
          <div
            className="absolute"
            style={{
              top: `calc(50% - 50px)`, // Center vertically
              left: `calc(50% + 200px)`, // Position outside to the right
              transform: "translate(-50%, -50%)",
            }}
          >
            {/* Placeholder images */}
            <div className="w-40 h-40 bg-gray-300 mb-4">Placeholder 1</div>
            <div className="w-40 h-40 bg-gray-300 mb-4">Placeholder 2</div>
            <div className="w-40 h-40 bg-gray-300">Placeholder 3</div>
          </div>
        )}
      </div>
    </div>
  );
}
