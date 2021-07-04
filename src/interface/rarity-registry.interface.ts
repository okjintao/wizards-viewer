import { RarityConfig } from './rarity-config.interface';

export interface RarityRegistry {
  artifact: RarityConfig;
  legendary: RarityConfig;
  epic: RarityConfig;
  rare: RarityConfig;
  uncommon: RarityConfig;
  common: RarityConfig;
}
