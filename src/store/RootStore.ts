import { Chain } from '../config/network/chain';
import { Ethereum } from '../config/network/eth.network';
import { NetworkStore } from './NetworkStore';

export class RootStore {
  private chains: Chain[];
  public networkStore: NetworkStore;

  constructor() {
    this.chains = [new Ethereum()];
    this.networkStore = new NetworkStore(this);
  }
}
