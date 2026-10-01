import { useEffect, useState } from "react";
import { probeImageVariants } from "../lib/imageProbe.js";

// true una vez que exista alguna imagen para `basePath` (probando varias
// extensiones comunes); false mientras no exista ninguna.
export default function useCoverImage(basePath) {
  const [ok, setOk] = useState(false);

  useEffect(() => {
    if (!basePath) {
      setOk(false);
      return undefined;
    }

    const controller = new AbortController();
    probeImageVariants(basePath, controller.signal).then((result) => {
      if (!controller.signal.aborted) setOk(Boolean(result));
    });

    return () => {
      controller.abort();
    };
  }, [basePath]);

  return ok;
}
