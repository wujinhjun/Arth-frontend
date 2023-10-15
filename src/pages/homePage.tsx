import 'react';
import '@/styles/homePage.css';
import btnImg from '@/assets/images/homePage/btn-left-top.svg';

export const HomePage = () => {
  return (
    <>
      <section
        id="section-homePage"
        className="w-[100vw] h-[100vh] bg-[#252525] flex"
      >
        <div className="left-bar w-[8vw] h-full border-solid border-r-white border-r-[0.007vw] flex flex-col justify-between pb-[5rem]">
          {/* TODO: 改Button */}
          <div className="btn-left-top w-full h-[7vw] flex justify-center items-center cursor-pointer">
            <div className="svg-container w-[1.74vw] h-[1.74vw]">
              <img className="w-full h-full" src={btnImg} alt="toggle" />
            </div>
          </div>
          <div className="bottom-btns w-full h-auto flex flex-col items-center">
            <div className="w-[4.5vw] h-[4.5vw] rounded-full bg-[#D9D9D9]"></div>
            <div className="w-[4.5vw] h-[4.5vw] rounded-full bg-[#D9D9D9] mt-[1vw]"></div>
          </div>
        </div>
        <div className="right-content flex-1 ">
          <p className="text-white">test</p>
        </div>
      </section>
    </>
  );
};
