"use client";
import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default function MapComponent({ memories, onMarkerClick }) {
  const mapRef = useRef(null);

  {/* Initialize the map when the component mounts */}
  useEffect(() => {
    const map = L.map(mapRef.current, {
      center: [51.0447, -114.0719],
      zoom: 4,
      minZoom: 4,
      maxZoom: 18
    });

    {/* Add the OpenStreetMap tile layer, important to also add the contributors */}
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    {/*map marker*/}
    const starIcon = L.divIcon({
      className: "leaflet-star-icon",
      html: '<div style="font-size: 32px; color: gold;">&#9733;</div>',
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    });

    {/*add the markers to the map*/}
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

    {/*Clean up the map when the component unmounts, possible memory leaks*/}
    return () => {
      map.remove();
    };
  }, [memories, onMarkerClick]);

  return <div ref={mapRef} className="w-2/3 h-[70vh] rounded-lg shadow-lg mb-6" />;
}