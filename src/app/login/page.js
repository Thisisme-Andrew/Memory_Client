"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/store.js"; // Redux actions

export default function Login() {
  const [email, setEmailState] = useState("");
  const [password, setPasswordState] = useState("");
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please fill in both fields.");
      return;
    }

    try {
      const response = await fetch(
        `https://memories-gebqazega2facsa4.canadacentral-01.azurewebsites.net/api/users/login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        throw new Error("Invalid email or password.");
      }

      const data = await response.json();
      console.log("API Response:", data);

      if (!data.userID) {
        throw new Error("Login failed. Please try again.");
      }

      // Store user data in Redux
      dispatch(
        setUser({
          userID: data.userID,
          fullName: `${data.firstName} ${data.lastName}`,
          email: data.email,
          profilePic: data.profilePic || "https://placehold.co/150", // Better placeholder
        })
      );

      console.log("Redux state updated with user:", {
        userID: data.userID,
        fullName: `${data.firstName} ${data.lastName}`,
        email: data.email,
      });
      
      sessionStorage.setItem("user", JSON.stringify({
        userID: data.userID,
        fullName: `${data.firstName} ${data.lastName}`,
        email: data.email,
        profilePic: data.profilePic || "https://placehold.co/150", // Better placeholder
      }));

      // Redirect to profile page
      router.push("/profile");
    } catch (err) {
      console.error("Login Error:", err.message);
      setError(err.message);
    }
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start w-full max-w-sm">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">The Memory</h1>
        <h2 className="text-xl font-semibold">Login</h2>
        <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmailState(e.target.value)}
            className="border border-gray-300 rounded px-4 py-2 w-full"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPasswordState(e.target.value)}
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
          Don't have an account?{" "}
          <a href="/signup" className="text-blue-500 hover:underline">
            Sign up
          </a>
        </p>
      </main>
    </div>
  );
}