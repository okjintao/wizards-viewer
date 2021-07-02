import { InfoStore } from '../store/InfoStore';
import { RankStore } from '../store/RankStore';
import { UserStore } from '../store/UserStore';

export interface AppStore {
  ranks: RankStore;
  info: InfoStore;
  user: UserStore;
}
