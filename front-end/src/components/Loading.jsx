import React from "react";

export default function Loading() {
  return (
    <div class="flex items-center justify-center min-h-screen">
      <div
        class="w-8 h-8 border-4 border-blue-200 rounded-full animate-spin"
      ></div>
      <p class="ml-2">Fetching Data...</p>
    </div>
  );
}
