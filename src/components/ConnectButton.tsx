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
      className="flex text-sm px-3 py-2 tracking-tight bg-haze text-white border border-gray-50 w-2/12 lg:w-1/12 cursor-pointer justify-center"
      onClick={handleClick}
    >
      {!active && <div>{text}</div>}
      {active && <div>{account.slice(0, 8)}</div>}
    </div>
  );
});

export default ConnectButton;
