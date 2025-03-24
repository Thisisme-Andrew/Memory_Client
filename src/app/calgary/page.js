// pages/calgary/page.js

"use client"; // Add this to indicate this is a Client Component

export default function CalgaryPage() {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-8">
        {/* Page Header */}
        <h1 className="text-4xl font-semibold text-gray-800 mb-6">Welcome to Calgary!</h1>
        
        {/* City Information Section */}
        <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-lg text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">About Calgary</h2>
          <p className="text-gray-600">
            Calgary is a vibrant city in the province of Alberta, Canada. Known for its stunning natural landscapes,
            Calgary is home to the beautiful Rocky Mountains, world-class ski resorts, and iconic landmarks like the Calgary Tower.
          </p>
          <p className="text-gray-600 mt-4">
            Calgary also has a rich cultural scene, with various festivals, museums, and art galleries. It’s known for being the gateway to the Canadian Rockies and offering many outdoor activities, including hiking, biking, and skiing.
          </p>
        </div>
  
        {/* Calgary Image */}
        <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-lg text-center mb-6">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/a/aa/Calgary_skyline_at_night.jpg"
            alt="Calgary Skyline"
            className="rounded-lg w-full h-auto mb-4"
          />
          <p className="text-gray-500">The stunning Calgary skyline at night.</p>
        </div>
  
        {/* Fun Facts */}
        <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-lg text-center mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Fun Facts About Calgary</h3>
          <ul className="list-disc text-left text-gray-600 space-y-2">
            <li>Calgary is home to the Calgary Stampede, one of the largest rodeo events in the world.</li>
            <li>The Calgary Tower, once the tallest structure in Canada, is located in the downtown area.</li>
            <li>It has over 1,000 parks, making it one of the greenest cities in Canada.</li>
            <li>Calgary has one of the most affordable housing markets in Canada compared to other major cities.</li>
          </ul>
        </div>
  
        {/* Footer */}
        <div className="mt-8">
          <button
            onClick={() => window.history.back()} // Go back to the previous page
            className="bg-blue-500 text-white py-2 px-6 rounded hover:bg-blue-600 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }
  