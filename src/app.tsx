import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Suspense, lazy, useEffect } from 'react';

import { store } from '@/state/index.ts';
import './style.scss';
import { useDarkMode } from './hooks/use-dark-mode.ts';
import Loader from './components/loader/loader.tsx';

// Dynamic imports for code splitting
const Home = lazy(() => import('@/pages/home/home.tsx'));
const TryNow = lazy(() => import('./pages/try-now/try-now.tsx'));
const NotFound = lazy(() => import('./components/not-found/not-found.tsx'));
const Header = lazy(() => import('./components/header/header.tsx'));
const Footer = lazy(() => import('./components/footer/footer.tsx'));

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
            <Header />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/try-now" element={<TryNow />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Footer />
          </Suspense>
        </div>
      </Router>
    </Provider>
  );
};
