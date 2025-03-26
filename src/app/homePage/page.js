"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css"; // Import Leaflet styles

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
    const starIcon = L.divIcon({
      className: 'leaflet-star-icon', // Assign a custom class name
      html: '<div style="font-size: 32px; color: gold; transform: rotate(0deg);">&#9733;</div>', // HTML for a star
      iconSize: [40, 40], // Icon size
      iconAnchor: [20, 20], // Anchor the icon at the center
    });

    // Add the marker with the custom star icon
    const calgaryMarker = L.marker([51.0447, -114.0719], { icon: starIcon }).addTo(map)
      .bindPopup("<b>Calgary</b><br>Click to visit Calgary page");
    
    const londonMarker = L.marker([51.5, -0.09], { icon: starIcon }).addTo(map)
      .bindPopup("<b>London</b><br>Click to visit London page");

    // Add click event on the marker to redirect to /calgary/page.js
    calgaryMarker.on('click', () => {
      router.push('/calgary');
    });

    londonMarker.on('click', () => {
      router.push('/calgary');
    });

    // Cleanup the map instance on unmount
    return () => {
      map.remove();
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 p-8">
      <h1 className="text-4xl font-bold text-white mb-6 drop-shadow-lg">Welcome to The Memory</h1>

      {/* "View My Galleries" Button in the top left */}
      <button
  onClick={() => router.push('/gallery')} // Navigate to the gallery page
  className="absolute top-4 left-4 bg-white text-blue-600 py-2 px-6 rounded-full hover:bg-gray-100 hover:text-blue-700 transition duration-300"
>
  View My Galleries
</button>


      {/* Google Maps Container */}
      <div
        id="map"
        ref={mapContainerRef}
        className="w-full max-w-3xl mt-8 rounded-lg shadow-lg"
        style={{ height: "400px" }}
      ></div>

      {/* Footer */}
      <footer className="absolute bottom-4 left-4 text-sm text-white opacity-80">
        &copy; {new Date().getFullYear()} The Memory. All rights reserved.
      </footer>
    </div>
  );
}
