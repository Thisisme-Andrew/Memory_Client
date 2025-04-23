import Image from "next/image";
import Link from "next/link";

//main landing page, directs users to signup or login of the app
export default function Home() {
  return (
    //main container, defines the gradient background and center content
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 text-white p-8">

      {/*app title*/}
      <header className="absolute top-6 left-6 text-2xl font-bold">The Memory</header>
      
      {/*main content*/}
      <main className="flex flex-col items-center text-center max-w-2xl">
        <h1 className="text-5xl font-extrabold mb-6 drop-shadow-lg">Preserve & Share Your Memories</h1>
        <p className="text-lg mb-8 max-w-lg">
          Organize your photos effortlessly by location. Create shared galleries with family and friends to revisit your best moments together.
        </p>
        
        {/*buttons*/}
        <div className="flex gap-4">
          <Link href="/signup" className="bg-white text-blue-600 px-6 py-3 rounded-full text-lg font-semibold shadow-lg hover:bg-gray-100 transition">
            Get Started
          </Link>
          <Link href="/login" className="border border-white px-6 py-3 rounded-full text-lg font-semibold shadow-lg hover:bg-white hover:text-blue-600 transition">
            Log In
          </Link>
        </div>
      </main>

      <footer className="absolute bottom-6 text-sm opacity-80">
        &copy; {new Date().getFullYear()} The Memory. All rights reserved.
      </footer>
    </div>
  );
}