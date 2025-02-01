/**
 * Target dimensions for notebook cover images (cached locally).
 * Aspect ratio ~3:1 for document-style cover.
 */
export const COVER_MAX_WIDTH = 1200;
export const COVER_MAX_HEIGHT = 400;

const COVER_JPEG_QUALITY = 0.85;

/**
 * Resize and compress an image to cover dimensions.
 * Returns a data URL (JPEG) suitable for storing in state / persistence.
 */
export function processCoverImage(source: string | File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = document.createElement('img');
    img.crossOrigin = 'anonymous';

    const onLoad = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = COVER_MAX_WIDTH;
        canvas.height = COVER_MAX_HEIGHT;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas not supported'));
          return;
        }
        // Draw image to cover the area (crop center)
        const scale = Math.max(
          COVER_MAX_WIDTH / img.naturalWidth,
          COVER_MAX_HEIGHT / img.naturalHeight
        );
        const w = img.naturalWidth * scale;
        const h = img.naturalHeight * scale;
        ctx.drawImage(
          img,
          (COVER_MAX_WIDTH - w) / 2,
          (COVER_MAX_HEIGHT - h) / 2,
          w,
          h
        );
        const dataUrl = canvas.toDataURL('image/jpeg', COVER_JPEG_QUALITY);
        resolve(dataUrl);
      } catch (e) {
        reject(e);
      }
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.onload = onLoad;

    if (typeof source === 'string') {
      img.src = source;
    } else {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.onload = () => {
        img.src = reader.result as string;
      };
      reader.readAsDataURL(source);
    }
  });
}

/**
 * Fetch image from URL and return as processed data URL (for local cache).
 * May fail due to CORS if the URL does not allow cross-origin.
 */
export async function fetchAndProcessCoverUrl(url: string): Promise<string> {
  const trimmed = url.trim();
  if (!trimmed) throw new Error('URL is required');
  const processed = await processCoverImage(trimmed);
  return processed;
}
