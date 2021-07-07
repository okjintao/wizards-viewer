import { AppStore } from '../interface/app-store.interface';
import { InfoStore } from './InfoStore';
import { RankStore } from './RankStore';
import { StateStore } from './StateStore';
import { UserStore } from './UserStore';

export class RootStore implements AppStore {
  public user: UserStore;
  public ranks: RankStore;
  public info: InfoStore;
  public state: StateStore;

  constructor() {
    this.user = new UserStore(this);
    this.ranks = new RankStore(this);
    this.info = new InfoStore();
    this.state = new StateStore();
  }
}

const store = new RootStore();
export default store;
