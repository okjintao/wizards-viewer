import { createMuiTheme } from '@material-ui/core/styles';
import fetch from 'node-fetch';
import { rarityRegistry } from './config/constants';
import { CollectionInfo } from './interface/collection-info.interface';
import { OpenseaResponse } from './interface/opensea-response.interface';
import { RarityConfig } from './interface/rarity-config.interface';

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
