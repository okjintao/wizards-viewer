export interface CollectionInfo {
  externalUrl: string;
  stats: {
    averagePrice: number;
    numOwners: number;
    id: string;
    totalSupply: number;
    totalVolume: number;
  };
}
