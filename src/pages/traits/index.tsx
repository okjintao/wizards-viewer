import React from 'react';

function Traits(): JSX.Element {
  return (
    <div className="flex flex-grow bg-depths text-white p-4">
      <div className="w-72">
        <div className="text-2xl text-raspberry">What is a Trait?</div>
        <div className="mt-4 space-y-4">
          <p>
            A trait is a visual property of your wizard. These properties span
            six categories: Background, Prop, Rune, Head, Body, and Familiar.
            Most traits, excluding backgrounds, in the Forgotten Runes Wizard's
            Cult are included in one or more affinities. While rare, it is
            possible a trait has no affinities.
          </p>
          <p>
            Traits have two different affinity types: Identity Affinity and
            Positive Affinity. The first are affinities that the trait embodies
            - it is that affinity. The second are affinities that trait is drawn
            to - they are more likely to occur together.
          </p>
        </div>
      </div>
      <div className="flex flex-grow"></div>
    </div>
  );
}

export default Traits;
