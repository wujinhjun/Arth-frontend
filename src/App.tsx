import React, { useState } from 'react';

import { NavLink, useRoutes } from 'react-router-dom';

import {
  Bars3CenterLeftIcon,
  HomeIcon,
  MapIcon,
  ChartBarIcon,
  CreditCardIcon,
  PaintBrushIcon
} from '@heroicons/react/24/outline';

import HomePage from '@/pages/homePage';
import TxtImgPage from './pages/txtImgPage';
import EEGStudioPage from './pages/EEGstudioPage';
import PaintingPage from './pages/paintingsPage';
import styles from './styles/app.module.css';

function App() {
  const routes = useRoutes([
    {
      path: '/',
      element: <HomePage />
    },
    {
      path: '/home',
      element: <HomePage />
    },
    {
      path: '/img',
      element: <TxtImgPage />
    },
    {
      path: 'eeg',
      element: <EEGStudioPage />
    },
    {
      path: 'painting',
      element: <PaintingPage />
    }
  ]);

  const [navbarList] = useState([
    { key: 'home', icon: HomeIcon },
    { key: 'painting', icon: PaintBrushIcon },
    { key: 'map', icon: MapIcon },
    { key: 'chart', icon: ChartBarIcon },
    { key: 'credit', icon: CreditCardIcon }
  ]);
  const [activeNavItem, setActiveNavItem] = useState<string>('home');

  const handleChangeActiveNavItem = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    let element = e.target as HTMLElement;
    let parentElement = element?.parentElement;

    if (!parentElement) {
      return;
    }

    while (parentElement && parentElement.tagName !== 'NAV') {
      element = parentElement;
      parentElement = element?.parentElement;
    }

    setActiveNavItem(element.id);
    // window.location.href = `/${element.id}`;
  };

  return (
    <section className="page-container">
      <div className={`${styles['left-panel']}`}>
        <div className={`${styles['left-top-button-wrapper']}`}>
          <input
            type="checkbox"
            name=""
            id="left-button-panel"
            className={`${styles.input}`}
          />
          <label htmlFor="left-button-panel" className="w-fit h-fit">
            <Bars3CenterLeftIcon
              className={'mx-auto rotate-180  cursor-pointer'}
            />
          </label>
        </div>

        <nav
          className={`${styles['left-navbar-wrapper']}`}
          onClick={handleChangeActiveNavItem}
        >
          {navbarList.map((item) => {
            return (
              <NavLink
                // unstable_viewTransition
                to={`/${item.key}`}
                className={`${styles['left-navbar-button']} ${
                  item.key === activeNavItem ? 'active' : ''
                }`}
                key={item.key}
                id={item.key}
              >
                <item.icon
                  className={`${styles['left-navbar-button-icon']}`}
                  id={item.key}
                />
              </NavLink>
            );
          })}
        </nav>

        <div className={`${styles['left-bottom-buttons-wrapper']}`}>
          <button className={`${styles['left-bottom-button']}`}>
            <img src="" alt="" />
          </button>
        </div>
      </div>
      <div className="right-panel">{routes}</div>
    </section>
  );
}

export default App;
