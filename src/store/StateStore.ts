import { action, extendObservable } from 'mobx';

export class StateStore {
  public showFilter = false;
  public affinity?: number;

  constructor() {
    extendObservable(this, {
      showFilter: this.showFilter,
      affinity: this.affinity,
    });
  }

  setShowFilter = action((showFilter: boolean) => (this.showFilter = showFilter));

  setAffinity = action((affinity: number) => (this.affinity = affinity));
}
