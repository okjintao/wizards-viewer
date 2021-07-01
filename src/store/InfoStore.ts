import { CollectionInfo } from '../interface/collection-info.interface';

export class InfoStore {
  private loading = false;
  public info?: CollectionInfo;

  constructor() {
    this.loadInfo();
  }

  async loadInfo(): Promise<void> {
    if (!this.loading) {
      // this.loading = true;
      // this.info = await getWizardData();
      // this.loading = false;
      // console.log(this.info);
    }
  }
}
