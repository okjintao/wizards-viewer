import { RankMap } from './rank-map.interface';

export interface WizardData {
  name: string;
  idx: number;
  nameLength: number;
  traits: string[];
  traitCount: number;
  image: string;
  rank?: number;
  expanded?: boolean;
  maxAffinity: number;
  affinities: RankMap;
}
