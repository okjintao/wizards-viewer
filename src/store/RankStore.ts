import { action, extendObservable, observe } from 'mobx';
import { RankMap } from '../interface/rank-map.interface';
import { ScoreStats } from '../interface/score-stats.interface';
import { WizardData } from '../interface/wizard-data.interface';
import { WizardSummary } from '../interface/wizard-summary.interface';
import summary from '../wizard-summary.json';
import { RootStore } from './RootStore';

export class RankStore {
  private store: RootStore;
  private baseScore = 1000;
  private scoreStats: ScoreStats;
  public wizardSummary: WizardSummary;
  public ranking: WizardData[];
  public custom = false;
  public isSorting = false;
  public showUser = false;
  public maxAffinity = false;
  public maxPercent = false;
  public cutoff?: number;
  public filter?: string;

  constructor(store: RootStore) {
    this.store = store;
    this.wizardSummary = summary as WizardSummary;

    const { wizards, traitOccurences, totalWizards } = this.wizardSummary;
    Object.entries(wizards).forEach((entry) => {
      const [id, wizard] = entry;
      this.wizardSummary.wizards[id].affinityWeight = this.getAffinityWeight(wizard);
    });
    const weights = Object.values(wizards)
      .map((wizard) => wizard.affinityWeight)
      .filter((val): val is number => !!val);

    const counts = Object.values(traitOccurences).map((count) => count / totalWizards);
    const affinityRarities = Object.values(wizards).map((wizard) => this.getAffinityRarity(wizard.maxAffinity));
    const primaryRarities = Object.values(wizards).map((wizard) => this.getTraitsRarity(wizard, true));
    const secondaryRarities = Object.values(wizards).map((wizard) => this.getTraitsRarity(wizard, false));
    const compositeRarities = Object.values(wizards).map(
      (wizard) => this.getTraitsRarity(wizard, true) * this.getTraitsRarity(wizard, false),
    );
    this.scoreStats = {
      minAffinityWeight: Math.min(...weights),
      maxAffinityWeight: Math.max(...weights),
      minAffinityRarity: Math.min(...affinityRarities),
      maxAffinityRarity: Math.max(...affinityRarities),
      minTraitCountRarity: Math.min(...counts),
      maxTraitCountRarity: Math.max(...counts),
      minTraitRarity: Math.min(...compositeRarities),
      maxTraitRarity: Math.max(...compositeRarities),
      minPrimarityTraitRarity: Math.min(...primaryRarities),
      maxPrimarityTraitRarity: Math.max(...primaryRarities),
      minSecondaryTraitRarity: Math.min(...secondaryRarities),
      maxSecondaryTraitRarity: Math.max(...secondaryRarities),
    };
    this.ranking = this.evaluateRank();

    const rankObeserver = extendObservable(this, {
      ranking: this.ranking,
      custom: this.custom,
      cutoff: this.cutoff,
      filter: this.filter,
      showUser: this.showUser,
      maxAffinity: this.maxAffinity,
      maxPercent: this.maxPercent,
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
    const affinityCounts = Object.keys(this.wizardSummary.affinityOccurences).map((key) => `${key} affinity`);
    return [...traits, ...traitCounts, ...nameLengths, ...affinityCounts];
  }

  get wizards(): WizardData[] {
    let userWizards: RankMap = {};
    const { wizards } = this.store.user;
    if (wizards) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      userWizards = Object.fromEntries(wizards.map((wizard) => [wizard.idx, wizard.rank!]));
    }
    return this.ranking.filter((wizard) => {
      if (this.showUser && !userWizards[wizard.idx]) {
        return false;
      }
      const affinityCount = wizard.affinities[wizard.maxAffinity];
      if (this.maxAffinity && affinityCount < 5) {
        return false;
      }
      if (this.maxPercent && affinityCount < Object.keys(wizard.traits).length - 1) {
        return false;
      }
      if (!this.filter) {
        return true;
      }

      const localFilter = this.filter.toLowerCase();

      // match exact words / partials
      const nameMatch = wizard.name.toLowerCase().includes(localFilter);
      const traitMatch = Object.values(wizard.traits).some((trait) => trait.toLowerCase().includes(localFilter));

      // match ranking / serial number look ups
      let serialMatch = false;
      let rankMatch = false;
      if (!isNaN(parseFloat(localFilter))) {
        const numericFilter = Number(localFilter);
        serialMatch = wizard.idx === numericFilter;
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

      // match name length look up
      let affinityMatches = false;
      try {
        const maybeAffinitySearch = localFilter.split(' ');
        if (!isNaN(parseFloat(maybeAffinitySearch[0])) && maybeAffinitySearch.slice(1).join(' ') === 'affinity') {
          const numericAffinity = Number(maybeAffinitySearch[0]);
          affinityMatches = wizard.maxAffinity === numericAffinity;
          if (!affinityMatches) {
            affinityMatches = Object.keys(wizard.affinities).some((key) => Number(key) === numericAffinity);
          }
        }
      } catch {}

      return (
        nameMatch || traitMatch || rankMatch || serialMatch || traitCountMatches || nameLengthMatches || affinityMatches
      );
    });
  }

  evaluateRank(wizards?: WizardData[]): WizardData[] {
    return Object.values(wizards ?? this.wizardSummary.wizards)
      .slice()
      .sort((a, b) => this.score(b) - this.score(a))
      .map((w, i) => {
        w.rank = i + 1;
        w.score = this.score(w);
        return w;
      });
  }

  private getAffinityWeight(wizard: WizardData): number {
    const affinityWeight = Object.values(wizard.affinities).reduce(
      (total, value) => (total += Math.pow(2, value ** 2)),
      0,
    );
    const normalizedWeight = Object.values(wizard.affinities).length * 5;
    return affinityWeight / normalizedWeight;
  }

  private getTraitsRarity(wizard: WizardData, primary: boolean): number {
    const traits = Object.values(wizard.traits)
      .map((trait) => this.getRarity(trait))
      .sort((a, b) => a - b);
    let evaluated: number[] = [];
    if (primary) {
      evaluated = traits.slice(0, 3);
    } else {
      evaluated = traits.slice(3);
    }
    return evaluated.reduce((total, value) => (total *= value), 1);
  }


  private scoreFromRange(min: number, max: number, val: number): number {
    const range = max - min;
    const offset = val - min;
    const minPercentile = 0.2;
    const percentile = (offset / range) * 0.8;
    return this.baseScore * (minPercentile + percentile);
  };

  private reverseScoreFromRange(min: number, max: number, val: number): number {
    const score = this.scoreFromRange(min, max, val);
    return this.baseScore - score + this.baseScore * 0.2;
  };

  score(wizard: WizardData): number {
    const {
      minAffinityWeight,
      maxAffinityWeight,
      minAffinityRarity,
      maxAffinityRarity,
      minTraitCountRarity,
      maxTraitCountRarity,
      minTraitRarity,
      maxTraitRarity,
      minPrimarityTraitRarity,
      maxPrimarityTraitRarity,
      minSecondaryTraitRarity,
      maxSecondaryTraitRarity,
    } = this.scoreStats;

    if (!this.custom) {
      const rarity = Object.values(wizard.traits).reduce((total, t) => total * this.getRarity(t), 1);
      return this.reverseScoreFromRange(minTraitRarity, maxTraitRarity, rarity);
    }

    // trait score calculation

    const primary = this.getTraitsRarity(wizard, true);
    const primaryScore = this.reverseScoreFromRange(minPrimarityTraitRarity, maxPrimarityTraitRarity, primary);
    const secondary = this.getTraitsRarity(wizard, false);
    const secondaryScore = this.reverseScoreFromRange(minSecondaryTraitRarity, maxSecondaryTraitRarity, secondary);
    const frequency = this.getCountRarity(wizard.traitCount);
    const frequencyScore = this.reverseScoreFromRange(minTraitCountRarity, maxTraitCountRarity, frequency);
    const traitCompositeScore = frequencyScore * 0.2 + primaryScore * 0.7 + secondaryScore * 0.1;

    // affinity score calculations

    const affinityCount = wizard.affinities[wizard.maxAffinity];
    const isMaxAffinity = affinityCount === 5;
    const affinityWeight = this.getAffinityWeight(wizard);
    const affinityRarity = this.getAffinityRarity(wizard.maxAffinity);
    const affinityRarityScore = this.reverseScoreFromRange(minAffinityRarity, maxAffinityRarity, affinityRarity);
    const maxAffinityScore = isMaxAffinity ? this.baseScore : 0;
    const affinityPercentileScore = this.scoreFromRange(minAffinityWeight, maxAffinityWeight, affinityWeight);
    const affinityCompositeScore = affinityRarityScore * 0.2 + maxAffinityScore * 0.2 + affinityPercentileScore * 0.6;

    return affinityCompositeScore * 0.375 + traitCompositeScore * 0.625;
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

  getAffinityOccurence(affinity: number) {
    return this.wizardSummary.affinityOccurences[affinity.toString()];
  }

  getAffinityRarity(affinity: number): number {
    return this.getAffinityOccurence(affinity) / this.wizardSummary.totalWizards;
  }

  toggleCustom = action(() => {
    if (this.isSorting) {
      return;
    }
    this.custom = !this.custom;
  });

  toggleMaxAffinity = action(() => {
    if (this.isSorting) {
      return;
    }
    this.maxAffinity = !this.maxAffinity;
  });

  toggleMaxPercent = action(() => {
    if (this.isSorting) {
      return;
    }
    this.maxPercent = !this.maxPercent;
  });

  setShowUser = action((showUser: boolean) => {
    this.showUser = showUser;
    this.search(undefined);
  });

  search = action((filter?: string) => {
    if (this.isSorting) {
      return;
    }
    this.store.state.setWizard(undefined);
    this.filter = filter;
  });
}
