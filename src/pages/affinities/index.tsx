import React from 'react';

function Traits(): JSX.Element {
  return (
    <div className="flex flex-grow bg-depths text-white p-4">
      <div className="w-72">
        <div className="text-2xl text-raspberry">What is an Affinity?</div>
        <div className="mt-4 space-y-4">
          <p>
            {
              "Within the realm of the Forgotten Runes Wizard's Cult there are \
              overarching themes or ideas known as affinities. As of now, these \
              affinities have no names - they are only referred to by a numeric \
              id. All components of a wizard (body, familiar, etc.) are associated \
              with one or many affinities. The combination of these affinities \
              make up a wizard's overall affinity. Any given wizard's maximum \
              affinity would be the number of traits they have."
            }
          </p>
          <p>
            As these affinities currently have no names, it is impossible to
            qualify them or provide searchable terms for them. Thus, as a
            community, we should name these affinities to have common
            terminology to discuss them.
          </p>
        </div>
      </div>
      <div className="w-3/4"></div>
    </div>
  );
}

export default Traits;
