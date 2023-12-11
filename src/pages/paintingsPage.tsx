import { useState, Fragment, useEffect, useRef } from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';

import { createTxtToImageSchema } from '@/utils/schema';

import { zodResolver } from '@hookform/resolvers/zod';
import cn from 'classnames';
import publicService from '@/service/publicService';
import { handleSingleImageUpload } from '@/utils/utilsForUpload';

import { Menu, RadioGroup, Transition, Listbox } from '@headlessui/react';
import downloadPng from '@/assets/download.png';
import image1Png from '@/assets/image001.png';

import {
  CheckIcon,
  ChevronUpDownIcon,
  ChevronDownIcon
} from '@heroicons/react/20/solid';

import AutoHeightTextarea from '@/components/autoHeightTextarea';
import LoadingNumber from '@/components/loadingNumber';

import style from '@/styles/painting.module.css';
import toast from 'react-hot-toast';

const base64Prefix = 'data:image/png;base64,';
const genre = [
  { name: '文艺复兴' },
  { name: '巴洛克' },
  { name: '洛可可' },
  { name: '新古典主义' },
  { name: '浪漫主义' },
  { name: '印象派' }
];

const imgRadioList = [
  {
    numerator: 1,
    denominator: 1,
    name: '1:1'
  },
  {
    numerator: 4,
    denominator: 3,
    name: '4:3'
  },
  {
    numerator: 16,
    denominator: 9,
    name: '16:9'
  }
];

type IFormDataTxt2Img = {
  school: string;
  prompt: string;
  negativePrompt: string;
  width: number;
  height: number;
  batchSize: number;
  steps: number;
  initImage: string;
};

export default function PaintingPage() {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors }
  } = useForm<IFormDataTxt2Img>({
    resolver: zodResolver(createTxtToImageSchema),
    defaultValues: {
      school: '文艺复兴',
      width: 512,
      height: 512,
      batchSize: 1,
      steps: 20,
      initImage: ''
    }
  });

  // 生成图片中
  const [isCreatingImageProcessing, setIsCreatingImageProcessing] =
    useState(false);
  // 垫图
  const [previewImage, setPreviewImage] = useState<string>('');
  // 生成的图片
  const [imagesList, setImagesList] = useState<Array<string>>([]);
  // 展示图片的索引
  const [activeDisplayImageIndex, setActiveDisplayImageIndex] =
    useState<number>(0);
  // 选择的图片比例
  const [radioSelected, setRadioSelected] = useState(imgRadioList[0].name);

  // onSubmit 生成图片
  const onSubmit: SubmitHandler<IFormDataTxt2Img> = (data) => {
    setIsCreatingImageProcessing(true);
    fetch('/api/imgs/generateImg', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.code !== 200) {
          throw new Error(JSON.stringify(res.error));
        }

        return res.data;
      })
      .then((res) => {
        return res.map((item: string) => base64Prefix + item);
      })
      .then((res) => {
        setImagesList(res);
        setActiveDisplayImageIndex(0);
      })
      .catch((err) => {
        console.log(err);
        const error = JSON.parse(err.message);
        console.log(error);
        const details =
          typeof error.detail === 'string' ? error.detail : error.detail[0].msg;
        const errorMessage = error.title || error.errors || details;
        toast.error(errorMessage, {
          duration: 5000
        });
      })
      .finally(() => {
        setIsCreatingImageProcessing(false);
      });
  };

  // 选择图片比例
  const handleChangeImgRadio = (e: string) => {
    const [numerator, denominator] = e.split(':').map((item) => Number(item));
    // const { numerator, denominator } = e;
    // 1:1
    // 4:3
    // 16:9

    if (numerator === 1 && denominator === 1) {
      setValue('width', 512);
      setValue('height', 512);
    } else if (numerator === 4 && denominator === 3) {
      setValue('width', 720);
      setValue('height', 540);
    } else if (numerator === 16 && denominator === 9) {
      setValue('width', 960);
      setValue('height', 540);
    }
    setRadioSelected(e);
  };

  // 上传垫图并且预览
  const handleUploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (!files) {
      toast.error('请选择图片');
      return;
    }

    const file = files[0];
    // console.log(file);

    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);

    fileReader.onload = (event) => {
      if (!event.target) {
        return;
      }

      try {
        const result = event.target.result as string;
        setPreviewImage(result);

        const canvas = document.createElement('canvas');
        canvas.style.display = 'none';
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          return;
        }

        const img = new Image();
        img.src = result;
        img.onload = () => {
          const radioCanvas = 256 / img.width;
          canvas.width = img.width * radioCanvas;
          canvas.height = img.height * radioCanvas;

          ctx.drawImage(img, 0, 0);

          const afterZip = canvas.toDataURL('image/jpeg', 0.92);
          setValue('initImage', afterZip);
        };
      } catch (err) {
        console.log(err);
        toast.error('图片上传失败');
      }
    };
  };

  // 选择展示的图片
  const handleSetActiveImage = (e: React.MouseEvent<HTMLUListElement>) => {
    const eleValue = e.target as HTMLImageElement;
    const dataset = eleValue.dataset;
    if (!dataset.picItem) {
      return;
    }
    const index = dataset.picItem as unknown as number;
    setActiveDisplayImageIndex(index);
  };

  // 上传当前的图片以及垫图
  // 辅助函数

  // 上传当前的图片以及垫图
  const handleUploadCurrentImage = () => {
    const currentImage = imagesList[activeDisplayImageIndex];
    const initImage = previewImage;

    if (!currentImage || !initImage) {
      toast.error('请先生成图片');
      return;
    }

    const uploadConfig = [
      {
        type: 'init_image',
        image: initImage,
        successMessage: '垫图上传成功',
        errorMessage: '垫图上传失败'
      },
      {
        type: 'current_image',
        image: currentImage,
        successMessage: '当前图片上传成功',
        errorMessage: '当前图片上传失败'
      }
    ];

    uploadConfig.forEach((config) => handleSingleImageUpload(config));
  };

  return (
    <section className={`${style['painting-page']}`}>
      <form
        className={`${style['command-panel']} flex flex-col justify-between`}
        onSubmit={handleSubmit(onSubmit)}
      >
        <section className="w-[21rem] overflow-hidden">
          <section
            style={{ height: 'calc(100vh - 8rem)', width: 'calc(22rem + 1px)' }}
            className="overflow-y-scroll mr-2 bg-[#161616]"
          >
            {/* 流派 */}
            <div
              className={`${style['instruction-container']} ${style['instruction-inline']}`}
            >
              <span className="mr-12">流派</span>
              <Controller
                name="school"
                control={control}
                render={({ field }) => {
                  return (
                    <Listbox {...field}>
                      <div className="relative mt-1 w-32 cursor-pointer">
                        <Listbox.Button className="relative w-full rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                          <span className="block truncate text-black">
                            {/* {watch('school')} */}
                            {field.value}
                          </span>
                          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                            <ChevronUpDownIcon
                              className="h-5 w-5 text-gray-400"
                              aria-hidden="true"
                            />
                          </span>
                        </Listbox.Button>
                        <Transition
                          as={Fragment}
                          leave="transition ease-in duration-100"
                          leaveFrom="opacity-100"
                          leaveTo="opacity-0"
                        >
                          <Listbox.Options className="absolute z-10 cursor-pointer mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                            {genre.map((school, schoolIdx) => (
                              <Listbox.Option
                                key={schoolIdx}
                                className={({ active }) =>
                                  `relative select-none py-2 pl-10 pr-4 ${
                                    active
                                      ? 'bg-amber-100 text-amber-900'
                                      : 'text-gray-900'
                                  }`
                                }
                                value={school.name}
                              >
                                {({ selected }) => (
                                  <>
                                    <span
                                      className={`block truncate ${
                                        selected ? 'font-medium' : 'font-normal'
                                      }`}
                                    >
                                      {school.name}
                                    </span>
                                    {selected ? (
                                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                        <CheckIcon
                                          className="h-5 w-5"
                                          aria-hidden="true"
                                        />
                                      </span>
                                    ) : null}
                                  </>
                                )}
                              </Listbox.Option>
                            ))}
                          </Listbox.Options>
                        </Transition>
                      </div>
                    </Listbox>
                  );
                }}
              />
            </div>

            {/* step */}
            <div className={`${style['instruction-container']} `}>
              <div className={`${style['instruction-inline']}`}>
                <span className="mr-12">步数</span>
                <input
                  className="relative w-32 h-full rounded-lg text-black/90 bg-white py-1 pl-2 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm"
                  {...register('steps', { valueAsNumber: true })}
                />
              </div>

              {errors.steps?.message && (
                <span className="text-red-500 pt-2">
                  {errors.steps.message}
                </span>
              )}
            </div>

            {/* 张数 */}
            <div className={`${style['instruction-container']} `}>
              <div className={`${style['instruction-inline']}`}>
                <span className="mr-12">张数</span>
                <input
                  {...register('batchSize', {
                    valueAsNumber: true
                  })}
                  className="relative w-32 h-full rounded-lg text-black/90 bg-white py-1 pl-2 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm"
                />
              </div>

              {errors.batchSize?.message && (
                <span className="text-red-500 pt-2">
                  {errors.batchSize.message}
                </span>
              )}
            </div>

            {/* 比例 */}
            <div className={`${style['instruction-container']}`}>
              <input
                id="radio"
                type="checkbox"
                className={`${style['collapse-command-checkbox']}`}
              />
              <label
                htmlFor="radio"
                className={`${style['collapsed-command']}`}
              >
                <p className="mb-2 flex">
                  比例 <ChevronDownIcon className={`${style.chevronIcon}`} />
                </p>
              </label>

              <div className={`${style['collapse-panel']}`}>
                <RadioGroup
                  onChange={(e) => handleChangeImgRadio(e)}
                  value={radioSelected}
                >
                  <RadioGroup.Label className={'sr-only'}>
                    Choose a size
                  </RadioGroup.Label>
                  <div className="px-2 pt-3 pb-1 flex justify-around bg-gray-600/60 rounded-xl">
                    {imgRadioList.map((item) => {
                      const { numerator, denominator, name } = item;
                      const value = numerator / denominator;
                      return (
                        <RadioGroup.Option
                          key={name}
                          value={item.name}
                          className={'cursor-pointer'}
                        >
                          {({ active, checked }) => (
                            <>
                              <div
                                className={`${
                                  style['radio-check-container']
                                } w-12 ${active || checked ? 'active' : ''}`}
                                style={{ width: 48 * value, height: 48 }}
                              ></div>
                              <p className="text-center pt-1">{item.name}</p>
                            </>
                          )}
                        </RadioGroup.Option>
                      );
                    })}
                  </div>
                </RadioGroup>
              </div>
            </div>

            {/* prompt */}
            <div className={`${style['instruction-container']}`}>
              <p className="mb-2">提示</p>
              <Controller
                name="prompt"
                control={control}
                render={({ field }) => {
                  return (
                    <AutoHeightTextarea
                      {...field}
                      placeholder={'请输入提示词'}
                      minHeight={96}
                      maxHeight={160}
                      className="text-black/90 rounded-xl px-3 py-1 text-sm mx-1"
                    />
                  );
                }}
              />
              {errors.prompt?.message && (
                <span className="text-red-500 pt-2">
                  {errors.prompt.message}
                </span>
              )}
            </div>

            {/* negative prompt */}
            <div className={`${style['instruction-container']}`}>
              <p className="mb-2">反向提示词</p>
              <Controller
                name="negativePrompt"
                control={control}
                render={({ field }) => {
                  return (
                    <AutoHeightTextarea
                      {...field}
                      placeholder={'请输入提示词'}
                      minHeight={96}
                      maxHeight={160}
                      className="text-black/90 rounded-xl px-3 py-1 text-sm mx-1"
                    />
                  );
                }}
              />
              {errors.negativePrompt?.message && (
                <span className="text-red-500 pt-2">
                  {errors.negativePrompt.message}
                </span>
              )}
            </div>

            {/* 图片上传 */}
            <div className={`${style['instruction-container']}`}>
              <p className="mb-2">垫图</p>
              <input
                name="initImages"
                onChange={handleUploadImage}
                type="file"
                accept="image/*"
                id="upload-background-image"
                className="hidden"
              />
              <label
                htmlFor="upload-background-image"
                className={`${style['img-uploader-wrapper']}`}
              >
                <img
                  src={previewImage}
                  alt="垫图"
                  className={cn(
                    'w-full block',
                    previewImage.length > 0 ? '' : 'opacity-0'
                  )}
                />
                {previewImage.length > 0 ? null : (
                  <div className={`${style['img-upload-tips']}`}>上传文件</div>
                )}
              </label>
              {errors.initImage && (
                <span className="text-red-500 pt-2">
                  {errors.initImage.message}
                </span>
              )}
            </div>
          </section>
        </section>
        {/* 提交按钮 */}
        <button
          className={
            'w-full mt-12 text-white bg-blue-700 hover:bg-blue-500 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 outline-none  ring-blue-500 dark:ring-blue-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600'
          }
          type="submit"
        >
          提交
        </button>
      </form>
      <div className={`${style['display-panel']}`}>
        {isCreatingImageProcessing ? (
          <div className="h-full flex justify-center items-center">
            <LoadingNumber />
          </div>
        ) : (
          <div className={`${style['display-images-container']}`}>
            <div className={`${style['display-main-image-container']}`}>
              <img src={imagesList[activeDisplayImageIndex]} alt="" />
            </div>
            <ul
              className={`${style['display-images-list']}`}
              onClick={handleSetActiveImage}
            >
              {imagesList.map((item, idx) => {
                return (
                  <li
                    key={idx}
                    className={`${style['display-images-list-item']} ${
                      idx === activeDisplayImageIndex ? 'active' : ''
                    }`}
                  >
                    <img src={item} alt="" data-pic-item={idx} />
                  </li>
                );
              })}
            </ul>
          </div>
        )}
        <button className="absolute bottom-[10rem] w-[4rem] aspect-square transition-all hover:bg-white bg-white/80 right-[4rem] flex items-center justify-center rounded-2xl">
          上传
          <br />
          图床
        </button>
      </div>
    </section>
  );
}
