import React from 'react';
import { useWeb3React } from '@web3-react/core';

export default function Home(): JSX.Element {
  const { active, library, account } = useWeb3React();
  return (
    <div className="flex flex-grow">

    </div>
  );
}
