import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect, useState } from 'react';
import { StoreContext } from '../../store/StoreContext';
import { Affinity } from '../../utils/interfaces/affinity.interface';

const Affinites = observer((): JSX.Element => {
  const { affinityStore } = useContext(StoreContext);
  const isLoading = Object.keys(affinityStore.affinities).length === 0;

  const [affinity, setAffinity] = useState<Affinity | null>(null);

  useEffect(() => {
    setAffinity(affinityStore.affinities[149]);
  }, [affinityStore.affinities]);

  return (
    <div className="flex flex-grow bg-depths text-white w-full">
      <div className="flex flex-col overflow-auto w-1/6">
        {!isLoading &&
          Object.values(affinityStore.affinities).map((affinity) => {
            return (
              <div
                key={affinity.id}
                onClick={() =>
                  setAffinity(affinityStore.affinities[affinity.id])
                }
                className="flex w-full bg-sky hover:bg-depths px-4 py-1 border border-skull cursor-pointer"
              >
                {affinity.name}
              </div>
            );
          })}
      </div>
      <div className="flex flex-col w-5/6 p-4">
        <div className="text-2xl text-raspberry">What is an Affinity?</div>
        <div className="mt-4 space-y-4">
          <div>
            {
              "Within the realm of the Forgotten Runes Wizard's Cult there are \
              overarching themes or ideas known as affinities. As of now, these \
              affinities have no names - they are only referred to by a numeric \
              id. All components of a wizard (body, familiar, etc.) are associated \
              with one or many affinities. The combination of these affinities \
              make up a wizard's overall affinity. Any given wizard's maximum \
              affinity would be the number of traits they have."
            }
          </div>
          <div>
            As these affinities currently have no names, it is impossible to
            qualify them or provide searchable terms for them. Thus, as a
            community, we should name these affinities to have common
            terminology to discuss them.
          </div>
        </div>
      </div>
    </div>
  );
});

export default Affinites;
