import { createMuiTheme } from '@material-ui/core/styles';
import fetch from 'node-fetch';
import { CollectionInfo } from './interface/collection-info.interface';
import { OpenseaResponse } from './interface/opensea-response.interface';

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
      paper: '#859d92',
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
    console.log(await response.text());
    return;
  }
  const openseaResponse: OpenseaResponse = await response.json();
  console.log(openseaResponse);
  return openseaResponse.data.collection;
}

export function getRarityDescriptor(rarity: number): string {
  if (rarity === 1 / 10000) {
    return 'Legendary';
  }
  if (rarity < 10 / 10000) {
    return 'Epic';
  }
  if (rarity < 35 / 10000) {
    return 'Rare';
  }
  if (rarity < 115 / 10000) {
    return 'Uncommon';
  }
  return 'Common';
}
