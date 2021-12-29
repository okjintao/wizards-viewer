import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect, useState } from 'react';
import { StoreContext } from '../../store/StoreContext';
import { Trait } from '../../utils/interfaces/trait.interface';
import Image from 'next/image';

const Traits = observer(() => {
  const { traitStore } = useContext(StoreContext);
  const isLoading = Object.keys(traitStore.traits).length === 0;

  const [trait, setTrait] = useState<Trait | null>(null);

  useEffect(() => {
    setTrait(traitStore.traits[149]);
  }, [traitStore.traits]);

  return (
    <div className="flex bg-depths text-white w-full">
      <div className="flex flex-col overflow-auto w-1/6">
        {!isLoading &&
          Object.values(traitStore.traits).map((trait) => {
            return (
              <div
                key={trait.id}
                onClick={() => setTrait(traitStore.traits[trait.id])}
                className="flex w-full bg-sky hover:bg-depths px-4 py-1 border border-skull cursor-pointer"
              >
                {trait.name}
              </div>
            );
          })}
      </div>
      <div className="flex flex-col w-5/6 p-4">
        <div className="text-2xl text-raspberry">What is a Trait?</div>
        <div className="flex flex-col space-y-4">
          <div>
            {
              "A trait is a visual property of your wizard. These properties span \
              six categories: Background, Prop, Rune, Head, Body, and Familiar. \
              Most traits, excluding backgrounds, in the Forgotten Runes Wizard's \
              Cult are included in one or more affinities. While rare, it is \
              possible a trait has no affinities."
            }
          </div>
          <div>
            Traits have two different affinity types: Identity Affinity and
            Positive Affinity. The first are affinities that the trait embodies
            - it is that affinity. The second are affinities that trait is drawn
            to - they are more likely to occur together.
          </div>
        </div>
        {trait && (
          <div className="flex flex-col mt-4">
            <div className="text-raspberry text-2xl">{trait.name}</div>
            <div>(Trait {trait.id})</div>
            <div className="flex">
              <div className="flex flex-col">
                <Image
                  alt="Trait Image"
                  src={`/img/traits/${trait.id}.png`}
                  width={150}
                  height={150}
                />
                Affinity Stuff
              </div>
              <div className="p-2 ml-4">
                <div>
                  Trait type:{' '}
                  {trait.type.charAt(0).toUpperCase() + trait.type.slice(1)}
                </div>
                <div>Frequency: {trait.frequency}</div>
                <div>Percentage: {(trait.frequency / 100).toFixed(2)}%</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

export default Traits;
