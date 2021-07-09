import { RankMap } from './rank-map.interface';
import { TraitMap } from './trait-map.interface';

export interface WizardData {
  name: string;
  idx: number;
  nameLength: number;
  traits: TraitMap;
  traitCount: number;
  image: string;
  rank?: number;
  score?: number;
  expanded?: boolean;
  maxAffinity: number;
  affinities: RankMap;
}
