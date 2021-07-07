import { action, extendObservable } from 'mobx';

export class StateStore {
  public showFilter = false;
  public affinity?: number;
  public trait?: number;

  constructor() {
    extendObservable(this, {
      showFilter: this.showFilter,
      affinity: this.affinity,
      trait: this.trait,
    });
  }

  setShowFilter = action((showFilter: boolean) => (this.showFilter = showFilter));

  setAffinity = action((affinity: number) => (this.affinity = affinity));

  setTrait = action((trait: number) => (this.trait = trait));
}
