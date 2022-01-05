import { makeAutoObservable } from 'mobx';
import { Chain } from '../config/network/chain';
import { DEFAULT_NETWORK } from '../hooks/useWallet';
import { RootStore } from './RootStore';

export class NetworkStore {
  private store: RootStore;
  public chain: Chain;
  public gasPrice?: number;

  constructor(store: RootStore) {
    this.store = store;
    this.chain = DEFAULT_NETWORK;
    makeAutoObservable(this);
  }
}
