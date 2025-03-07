'use client';

import { useState } from "react";

export default function Signup() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Error checks
    if (!fullName || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
    } else if (password !== confirmPassword) {
      setError("Passwords do not match.");
    } else if (password.length < 6) {
      setError("Password must be at least 6 characters.");
    } else {
      setError(""); // Reset error if all checks pass
      // Proceed with the signup logic here
      console.log("Form submitted", { fullName, email, password });
    }
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start w-full max-w-sm">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white font-serif">The Memory</h1>
        <h2 className="text-xl font-semibold">Sign Up</h2>
        <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="border border-gray-300 rounded px-4 py-2 w-full"
          />
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
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="border border-gray-300 rounded px-4 py-2 w-full"
          />
          <button
            type="submit"
            className="bg-black text-white rounded px-4 py-2 hover:bg-gray-800 transition"
          >
            Sign Up
          </button>
        </form>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <p className="text-sm text-gray-500">
          Already have an account? <a href="/login" className="text-blue-500 hover:underline">Login</a>
        </p>
      </main>
    </div>
  );
}
