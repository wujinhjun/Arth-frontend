import { useEffect, useState } from 'react';
import style from './LoadingNumber.module.css';
export default function LoadingNumber() {
  const [isRunning, setIsRunning] = useState(false);
  useEffect(() => {
    setIsRunning(true);
  }, []);
  return (
    <div className={`${style.container}`}>
      <div className={`${style.loading}`}></div>
      <output
        className={`${style['loading-num']} ${isRunning ? 'running' : ''}`}
      >
        %
      </output>
    </div>
  );
}
