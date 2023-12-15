import toast from 'react-hot-toast';
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
