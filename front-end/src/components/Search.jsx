import React from "react";

export default function Search() {
  return (
    <div class="mb-0 xl:w-1/2">
      <div class="relative mb-4 flex w-full flex-wrap items-stretch">
        <input
          type="search"
          class="h-12 relative m-0 -mr-0.5 block w-[1px] min-w-0 flex-auto rounded-l border border-solid border-neutral-300 bg-transparent bg-clip-padding px-3 py-[0.25rem] text-base font-normal leading-[1.6] text-neutral-700 outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-primary focus:text-neutral-700 focus:shadow-[inset_0_0_0_1px_rgb(59,113,202)] focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:focus:border-primary"
          placeholder="Search a Movie"
          aria-label="Search"
          aria-describedby="button-addon3"
        />

        <button
          class="relative z-[2] rounded-r border-2 border-primary px-6 py-2 text-xs font-medium uppercase text-primary transition duration-150 ease-in-out hover:bg-black hover:bg-opacity-5 focus:outline-none focus:ring-0 bg-indigo-500 text-white font-semibold"
          type="button"
          id="button-addon3"
          data-te-ripple-init
        >
          Search
        </button>
      </div>
    </div>
  );
}
