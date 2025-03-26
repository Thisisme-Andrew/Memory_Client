"use client"; // Add this to indicate this is a Client Component

export default function galleryview() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 text-white p-8 relative">
      {/* Profile Picture */}
      <a href="/profile" className="absolute top-4 right-4">
        <img
          src="https://via.placeholder.com/50" // Replace this with the actual URL of the profile picture
          alt="Profile"
          className="w-12 h-12 rounded-full border-2 border-white shadow-lg hover:opacity-80 transition-opacity"
        />
      </a>

      {/* "The Memory" Text */}
      <div className="absolute top-4 left-4 text-2xl font-semibold text-white">
        The Memory
      </div>

      {/* Go Back Button */}
      <div className="absolute top-16 left-4">
        <button
          onClick={() => window.history.back()} // Go back to the previous page
          className="bg-white text-blue-600 py-2 px-6 rounded-full text-lg font-semibold shadow-lg hover:bg-gray-100 transition"
        >
          Go Back
        </button>
      </div>

      {/* Page Header */}
      <h1 className="text-4xl font-semibold mb-6 drop-shadow-lg">Gallery 1</h1>

      {/* Main Image Section */}
      <div className="flex w-full max-w-4xl items-center space-x-8">
        {/* Left Sidebar (Buttons) */}
        <div className="flex flex-col space-y-4">
          {/* Buttons Stacked Vertically */}
          <button className="bg-transparent border-2 border-white text-white py-2 px-4 rounded-lg shadow-lg hover:bg-white hover:text-blue-600 transition">
            Add Images
          </button>
          <button className="bg-transparent border-2 border-white text-white py-2 px-4 rounded-lg shadow-lg hover:bg-white hover:text-blue-600 transition">
            Remove Images
          </button>
          <button className="bg-transparent border-2 border-white text-white py-2 px-4 rounded-lg shadow-lg hover:bg-white hover:text-blue-600 transition">
            Gallery Settings
          </button>
          <button className="bg-transparent border-2 border-white text-white py-2 px-4 rounded-lg shadow-lg hover:bg-white hover:text-blue-600 transition">
            Share Gallery
          </button>
        </div>

        {/* Current Image in the center */}
        <div className="w-2/3">
          <div className="w-full h-96 bg-red-500 rounded-lg mb-6"></div>
        </div>

        {/* Thumbnail List on the Right */}
        <div className="w-40 h-96 overflow-y-auto custom-scrollbar">
          {/* This will enable vertical scrolling for the thumbnails */}
          <div className="space-y-4">
            <div className="w-24 h-24 bg-red-500 rounded-lg"></div>
            <div className="w-24 h-24 bg-red-500 rounded-lg"></div>
            <div className="w-24 h-24 bg-red-500 rounded-lg"></div>
            <div className="w-24 h-24 bg-red-500 rounded-lg"></div>
            <div className="w-24 h-24 bg-red-500 rounded-lg"></div>
            <div className="w-24 h-24 bg-red-500 rounded-lg"></div>
            <div className="w-24 h-24 bg-red-500 rounded-lg"></div>
            <div className="w-24 h-24 bg-red-500 rounded-lg"></div>
            <div className="w-24 h-24 bg-red-500 rounded-lg"></div>
            <div className="w-24 h-24 bg-red-500 rounded-lg"></div>
          </div>
        </div>
      </div>

      {/* Footer (Copyright info) */}
      <footer className="absolute bottom-6 left-4 text-sm opacity-80 text-white">
        &copy; {new Date().getFullYear()} The Memory. All rights reserved.
      </footer>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px; /* Width of the scrollbar */
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #4c6ef5; /* Thumb color */
          border-radius: 10px; /* Rounded corners */
          transition: background-color 0.3s ease; /* Smooth transition for hover effect */
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #2b4ca1; /* Darker color on hover */
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f0f0f0; /* Track color */
          border-radius: 10px; /* Rounded corners */
        }
      `}</style>
    </div>
  );
}
