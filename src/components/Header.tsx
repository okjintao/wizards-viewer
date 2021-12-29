import React from 'react';
import ConnectButton from './ConnectButton';

function Header(): JSX.Element {
  return (
    <div className="bg-depths flex justify-end items-center border-b border-skull p-4 shadow-lg">
      <ConnectButton />
    </div>
  );
}

export default Header;
