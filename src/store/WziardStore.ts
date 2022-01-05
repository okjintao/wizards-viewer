import { makeAutoObservable } from 'mobx';
import { Wizard } from '../utils/interfaces/wizard.interface';
import { RootStore } from './RootStore';

export class WizardStore {
  private store: RootStore;
  public wizards: Record<string, Wizard>;

  constructor(store: RootStore) {
    this.store = store;
    this.wizards = {};
    makeAutoObservable(this);
    this.loadWizards();
  }

  async loadWizards(): Promise<void> {
    const { data, status } = await this.store.client.get('/wizards');
    if (status !== 200) {
      return;
    }
    this.wizards = data;
  }
}
