import { useCallback, useEffect, useRef, useState } from "react";

import SiteFooter from "../components/SiteFooter.jsx";
import SiteHeader from "../components/SiteHeader.jsx";
import SkipLink from "../components/SkipLink.jsx";
import { extractKeywords, markdownToHtml, renderInline } from "../lib/markdown.js";
import useDocumentTitle from "../lib/useDocumentTitle.js";

const NAV_LINKS = [
  { label: "Back to Main Site", to: "/" },
  { label: "Projects", to: "/projects" },
  { label: "Lessons", to: "/learnPython", current: true },
];

export default function LearnPython() {
  useDocumentTitle("Lessons - William Cook");

  const [lessons, setLessons] = useState([]);
  const [loadingText, setLoadingText] = useState("Loading lessons...");
  const [loaded, setLoaded] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const [searchValue, setSearchValue] = useState("");

  const searchInputRef = useRef(null);

  // Same loading pipeline as the original initLessons(): read the manifest,
  // then read every markdown file in order, using the first line as the title.
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const manifestResponse = await fetch("/pythonLessons/lessons.json");
        const manifest = await manifestResponse.json();
        const files = Array.isArray(manifest.files) ? manifest.files : [];
        const collected = [];

        for (const [index, filename] of files.entries()) {
          const response = await fetch(`/pythonLessons/${filename}`);
          if (!response.ok) continue;
          const raw = await response.text();
          const lines = raw.replace(/\r\n/g, "\n").split("\n");
          const title = lines[0].replace(/^#+\s*/, "").trim() || filename;
          const body = lines.slice(1).join("\n").trim();

          collected.push({
            id: `lesson-${index}`,
            title,
            filename,
            body,
            keywords: extractKeywords(`${title} ${body}`),
          });
        }

        if (cancelled) return;

        if (!collected.length) {
          setLoadingText("Lessons could not load.");
          return;
        }

        setLessons(collected);
        setLoaded(true);

        const initialLesson = collected.find(
          (lesson) => `#${lesson.id}` === window.location.hash,
        );
        setActiveId(initialLesson ? initialLesson.id : collected[0].id);
        if (initialLesson) {
          history.replaceState(null, "", `#${initialLesson.id}`);
        }
      } catch (error) {
        if (!cancelled) setLoadingText("Lessons could not load.");
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  const showLesson = useCallback(
    (lessonId, updateHash = true) => {
      const lesson = lessons.find((item) => item.id === lessonId) || lessons[0];
      if (!lesson) return;
      setActiveId(lesson.id);
      if (updateHash) {
        history.replaceState(null, "", `#${lesson.id}`);
      }
    },
    [lessons],
  );

  // Ctrl/Cmd+K focuses the lesson search, exactly as before.
  useEffect(() => {
    if (!loaded) return undefined;

    const handleKeydown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeydown);
    return () => document.removeEventListener("keydown", handleKeydown);
  }, [loaded]);

  const searchTerm = searchValue.toLowerCase().trim();
  const isVisible = (lesson) => {
    if (!searchTerm) return true;
    return `${lesson.title} ${lesson.keywords}`.toLowerCase().includes(searchTerm);
  };
  const visibleCount = lessons.filter(isVisible).length;

  const activeLesson = lessons.find((lesson) => lesson.id === activeId) || null;

  return (
    <>
      <SkipLink href="#lessons-content" />

      <SiteHeader brandStrong="Learn Python" links={NAV_LINKS} showResume={false} />

      <main>
        <section className="page-hero lessons-hero">
          <div className="container">
            <p className="eyebrow">Python Lessons</p>
            <h1>Welcome to Python Lessons</h1>
            <p className="hero-description">Select a lesson from the sidebar to get started!</p>
          </div>
        </section>

        <section className="section">
          <div className="container lessons-layout">
            <aside className="lessons-sidebar" aria-label="Python Lessons">
              <h2>Python Lessons</h2>
              <div id="loading" hidden={loaded}>{loadingText}</div>
              <ul id="lessons-list" className="lesson-links" hidden={!loaded}>
                {lessons.map((lesson) => (
                  <li key={lesson.id} hidden={!isVisible(lesson)}>
                    <a
                      href={`#${lesson.id}`}
                      data-lesson-id={lesson.id}
                      data-keywords={lesson.keywords}
                      className={lesson.id === activeId ? "active-lesson" : undefined}
                      onClick={(event) => {
                        event.preventDefault();
                        showLesson(lesson.id);
                      }}
                    >
                      {lesson.title}
                    </a>
                  </li>
                ))}
              </ul>

              <div id="search-container" className="lesson-search" hidden={!loaded}>
                <label className="visually-hidden" htmlFor="lesson-search">Search lessons</label>
                <input
                  type="text"
                  id="lesson-search"
                  placeholder="Search lessons..."
                  autoComplete="off"
                  ref={searchInputRef}
                  value={searchValue}
                  onChange={(event) => setSearchValue(event.target.value)}
                />
                <button
                  id="clear-search"
                  type="button"
                  title="Clear search"
                  hidden={!searchTerm}
                  onClick={() => {
                    setSearchValue("");
                    searchInputRef.current?.focus();
                  }}
                >
                  Clear
                </button>
              </div>

              <div id="no-results" className="notice" hidden={!loaded || visibleCount !== 0}>
                <p>No lessons found matching your search.</p>
              </div>

              <noscript>
                <div className="notice">
                  <p>Open the Markdown files in the pythonLessons folder to view the lessons.</p>
                </div>
              </noscript>
            </aside>

            <article id="lessons-content" className="lesson-reader" aria-live="polite">
              {activeLesson ? (
                <div
                  className="lesson-content active"
                  dangerouslySetInnerHTML={{
                    __html: `<h1>${renderInline(activeLesson.title)}</h1>${markdownToHtml(
                      activeLesson.body,
                    )}`,
                  }}
                />
              ) : (
                <div id="welcome-message">
                  <h2>Welcome to Python Lessons</h2>
                  <p>Select a lesson from the sidebar to get started!</p>
                </div>
              )}
            </article>
          </div>
        </section>
      </main>

      <SiteFooter mark="Learn Python" />
    </>
  );
}
