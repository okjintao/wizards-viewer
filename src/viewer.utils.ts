import { createMuiTheme } from '@material-ui/core/styles';
import fetch from 'node-fetch';
import { rarityRegistry } from './config/constants';
import { CollectionInfo } from './interface/collection-info.interface';
import { FrequencyMap } from './interface/frequency-map.interface';
import { OpenseaResponse } from './interface/opensea-response.interface';
import { RarityConfig } from './interface/rarity-config.interface';
import { TraitMap } from './interface/trait-map.interface';
import { WizardData } from './interface/wizard-data.interface';
import { WizardSummary } from './interface/wizard-summary.interface';

const openseaGraphUrl = 'https://api.opensea.io/graphql/';
const wizardQuery = {
  id: 'collectionQuery',
  query:
    'query collectionQuery(\n  $collection: CollectionSlug!\n) {\n  collection(collection: $collection) {\n    bannerImageUrl\n    name\n    description\n    imageUrl\n    ...CollectionHeader_data\n    id\n  }\n}\n\nfragment CollectionHeader_data on CollectionType {\n  name\n  description\n  imageUrl\n  bannerImageUrl\n  ...CollectionStatsBar_data\n  ...SocialBar_data\n  ...verification_data\n}\n\nfragment CollectionStatsBar_data on CollectionType {\n  stats {\n    averagePrice\n    numOwners\n    totalSupply\n    totalVolume\n    id\n  }\n  slug\n}\n\nfragment SocialBar_data on CollectionType {\n  discordUrl\n  externalUrl\n  instagramUsername\n  isEditable\n  mediumUsername\n  slug\n  telegramUrl\n  twitterUsername\n}\n\nfragment verification_data on CollectionType {\n  isMintable\n  isSafelisted\n  isVerified\n}\n',
  variables: {
    collection: 'forgottenruneswizardscult',
  },
};

export const viewerTheme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      light: '#859d92',
      main: '#1c3b4b',
      dark: '#1c3b4b',
      contrastText: '#fff',
    },
    secondary: {
      light: '#ff7961',
      main: '#f841b3',
      dark: '#6ca0dc',
      contrastText: '#000',
    },
    background: {
      paper: '#1c3b4b',
    },
  },
  typography: {
    fontFamily: ['Acme'].join(','),
  },
});

export async function getWizardData(): Promise<CollectionInfo | undefined> {
  const response = await fetch(openseaGraphUrl, {
    method: 'POST',
    body: JSON.stringify(wizardQuery),
  });
  if (!response.ok) {
    return;
  }
  const openseaResponse: OpenseaResponse = await response.json();
  return openseaResponse.data.collection;
}

function getRarityConfig(rarity: number, getCutoff: (config: RarityConfig) => number): RarityConfig {
  const rarityConfigs: RarityConfig[] = Object.values(rarityRegistry);
  for (const config of rarityConfigs) {
    if (getCutoff(config) / 10000 >= rarity) {
      return config;
    }
  }
  return rarityRegistry.common;
}

export function getRarityDescriptor(rarity: number): string {
  return getRarityConfig(rarity, (config) => config.cutoff).name;
}

export function getAffinityRarityDescriptor(rarity: number): string {
  return getRarityConfig(rarity, (config) => config.affinityCutoff).name;
}

export function getRarityColor(rarity: number): string {
  return getRarityConfig(rarity, (config) => config.cutoff).color;
}

export function getAffinityRarityColor(rarity: number): string {
  return getRarityConfig(rarity, (config) => config.affinityCutoff).color;
}

export function randomWizard(wizardSummary: WizardSummary): WizardData {
  const wizardType = randomItem([
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
  const wizardName = randomItem([
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
  const suffix = randomItem([
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
  const nameLength = name.split(' ').length;
  const traitCount = randomItem([3, 4, 5, 6]);

  // traits
  const { traitMap, traitsToAffinity, affinityOccurences } = wizardSummary;
  const wizardTraits: TraitMap = {};

  const checkTrait = (entry: string[], expected: string): boolean => {
    const traitType = entry[1].split(': ')[0];
    return traitType === expected;
  };
  const pickTrait = (filter: string): void => {
    const traits = Object.fromEntries(Object.entries(traitMap).filter((e) => checkTrait(e, filter)));
    const key = randomItem(Object.keys(traits));
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
    const mappedAffinities = traitsToAffinity[trait];
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
      return affinityOccurences[a[0]] - affinityOccurences[b[0]];
    } else {
      return b[1] - a[1];
    }
  })[0][0];

  return {
    idx: 10001,
    rank: 10001,
    score: 0,
    name,
    nameLength,
    traitCount,
    traits: wizardTraits,
    image: '',
    affinities,
    maxAffinity: Number(maxAffinity),
  };
}

export function randomItem<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}
