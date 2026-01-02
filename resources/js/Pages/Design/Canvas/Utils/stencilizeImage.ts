/**
 * Converts an image into a black-and-white stencil / posterized cutout
 * @param url - Image URL
 * @param options.threshold - Main cutoff for black/white (0-255)
 * @param options.blur - Optional Gaussian blur before threshold to smooth edges
 * @param options.edgeDetection - Enable edge detection for crisp outlines
 * @param options.posterizeLevels - Number of grayscale levels (2 = pure B/W)
 */
export const stencilizeImage = (
  url: string,
  options: {
    threshold?: number;
    blur?: number;
    edgeDetection?: boolean;
    posterizeLevels?: number;
  } = {}
): Promise<string> => {
  const { threshold = 128, blur = 0, edgeDetection = true, posterizeLevels = 2 } = options;

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = url;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d")!;
      canvas.width = img.width;
      canvas.height = img.height;

      ctx.drawImage(img, 0, 0);

      // Optional blur to smooth edges
      if (blur > 0) {
        ctx.filter = `blur(${blur}px)`;
        ctx.drawImage(canvas, 0, 0);
        ctx.filter = "none";
      }

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Grayscale & optional posterization
      for (let i = 0; i < data.length; i += 4) {
        let gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;

        // Posterize
        if (posterizeLevels > 2) {
          gray = Math.floor((gray / 255) * (posterizeLevels - 1)) * (255 / (posterizeLevels - 1));
        }

        data[i] = data[i + 1] = data[i + 2] = gray;
      }

      // Optional edge detection (Sobel operator)
      if (edgeDetection) {
        const w = canvas.width;
        const h = canvas.height;
        const copy = new Uint8ClampedArray(data); // copy of original gray

        const kernelX = [
          [-1, 0, 1],
          [-2, 0, 2],
          [-1, 0, 1],
        ];
        const kernelY = [
          [-1, -2, -1],
          [0, 0, 0],
          [1, 2, 1],
        ];

        for (let y = 1; y < h - 1; y++) {
          for (let x = 1; x < w - 1; x++) {
            let gx = 0;
            let gy = 0;

            for (let ky = -1; ky <= 1; ky++) {
              for (let kx = -1; kx <= 1; kx++) {
                const px = x + kx;
                const py = y + ky;
                const idx = (py * w + px) * 4;
                const val = copy[idx]; // gray

                gx += val * kernelX[ky + 1][kx + 1];
                gy += val * kernelY[ky + 1][kx + 1];
              }
            }

            const mag = Math.sqrt(gx * gx + gy * gy);
            const i = (y * w + x) * 4;
            const v = mag > threshold ? 0 : 255; // edges black, background white
            data[i] = data[i + 1] = data[i + 2] = v;
          }
        }
      } else {
        // Simple threshold if no edge detection
        for (let i = 0; i < data.length; i += 4) {
          const v = data[i] < threshold ? 0 : 255;
          data[i] = data[i + 1] = data[i + 2] = v;
        }
      }

      ctx.putImageData(imageData, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };
  });
};
