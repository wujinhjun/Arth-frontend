import styles from '@/styles/homepage.module.css';
import { Bars3CenterLeftIcon } from '@heroicons/react/24/outline';

export default function Homepage() {
  return (
    <section className={`${styles.wrapper}`}>
      <div className={`${styles['left-panel']}`}>
        <div className={`${styles['left-top-button-wrapper']}`}>
          <Bars3CenterLeftIcon
            className={'mx-auto rotate-180  cursor-pointer'}
          />
        </div>
        <div className={`${styles['left-bottom-buttons-wrapper']}`}>
          <button className={`${styles['left-bottom-button']}`}>a</button>
          <button className={`${styles['left-bottom-button']}`}>b</button>
        </div>
      </div>
      <div className={`${styles['right-panel']}`}>
        <div className={`${styles['right-panel-content-area']}`}></div>
        <div className={`${styles['right-panel-timescale']}`}></div>
      </div>
    </section>
  );
}
