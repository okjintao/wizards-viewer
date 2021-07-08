import { RarityRegistry } from '../interface/rarity-registry.interface';

export const baseUrl = 'https://opensea.io/assets/0x521f9c7505005cfa19a8e5786a9c3c9c9f5e6f42/';
export const ref = '?ref=0x8d26c9dac7e16738752fa1446b956a97c63e2f39';
export const wizardsAddress = '0x521f9c7505005cfa19a8e5786a9c3c9c9f5e6f42';

export const rarityRegistry: RarityRegistry = {
  artifact: {
    color: '#e6cc80',
    cutoff: 1,
    affinityCutoff: 1,
    name: 'Artifact',
  },
  legendary: {
    color: '#ff8000',
    cutoff: 16,
    affinityCutoff: 160,
    name: 'Legendary',
  },
  epic: {
    color: '#a335ee',
    cutoff: 32,
    affinityCutoff: 320,
    name: 'Epic',
  },
  rare: {
    color: '#0070dd',
    cutoff: 128,
    affinityCutoff: 1280,
    name: 'Rare',
  },
  uncommon: {
    color: '#1eff00',
    cutoff: 256,
    affinityCutoff: 2560,
    name: 'Uncommon',
  },
  common: {
    color: '#ffffff',
    cutoff: 10000,
    affinityCutoff: 10000,
    name: 'Common',
  },
};
