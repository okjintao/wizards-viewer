import { AffinityMap } from './affinity-map.interface';
import { FrequencyMap } from './frequency-map.interface';
import { TraitMap } from './trait-map.interface';
import { WizardMap } from './wizard-map.interface';

export interface WizardSummary {
  nameLengths: FrequencyMap;
  traitCounts: FrequencyMap;
  traitOccurences: FrequencyMap;
  affinityOccurences: FrequencyMap;
  wizards: WizardMap;
  totalWizards: number;
  affinityToTraits: AffinityMap;
  traitMap: TraitMap;
}
