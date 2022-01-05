import { Chain } from './chain';
import { ChainNetwork } from './enums/chain-network.enum';

export class Ethereum extends Chain {
  constructor() {
    super(
      'Ethereum',
      '0x1',
      ChainNetwork.Ethereum,
      'https://infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
      'https://etherscan.io/',
    );
  }
}
