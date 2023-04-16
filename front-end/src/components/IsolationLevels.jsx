import React from "react";

export default function IsolationLevels({ isolationLevel, handleSetLevel }) {
  return (
    <div className="flex">
      <p className="mr-2 font-bold text-indigo-500">Isolation Level:</p>
      <div>
        {isolationLevel === 1 ? (<span
          onClick={() => handleSetLevel(1)}
          class="cursor-pointer inline-block whitespace-nowrap rounded-[0.27rem] bg-blue-100 px-[0.65em] pb-[0.25em] pt-[0.35em] text-center align-baseline text-[0.75em] font-bold leading-none text-blue-700"
        >
          Read Uncommitted
        </span>) : (<span
          onClick={() => handleSetLevel(1)}
          class="cursor-pointer inline-block whitespace-nowrap rounded-[0.27rem] bg-gray-100 px-[0.65em] pb-[0.25em] pt-[0.35em] text-center align-baseline text-[0.75em] font-bold leading-none text-gray-700"
        >
          Read Uncommitted
        </span>)}

        {isolationLevel === 2 ? (<span
          onClick={() => handleSetLevel(2)}
          class="cursor-pointer inline-block whitespace-nowrap rounded-[0.27rem] bg-blue-100 px-[0.65em] pb-[0.25em] pt-[0.35em] text-center align-baseline text-[0.75em] font-bold leading-none text-blue-700"
        >
          Read Uncommitted
        </span>) : (<span
          onClick={() => handleSetLevel(2)}
          class="cursor-pointer ml-2 inline-block whitespace-nowrap rounded-[0.27rem] bg-gray-100 px-[0.65em] pb-[0.25em] pt-[0.35em] text-center align-baseline text-[0.75em] font-bold leading-none text-gray-700"
        >
          Read Committed
        </span>)}

        {isolationLevel === 3 ? (<span
          onClick={() => handleSetLevel(3)}
          class="cursor-pointer inline-block whitespace-nowrap rounded-[0.27rem] bg-blue-100 px-[0.65em] pb-[0.25em] pt-[0.35em] text-center align-baseline text-[0.75em] font-bold leading-none text-blue-700"
        >
          Repeatable Read
        </span>) : (<span
          onClick={() => handleSetLevel(3)}
          class="cursor-pointer ml-2 inline-block whitespace-nowrap rounded-[0.27rem] bg-gray-100 px-[0.65em] pb-[0.25em] pt-[0.35em] text-center align-baseline text-[0.75em] font-bold leading-none text-gray-700"
        >
          Repeatable Read
        </span>)}

        {isolationLevel === 4 ? (<span
          onClick={() => handleSetLevel(4)}
          class="cursor-pointer inline-block whitespace-nowrap rounded-[0.27rem] bg-blue-100 px-[0.65em] pb-[0.25em] pt-[0.35em] text-center align-baseline text-[0.75em] font-bold leading-none text-blue-700"
        >
          Serializable
        </span>) : (<span
          onClick={() => handleSetLevel(4)}
          class="cursor-pointer ml-2 inline-block whitespace-nowrap rounded-[0.27rem] bg-gray-100 px-[0.65em] pb-[0.25em] pt-[0.35em] text-center align-baseline text-[0.75em] font-bold leading-none text-gray-700"
        >
          Serializable
        </span>)}

      </div>
    </div>
  );
}
