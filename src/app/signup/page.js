"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, setEmail, setPassword, setFullName } from "../redux/store.js"; // Import Redux actions
import { useRouter } from "next/navigation";

export default function Signup() {
  const fullName = useSelector((state) => state.auth.fullName);
  const email = useSelector((state) => state.auth.email);
  const password = useSelector((state) => state.auth.password);
  const registeredUsers = useSelector((state) => state.auth.registeredUsers); // Get all users
  const dispatch = useDispatch();
  const router = useRouter();

  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!fullName || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (registeredUsers.some((user) => user.email === email)) {
      setError("Email already registered.");
      return;
    }

    setError("");

    const newUser = {
      fullName,
      email,
      password, // Store the password for validation
      profilePic: "https://fastly.picsum.photos/id/1060/200/200.jpg?hmac=M0E6SK-_reDe8rAPtwDpww5ihTgL6yewgERGc7eX5z8",
    };

    dispatch(registerUser(newUser)); // Save user in Redux

    router.push("/login");
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start w-full max-w-sm">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">The Memory</h1>
        <h2 className="text-xl font-semibold">Sign Up</h2>
        <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => dispatch(setFullName(e.target.value))} // ✅ Fix here
            className="border border-gray-300 rounded px-4 py-2 w-full"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => dispatch(setEmail(e.target.value))}
            className="border border-gray-300 rounded px-4 py-2 w-full"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => dispatch(setPassword(e.target.value))}
            className="border border-gray-300 rounded px-4 py-2 w-full"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="border border-gray-300 rounded px-4 py-2 w-full"
          />
          <button type="submit" className="bg-black text-white rounded px-4 py-2 hover:bg-gray-800 transition">
            Sign Up
          </button>
        </form>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </main>
    </div>
  );
}