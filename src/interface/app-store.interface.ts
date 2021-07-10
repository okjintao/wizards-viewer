import { RankStore } from '../store/RankStore';
import { StateStore } from '../store/StateStore';
import { UserStore } from '../store/UserStore';

export interface AppStore {
  ranks: RankStore;
  state: StateStore;
  user: UserStore;
}
