import { AffinityMap } from '../interface/affinity-map.interface';
import { FrequencyMap } from '../interface/frequency-map.interface';
import { TraitAffinityMap } from '../interface/trait-affinity-map.interface';
import { TraitMap } from '../interface/trait-map.interface';
import { WizardData } from '../interface/wizard-data.interface';
import { WizardMap } from '../interface/wizard-map.interface';
import { WizardSummary } from '../interface/wizard-summary.interface';
import { WizardSummary2 } from '../interface/wizard-summary-2.interface';
import wizardSummary from '../wizard-summary.json';
import { RootStore } from './RootStore';

export class WizardStore {
  protected store: RootStore;
  public totalWizards: number;
  public traitOccurences: FrequencyMap;
  public traitCounts: FrequencyMap;
  public affinityOccurences: FrequencyMap;
  public wizards: WizardMap;
  public traitMap: TraitMap;
  public traitsToAffinity: TraitAffinityMap;
  public affinityToTraits: AffinityMap;

  constructor(store: RootStore) {
    this.store = store;

    const summary = this.evaluateSummary();
    this.totalWizards = summary.totalWizards;
    this.traitOccurences = summary.traitOccurences;
    this.traitCounts = summary.traitCounts;
    this.affinityOccurences = summary.affinityOccurences;
    this.wizards = summary.wizards;
    this.traitMap = summary.traitMap;
    this.traitsToAffinity = summary.traitsToAffinity;
    this.affinityToTraits = summary.affinityToTraits;
  }

  private evaluateSummary(): WizardSummary {
    const summary: WizardSummary2 = wizardSummary;
    const { wizards: wizardMap, traits, traitMap } = summary;
    const wizards = Object.values(wizardMap);

    const traitToAffinities: AffinityMap = {};
    const affinityToTraits: AffinityMap = {};
    Object.entries(traits).forEach((e) => {
      const [id, trait] = e;
      const { identity, positive } = trait;
      const affinities = [...new Set([...identity, ...positive])];
      traitToAffinities[id] = affinities;
      affinities.forEach((affinity) => {
        if (!affinityToTraits[affinity]) {
          affinityToTraits[affinity] = [];
        }
        affinityToTraits[affinity] = [...new Set([...affinityToTraits[affinity], Number(id)])];
      });
    });

    const traitCounts: FrequencyMap = {};
    const traitOccurences: FrequencyMap = {};
    const affinityOccurences: FrequencyMap = {};
    wizards.forEach((wizard) => {
      wizard.traits.forEach((trait) => {
        this.count(traitOccurences, trait);
        if (trait !== 7777) {
          const traitAffinities = traitToAffinities[trait];
          traitAffinities.forEach((a) => this.count(affinityOccurences, a));
        }
      });
      this.count(traitCounts, wizard.traits.length);
    });

    const evaluatedWizards: WizardMap = Object.fromEntries(
      wizards.map((wizard) => {
        const { name, id, traits, image } = wizard;
        const affinityCounts: FrequencyMap = {};
        traits.flatMap((t) => traitToAffinities[t]).forEach((t) => this.count(affinityCounts, t));
        const maxKey = Object.entries(affinityCounts).sort((a, b) => b[1] - a[1])[0][0];
        const data = {
          name,
          id,
          traits: Object.fromEntries(traits.map((e) => [e, traitMap[e]])),
          traitCount: traits.length,
          affinities: affinityCounts,
          image,
          maxAffinity: Number(maxKey),
        };
        return [wizard.id, data];
      }),
    );

    return {
      traitOccurences,
      traitCounts,
      totalWizards: wizards.length,
      traitMap,
      affinityOccurences,
      traitsToAffinity: traits,
      affinityToTraits,
      wizards: evaluatedWizards,
    };
  }

  randomWizard(): WizardData {
    const wizardType = this.randomItem([
      'Black Mage',
      'Blue Mage',
      'Summoner',
      'Warlock',
      'White Mage',
      'Time Mage',
      'Evoker',
      'Conjurer',
      'Enchanter',
      'Acolyte',
      'High Magus',
    ]);
    const wizardName = this.randomItem([
      'Jintao',
      'Madness',
      'Larry',
      'Wilt',
      'Shual',
      'Sifu',
      'Creat0r',
      'Yyc',
      'Jrrrrrr',
      'TV',
      'Dpit',
      'Madotsuki',
    ]);
    const suffix = this.randomItem([
      '',
      ' of the Four Winds',
      ", Hand of A'dal",
      ', Slayer of Stupid, Incompetent and Disappointing Minions',
      ' the Immortal',
      ", Winter's Envoy",
      ' the Faceless One',
      ' the Astral Walker',
      ' of the Black Harvest',
      ', No Good, Dirty, Rotten, Candy Stealer!',
      ' the Awakened',
      ' the Crazy Cat Man',
      ' the Love Fool',
      ' the Stormbreaker',
    ]);
    const name = `${wizardType} ${wizardName}${suffix}`;
    const traitCount = this.randomItem([3, 4, 5, 6]);

    // traits
    const wizardTraits: TraitMap = {};
    const checkTrait = (entry: string[], expected: string): boolean => {
      const traitType = entry[1].split(': ')[0];
      return traitType === expected;
    };
    const pickTrait = (filter: string): void => {
      const traits = Object.fromEntries(Object.entries(this.traitMap).filter((e) => checkTrait(e, filter)));
      const key = this.randomItem(Object.keys(traits));
      wizardTraits[key] = traits[key];
    };

    pickTrait('background');
    pickTrait('head');
    pickTrait('body');
    if (traitCount > 3) {
      pickTrait('prop');
    }
    if (traitCount > 4) {
      pickTrait('rune');
    }
    if (traitCount > 5) {
      pickTrait('familiar');
    }

    const affinities: FrequencyMap = {};
    Object.keys(wizardTraits).forEach((trait) => {
      const mappedAffinities = this.traitsToAffinity[trait];
      const traitAffinities = [...new Set([...mappedAffinities.identity, ...mappedAffinities.positive])];
      traitAffinities.forEach((traitAffinity) => {
        if (!affinities[traitAffinity]) {
          affinities[traitAffinity] = 0;
        }
        affinities[traitAffinity] += 1;
      });
    });
    const maxAffinity = Object.entries(affinities).sort((a, b) => {
      if (a[1] === b[1]) {
        return this.affinityOccurences[a[0]] - this.affinityOccurences[b[0]];
      } else {
        return b[1] - a[1];
      }
    })[0][0];

    return {
      id: '10001',
      rank: 10001,
      score: 0,
      name,
      traitCount,
      traits: wizardTraits,
      image: '',
      affinities,
      maxAffinity: Number(maxAffinity),
    };
  }

  private count(map: FrequencyMap, key: string | number) {
    if (!map[key]) {
      map[key] = 0;
    }
    map[key] += 1;
  }

  private randomItem<T>(items: T[]): T {
    return items[Math.floor(Math.random() * items.length)];
  }
}
