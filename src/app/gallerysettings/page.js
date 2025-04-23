"use client"; // Add this to indicate this is a Client Component

import { Suspense } from "react";
import GallerySettings from "./GallerySettings.js";

export const dynamic = "force-dynamic";

export default function gallerysettings() {
  return (
    <Suspense>
      <GallerySettings />
    </Suspense>
  );
}
