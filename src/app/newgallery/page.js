"use client";

import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { logoutUser } from "../redux/store.js"; // Import logout action
import { setUser } from "../redux/store.js"; // Redux actions
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default function NewGalleryPage() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [name, setName] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [collaborators, setCollaborators] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const mapContainerRef = useRef(null);
  const markerRef = useRef(null);
  const mapRef = useRef(null);
  const lastSelected = useRef([0,0]);
  const [map, setMap] = useState(null);

  const router = useRouter();

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  useEffect(() => {
    if ((latitude !== null) && (longitude !== null)) lastSelected.current = [latitude, longitude];
  }, [latitude, longitude])

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLatitude(latitude);
          setLongitude(longitude);
        },
        (error) => {
          console.error("Error getting location", error);
          // Default to a specific location if geolocation fails
          setLatitude(0);
          setLongitude(0);
        }
      );
    } else {
      setLatitude(0);
      setLongitude(0);
    }
 }, [])

  useEffect(() => {
    if (latitude === null || longitude === null || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [latitude, longitude],
      zoom: 17,
      minZoom: 2,
      maxZoom: 18,
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

    const marker = L.marker([latitude, longitude], {
      icon: starIcon,
    }).addTo(map);

    map.on("click", (e) => {
      const { lat, lng } = e.latlng;
      lastSelected.current = [lat, lng];
      marker.setLatLng([lat, lng]);
      map.setView([lat, lng], 17);
      setLatitude(lat);
      setLongitude(lng);
    });

    map.on("mouseout", () => {
      if (lastSelected.current) {
        map.setView(lastSelected.current, 17);
        marker.setLatLng(lastSelected.current);
      }
    });

    mapRef.current = map;
    markerRef.current = marker;

    setMap(map);

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [latitude, longitude]);

  useEffect(() => {
      const storedUser = sessionStorage.getItem("user");
      if (!storedUser && !isLoggingOut) {
        router.push("/login"); // If no user, redirect to login
      } else {
        const userData = JSON.parse(storedUser);
        if (userData) {
          dispatch(setUser(userData)); // Set the Redux state if user data is available
      }
    }
  }, [router, isLoggingOut, dispatch]);

  const handleImageChange = (e) => {
    setImageFiles([...e.target.files]);
  };

  const handleCollaboratorChange = (e) => {
    const userIds = e.target.value
      .split(",") // Split input by commas
      .map((id) => id.trim()) // Trim any extra spaces around the IDs
      .map((id) => parseInt(id)) // Convert to numbers
      .filter((id) => !isNaN(id)); // Filter out any non-number values
  

      setCollaborators(userIds);
    //setCollaborators((prevCollaborators) => {
      //const newCollaborators = [...new Set([...prevCollaborators, ...userIds])]; // Add new IDs and ensure uniqueness
      //return newCollaborators;
    //});
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
  
    try {
      // Step 1: Upload images
      const imageUrls = await uploadImages(imageFiles);
  
      // Step 2: Create memory
      const memoryData = {
        creatorID: user.userID, // Replace with actual user ID
        name: name,
        isPrivate: isPrivate,
        latitude: latitude,
        longitude: longitude,
        collaborators: collaborators,
        imageURLs: [], // Do NOT include imageURLs here
      };
  
      const createResponse = async () => {
        console.log("collabaors object: " + collaborators);
        return await fetch(
          "https://memories-gebqazega2facsa4.canadacentral-01.azurewebsites.net/api/memories/add",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(memoryData),
          }
        );
      }
  
      let createData = await createResponse();
      createData = await createData.json();
      console.log("Memory created:", createData);
  
      if (!createData.memoryID) {
        throw new Error("Failed to create memory");
      }
  
      // Step 3: Call /addImages with memoryID and imageURLs
      const uniqueImageUrls = [...new Set(imageUrls)]; // Remove duplicate URLs to avoid breaking the API
  
      const imageResponse = await fetch(
        "https://memories-gebqazega2facsa4.canadacentral-01.azurewebsites.net/api/memories/addImages",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            memoryID: createData.memoryID,
            imageURLs: uniqueImageUrls,
          }),
        }
      );
  
      const imageData = await imageResponse.json();
      console.log("Images added:", imageData);
  
      setMessage("Memory and images created successfully!");
      router.push(`/galleryview?memid=${createData.memoryID}`);

    } catch (error) {
      console.error("Error:", error);
      setMessage("Error creating memory or uploading images. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  

  // Function to upload images and return their URLs
  const uploadImages = async (files) => {
    const urls = [];
    for (const file of files) {
      // Implement the image upload logic here, 
      // returning a URL for each uploaded image.
      const imageUrl = await uploadImageToServer(file);
      urls.push(imageUrl);
    }
    return urls;
  };

  const uploadImageToServer = async (file) => {
    const blobName = `${Date.now()}-${file.name}`;
    const uploadUrl = `${process.env.NEXT_PUBLIC_AZURE_BASE_SAS_URL}/${blobName}?${process.env.NEXT_PUBLIC_AZURE_SAS_TOKEN}`;
  
    const response = await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        "x-ms-blob-type": "BlockBlob",
        "Content-Type": file.type,
      },
      body: file,
    });
  
    if (!response.ok) {
      throw new Error(`Failed to upload image: ${file.name}`);
    }
  
    return `${process.env.NEXT_PUBLIC_AZURE_BASE_SAS_URL}/${blobName}`;
  };

  return (
<div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 text-white p-8 pt-[100px] relative">

      {/* Initials Badge */}
      <a href="/profile" className="absolute top-4 right-4">
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white text-blue-600 rounded-full flex items-center justify-center font-bold text-base sm:text-lg shadow-lg border-2 border-white hover:opacity-80 transition-opacity">
          {getInitials(user?.fullName)}
        </div>
      </a>

      {/* "The Memory" Text */}
      <div className="absolute top-4 left-4 text-lg sm:text-2xl font-semibold text-white">
        The Memory
      </div>

      <div className="absolute top-14 sm:top-16 left-4">
        <button
          onClick={() => router.push("/homePage")}
          className="bg-white text-blue-600 py-1.5 px-4 sm:py-2 sm:px-6 rounded-full text-sm sm:text-lg font-semibold shadow-lg hover:bg-gray-100 transition"
        >
          Galleries
        </button>
      </div>

      <h1 className="text-4xl font-semibold mb-6">Create New Gallery</h1>

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[999]">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="w-full max-w-lg bg-white text-blue-600 shadow-lg rounded-lg p-6">
        {/* Memory Name */}
        <div className="mb-4">
          <label className="block text-lg font-semibold mb-2" htmlFor="name">
            Gallery Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter gallery name"
            required
          />
        </div>

        {/* Coordinates */}
        <div className="mb-4">
          <label className="block text-lg font-semibold mb-2">Location (Click to Move Marker)</label>
          <div ref={mapContainerRef} className="w-full h-[30vh] sm:h-[30vh] max-w-full sm:max-w-3xl rounded-lg shadow-lg mb-6 z-0">
        </div>

        {/* Privacy Option */}
        <div className="mb-4">
          <label className="block text-lg font-semibold mb-2">Privacy</label>
          <label className="inline-flex items-center mr-6">
            <input
              type="radio"
              value={false}
              checked={!isPrivate}
              onChange={() => setIsPrivate(false)}
              className="form-radio text-blue-600"
            />
            <span className="ml-2">Public</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              value={true}
              checked={isPrivate}
              onChange={() => setIsPrivate(true)}
              className="form-radio text-blue-600"
            />
            <span className="ml-2">Private</span>
          </label>
        </div>

        
          
        </div>
          {/* Collaborators */}
          <div className="mb-4">
            <label className="block text-lg font-semibold mb-2">Collaborators (User IDs)</label>
            <input
              type="text"
              placeholder="Enter collaborator user IDs separated by commas"
              onChange={handleCollaboratorChange}
              className="w-full p-3 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="mt-2 text-sm text-gray-500">Enter collaborator user IDs, separated by commas.</p>
          </div>


        {/* Image Upload */}
        <div className="mb-4">
          <label className="block text-lg font-semibold mb-2" htmlFor="images">
            Upload Images
          </label>
          <input
            type="file"
            id="images"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="w-full p-3 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Submit Button */}
        <div className="mb-4">
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold shadow-lg hover:bg-blue-700 transition"
          >
            Create Gallery
          </button>
        </div>
      </form>

      {/* Status Message */}
      {message && (
        <p className="mt-4 text-lg font-semibold text-white">{message}</p>
      )}
    </div>
  );
}
