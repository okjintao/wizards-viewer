import { action, extendObservable, observe } from 'mobx';
import { RankMap } from '../interface/rank-map.interface';
import { WizardData } from '../interface/wizard-data.interface';
import { WizardSummary } from '../interface/wizard-summary.interface';
import summary from '../wizard-summary.json';
import { RootStore } from './RootStore';

export class RankStore {
  private store: RootStore;
  public wizardSummary: WizardSummary;
  public ranking: WizardData[];
  public includeTraitCount = false;
  public includeName = false;
  public isSorting = false;
  public showUser = false;
  public cutoff?: number;
  public filter?: string;

  constructor(store: RootStore) {
    this.store = store;
    this.wizardSummary = summary;
    Object.values(this.wizardSummary.wizards).forEach((wizard, i) => {
      wizard.traits = wizard.traits.sort((a, b) => this.getRarity(a) - this.getRarity(b));
      wizard.image = wizard.image.replace('ipfs://', 'https://ipfs.io/ipfs/');
      wizard.id = i;
    });
    this.ranking = this.evaluateRank();

    const rankObeserver = extendObservable(this, {
      ranking: this.ranking,
      includeTraitCount: this.includeTraitCount,
      includeName: this.includeName,
      cutoff: this.cutoff,
      filter: this.filter,
      showUser: this.showUser,
    });

    observe(rankObeserver, (_change) => {
      if (this.isSorting) {
        return;
      }
      this.isSorting = true;
      this.ranking = this.evaluateRank();
      this.store.user.wizards = this.evaluateRank(this.store.user.wizards);
      this.isSorting = false;
    });
  }

  get searchOptions(): string[] {
    const traits = Object.keys(this.wizardSummary.traitOccurences);
    const traitCounts = Object.keys(this.wizardSummary.traitCounts).map((key) => `${key} traits`);
    const nameLengths = Object.keys(this.wizardSummary.nameLengths).map((key) => `${key} part name`);
    return [...traits, ...traitCounts, ...nameLengths];
  }

  get wizards(): WizardData[] {
    let userWizards: RankMap = {};
    if (this.store.user.wizards) {
      userWizards = Object.fromEntries(this.store.user.wizards.map((wizard) => [wizard.id, wizard.rank]));
    }
    return this.ranking.filter((wizard) => {
      if (this.showUser && !userWizards[wizard.id!]) {
        return false;
      }
      if (!this.filter) {
        return true;
      }

      const localFilter = this.filter.toLowerCase();

      // match exact words / partials
      const nameMatch = wizard.name.toLowerCase().includes(localFilter);
      const traitMatch = wizard.traits.some((trait) => trait.toLowerCase().includes(localFilter));

      // match ranking / serial number look ups
      let serialMatch = false;
      let rankMatch = false;
      if (!isNaN(parseFloat(localFilter))) {
        const numericFilter = Number(localFilter);
        serialMatch = wizard.id === numericFilter;
        rankMatch = wizard.rank === numericFilter;
      }

      // match trait count look up
      let traitCountMatches = false;
      try {
        const [traitCount, maybeTraits] = localFilter.split(' ');
        if (!isNaN(parseFloat(traitCount)) && maybeTraits.toLowerCase() === 'traits') {
          traitCountMatches = wizard.traitCount === Number(traitCount);
        }
      } catch {}

      // match name length look up
      let nameLengthMatches = false;
      try {
        const maybeNameSearch = localFilter.split(' ');
        if (!isNaN(parseFloat(maybeNameSearch[0])) && maybeNameSearch.slice(1).join(' ') === 'part name') {
          nameLengthMatches = wizard.nameLength === Number(maybeNameSearch[0]);
        }
      } catch {}

      return nameMatch || traitMatch || rankMatch || serialMatch || traitCountMatches || nameLengthMatches;
    });
  }

  evaluateRank(wizards?: WizardData[]): WizardData[] {
    return Object.values(wizards ?? this.wizardSummary.wizards)
      .slice()
      .sort((a, b) => this.score(a) - this.score(b))
      .map((w, i) => {
        w.rank = i + 1;
        return w;
      });
  }

  score(wizard: WizardData): number {
    let score = 1;

    const traitCount = this.cutoff ?? wizard.traitCount;
    for (let i = 0; i < traitCount; i++) {
      score *= this.getRarity(wizard.traits[i]);
    }

    if (this.includeTraitCount) {
      score *= this.getCountRarity(wizard.traitCount);
    }

    if (this.includeName) {
      score *= this.getNameRarity(wizard.nameLength);
    }

    return score;
  }

  getRarity(trait: string): number {
    return this.getRarityOccurence(trait) / this.wizardSummary.totalWizards;
  }

  getRarityOccurence(trait: string) {
    return this.wizardSummary.traitOccurences[trait];
  }

  getCountRarity(count: number): number {
    return this.wizardSummary.traitCounts[count] / this.wizardSummary.totalWizards;
  }

  getNameRarity(length: number): number {
    return this.wizardSummary.nameLengths[length] / this.wizardSummary.totalWizards;
  }

  toggleIncludeCount = action(() => {
    if (this.isSorting) {
      return;
    }
    this.includeTraitCount = !this.includeTraitCount;
  });

  toggleIncludeName = action(() => {
    if (this.isSorting) {
      return;
    }
    this.includeName = !this.includeName;
  });

  setShowUser = action((showUser: boolean) => {
    this.showUser = showUser;
  });

  search = action((filter?: string) => {
    if (this.isSorting) {
      return;
    }
    this.store.info.setExpanded(undefined);
    this.filter = filter;
  });
}
