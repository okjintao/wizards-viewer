import { toast } from 'react-toastify';
import { Chain } from '../config/network/chain';
import { DEFAULT_RPC } from '../config/network/rpc.config';

// https://docs.metamask.io/guide/rpc-api.html#other-rpc-methods
export async function switchOrAddNetwork(chain: Chain): Promise<boolean> {
  const { ethereum } = window;
  if (ethereum) {
    try {
      await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chain.chainId }],
      });
      return true;
    } catch (error) {
      if (error.code === 4902) {
        try {
          await ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: `0x${chain.chainId}`,
                chainName: chain.name,
                nativeCurrency: {
                  name: chain.network.toUpperCase(),
                  symbol: chain.network.toLowerCase(),
                  decimals: 18,
                },
                rpcUrls: [DEFAULT_RPC[chain.network]],
                blockExplorerUrls: [chain.explorer],
              },
            ],
          });
          return true;
        } catch (addError) {
          toast(`Unable to switch to or add ${chain.name}`, {
            position: 'bottom-right',
            type: 'error',
          });
          return false;
        }
      }
      return false;
    }
  }
  return false;
}
