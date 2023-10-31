import { useState } from 'react';
import { produce } from 'immer';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import style from '@/styles/txtImgPage.module.css';
import { createImageSchema } from '@/utils/schema';
import LoadingNumber from '@/components/LoadingNumber';

type IFormDataTxt2Img = {
  prompt: string;
  negativePrompt: string;
  width: number;
  height: number;
  batchSize: number;
  steps: number;
};

const base64Prefix = 'data:image/png;base64,';

export default function TxtImgPage() {
  const [isCreatingProcessing, setIsCreateProcessing] = useState(false);
  const [img, setImg] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<IFormDataTxt2Img>({ resolver: zodResolver(createImageSchema) });

  const onSubmit: SubmitHandler<IFormDataTxt2Img> = (data) => {
    setIsCreateProcessing(true);
    const formData = {
      prompt: data.prompt,
      negative_prompt: data.negativePrompt ?? '',
      width: data.width ?? 512,
      height: data.height ?? 512 + 256,
      batch_size: data.batchSize
    };
    fetch('http://localhost:3000/img/txt2img', {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((res) => res.json())
      .then((res) => {
        setImg(base64Prefix + res);
      })
      .finally(() => {
        setIsCreateProcessing(false);
      });
  };

  return (
    <section className={`${style.wrapper}`}>
      <section className={`${style['left-panel']} flex flex-col`}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col justify-between grow"
        >
          <section>
            <div className={`${style['form-field']}`}>
              <label htmlFor="prompt">prompt</label>
              <textarea
                id="prompt"
                className={`${style['form-input']}`}
                {...register('prompt')}
              />
              {errors.prompt?.message ? (
                <p className={'text-red-500'}>{errors.prompt.message}</p>
              ) : null}
            </div>

            <div className={`${style['form-field']}`}>
              <label htmlFor="negativePrompt">negative prompt</label>
              <textarea
                id="negativePrompt"
                defaultValue={''}
                className={`${style['form-input']}`}
                {...register('negativePrompt')}
              />
              {errors.negativePrompt?.message ? (
                <p className={'text-red-500'}>
                  {errors.negativePrompt.message}
                </p>
              ) : null}
            </div>

            <div className={`${style['form-field']}`}>
              <label htmlFor="batchSize">batch size</label>

              <textarea
                id="batchSize"
                defaultValue={1}
                className={`${style['form-input']}`}
                {...register('batchSize', { valueAsNumber: true })}
              />
              {errors.batchSize?.message ? (
                <p className={'text-red-500'}>{errors.batchSize.message}</p>
              ) : null}
            </div>
          </section>

          <button
            className={
              'w-full justify-center rounded-md bg-black/20 px-4 py-2 text-sm font-medium text-white hover:bg-black/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75'
            }
            type="submit"
          >
            提交
          </button>
        </form>
      </section>
      <section className={`${style['right-panel']}`}>
        {isCreatingProcessing ? (
          <LoadingNumber />
        ) : img.length > 0 ? (
          <>
            <img src={img} />
          </>
        ) : null}
      </section>
    </section>
  );
}
