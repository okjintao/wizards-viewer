import { InfoStore } from '../store/InfoStore';
import { RankStore } from '../store/RankStore';

export interface AppStore {
  ranks: RankStore;
  info: InfoStore;
}
