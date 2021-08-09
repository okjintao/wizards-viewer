import { action, extendObservable } from 'mobx';

export class StateStore {
  public showFilter = true;
  public wizard?: number;
  public affinity?: number;
  public trait?: number;

  constructor() {
    extendObservable(this, {
      showFilter: this.showFilter,
      wizard: this.wizard,
      affinity: this.affinity,
      trait: this.trait,
    });
  }

  setShowFilter = action((showFilter: boolean) => (this.showFilter = showFilter));

  setWizard = action((wizard?: number) => {
    if (this.wizard === wizard) {
      this.wizard = undefined;
    } else {
      this.wizard = wizard;
    }
  });

  setAffinity = action((affinity: number) => (this.affinity = affinity));

  setTrait = action((trait: number) => (this.trait = trait));
}
