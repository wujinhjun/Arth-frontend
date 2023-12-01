import React, { useState } from 'react';
import { NavLink, useRoutes, useLocation } from 'react-router-dom';

import { Tooltip } from 'react-tooltip';
import {
  Bars3CenterLeftIcon,
  HomeIcon,
  MapIcon,
  ChartBarIcon,
  CreditCardIcon,
  PaintBrushIcon,
  Bars3Icon
} from '@heroicons/react/24/outline';

import HomePage from '@/pages/homePage';
import TxtImgPage from './pages/txtImgPage';
import EEGStudioPage from './pages/EEGstudioPage';
import PaintingPage from './pages/paintingsPage';
import Dashboard from './pages/dashboard';

import styles from './styles/app.module.css';

function App() {
  const location = useLocation();
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
    },
    {
      path: 'dashboard',
      element: <Dashboard />
    }
  ]);

  console.log(location);

  const [navbarList] = useState([
    { key: 'home', icon: HomeIcon, tooltip: '主页', active: true },
    { key: 'painting', icon: PaintBrushIcon, tooltip: '绘画', active: true },
    { key: 'map', icon: MapIcon, tooltip: '广场', active: false },
    { key: 'dashboard', icon: Bars3Icon, tooltip: '管理', active: true },
    { key: 'credit', icon: CreditCardIcon, tooltip: 'lora', active: false }
  ]);
  const [activeNavItem, setActiveNavItem] = useState<string>(
    location.pathname.slice(1) || 'home'
  );

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
            if (!item.active) {
              return null;
            }
            return (
              <NavLink
                // unstable_viewTransition
                to={`/${item.key}`}
                className={`${styles['left-navbar-button']} ${
                  item.key === activeNavItem ? 'active' : ''
                }`}
                key={item.key}
                id={item.key}
                data-tooltip-id={`tooltip-${item.key}`}
                data-tooltip-content={`${item.tooltip}`}
              >
                <item.icon
                  className={`${styles['left-navbar-button-icon']}`}
                  id={item.key}
                />
                <Tooltip id={`tooltip-${item.key}`} place="right" />
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

      <div className={`${styles['right-panel']}`}>{routes}</div>
    </section>
  );
}

export default App;
