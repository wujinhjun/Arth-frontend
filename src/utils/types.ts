import {
  GITHUB_USERNAME_ACTION,
  GITHUB_REPO_ACTION
} from '@/utils/storageAction';

export interface IDataGenerateImg {
  // 流派
  school: string;
  // prompt
  prompt: string;
  // negative
  negativePrompt: string;
  // 高宽
  width: number;
  height: number;
  // 张数
  batchSize: number;
  // 步长
  steps: number;
  // 垫图
  initImage: string;
}

export type ConfigKeyType =
  | typeof GITHUB_USERNAME_ACTION
  | typeof GITHUB_REPO_ACTION;
