import { RankMap } from './rank-map.interface';
import { Score } from './score.interface';
import { TraitMap } from './trait-map.interface';

export interface WizardData {
  id: string;
  name: string;
  nameScore: number;
  title: string;
  location?: string;
  traits: TraitMap;
  traitCount: number;
  image: string;
  rank?: number;
  score?: Score;
  expanded?: boolean;
  maxAffinity: number;
  affinities: RankMap;
  affinityWeight?: number;
}
