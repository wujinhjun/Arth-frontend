import type { IDataGenerateImg } from '@/utils/types';

const base64Prefix = 'data:image/png;base64,';

// 生成图片
function generateImage(data: IDataGenerateImg) {
  return fetch('/api/imgs/generateImg', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.code !== 200) {
        throw JSON.stringify(res.error);
      }

      return res.data;
    })
    .then((res) => {
      return res.map((item: string) => base64Prefix + item);
    })
    .catch((err) => {
      throw err;
    });
}

// 更新地址
function configPublicService(key: string, value: string) {
  return fetch('/api/config/', {
    method: 'POST',
    body: JSON.stringify({ key, value }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then((res) => res.json())
    .catch((err) => {
      throw err;
    });
}

// 获取所有配置信息
function getAllConfigInformation(): Promise<
  Array<{ key: string; value: string }>
> {
  return fetch('/api/config/all-config')
    .then((res) => res.json())
    .catch((err) => {
      throw err;
    });
}

// 持久化存储

const privateService = {
  generateImage,
  configPublicService,
  getAllConfigInformation
};

export default privateService;
