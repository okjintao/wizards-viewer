import { createContext } from 'react';
import { RootStore } from './RootStore';

export const StoreContext = createContext({} as RootStore);
export const StoreProvider = StoreContext.Provider;
