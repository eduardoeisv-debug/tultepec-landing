import { useEffect, useState } from "react";
import { probeVideoVariants } from "../lib/videoProbe.js";

// true una vez que exista algún video para `basePath`; false mientras no
// exista ninguno. Mismo patrón que useCoverImage.
export default function useCoverVideo(basePath) {
  const [ok, setOk] = useState(false);

  useEffect(() => {
    if (!basePath) {
      setOk(false);
      return undefined;
    }

    const controller = new AbortController();
    probeVideoVariants(basePath, controller.signal).then((result) => {
      if (!controller.signal.aborted) setOk(Boolean(result));
    });

    return () => {
      controller.abort();
    };
  }, [basePath]);

  return ok;
}
