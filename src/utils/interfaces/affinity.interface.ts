import { Trait } from './trait.interface';

export interface Affinity {
  id: number;
  name: string;
  frequency: number;
  traits: Trait[];
}
