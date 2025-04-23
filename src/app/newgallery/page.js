"use client";

import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { logoutUser } from "../redux/store.js"; // Import logout action
import { setUser } from "../redux/store.js"; // Redux actions
import dynamic from "next/dynamic";

{/* import Map from "./map.js"; */}
const Map = dynamic(() => import("./map.js"), {
  ssr: false,
})


export default function NewGalleryPage() {
  {/*State Variables For Redux And User Session*/}
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

  
  {/*initials*/}
  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  {/*last selected marker, IMPORTATNT to store longitude and latitude*/}
  useEffect(() => {
    if ((latitude !== null) && (longitude !== null)) lastSelected.current = [latitude, longitude];
  }, [latitude, longitude])

  {/*Get user location*/}
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

 {/*Check if user is logged in*/}
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

  {/*Function to handle image changes*/}
  const handleImageChange = (e) => {
    setImageFiles([...e.target.files]);
  };

  {/*Function to handle collaborator changes*/}
  const handleCollaboratorChange = (e) => {
    const userIds = e.target.value
      .split(",")
      .map((id) => id.trim())
      .map((id) => parseInt(id)) 
      .filter((id) => !isNaN(id));
  

      setCollaborators(userIds);
  };
  
{/*Function to handle form submission, calls the API*/}
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
  
    try {

      const imageUrls = await uploadImages(imageFiles);
  
      const memoryData = {
        creatorID: user.userID, // Use the userID from the Redux store
        name: name,
        isPrivate: isPrivate,
        latitude: latitude,
        longitude: longitude,
        collaborators: collaborators,
        imageURLs: [],
      };
  
      {}
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
      const uniqueImageUrls = [...new Set(imageUrls)]; //Remove duplicate URLs to avoid breaking the API
  
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

  {/*Function to upload images and return their URLs*/}
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
    // Main container
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

      {/* Galleries Button */}
      <div className="absolute top-14 sm:top-16 left-4">
        <button
          onClick={() => router.push("/homePage")}
          className="bg-white text-blue-600 py-1.5 px-4 sm:py-2 sm:px-6 rounded-full text-sm sm:text-lg font-semibold shadow-lg hover:bg-gray-100 transition"
        >
          Galleries
        </button>
      </div>

      {/* "Create New Gallery" Text */}
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
          <Map
            newLatitude={latitude}
            newLongitude={longitude}
            setNewLatitude={setLatitude}
            setNewLongitude={setLongitude}
          />
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
