import styles from '@/styles/homepage.module.css';
import picture from '@/assets/home/RenaissanceFirst.png';

interface paintingItemType {
  key: string;
  name: string;
  img: string;
  introduction: string;
  author: string;
}

export default function Homepage() {
  return (
    <>
      {/* right panel */}
      <div className={`${styles['right-panel']}`}>
        <div className={`${styles['right-panel-content-area']}`}>
          <div
            className={`${styles['right-panel-content-list-wrapper']}`}
          ></div>

          <div className={`${styles['right-panel-content-img']}`}>
            <img src={picture} alt="" />
          </div>
          <div
            className={`${styles['right-panel-content-intro-wrapper']}`}
          ></div>
        </div>
        <div className={`${styles['right-panel-timescale']}`}></div>
      </div>
    </>
  );
}
