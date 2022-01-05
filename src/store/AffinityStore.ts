import { makeAutoObservable } from 'mobx';
import { Affinity } from '../utils/interfaces/affinity.interface';
import { RootStore } from './RootStore';

export class AffinityStore {
  private store: RootStore;
  public affinities: Record<string, Affinity>;

  constructor(store: RootStore) {
    this.store = store;
    this.affinities = {};
    makeAutoObservable(this);
    this.loadAffinities();
  }

  async loadAffinities(): Promise<void> {
    const { data, status } = await this.store.client.get('/affinities');
    if (status !== 200) {
      return;
    }
    this.affinities = data;
  }
}
