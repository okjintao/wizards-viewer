import { ChainNetwork } from './enums/chain-network.enum';
import { Provider } from './enums/provider.enum';

export const DEFAULT_RPC = {
  [ChainNetwork.Ethereum]: Provider.Ethereum,
};

const rpc = {
  [ChainNetwork.Ethereum]: process.env.NEXT_PUBLIC_ETH_RPC || Provider.Ethereum,
};

export default rpc;
