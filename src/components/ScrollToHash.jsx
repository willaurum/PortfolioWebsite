import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * The original site navigated between real documents, so a link such as
 * "index.html#experience" landed on the anchor and a plain link landed at the
 * top of the page. This reproduces that for client-side route changes.
 */
export default function ScrollToHash() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const target = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (target) {
        target.scrollIntoView({ behavior: "instant", block: "start" });
        return;
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname, hash]);

  return null;
}
