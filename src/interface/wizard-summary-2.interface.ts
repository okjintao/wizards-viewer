import { TraitAffinityMap } from './trait-affinity-map.interface';
import { TraitMap } from './trait-map.interface';
import { WizardMap2 } from './wizard-map-2.interface';

export interface WizardSummary2 {
  wizards: WizardMap2;
  traits: TraitAffinityMap;
  traitMap: TraitMap;
}
