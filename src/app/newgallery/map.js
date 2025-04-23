"use client";
import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default function GalleryMap({ newLatitude, newLongitude, setNewLatitude, setNewLongitude }) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    if (!newLatitude || !newLongitude || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [newLatitude, newLongitude],
      zoom: 17,
      worldCopyJump: true,
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

    const marker = L.marker([newLatitude, newLongitude], {
      icon: starIcon,
    }).addTo(map);

    map.on("click", (e) => {
      const { lat, lng } = e.latlng;
      marker.setLatLng([lat, lng]);
      setNewLatitude(lat);
      setNewLongitude(lng);
      map.setView([lat, lng], 17);
    });

    markerRef.current = marker;
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [newLatitude, newLongitude]);

  return <div ref={mapContainerRef} className="w-full h-[30vh] sm:h-[30vh] rounded-lg shadow-lg mb-6 z-0" />;
}