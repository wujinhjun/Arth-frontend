import toast from 'react-hot-toast';
import privateService from '@/service/privateService';

import type { ConfigKeyType } from '@/utils/types';

export const synchronizeUserConfigData = async (
  key: ConfigKeyType,
  value: string
) => {
  localStorage.setItem(key, value);
};

export const handleConfigService = async (config: {
  key: string;
  value: string;
  successMessage: string;
  errorMessage: string;
}) => {
  try {
    const res = await privateService.configPublicService(
      config.key,
      config.value
    );
    console.log(res);
    localStorage.setItem(config.key, config.value);
    toast.success(config.successMessage);
  } catch (err) {
    console.error(err);
    toast.error(config.errorMessage);
  }
};
