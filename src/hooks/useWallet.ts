import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core';
import { useCallback } from 'react';
import { toast } from 'react-toastify';
import { ConnectorType } from '../config/network/enums/connector-type.enum';
import { Ethereum } from '../config/network/eth.network';
import { connectorsByType } from '../config/web3/providers.config';
import { switchOrAddNetwork } from '../utils/network.utils';

export const DEFAULT_NETWORK = new Ethereum();

export interface WalletFunctions {
  connect: (type: ConnectorType) => void;
  disconnect: () => void;
}

const useWallet = (): WalletFunctions => {
  const { activate, deactivate } = useWeb3React();

  const connect = useCallback(
    (type: ConnectorType) => {
      const connector = connectorsByType[type];
      if (connector) {
        activate(connector, async (error: Error) => {
          if (error instanceof UnsupportedChainIdError) {
            const successfulSwap = await switchOrAddNetwork(DEFAULT_NETWORK);
            if (successfulSwap) {
              await activate(connector);
            }
          } else {
            toast('Authorize wallet to access your account', {
              position: 'bottom-right',
              type: 'info',
            });
          }
        });
      } else {
        toast('Unsupported wallet connector', {
          position: 'bottom-right',
          type: 'info',
        });
      }
    },
    [activate],
  );

  const disconnect = useCallback(() => {
    deactivate();
  }, [deactivate]);

  return { connect, disconnect };
};

export default useWallet;
