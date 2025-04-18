"use client";

import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState, useRef } from "react";
import { logoutUser } from "../redux/store.js"; // Import logout action
import { setUser } from "../redux/store.js"; // Redux actions
import { useSearchParams, useRouter } from "next/navigation";

export default function GalleryView() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentid = parseInt(searchParams.get("memid"));
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageFiles, setImageFiles] = useState([])

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

  useEffect(() => {
    // Fetch memories from the database
    const fetchMemory = async () => {
      try {
        const response = await fetch(`https://memories-gebqazega2facsa4.canadacentral-01.azurewebsites.net/api/memories/${currentid}`);
        const data = await response.json();
        
        setImages(data.imageURLs);
        if (data.imageURLs.length > 0) {
          setSelectedImage(0);
        }

      } catch (error) {
        console.error("Error fetching memory:", error);
      }
    };

    fetchMemory();
  }, [currentid]);

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

  const handleAddPhotos = async() => {
      // Open File Upload Dialog
      let input = document.createElement('input');
      input.type = 'file';
      input.multiple = true;
      input.accept="image/*";
      input.click();
      input.onchange = async (e) => {
        const files = [...e.target.files];
        if (!files.length) return;
      
        try {
          const imageUrls = await uploadImages(files);
          const uniqueImageUrls = [...new Set([...images, ...imageUrls])];
      
          const imageResponse = await fetch(
            "https://memories-gebqazega2facsa4.canadacentral-01.azurewebsites.net/api/memories/addImages",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
              memoryID: currentid,
              imageURLs: uniqueImageUrls,
            }),
          }
        );
      
        const imageData = await imageResponse.json();
        console.log("Images added:", imageData);
        setImages(uniqueImageUrls);
        if (selectedImage === null) {
          setSelectedImage(0);
        } else setSelectedImage(images.length);
        setImageFiles([]);
      } catch (error) {
        console.error("Error uploading images:", error);
      }
    }
  }

  const handleRemovePhoto = async () => {
    if (selectedImage !== null) {
      try {
        const removalResponse = await fetch(
          "https://memories-gebqazega2facsa4.canadacentral-01.azurewebsites.net/api/memories/removeImages",
          {
            method: "DELETE",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
              memoryID: currentid,
              imageURLs: [images[selectedImage]]
            }),
          }
        );
        const removalData = await removalResponse.json();
        console.log("Image removed:", removalData);
        setImages(prev => prev.filter(c => c !== images[selectedImage]));
        if (images.length === 1) {
          setSelectedImage(null);
        } else if (selectedImage === (images.length - 1)) setSelectedImage(selectedImage - 1);

      } catch (error) {
        console.error("Error removing image:", error);
      }
    }
  }

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
          <button className="bg-transparent border-2 border-white text-white py-2 px-4 rounded-lg shadow-lg hover:bg-white hover:text-blue-600 transition" onClick={() => handleAddPhotos()}>
            Add Images
          </button>
          <button className="bg-transparent border-2 border-white text-white py-2 px-4 rounded-lg shadow-lg hover:bg-white hover:text-blue-600 transition" onClick={() => handleRemovePhoto()}>
            Remove Image
          </button>
          <button className="bg-transparent border-2 border-white text-white py-2 px-4 rounded-lg shadow-lg hover:bg-white hover:text-blue-600 transition" onClick={() => router.push(`/gallerysettings?memid=${currentid}`)}>
            Gallery Settings
          </button>
          <button className="bg-transparent border-2 border-white text-white py-2 px-4 rounded-lg shadow-lg hover:bg-white hover:text-blue-600 transition" onClick={() => navigator.clipboard.writeText(window.location.href)}>
            Share Gallery
          </button>
        </div>

        {/* Main Content */}
        <div key={currentid} className="flex space-x-2 overflow-x-hidden">
            {/* Main Selected Image */}
            <div className="flex items-center justify-center">
            <div className="border-4 border-white rounded-lg shadow-xl -mt-28">
            {typeof selectedImage === "number" && (
              <img
                src={images[selectedImage]}
                alt="Selected Memory"
                className="rounded-md max-w-[500px] max-h-[500px] w-full h-full object-contain block"
              />
            )}
          </div>
        </div>


            {/* Scrollable Thumbnails */}
            <div className="w-40 h-[500px]">
              <div className="space-y">
                {images.map((url, index) => (
                  <img
                    key={index}
                    src={url}
                    alt={`Thumbnail ${index}`}
                    onClick={() => setSelectedImage(index)}
                    className={`w-auto h-auto rounded-lg border-2 shadow-md cursor-pointer transition-transform duration-200 ${
                    selectedImage === index ? "border-yellow-400 scale-105" : "border-white"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
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
