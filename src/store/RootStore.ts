import { Chain } from '../config/network/chain';
import { Ethereum } from '../config/network/eth.network';
import { NetworkStore } from './NetworkStore';
import axios, { AxiosInstance } from 'axios';
import { TraitStore } from './TraitStore';
import { AffinityStore } from './AffinityStore';

export class RootStore {
  private chains: Chain[];
  public client: AxiosInstance;
  public networkStore: NetworkStore;
  public traitStore: TraitStore;
  public affinityStore: AffinityStore;

  constructor() {
    this.chains = [new Ethereum()];
    this.client = axios.create({
      baseURL: 'https://api.wizards.guide',
    });
    this.networkStore = new NetworkStore(this);
    this.traitStore = new TraitStore(this);
    this.affinityStore = new AffinityStore(this);
  }
}
