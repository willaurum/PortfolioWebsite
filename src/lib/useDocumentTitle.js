import { useEffect } from "react";

/**
 * Mirrors the per-page <title> values of the original static pages.
 */
export default function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title;
  }, [title]);
}
