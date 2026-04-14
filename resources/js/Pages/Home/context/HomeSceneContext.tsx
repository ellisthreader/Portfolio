import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import type { HomeSceneState } from '../types/home';

const HomeSceneContext = createContext<HomeSceneState | null>(null);

export function HomeSceneProvider({
  children,
  value,
}: {
  children: ReactNode;
  value: HomeSceneState;
}) {
  return <HomeSceneContext.Provider value={value}>{children}</HomeSceneContext.Provider>;
}

export function useHomeSceneContext() {
  const context = useContext(HomeSceneContext);
  if (!context) {
    throw new Error('useHomeSceneContext must be used within HomeSceneProvider');
  }
  return context;
}
