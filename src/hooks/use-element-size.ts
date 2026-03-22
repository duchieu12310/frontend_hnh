import { useEffect, useRef, useState } from 'react';

interface UseElementSizeReturn {
  ref: React.RefObject<HTMLElement>;
  width: number;
  height: number;
}

export function useElementSize(): UseElementSizeReturn {
  const ref = useRef<HTMLElement>(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (!ref.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setWidth(entry.contentRect.width);
        setHeight(entry.contentRect.height);
      }
    });

    resizeObserver.observe(ref.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return { ref, width, height };
}









