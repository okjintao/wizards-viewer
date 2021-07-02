import { action, extendObservable } from 'mobx';

export class InfoStore {
  public expanded?: number;

  constructor() {
    extendObservable(this, {
      expanded: this.expanded,
    });
  }

  setExpanded = action((expanded?: number) => {
    this.expanded = this.expanded !== expanded ? expanded : undefined;
  });
}
