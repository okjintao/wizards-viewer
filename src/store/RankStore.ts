import { action, extendObservable, observe } from 'mobx';
import { WizardData } from '../interface/wizard-data.interface';
import { WizardSummary } from '../interface/wizard-summary.interface';
import summary from '../wizard-summary.json';

export class RankStore {
  private wizardSummary: WizardSummary;
  public ranking: WizardData[];
  public includeTraitCount = false;
  public includeName = false;
  public cutoff?: number;
  public isSorting = false;

  constructor() {
    this.wizardSummary = summary;
    Object.values(this.wizardSummary.wizards).forEach((wizard, i) => {
      wizard.traits = wizard.traits.sort((a, b) => this.getRarity(a) - this.getRarity(b));
      wizard.image = wizard.image.replace('ipfs://', 'https://ipfs.io/ipfs/');
      wizard.id = i;
    });
    this.ranking = this.evaluateRank();

    const rankObeserver = extendObservable(this, {
      ranking: this.ranking,
      includeTraitCount: this.includeTraitCount,
      includeName: this.includeName,
    });

    observe(rankObeserver, (_change) => {
      if (this.isSorting) {
        return;
      }
      this.isSorting = true;
      this.ranking = this.evaluateRank();
      this.isSorting = false;
    });
  }

  evaluateRank(): WizardData[] {
    return Object.values(this.wizardSummary.wizards).sort((a, b) => this.score(a) - this.score(b));
  }

  score(wizard: WizardData): number {
    let score = 1;

    const traitCount = this.cutoff ?? wizard.traitCount;
    for (let i = 0; i < traitCount; i++) {
      score *= this.getRarity(wizard.traits[i]);
    }

    if (this.includeTraitCount) {
      score *= this.getCountRarity(wizard.traitCount);
    }

    if (this.includeName) {
      score *= this.getNameRarity(wizard.nameLength);
    }

    return score;
  }

  getRarity(trait: string): number {
    return this.getRarityOccurence(trait) / this.wizardSummary.totalWizards;
  }

  getRarityOccurence(trait: string) {
    return this.wizardSummary.traitOccurences[trait];
  }

  getCountRarity(count: number): number {
    return this.wizardSummary.traitCounts[count] / this.wizardSummary.totalWizards;
  }

  getNameRarity(length: number): number {
    return this.wizardSummary.nameLengths[length] / this.wizardSummary.totalWizards;
  }

  toggleIncludeCount = action(() => {
    if (this.isSorting) {
      return;
    }
    this.includeTraitCount = !this.includeTraitCount;
  });

  toggleIncludeName = action(() => {
    if (this.isSorting) {
      return;
    }
    this.includeName = !this.includeName;
  });
}