import { useEffect, useState } from "react";

/**
 * Same live count as the original script.js: the number of directories in the
 * LeetCode-Solutions repository.
 */
export default function LeetCodeCount() {
  const [count, setCount] = useState("Loading...");

  useEffect(() => {
    let cancelled = false;

    const loadLeetCodeCount = async () => {
      try {
        const response = await fetch(
          "https://api.github.com/repos/Willaurum/LeetCode-Solutions/contents",
        );
        const data = await response.json();
        if (cancelled) return;

        if (!Array.isArray(data)) {
          setCount("N/A");
          return;
        }

        const folderCount = data.filter((item) => item.type === "dir").length;
        setCount(String(folderCount));
      } catch (error) {
        if (!cancelled) setCount("Error");
      }
    };

    loadLeetCodeCount();

    return () => {
      cancelled = true;
    };
  }, []);

  return <span id="leetcode-count-exp">{count}</span>;
}
