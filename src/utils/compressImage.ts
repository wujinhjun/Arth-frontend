export default function compressImage(image: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    canvas.style.display = 'none';
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      return;
    }

    const img = new Image();

    img.src = image;
    img.onload = () => {
      const radioCanvas = 256 / img.width;
      canvas.width = img.width * radioCanvas;
      canvas.height = img.height * radioCanvas;

      ctx.drawImage(img, 0, 0);

      const result = canvas.toDataURL('image/jpeg', 0.92);
      resolve(result);
    };

    img.onerror = (err) => {
      reject(err);
    };
  });
}
