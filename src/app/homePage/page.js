"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css"; // Import Leaflet styles
//import "leaflet-google"; // Import leaflet-google plugin
//import "leaflet-tilelayer-google"

export default function Home() {
  const router = useRouter();
  const mapContainerRef = useRef(null); // Ref for the map container

  useEffect(() => {
    // Initialize the map once the component is mounted
    const map = L.map(mapContainerRef.current).setView([51.505, -0.09], 13); // Change the coordinates to where you want to center the map

    // Set up the Google Maps layer
    L.tileLayer(
      "https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
      {
        attribution:
          'Map data &copy; <a href="https://www.google.com/intl/en_us/help/terms_maps.html">Google</a>',
        subdomains: ["mt0", "mt1", "mt2", "mt3"], // Google Map subdomains
      }
    ).addTo(map);

    // Add a marker on the map (optional)
    L.marker([51.5, -0.09]).addTo(map).bindPopup("<b>Hello world!</b>").openPopup();
    const calgaryMarker = L.marker([51.0447, -114.0719]).addTo(map).bindPopup("<b>Calgary</b><br>Click to visit Calgary page");

    // Add click event on the marker to redirect to /calgary/page.js
    calgaryMarker.on('click', () => {
      router.push('/calgary');
    });

    // Cleanup the map instance on unmount
    return () => {
      map.remove();
    };
  }, []);

  // Optionally, you can add a redirect in case the user isn't logged in
  useEffect(() => {
    // You could check the user state here and redirect if not logged in
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-semibold text-gray-800 mb-4">Welcome to the Home Page!</h1>
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-sm text-center">
        <p className="text-gray-500 mb-4">This is the main page of your application.</p>
        <button
          onClick={() => router.push("/profile")} // Navigate back to the profile page
          className="bg-blue-500 text-white py-2 px-6 rounded hover:bg-blue-600 transition"
        >
          Go to Profile
        </button>
      </div>

      {/* Google Maps Container */}
      <div
        id="map"
        ref={mapContainerRef}
        style={{ width: "100%", height: "400px", marginTop: "20px" }}
      ></div>
    </div>
  );
}
