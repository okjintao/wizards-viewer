import React from 'react';

function Sidebar(): JSX.Element {
  return (
    <div className="flex flex-col w-44 bg-haze p-4">
      <div className="flex-grow text-md tracking-tight mt-2">
        <span className="text-lg tracking-tight">{"Wizard's Guide"}</span>
        <div className='flex flex-col space-y-1 mt-4'>
        <span>Ranking</span>
        <span>Traits</span>
        <span>Affinities</span>
        </div>
      </div>
      <div>
        jintao
      </div>
    </div>
  );
}

export default Sidebar;