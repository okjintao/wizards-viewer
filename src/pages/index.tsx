import React from 'react';

export default function Home(): JSX.Element {
  return (
    <div className="flex flex-grow bg-lake">
      {/* Rankings */}
      <div className="flex w-full lg:w-3/4 overflow-auto"></div>
      {/* Preview */}
      <div className="hidden lg:flex bg-cave lg:w-1/4 border-l border-skull p-4 text-white flex-col items-center">
        <div className="text-xl">Artificer of the Wood</div>
        <div className="flex justify-around mt-2 w-full">
          <div className="flex flex-col items-center text-sm">
            <div>Serial ID</div>
            <div className="text-xs">10</div>
          </div>
          <div className="flex flex-col items-center text-sm">
            <div>Rank</div>
            <div className="text-xs">10</div>
          </div>
          <div className="flex flex-col items-center text-sm">
            <div>Score</div>
            <div className="text-xs">10</div>
          </div>
        </div>
      </div>
    </div>
  );
}
