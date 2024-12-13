import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';

import { store } from '@/state/index.ts';
import Home from '@/pages/home/home.tsx';
import CellList from '@/components/cell-list/cell-list.tsx';

import './style.scss';
import { useDarkMode } from './hooks/use-dark-mode.ts';
import { useEffect } from 'react';

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
          <nav>
            <a href="/">Home</a> | <a href="/cells">Cells</a> |{' '}
            <a href="/about">About</a>
          </nav>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cells" element={<CellList />} />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
};
