"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { setEmail, setPassword, setUser } from "../redux/store.js"; // Import Redux actions

export default function Login() {
  const email = useSelector((state) => state.auth.email);
  const password = useSelector((state) => state.auth.password);
  const registeredUsers = useSelector((state) => state.auth.registeredUsers); // Get registered users from Redux
  const dispatch = useDispatch();
  const router = useRouter();

  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please fill in both fields.");
      return;
    }

    // Check if the email exists in registeredUsers
    const user = registeredUsers.find((user) => user.email === email);

    if (!user) {
      setError("Email not recognized.");
    } else if (user.password !== password) {
      setError("Incorrect password.");
    } else {
      setError("");
      console.log("Login successful!", { email, password });

      // Save logged-in user data in Redux
      dispatch(setUser(user));

      router.push("/profile");
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