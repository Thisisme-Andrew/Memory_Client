"use client";

import Image from "next/image";

const galleries = [
  {
    name: "Calgary",
    images: [
      { id: 1, url: "/images/Calgary1.jpg" },
      { id: 2, url: "/images/Calgary2.jpg" },
      { id: 3, url: "/images/Calgary3.jpg" },
    ],
  },
  {
    name: "London",
    images: [
      { id: 4, url: "/images/London1.jpg" },
      { id: 5, url: "/images/London2.jpg" },
      { id: 6, url: "/images/London3.jpg" },
    ],
  },
  {
    name: "Seoul",
    images: [
      { id: 7, url: "/images/Seoul1.jpg" },
      { id: 8, url: "/images/Seoul2.jpg" },
      { id: 9, url: "/images/Seoul3.jpg" },
    ],
  },
];

export default function Gallery() {
  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 text-white p-8">
      <header className="absolute top-6 left-6 text-2xl font-bold">The Memory</header>

      <main className="flex flex-col items-center text-center max-w-4xl">
        <h1 className="text-5xl font-extrabold mb-6 drop-shadow-lg">Your Memories, Organized Beautifully</h1>
        <p className="text-lg mb-8 max-w-lg">
          Browse and revisit your special moments through different galleries. Your memories are safe, stunning, and always accessible.
        </p>
      </main>

      {/* Galleries Section */}
      <div className="w-full max-w-6xl space-y-10">
        {galleries.map((gallery) => (
          <div key={gallery.name} className="mb-8">
            <h2 className="text-3xl font-semibold mb-6">{gallery.name} Gallery</h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {gallery.images.length > 0 ? (
                gallery.images.map((image) => (
                  <div key={image.id} className="relative group">
                    <Image
                      src={image.url}
                      alt={`Gallery ${gallery.name} - Image ${image.id}`}
                      width={300}
                      height={200}
                      className="w-full h-40 object-cover rounded-lg shadow-lg transition-transform transform hover:scale-105"
                    />
                  </div>
                ))
              ) : (
                <p className="text-gray-300">No images available for this gallery.</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
