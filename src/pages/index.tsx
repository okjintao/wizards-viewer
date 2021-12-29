import React from 'react';
import Image from 'next/image';
import towerImage from '../../public/img/tower.png';

interface TraitProps {
  trait: string;
  name: string;
  rarity: string;
}

function TraitItem({ trait, name, rarity }: TraitProps): JSX.Element {
  return (
    <div className="flex justify-between">
      <div className="flex flex-col">
        <div>{trait}</div>
        <div className="text-xs text-skull">{rarity}</div>
      </div>
      <div>{name}</div>
    </div>
  );
}

export default function Home(): JSX.Element {
  return (
    <div className="flex flex-grow bg-cave">
      {/* Rankings */}
      <div className="flex w-full lg:w-3/4 overflow-auto p-4"></div>
      {/* Preview */}
      <div className="hidden lg:flex bg-gradient-to-b from-cave to-tower lg:w-1/4 border-l border-skull px-4 pt-4 text-white flex-col items-center">
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
        <div className="flex flex-col items-center h-full overflow-hidden">
          <div className="absolute z-10 pt-4">
            <Image
              width={150}
              height={150}
              src={'https://www.forgottenrunes.com/api/art/wizards/9496/nobg'}
              alt="Wizard Image"
            />
          </div>
          <div className="flex flex-col items-center h-64 absolute z-10 transform translate-y-80 bg-depths w-60 border-2 border-skull p-4 overflow-auto shadow-lg">
            <div className="pb-2">Traits</div>
            <div className="text-sm w-full space-y-2">
              <TraitItem trait="Head" name="Anuran" rarity="Rare" />
            </div>
            <div className="py-2">Affinities</div>
          </div>
          <div className="flex pt-16">
            <Image src={towerImage} alt="Wizard Tower" />
          </div>
        </div>
      </div>
    </div>
  );
}
