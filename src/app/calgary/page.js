"use client"; // Add this to indicate this is a Client Component

import axios from 'axios';

// Assuming you already have your userID from the login process
const BASE_URL = 'https://memories-gebqazega2facsa4.canadacentral-01.azurewebsites.net/api/users';

// Function to retrieve your own user data by userID
async function retrieveOwnUser(userID) {
  try {
    const response = await axios.get(`${BASE_URL}/${userID}`);
    console.log('Your User Data:', response.data.body);
    return response.data.body;
  } catch (error) {
    console.error('Error retrieving user data:', error.response?.data || error.message);
  }
}

// Example of using the function (replace `userID` with the actual user ID after login)
const userID = 1; // Replace this with your actual userID obtained after login
retrieveOwnUser(userID);

export default function CalgaryPage() {
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
      <h1 className="text-4xl font-semibold mb-6 drop-shadow-lg">Calgary</h1>
      
      {/* Search Box */}
      <div className="bg-white text-blue-600 shadow-lg rounded-lg p-4 w-full max-w-lg text-center mb-6">
        <input
          type="text"
          placeholder="Search for something in Calgary..."
          className="w-full p-3 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Gallery Title */}
      {/*<h2 className="text-2xl font-semibold text-white mb-4 text-left w-full">Gallery 1</h2>*/}
      <a href="/galleryview" className="text-2xl font-semibold text-white mb-4 text-left w-full">Gallery 1</a>

      {/* Horizontal Image Gallery Section */}
      <div className="w-full overflow-x-auto mb-6 custom-scrollbar">
        <div className="flex space-x-4 min-w-max">
          {/* Red boxes for initial view with smaller size */}
          <div className="w-48 h-48 bg-red-500 rounded-lg"></div>
          <div className="w-48 h-48 bg-red-500 rounded-lg"></div>
          <div className="w-48 h-48 bg-red-500 rounded-lg"></div>
          <div className="w-48 h-48 bg-red-500 rounded-lg"></div>
          <div className="w-48 h-48 bg-red-500 rounded-lg"></div>

          {/* White boxes for scrolling further */}
          <div className="w-48 h-48 bg-white border-2 border-blue-600 rounded-lg"></div>
          <div className="w-48 h-48 bg-white border-2 border-blue-600 rounded-lg"></div>
          <div className="w-48 h-48 bg-white border-2 border-blue-600 rounded-lg"></div>
          <div className="w-48 h-48 bg-white border-2 border-blue-600 rounded-lg"></div>
          <div className="w-48 h-48 bg-white border-2 border-blue-600 rounded-lg"></div>
        </div>
      </div>

      {/* Gallery Title */}
      <h2 className="text-2xl font-semibold text-white mb-4 text-left w-full">Gallery 2</h2>

      {/* Horizontal Image Gallery Section */}
      <div className="w-full overflow-x-auto mb-6 custom-scrollbar">
        <div className="flex space-x-4 min-w-max">
          {/* Red boxes for initial view with smaller size */}
          <div className="w-48 h-48 bg-red-500 rounded-lg"></div>
          <div className="w-48 h-48 bg-red-500 rounded-lg"></div>
          <div className="w-48 h-48 bg-red-500 rounded-lg"></div>
          <div className="w-48 h-48 bg-red-500 rounded-lg"></div>
          <div className="w-48 h-48 bg-red-500 rounded-lg"></div>

          {/* White boxes for scrolling further */}
          <div className="w-48 h-48 bg-white border-2 border-blue-600 rounded-lg"></div>
          <div className="w-48 h-48 bg-white border-2 border-blue-600 rounded-lg"></div>
          <div className="w-48 h-48 bg-white border-2 border-blue-600 rounded-lg"></div>
          <div className="w-48 h-48 bg-white border-2 border-blue-600 rounded-lg"></div>
          <div className="w-48 h-48 bg-white border-2 border-blue-600 rounded-lg"></div>
        </div>
      </div>

      {/* Gallery Title */}
      <h2 className="text-2xl font-semibold text-white mb-4 text-left w-full">Gallery 3</h2>

      {/* Horizontal Image Gallery Section */}
      <div className="w-full overflow-x-auto mb-6 custom-scrollbar">
        <div className="flex space-x-4 min-w-max">
          {/* Red boxes for initial view with smaller size */}
          <div className="w-48 h-48 bg-red-500 rounded-lg"></div>
          <div className="w-48 h-48 bg-red-500 rounded-lg"></div>
          <div className="w-48 h-48 bg-red-500 rounded-lg"></div>
          <div className="w-48 h-48 bg-red-500 rounded-lg"></div>
          <div className="w-48 h-48 bg-red-500 rounded-lg"></div>

          {/* White boxes for scrolling further */}
          <div className="w-48 h-48 bg-white border-2 border-blue-600 rounded-lg"></div>
          <div className="w-48 h-48 bg-white border-2 border-blue-600 rounded-lg"></div>
          <div className="w-48 h-48 bg-white border-2 border-blue-600 rounded-lg"></div>
          <div className="w-48 h-48 bg-white border-2 border-blue-600 rounded-lg"></div>
          <div className="w-48 h-48 bg-white border-2 border-blue-600 rounded-lg"></div>
        </div>
      </div>

      {/* Gallery Title */}
      <h2 className="text-2xl font-semibold text-white mb-4 text-left w-full">Gallery 4</h2>

      {/* Horizontal Image Gallery Section */}
      <div className="w-full overflow-x-auto mb-6 custom-scrollbar">
        <div className="flex space-x-4 min-w-max">
          {/* Red boxes for initial view with smaller size */}
          <div className="w-48 h-48 bg-red-500 rounded-lg"></div>
          <div className="w-48 h-48 bg-red-500 rounded-lg"></div>
          <div className="w-48 h-48 bg-red-500 rounded-lg"></div>
          <div className="w-48 h-48 bg-red-500 rounded-lg"></div>
          <div className="w-48 h-48 bg-red-500 rounded-lg"></div>

          {/* White boxes for scrolling further */}
          <div className="w-48 h-48 bg-white border-2 border-blue-600 rounded-lg"></div>
          <div className="w-48 h-48 bg-white border-2 border-blue-600 rounded-lg"></div>
          <div className="w-48 h-48 bg-white border-2 border-blue-600 rounded-lg"></div>
          <div className="w-48 h-48 bg-white border-2 border-blue-600 rounded-lg"></div>
          <div className="w-48 h-48 bg-white border-2 border-blue-600 rounded-lg"></div>
        </div>
      </div>

      {/* New Gallery Button */}
      <a
        href="#gallery-section" // Scroll to the gallery section
        className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white py-3 px-6 rounded-full text-lg font-semibold shadow-lg hover:bg-blue-700 transition duration-300"
      >
        New Gallery
      </a>

      {/* Footer (Copyright info) */}
      <footer className="absolute bottom-6 left-4 text-sm opacity-80 text-white">
        &copy; {new Date().getFullYear()} The Memory. All rights reserved.
      </footer>
    </div>
  );
}
