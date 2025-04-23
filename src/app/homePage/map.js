"use client";
import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default function MapComponent({ memories, onMarkerClick }) {
  const mapRef = useRef(null);

  useEffect(() => {
    const map = L.map(mapRef.current, {
      center: [51.0447, -114.0719],
      zoom: 4,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    const starIcon = L.divIcon({
      className: "leaflet-star-icon",
      html: '<div style="font-size: 32px; color: gold;">&#9733;</div>',
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    });

    memories.forEach((memory) => {
      if (memory.latitude && memory.longitude) {
        const marker = L.marker([memory.latitude, memory.longitude], {
          icon: starIcon,
        })
          .bindTooltip(`<b>${memory.name}</b><br>Click to view`)
          .on("click", () => onMarkerClick(memory.memoryID));
        marker.addTo(map);
      }
    });

    return () => {
      map.remove();
    };
  }, [memories, onMarkerClick]);

  return <div ref={mapRef} className="w-full h-[70vh] rounded-lg shadow-lg mb-6" />;
}