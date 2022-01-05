import { Trait } from './trait.interface';

export interface Wizard {
  id: number;
  name: string;
  traits: Trait[];
  affinityId: number;
  score: number;
  customScore: number;
  attunement: number;
}
