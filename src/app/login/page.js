'use client';

import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Error check for empty fields
    if (!email || !password) {
      setError("Please fill in both fields.");
    } else {
      setError(""); // Reset error if fields are filled
      // Proceed with the login logic here
      console.log("Form submitted", { email, password });
    }
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start w-full max-w-sm">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white font-serif">The Memory</h1>
        <h2 className="text-xl font-semibold">Login</h2>
        <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 rounded px-4 py-2 w-full"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 rounded px-4 py-2 w-full"
          />
          <button
            type="submit"
            className="bg-black text-white rounded px-4 py-2 hover:bg-gray-800 transition"
          >
            Login
          </button>
        </form>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <p className="text-sm text-gray-500">
          Don't have an account? <a href="/signup" className="text-blue-500 hover:underline">Sign up</a>
        </p>
      </main>
    </div>
  );
}
