// Rasterizes sponsor logo images into drawable bitmaps for the Hall of Fame.
// The bitmap is drawn directly onto the frame buffer (real image, not ASCII),
// while paintCell() leaves the painting's canvas area transparent so the
// image shows through. Falls back to procedural art until the image loads.

const TEX_SIZE = 256;

export function loadPaintingImages(paintings) {
  if (typeof document === 'undefined') return;
  for (const p of paintings) {
    if (!p.logoUrl || p.canvasBitmap || p._texLoading) continue;
    p._texLoading = true;

    const img = new Image();
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = TEX_SIZE;
        canvas.height = TEX_SIZE;
        const ctx = canvas.getContext('2d');

        // contain-fit so nothing stretches; margins stay transparent
        const iw = img.naturalWidth || TEX_SIZE;
        const ih = img.naturalHeight || TEX_SIZE;
        const scale = Math.min(TEX_SIZE / iw, TEX_SIZE / ih);
        const dw = Math.max(1, Math.round(iw * scale));
        const dh = Math.max(1, Math.round(ih * scale));
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, (TEX_SIZE - dw) / 2, (TEX_SIZE - dh) / 2, dw, dh);

        p.canvasBitmap = canvas;
        p.tex = { w: TEX_SIZE, h: TEX_SIZE };
      } catch (_) {
        // cross-origin or decode failure — painting falls back to procedural art
      }
    };
    img.onerror = () => { p._texLoading = false; };
    img.src = encodeURI(p.logoUrl);
  }
}
