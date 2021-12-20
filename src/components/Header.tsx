import React from 'react';
import ConnectButton from './ConnectButton';

function Header(): JSX.Element {
  return (
    <div className="bg-haze flex justify-end items-center border-b border-skull p-4">
      <ConnectButton />
    </div>
  );
}

export default Header;
