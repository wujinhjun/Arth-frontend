import toast from 'react-hot-toast';
import md5 from 'crypto-js/md5';
import SparkMD5 from 'spark-md5';

import publicService from '@/service/publicService';

function retryFunction<InputT extends unknown[], ReturnT>(
  fn: (...args: InputT) => Promise<ReturnT>,
  maxCount: number = 5
) {
  let count = 0;

  return async function (...args: InputT): Promise<ReturnT> {
    try {
      return await fn(...args);
    } catch (err) {
      if (count < maxCount) {
        count++;
        return retryFunction(fn, maxCount)(...args);
      }

      throw err;
    }
  };
}

export const handleSingleImageUpload = async (config: {
  type: string;
  image: string;
  successMessage: string;
  errorMessage: string;
  successAction?: (url: string) => void;
}) => {
  const retryUploadImageToGithub = retryFunction<[string, string], string>(
    publicService.uploadImageToGithub,
    5
  );

  try {
    const res = await retryUploadImageToGithub(config.type, config.image);
    toast.success(config.successMessage);
    config.successAction && config.successAction(res);
    return res;
  } catch (err) {
    console.error(err);
    toast.error(config.errorMessage);
  }
};

const retryUploadImageToGithub = retryFunction<[string, string], string>(
  publicService.uploadImageToGithub,
  2
);

export const handleUploadGeneratedImage = async (image: string) => {
  try {
    const res = await retryUploadImageToGithub('generated_image', image);

    toast.success('生成图上传成功');

    return res;
  } catch (err) {
    console.log(err);

    toast.error('生成图上传失败');
  }
};

export const handleUploadInitImage = async (image: string) => {
  // 先计算hash值
  const data = image.replace(/^data:image\/\w+;base64,/, '');
  const binaryData = atob(data);
  const hash = SparkMD5.hash(binaryData);

  try {
    // 然后去数据库查询是否存在
    const queryResult = await fetch(
      `/api/aigc-data/query-init-image?hash=${hash}`
    ).then((res) => res.json());
    if (queryResult.code === 200) {
      // 如果存在则直接返回
      return queryResult.data.url;
    } else {
      // 如果不存在则上传github
      const initImageUrl = await retryUploadImageToGithub('init_image', image);
      toast.success('垫图上传成功');

      // 上传github后再上传到本地的数据库
      await fetch('/api/aigc-data/init-image', {
        method: 'POST',
        body: JSON.stringify({
          hash,
          url: initImageUrl,
          date: new Date().getTime()
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
  } catch {
    toast.error('垫图上传失败');
  }
};
