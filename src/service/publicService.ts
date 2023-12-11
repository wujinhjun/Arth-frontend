const TOKEN = import.meta.env.VITE_GITHUB_SSH_KEY;
const OWNER = 'wujinhjun';
const REPO = 'arth-picture';

/**
 * Description: 上传图片到github
 *
 * @param {string} fileName 文件名
 * @param {string} image base64格式的图片(带前缀)
 * @return {*}  {Promise<string>} 图片的下载地址
 */
function uploadImageToGithub(fileName: string, image: string) {
  const date = new Date();

  const path = `${date.getFullYear()}_${
    date.getMonth() + 1
  }_${date.getDate()}_${date.getHours()}_${date.getMinutes()}_${date.getSeconds()}_${fileName}`;

  const headers = new Headers({
    Accept: 'application/vnd.github+json',
    Authorization: `Bearer ${TOKEN}`,
    'X-GitHub-Api-Version': '2022-11-28',
    'Content-Type': 'application/json'
  });

  const body = {
    message: 'upload image',
    content: image.replace(/^data:image\/\w+;base64,/, ''),
    branch: 'main',
    path
  };

  return fetch(
    `https://api.github.com/repos/wujinhjun/arth-picture/contents/${path}`,
    {
      method: 'PUT',
      headers,
      body: JSON.stringify(body)
    }
  )
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      console.log(res);
      const downloadUrl = res.content.download_url
        .replace('raw.githubusercontent.com', 'cdn.jsdelivr.net/gh')
        .replace('/main', '');
      return downloadUrl;
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
}

/**
 * Description: 公共服务部分
 *
 */
const publicService = {
  uploadImageToGithub
};

export default publicService;
