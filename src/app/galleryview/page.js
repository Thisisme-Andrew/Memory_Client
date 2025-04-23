"use client"; // Add this to indicate this is a Client Component

import { Suspense } from "react";
import GalleryView from "./GalleryView.js";

export const dynamic = "force-dynamic";

export default function galleryview() {
  return (
    <Suspense>
      <GalleryView />
    </Suspense>
  );
}
