import { useEffect, useRef, useState } from "react";

export function useImagePreloader(urls: string[]) {
  const [loaded, setLoaded] = useState(0);
  const [done, setDone] = useState(false);
  const imagesRef = useRef<HTMLImageElement[]>([]);

  useEffect(() => {
    let cancelled = false;
    imagesRef.current = new Array(urls.length);
    let count = 0;
    const concurrency = 12;
    let cursor = 0;

    const loadNext = (): Promise<void> => {
      if (cancelled || cursor >= urls.length) return Promise.resolve();
      const i = cursor++;
      return new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = img.onerror = () => {
          if (cancelled) return resolve();
          imagesRef.current[i] = img;
          count++;
          setLoaded(count);
          resolve();
        };
        img.src = urls[i];
      }).then(loadNext);
    };

    Promise.all(Array.from({ length: concurrency }, loadNext)).then(() => {
      if (!cancelled) setDone(true);
    });

    return () => { cancelled = true; };
  }, [urls]);

  return { images: imagesRef, loaded, total: urls.length, progress: urls.length ? loaded / urls.length : 0, done };
}
