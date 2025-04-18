"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { setUser } from "../redux/store.js";

export default function Signup() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const router = useRouter();

  const handleSubmit = async (e) => {
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

    const nameParts = fullName.trim().split(" ");
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(" ") || "Unknown";

    const user = { firstName, lastName, email, password };

    try {
      const response = await fetch(
        `https://memories-gebqazega2facsa4.canadacentral-01.azurewebsites.net/api/users/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(user),
        }
      );

      const responseText = await response.text();
      console.log("API Raw Response:", responseText);

      if (!response.ok) {
        throw new Error(`Signup failed: ${responseText || "Unknown error"}`);
      }

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (err) {
        console.error("JSON Parse Error:", err);
        throw new Error("Invalid response format from server.");
      }

      console.log("API Response:", data);

      if (!data.userID) {
        throw new Error("Signup succeeded, but no user ID was returned.");
      }

      dispatch(setUser({
        userID: data.userID,
        fullName: `${data.firstName} ${data.lastName}`,
        email: data.email,
        profilePic: data.profilePic || "https://via.placeholder.com/150",
      }));

      router.push("/profile");
    } catch (err) {
      console.error("Signup Error:", err.message);
      setError(err.message);
    }
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
          <button type="submit" className="bg-black text-white rounded px-4 py-2 hover:bg-gray-800 transition">
            Sign Up
          </button>
        </form>

        {/* Show Error if exists */}
        {error && <p className="text-red-500 text-sm">{error}</p>}

        {/* 🔗 Link to Login Page */}
        <p className="text-sm text-gray-600">
          Already have an account?{" "}
          <span
            onClick={() => router.push("/login")}
            className="text-blue-600 hover:underline cursor-pointer"
          >
            Log in
          </span>
        </p>
      </main>
    </div>
  );
}
