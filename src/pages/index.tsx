import React, { useContext, useEffect, useState } from 'react';
import Image from 'next/image';
import towerImage from '../../public/img/tower.png';
import { observer } from 'mobx-react-lite';
import { StoreContext } from '../store/StoreContext';
import { Wizard } from '../utils/interfaces/wizard.interface';

interface TraitProps {
  trait: string;
  name: string;
  rarity: string;
}

function TraitItem({ trait, name, rarity }: TraitProps): JSX.Element {
  return (
    <div className="flex justify-between">
      <div className="flex flex-col w-1/2">
        <div>{trait.charAt(0).toUpperCase() + trait.slice(1)}</div>
        <div className="text-xs text-skull">{rarity}</div>
      </div>
      <div className="w-1/2 flex justify-end">{name}</div>
    </div>
  );
}

const WizardRanks = observer((): JSX.Element => {
  const { wizardStore } = useContext(StoreContext);
  const loadedWizards = Object.keys(wizardStore.wizards).length !== 0;
  const wizards = Object.values(wizardStore.wizards).sort((a, b) =>
    a.id > b.id ? 1 : b.id > a.id ? -1 : 0,
  );

  const [wizard, setWizard] = useState<Wizard | null>(null);
  useEffect(() => {
    setWizard(wizardStore.wizards[Object.keys(wizardStore.wizards)[0]]);
  }, [wizardStore.wizards]);

  return (
    <div className="flex flex-grow bg-cave">
      {/* Rankings */}
      <div className="flex w-full lg:w-3/4 overflow-auto p-4 flex-wrap justify-between">
        {loadedWizards &&
          wizards.map((w) => {
            return (
              <div
                key={w.id}
                onClick={() => setWizard(wizardStore.wizards[w.id])}
                className="m-2 w-1/6 text-white text-sm bg-tower shadow-lg p-2 flex flex-col cursor-pointer"
              >
                <span className="flex flex-grow">{w.name}</span>
                <div className="flex items-center justify-center pt-4">
                  <Image
                    width={75}
                    height={75}
                    src={`https://www.forgottenrunes.com/api/art/wizards/${w.id}/nobg`}
                    alt={`${w.name}`}
                  />
                </div>
                <div className="flex flex-col text-xs mt-2">
                  <span>{w.traits.length} Traits</span>
                  <span>{w.attunement}% Attuned</span>
                </div>
              </div>
            );
          })}
      </div>
      {/* Preview */}
      <div className="hidden lg:flex bg-gradient-to-b from-cave to-tower lg:w-1/4 border-l border-skull px-4 pt-4 text-white flex-col items-center">
        <div className="text-xl">{wizard ? wizard.name : 'Loading...'}</div>
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
          {wizard && (
            <div className="absolute z-10 pt-4">
              <Image
                width={150}
                height={150}
                src={`https://www.forgottenrunes.com/api/art/wizards/${wizard.id}/nobg`}
                alt={`${wizard.name}`}
              />
            </div>
          )}
          <div className="flex flex-col items-center h-64 absolute z-10 transform translate-y-80 bg-depths w-64 border-2 border-skull p-4 overflow-auto shadow-lg">
            {wizard ? (
              <>
                <div className="pb-2">Traits</div>
                <div className="text-sm w-full space-y-2">
                  {wizard.traits.map((t) => (
                    <TraitItem
                      key={`${wizard.id}-${t.id}`}
                      trait={t.type}
                      name={t.name}
                      rarity="Rare"
                    />
                  ))}
                </div>
                <div className="py-2">Affinities</div>
                <div className="text-sm w-full space-y-2">
                  {wizard.traits.map((t) => (
                    <TraitItem
                      key={`${wizard.id}-${t.id}`}
                      trait={t.type}
                      name={t.name}
                      rarity="Rare"
                    />
                  ))}
                </div>
              </>
            ) : (
              <span>Loading...</span>
            )}
          </div>
          <div className="flex pt-16">
            <Image src={towerImage} alt="Wizard Tower" />
          </div>
        </div>
      </div>
    </div>
  );
});

export default WizardRanks;
