import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { Provider } from 'react-redux';
import { Suspense, lazy, useEffect } from 'react';
import { PersistGate } from 'redux-persist/integration/react';

import { store, persistor } from '@/state/index.ts';
import { useDarkMode } from '@/hooks/use-dark-mode.ts';
import { FocusModeProvider } from '@/context/FocusModeContext.tsx';
import { isReturningUser } from '@/pages/redirect-to-recent-or-create.tsx';
import Loader from '@/components/loader.tsx';
import './style.scss';

// Dynamic imports for code splitting
const Home = lazy(() => import('@/pages/home/home.tsx'));
const NotFound = lazy(() => import('./components/not-found.tsx'));
const WorkSpace = lazy(() => import('./pages/workspace.tsx'));
const Playground = lazy(() => import('./pages/playground.tsx'));

function HomeOrRedirect() {
  if (isReturningUser()) {
    return <Navigate to="/app" replace />;
  }
  return <Home />;
}

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
          <FocusModeProvider>
            <Suspense fallback={<Loader />}>
              <Routes>
                <Route path="/" element={<HomeOrRedirect />} />
                <Route path="/playground" element={<Playground />} />
                <Route path="/app/*" element={<WorkSpace />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </FocusModeProvider>
        </Router>
      </PersistGate>
    </Provider>
  );
};
