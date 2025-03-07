import Image from "next/image";

export default function Signup() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start w-full max-w-sm">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white font-serif">The Memory</h1>
        <h2 className="text-xl font-semibold">Sign Up</h2>
        <form className="flex flex-col gap-4 w-full">
          <input
            type="text"
            placeholder="Full Name"
            className="border border-gray-300 rounded px-4 py-2 w-full"
          />
          <input
            type="email"
            placeholder="Email"
            className="border border-gray-300 rounded px-4 py-2 w-full"
          />
          <input
            type="password"
            placeholder="Password"
            className="border border-gray-300 rounded px-4 py-2 w-full"
          />
          <button
            type="submit"
            className="bg-black text-white rounded px-4 py-2 hover:bg-gray-800 transition"
          >
            Sign Up
          </button>
        </form>
        <p className="text-sm text-gray-500">
          Already have an account? <a href="/login" className="text-blue-500 hover:underline">Login</a>
        </p>
      </main>
    </div>
  );
}
