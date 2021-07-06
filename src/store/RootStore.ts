import { AppStore } from '../interface/app-store.interface';
import { InfoStore } from './InfoStore';
import { RankStore } from './RankStore';
import { UserStore } from './UserStore';

export class RootStore implements AppStore {
  public user: UserStore;
  public ranks: RankStore;
  public info: InfoStore;

  constructor() {
    this.user = new UserStore(this);
    this.ranks = new RankStore(this);
    this.info = new InfoStore();
  }
}

const store = new RootStore();
export default store;
