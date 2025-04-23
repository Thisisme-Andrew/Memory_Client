"use client";

import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState, useRef } from "react";
import { logoutUser } from "../redux/store.js"; // Import logout action
import { setUser } from "../redux/store.js"; // Redux actions
import { useSearchParams, useRouter } from "next/navigation";


{/*Gallery View, allows users to view and interact with a specific gallery*/}
export default function GalleryView() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentid = parseInt(searchParams.get("memid"));
  const [images, setImages] = useState([]);
  const [title, setTitle] = useState("");
  const [creator, setCreator] = useState(null);
  const [collaborators, setCollaborators] = useState(null);
  const [isPublic, setIsPublic] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageFiles, setImageFiles] = useState([])
  const [isMobile, setIsMobile] = useState(false);
  const [message, setMessage] = useState(null);


  {/*initials*/}
  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };
  
  {/* Check if user is logged in, if not, redirect to login page, authentication checking*/}
  useEffect(() => {
    if ((creator === null) || (collaborators === null)) return;
    const storedUser = sessionStorage.getItem("user");

    if (!storedUser && !isLoggingOut) {
      if (!isPublic) router.push("/login"); 
    } else {
      const userData = JSON.parse(storedUser);
      if (userData) {
        dispatch(setUser(userData)); 
      }
      console.log(userData);
      if (!isPublic && userData.userID !== creator && !collaborators.includes(userData.userID)) router.push("/homePage"); 
  }
}, [router, isLoggingOut, dispatch, creator, isPublic, collaborators]);


  
  useEffect(() => {
    {/* Check if the window width is less than or equal to 768px */}
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Initial check
    handleResize();

    // Listen for screen resizes
    window.addEventListener("resize", handleResize);

    // Cleanup on unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {

    // Fetch memories from the database
    const fetchMemory = async () => {
      try {
        const response = await fetch(`https://memories-gebqazega2facsa4.canadacentral-01.azurewebsites.net/api/memories/${currentid}`);
        const data = await response.json();
        
        setImages(data.imageURLs);
        setCollaborators(data.collaborators);
        setCreator(data.creatorID);
        setIsPublic(!data.isPrivate);
        setTitle(data.name);
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

    {/* Function to upload a single image and return its URL */}
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

  {/* Function to handle adding photos */}
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
        setMessage("Image(s) Successfully Added!");
        setImageFiles([]);
      } catch (error) {
        console.error("Error uploading images:", error);
      }
    }
  }

  {/* Function to handle removing a photo */}
  const handleRemovePhoto = async () => {
    if (selectedImage !== null) {
      if (confirm("Are you sure you want to remove the selected image?")) {
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
          setMessage("Image Successfully Removed!");

        } catch (error) {
          console.error("Error removing image:", error);
        }
      }
    }
  }

  return (
    //main container
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 text-white p-4 sm:p-8 relative">
      {(user !== null) ?
      <a href="/profile" className="absolute top-4 right-4">
        <div className="w-9 h-9 sm:w-12 sm:h-12 bg-white text-blue-600 rounded-full flex items-center justify-center font-bold text-sm sm:text-lg shadow-lg border-2 border-white hover:opacity-80 transition-opacity">
          {getInitials(user?.fullName)}
        </div>
      </a>
      :
      <div className="absolute flex top-5 right-4 space-x-2">
        {/*buttons*/}
        <button
          onClick={() => router.push("/signup")}
          className="bg-white text-blue-600 py-1.5 px-4 sm:py-2 sm:px-6 rounded-full text-sm sm:text-lg font-semibold shadow-lg hover:bg-gray-100 transition"
        >
          Sign Up
        </button>
        <button
          onClick={() => router.push("/login")}
          className="bg-transparent text-white border border-white py-1.5 px-4 sm:py-2 sm:px-6 rounded-full text-sm sm:text-lg font-semibold shadow-lg hover:bg-white hover:text-blue-600 transition"
        >
          Log In
        </button>
      </div>}

      {((user !== null) &&
      <div className="absolute top-10 sm:top-10 left-4">
        <button
          onClick={() => router.push("/homePage")}
          className="bg-white text-blue-600 py-1.5 px-4 sm:py-2 sm:px-6 rounded-full text-sm sm:text-lg font-semibold shadow-lg hover:bg-gray-100 transition"
        >
          Galleries
        </button>
      </div>
      )}

      <h1 className="text-4xl font-semibold mb-6 drop-shadow-lg">{title}</h1>

      {!isMobile ?
        <div className="flex w-full max-w-6xl items-center space-x-8 overflow-x-hidden">
          {/* Sidebar Buttons */}
          <div className="flex flex-col space-y-4">
            {((collaborators !== null) && (((user?.userID === creator) || collaborators.includes(user?.userID))) &&
            <div className="flex space-x-4">
              <button className="w-1/2 bg-transparent border-2 border-white text-white py-2 px-4 rounded-lg shadow-lg hover:bg-white hover:text-blue-600 transition" onClick={() => handleAddPhotos()}>
                Add<br/>Images
              </button>
              <button className="w-1/2 bg-transparent border-2 border-white text-white py-2 px-4 rounded-lg shadow-lg hover:bg-white hover:text-blue-600 transition" onClick={() => handleRemovePhoto()}>
                Remove Image
              </button>
            </div>
            )}
            {((user?.userID === creator) &&
              <button className="bg-transparent border-2 border-white text-white py-2 px-4 rounded-lg shadow-lg hover:bg-white hover:text-blue-600 transition" onClick={() => router.push(`/gallerysettings?memid=${currentid}`)}>
                Gallery Settings
              </button>
            )}
            {(isPublic &&
              <button className="bg-transparent border-2 border-white text-white py-2 px-4 rounded-lg shadow-lg hover:bg-white hover:text-blue-600 transition" onClick={() => {navigator.clipboard.writeText(window.location.href); setMessage("Gallery Link Copied to Clipboard!")}}>
                Share Gallery
              </button>
            )}
          </div>

          {/* Main Content */}
          <div key={currentid} className="flex space-x-2 overflow-x-hidden items-center min-h-[500px]">
            {/* Main Selected Image */}
            <div className="flex items-center justify-center h-[500px]">
              <div className="border-4 border-white rounded-lg shadow-xl">
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
            <div className="w-40 h-[500px] overflow-y-auto custom-scrollbar pr-1">
              <div className="flex flex-col space-y-2">
                {images.map((url, index) => (
                  <img
                    key={index}
                    src={url}
                    alt={`Thumbnail ${index}`}
                    onClick={() => setSelectedImage(index)}
                    className={`w-auto h-auto rounded-lg border-2 shadow-md cursor-pointer transition-transform duration-200 ${
                    selectedImage === index ? "border-yellow-400" : "border-white scale-95"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      : 
        <div className="flex flex-col w-full max-w-6xl items-center overflow-x-hidden py-1">
          {/* Thumbnails */}
          <div className="w-full overflow-x-auto custom-scrollbar px-1 mb-1">
            <div className="flex space-x-1">
              {images.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`Thumbnail ${index}`}
                  onClick={() => setSelectedImage(index)}
                  className={`h-[60px] rounded border-2 cursor-pointer transition-transform duration-200 ${
                    selectedImage === index ? "border-yellow-400" : "border-white scale-95"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Selected Image */}
          <div className="flex items-center justify-center h-[300px] mb-1">
            <div className="border-4 border-white rounded shadow">
              {typeof selectedImage === "number" && (
                <img
                  src={images[selectedImage]}
                  alt="Selected Memory"
                  className="rounded max-w-[300px] max-h-[300px] w-full h-full object-contain block"
                />
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-1 w-full px-1 space-y-2">
            {(collaborators !== null &&
              ((user?.userID === creator) || collaborators.includes(user?.userID))) && (
              <div className="flex gap-2">
                <button className="w-1/2 bg-transparent border-2 border-white text-white py-2 px-4 rounded-lg shadow-lg hover:bg-white hover:text-blue-600 transition" onClick={handleAddPhotos}>
                  Add Images
                </button>
                <button className="w-1/2 bg-transparent border-2 border-white text-white py-2 px-4 rounded-lg shadow-lg hover:bg-white hover:text-blue-600 transition" onClick={handleRemovePhoto}>
                  Remove Image
                </button>
              </div>
            )}
            {(user?.userID === creator) && (
              <button className="bg-transparent border-2 border-white text-white py-2 px-4 rounded-lg shadow-lg hover:bg-white hover:text-blue-600 transition" onClick={() => router.push(`/gallerysettings?memid=${currentid}`)}>
                Gallery Settings
              </button>
            )}
            {isPublic && (
              <button className="bg-transparent border-2 border-white text-white py-2 px-4 rounded-lg shadow-lg hover:bg-white hover:text-blue-600 transition" onClick={() => {navigator.clipboard.writeText(window.location.href); setMessage("Gallery Link Copied to Clipboard!")}}>
                Share Gallery
              </button>
            )}
          </div>
        </div>}

        {/* Status Message */}
        {message && (
          <p className="mt-4 text-lg font-semibold text-white">{message}</p>
        )}

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
