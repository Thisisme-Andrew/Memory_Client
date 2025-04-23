"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/store.js"; // Redux actions


//login page, allows users to log in to the app if they have an account in the database
export default function Login() {
  {/*State Variables For User Input*/}
  const [email, setEmailState] = useState("");
  const [password, setPasswordState] = useState("");
  const [error, setError] = useState("");

  {/*State Variables For Redux*/}
  const dispatch = useDispatch();
  const router = useRouter();

  {/*Handle Form Submission*/}
  const handleSubmit = async (e) => {
    e.preventDefault();

    {/*Error Checking For Empty Fields*/}
    if (!email || !password) {
      setError("Please fill in both fields.");
      return;
    }

    {/*API call to login user in backend*/}
    try {
      const response = await fetch(
        `https://memories-gebqazega2facsa4.canadacentral-01.azurewebsites.net/api/users/login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      {/*Error Checking For Invalid Credentials*/}
      if (!response.ok) {
        throw new Error("Invalid email or password.");
      }

      {/*Handle API Response*/}
      const data = await response.json();
      console.log("API Response:", data);

      {/*Error Checking For Login Failure*/}
      if (!data.userID) {
        throw new Error("Login failed. Please try again.");
      }

      {/*Update Redux State*/}
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
      
      {/*Update Session Storage, IMPORTANT TO MAINTAIN USER STATE ACROSS SESSIONS*/}
      sessionStorage.setItem("user", JSON.stringify({
        userID: data.userID,
        fullName: `${data.firstName} ${data.lastName}`,
        email: data.email,
        profilePic: data.profilePic || "https://placehold.co/150", // Better placeholder
      }));

      {/*Redirect To Profile Page if Login Successful*/}
      router.push("/profile");
    } catch (err) {
      console.error("Login Error:", err.message);
      setError(err.message);
    }
  };

  
  return (
    //main container, defines the gradient background and center content
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">


      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start w-full max-w-sm">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">The Memory</h1>
        <h2 className="text-xl font-semibold">Login</h2>
        <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit}>
          {/*Error Checking For Invalid Credentials*/}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmailState(e.target.value)}
            className="border border-gray-300 rounded px-4 py-2 w-full"
          />

          {/*Error Checking For Invalid Credentials*/}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPasswordState(e.target.value)}
            className="border border-gray-300 rounded px-4 py-2 w-full"
          />

          {/*Login Button*/}
          <button
            type="submit"
            className="bg-black text-white rounded px-4 py-2 hover:bg-gray-800 transition"
          >
            Login
          </button>
        </form>

        {/*Error Message*/}
        {error && <p className="text-red-500 text-sm">{error}</p>}

        {/*Sign Up Link*/}
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