import { ChainNetwork } from './enums/chain-network.enum';
import { ethers } from 'ethers';

type Chains = Record<string, Chain>;

export abstract class Chain {
  private static chains: Chains = {};
  readonly name: string;
  readonly chainId: string;
  readonly network: ChainNetwork;
  readonly explorer: string;
  readonly provider: ethers.providers.JsonRpcProvider;
  readonly batchProvider: ethers.providers.JsonRpcBatchProvider;

  constructor(
    name: string,
    chainId: string,
    network: ChainNetwork,
    rpcUrl: string,
    explorer: string,
  ) {
    this.name = name;
    this.chainId = chainId;
    this.network = network;
    this.provider = new ethers.providers.JsonRpcProvider(rpcUrl);
    this.batchProvider = new ethers.providers.JsonRpcBatchProvider(rpcUrl);
    this.explorer = explorer;
    Chain.register(this);
  }

  static register(chain: Chain): void {
    Chain.chains[parseInt(chain.chainId, 16)] = chain;
  }

  static getChain(chainId: number): Chain {
    const chain = this.chains[chainId];
    if (!chain) {
      throw new Error(`${chainId} is not a supported chain`);
    }
    return chain;
  }
}
