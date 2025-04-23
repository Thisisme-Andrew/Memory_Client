"use client"; // Add this to indicate this is a Client Component

import { Suspense } from "react";
import AllGalleries from "./AllGalleries.js";

export const dynamic = "force-dynamic";

export default function allgalleries() {
  return (
    <Suspense>
      <AllGalleries />
    </Suspense>
  );
}