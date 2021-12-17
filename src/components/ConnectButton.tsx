import { useWeb3React } from '@web3-react/core';
import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { ConnectorType } from '../config/network/enums/connector-type.enum';
import useWallet from '../hooks/useWallet';

interface Props {
  text?: string;
}

const ConnectButton = observer(({ text = 'Connect' }: Props): JSX.Element => {
  const { connect, disconnect } = useWallet();
  const { active, account } = useWeb3React();

  useEffect(() => {
    connect(ConnectorType.Injected);
  }, [connect]);

  async function handleClick() {
    if (!active) {
      connect(ConnectorType.Injected);
    } else {
      disconnect();
    }
  }

  return (
    <div
      className="flex flex-grow items-center justify-center w-full h-full text-sm px-3 py-2"
      onClick={handleClick}
    >
      {!active && <div className="text-md leading-tight">{text}</div>}
      {active && (
        <div className="text-md leading-tight">{account.slice(0, 8)}</div>
      )}
    </div>
  );
});

export default ConnectButton;
