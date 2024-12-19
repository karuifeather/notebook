import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Suspense, lazy, useEffect } from 'react';

import { store } from '@/state/index.ts';
import { useDarkMode } from '@/hooks/use-dark-mode.ts';
import Loader from '@/components/loader.tsx';
import './style.scss';

// Dynamic imports for code splitting
const Home = lazy(() => import('@/pages/home/home.tsx'));
const NotFound = lazy(() => import('./components/not-found.tsx'));
const WorkSpace = lazy(() => import('./pages/workspace/workspace.tsx'));

export const App = () => {
  const isDarkMode = useDarkMode();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <Provider store={store}>
      <Router>
        <div>
          <Suspense fallback={<Loader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/app/*" element={<WorkSpace />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </div>
      </Router>
    </Provider>
  );
};
