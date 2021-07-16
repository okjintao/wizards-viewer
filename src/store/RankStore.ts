import { action, extendObservable, IObjectDidChange, observe } from 'mobx';
import { Score } from '../interface/score.interface';
import { ScoreStats } from '../interface/score-stats.interface';
import { WizardData } from '../interface/wizard-data.interface';
import { RootStore } from './RootStore';
import { WizardStore } from './WizardStore';

export class RankStore extends WizardStore {
  private baseScore = 1000;
  public scoreStats: ScoreStats;
  public ranking: WizardData[];
  public customRanking: WizardData[];
  public custom = true;
  public showUser = false;
  public maxAffinity = false;
  public maxPercent = false;
  public filter?: string;

  constructor(store: RootStore) {
    super(store);
    Object.entries(this.wizards).forEach((entry) => {
      const [id, wizard] = entry;
      this.wizards[id].affinityWeight = this.getAffinityWeight(wizard);
    });
    const weights = Object.values(this.wizards)
      .map((wizard) => wizard.affinityWeight)
      .filter((val): val is number => !!val);

    const counts = Object.values(this.traitOccurences).map((count) => count / this.totalWizards);
    const affinityRarities = Object.values(this.wizards).map((wizard) => this.getAffinityRarity(wizard.maxAffinity));
    const primaryRarities = Object.values(this.wizards).map((wizard) => this.getTraitsRarity(wizard, true));
    const secondaryRarities = Object.values(this.wizards).map((wizard) => this.getTraitsRarity(wizard, false));
    const compositeRarities = Object.values(this.wizards).map((wizard) =>
      Math.pow(this.getTraitsRarity(wizard, true) * this.getTraitsRarity(wizard, false), 0.01),
    );
    const nameScores = Object.values(this.wizards).map((wizard) => wizard.nameScore);
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
      minNameScore: Math.min(...nameScores),
      maxNameScore: Math.max(...nameScores),
    };
    this.customRanking = this.evaluateRank();
    this.custom = false;
    this.ranking = this.evaluateRank();
    this.updateUserWizards();

    const rankObeserver = extendObservable(this, {
      ranking: this.ranking,
      custom: this.custom,
      filter: this.filter,
      showUser: this.showUser,
      maxAffinity: this.maxAffinity,
      maxPercent: this.maxPercent,
    });

    observe(rankObeserver, (change: IObjectDidChange) => {
      if (change.name === 'custom') {
        this.updateUserWizards();
      }
    });
  }

  updateUserWizards() {
    const ranking = this.custom ? this.customRanking : this.ranking;
    const wizards = this.store.user.wizards ?? [];
    const userWizards = new Set(wizards.map((wizard) => wizard.id));
    this.store.user.wizards = ranking.filter((wizard) => userWizards.has(wizard.id));
  }

  get displayRanking(): WizardData[] {
    return this.custom ? this.customRanking : this.ranking;
  }

  get searchOptions(): string[] {
    const traits = Object.entries(this.traitMap)
      .filter((trait) => this.traitMap[trait[0]])
      .map((e) => e[1]);
    const traitCounts = Object.keys(this.traitCounts).map((key) => `${key} traits`);
    const affinityCounts = Object.keys(this.affinityOccurences).map((key) => `${key} affinity`);
    const locations = Object.values(this.wizards)
      .filter((w) => w.location)
      .map((w) => w.location)
      .map((key) => `location: ${key}`);
    const titles = Object.values(this.wizards)
      .filter((w) => w.title)
      .map((w) => w.title)
      .map((key) => `title: ${key}`);
    return [...traits, ...traitCounts, ...affinityCounts, ...locations, ...titles];
  }

  get display(): WizardData[] {
    let displayList: WizardData[] = [];
    const { wizards } = this.store.user;
    if (this.showUser) {
      displayList = wizards ? wizards : [];
    } else {
      displayList = this.custom ? this.customRanking : this.ranking;
    }
    return displayList.filter((wizard) => {
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

      const localFilter = this.filter;

      // match exact words / partials
      const nameMatch = wizard.name.toLowerCase().includes(localFilter);
      const traitMatch = Object.values(wizard.traits).some((trait) => trait.includes(localFilter));

      // match ranking / serial number look ups
      let serialMatch = false;
      let rankMatch = false;
      if (!isNaN(parseFloat(localFilter))) {
        const numericFilter = Number(localFilter);
        serialMatch = Number(wizard.id) === numericFilter;
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

      return nameMatch || traitMatch || rankMatch || serialMatch || traitCountMatches || affinityMatches;
    });
  }

  evaluateRank(): WizardData[] {
    const wizards: WizardData[] = JSON.parse(JSON.stringify(Object.values(this.wizards)));
    return wizards
      .sort((a, b) => this.score(b).total - this.score(a).total)
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
    const normalizedWeight = Object.values(wizard.affinities).reduce(
      (total, value) => (total += Math.pow(2, (6 - value) ** 2)),
      0,
    );
    return affinityWeight / normalizedWeight;
  }

  private getTraitsRarity(wizard: WizardData, primary: boolean): number {
    const traits = Object.keys(wizard.traits)
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
  }

  private reverseScoreFromRange(min: number, max: number, val: number): number {
    const score = this.scoreFromRange(min, max, val);
    return this.baseScore - score + this.baseScore * 0.2;
  }

  score(wizard: WizardData): Score {
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
      minNameScore,
      maxNameScore,
    } = this.scoreStats;

    if (!this.custom) {
      const rarity = Object.keys(wizard.traits).reduce((total, t) => (total *= this.getRarity(t)), 1);
      const score = this.reverseScoreFromRange(minTraitRarity, maxTraitRarity, Math.pow(rarity, 0.01));
      return {
        affinity: 0,
        trait: 0,
        name: 0,
        total: score,
      };
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

    // const name score calculations
    const nameRawScore = this.scoreFromRange(minNameScore, maxNameScore, wizard.nameScore);

    const affinity = affinityCompositeScore * 0.4;
    const trait = traitCompositeScore * 0.4;
    const name = nameRawScore * 0.2;
    const total = affinity + trait + name;
    return { affinity, trait, name, total };
  }

  getRarity(trait: string): number {
    return this.getRarityOccurence(trait) / this.totalWizards;
  }

  getRarityOccurence(trait: string) {
    return this.traitOccurences[trait];
  }

  getCountRarity(count: number): number {
    return this.traitCounts[count] / this.totalWizards;
  }

  getAffinityOccurence(affinity: number) {
    return this.affinityOccurences[affinity.toString()];
  }

  getAffinityRarity(affinity: number): number {
    return this.getAffinityOccurence(affinity) / this.totalWizards;
  }

  toggleCustom = action(() => {
    this.custom = !this.custom;
  });

  toggleMaxAffinity = action(() => {
    this.maxAffinity = !this.maxAffinity;
  });

  toggleMaxPercent = action(() => {
    this.maxPercent = !this.maxPercent;
  });

  setShowUser = action((showUser: boolean) => {
    if (this.showUser === showUser) {
      return;
    }
    this.showUser = showUser;
  });

  search = action((filter?: string) => {
    this.store.state.setWizard(undefined);
    this.filter = filter;
  });
}
