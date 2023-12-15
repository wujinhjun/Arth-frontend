import { useEffect, useState } from 'react';

import privateService from '@/service/privateService';
import publicService from '@/service/publicService';

import {
  GITHUB_USERNAME_ACTION,
  GITHUB_REPO_ACTION,
  STABLE_DIFFUSION_ACTION
} from '@/utils/storageAction';
import { handleConfigService } from '@/utils/utilsForConfig';

import style from '@/styles/dashboard.module.css';

export default function Dashboard() {
  const [githubUsername, setGithubUsername] = useState('');
  const [githubRepo, setGithubRepo] = useState('');
  const [isGIthubConnected, setIsGIthubConnected] = useState(false);

  const [stableDiffusionUrl, setStableDiffusionUrl] = useState('');

  useEffect(() => {
    // 状态检测
    async function fetchData() {
      const data = await privateService.getAllConfigInformation();
      if (data.length > 0) {
        data.forEach((item) => {
          if (item.key === GITHUB_USERNAME_ACTION) {
            setGithubUsername(item.value);
            localStorage.setItem(GITHUB_USERNAME_ACTION, item.value);
          }
          if (item.key === GITHUB_REPO_ACTION) {
            setGithubRepo(item.value);
            localStorage.setItem(GITHUB_REPO_ACTION, item.value);
          }

          if (item.key === STABLE_DIFFUSION_ACTION) {
            setStableDiffusionUrl(item.value);
            localStorage.setItem(STABLE_DIFFUSION_ACTION, item.value);
          }
        });
      }
    }

    fetchData();

    const configList = [
      {
        item: githubUsername,
        key: GITHUB_USERNAME_ACTION,
        action: setGithubUsername
      },
      { item: githubRepo, key: GITHUB_REPO_ACTION, action: setGithubRepo },
      {
        item: stableDiffusionUrl,
        key: STABLE_DIFFUSION_ACTION,
        action: setStableDiffusionUrl
      }
    ];

    configList.forEach((config) => {
      if (config.item === '') {
        const value = localStorage.getItem(config.key);
        value && config.action(value);
      }
    });

    // // 检测 github 连通情况
    // async function checkGithubConnect() {
    //   publicService.checkGithubServiceOnline().then((res) => {
    //     console.log(res);
    //   });
    // }

    // checkGithubConnect();
  }, []);

  const handleSubmitGithub = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const githubConfig = [
      {
        key: GITHUB_USERNAME_ACTION,
        value: githubUsername,
        successMessage: 'Github 用户名配置成功',
        errorMessage: 'Github 用户名配置失败'
      },
      {
        key: GITHUB_REPO_ACTION,
        value: githubRepo,
        successMessage: 'Github 仓库地址配置成功',
        errorMessage: 'Github 仓库地址配置失败'
      }
    ];

    githubConfig.forEach((config) => handleConfigService(config));
  };

  const handleSubmitStableDiffusion = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const stableDiffusionConfig = [
      {
        key: STABLE_DIFFUSION_ACTION,
        value: stableDiffusionUrl,
        successMessage: 'stable diffusion 配置成功',
        errorMessage: 'stable diffusion 配置失败'
      }
    ];

    stableDiffusionConfig.forEach((config) => handleConfigService(config));
  };

  return (
    <div className={`${style['dashboard-container']}`}>
      <div className={`${style['dashboard-column']}`}>
        <section className={`${style['dashboard-card']}`}>
          <h3 className="mb-2">Github 配置</h3>
          <form onSubmit={handleSubmitGithub}>
            {/* username */}
            {/* 仓库地址*/}
            {/* <input type="text" /> */}
            <fieldset>
              <div className="mb-2">
                <label
                  htmlFor="github-username"
                  className="block mb-1 ml-1 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Github 用户名
                </label>
                <input
                  type="text"
                  id="github-username"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  onChange={(e) => setGithubUsername(e.target.value)}
                  value={githubUsername}
                />
              </div>

              <div className="mb-2">
                <label
                  htmlFor="github-url"
                  className="block mb-2 ml-1 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Github 仓库地址
                </label>
                <input
                  type="text"
                  id="github-url"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  onChange={(e) => setGithubRepo(e.target.value)}
                  value={githubRepo}
                />
              </div>

              <div className="mb-2">
                <label className="block mb-2 ml-1 text-sm font-medium text-gray-900 dark:text-white">
                  Github 连通情况
                </label>
                <div className="ml-1">开</div>
              </div>
            </fieldset>

            <div className="flex">
              <button
                type="submit"
                className="text-white ml-auto bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
              >
                提交
              </button>
              <button
                type="button"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
              >
                刷新
              </button>
            </div>
          </form>
        </section>
      </div>
      <div className={`${style['dashboard-column']}`}>
        <section className={`${style['dashboard-card']}`}>
          <h3 className="mb-2">Stable Diffusion 配置</h3>
          <form onSubmit={handleSubmitStableDiffusion}>
            <fieldset>
              <div className="mb-2">
                <label
                  htmlFor="sd-url"
                  className="block mb-1 ml-1 text-sm font-medium text-gray-900 dark:text-white"
                >
                  stable diffusion 服务地址
                </label>
                <input
                  type="text"
                  id="sd-url"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  onChange={(e) => setStableDiffusionUrl(e.target.value)}
                  value={stableDiffusionUrl}
                />
              </div>
            </fieldset>

            <div className="flex">
              <button
                type="submit"
                className="text-white ml-auto bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
              >
                提交
              </button>
              <button
                type="button"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
              >
                刷新
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
