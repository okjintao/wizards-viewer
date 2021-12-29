import { Chain } from '../config/network/chain';
import { Ethereum } from '../config/network/eth.network';
import { NetworkStore } from './NetworkStore';
import axios, { AxiosInstance } from 'axios';
import { TraitStore } from './TraitStore';

export class RootStore {
  private chains: Chain[];
  public client: AxiosInstance;
  public networkStore: NetworkStore;
  public traitStore: TraitStore;

  constructor() {
    this.chains = [new Ethereum()];
    this.client = axios.create({
      baseURL: 'https://api.wizards.guide',
    });
    this.networkStore = new NetworkStore(this);
    this.traitStore = new TraitStore(this);
  }
}
