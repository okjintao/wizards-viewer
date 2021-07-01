import { FrequencyMap } from './frequency-map.interface';
import { WizardMap } from './wizard-map.interface';

export interface WizardSummary {
  nameLengths: FrequencyMap;
  traitCounts: FrequencyMap;
  traitOccurences: FrequencyMap;
  wizards: WizardMap;
  totalWizards: number;
}
