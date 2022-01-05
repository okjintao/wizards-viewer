import { makeAutoObservable } from 'mobx';
import { Trait } from '../utils/interfaces/trait.interface';
import { RootStore } from './RootStore';

export class TraitStore {
  private store: RootStore;
  public traits: Record<string, Trait>;

  constructor(store: RootStore) {
    this.store = store;
    this.traits = {};
    makeAutoObservable(this);
    this.loadTraits();
  }

  async loadTraits(): Promise<void> {
    const { data, status } = await this.store.client.get('/traits');
    if (status !== 200) {
      return;
    }
    this.traits = data;
  }
}
