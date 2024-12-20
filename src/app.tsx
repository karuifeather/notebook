import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Suspense, lazy, useEffect } from 'react';
import { PersistGate } from 'redux-persist/integration/react';

import { store, persistor } from '@/state/index.ts';
import { useDarkMode } from '@/hooks/use-dark-mode.ts';
import Loader from '@/components/loader.tsx';
import './style.scss';

// Dynamic imports for code splitting
const Home = lazy(() => import('@/pages/home/home.tsx'));
const NotFound = lazy(() => import('./components/not-found.tsx'));
const WorkSpace = lazy(() => import('./pages/workspace.tsx'));
const Playground = lazy(() => import('./pages/playground.tsx'));

export const App = () => {
  const isDarkMode = useDarkMode();

  // Apply dark mode class dynamically
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  return (
    <Provider store={store}>
      <PersistGate loading={<Loader />} persistor={persistor}>
        <Router>
          <Suspense fallback={<Loader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/playground" element={<Playground />} />
              <Route path="/app/*" element={<WorkSpace />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </Router>
      </PersistGate>
    </Provider>
  );
};
