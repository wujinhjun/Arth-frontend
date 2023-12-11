import toast from 'react-hot-toast';
import publicService from '@/service/publicService';

export const handleSingleImageUpload = async (config: {
  type: string;
  image: string;
  successMessage: string;
  errorMessage: string;
}) => {
  try {
    const res = await publicService.uploadImageToGithub(
      config.type,
      config.image
    );
    console.log(res);
    toast.success(config.successMessage);
  } catch (err) {
    console.error(err);
    toast.error(config.errorMessage);
  }
};
