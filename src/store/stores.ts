import { enableStaticRendering } from 'mobx-react-lite';
import { RootStore } from './RootStore';

const isServer = typeof window === 'undefined';
// eslint-disable-next-line react-hooks/rules-of-hooks
enableStaticRendering(isServer);

let store = null;

export default function getStore(initial?: RootStore): RootStore {
  if (isServer) {
    return new RootStore();
  }
  if (store === null) {
    store = initial ?? new RootStore();
  }
  return store;
}
