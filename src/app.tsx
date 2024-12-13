import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';

import { store } from '@/state/index.ts';
import Home from '@/pages/home/home.tsx';
import CellList from '@/components/cell-list/cell-list.tsx';

import './style.scss';
import { useDarkMode } from './hooks/use-dark-mode.ts';
import { useEffect } from 'react';
import Header from './components/header/header.tsx';

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
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cells" element={<CellList />} />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
};
