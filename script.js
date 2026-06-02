(() => {
  const escapeHtml = (value) =>
    value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

  const renderInline = (value) => {
    let html = escapeHtml(value);
    html = html.replace(/`([^`]+)`/g, "<code>$1</code>");
    html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    html = html.replace(/\*([^*]+)\*/g, "<em>$1</em>");
    return html;
  };

  const splitTableRow = (line) =>
    line
      .trim()
      .replace(/^\|/, "")
      .replace(/\|$/, "")
      .split("|")
      .map((cell) => cell.trim());

  const isTableDivider = (line) =>
    /^\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?$/.test(line.trim());

  const markdownToHtml = (markdown) => {
    const lines = markdown.replace(/\r\n/g, "\n").split("\n");
    const output = [];
    let paragraph = [];
    let listType = null;
    let codeFence = null;
    let codeLines = [];

    const flushParagraph = () => {
      if (paragraph.length) {
        output.push(`<p>${renderInline(paragraph.join(" "))}</p>`);
        paragraph = [];
      }
    };

    const closeList = () => {
      if (listType) {
        output.push(`</${listType}>`);
        listType = null;
      }
    };

    for (let i = 0; i < lines.length; i += 1) {
      const line = lines[i];
      const trimmed = line.trim();

      if (codeFence) {
        if (trimmed.startsWith("```")) {
          output.push(
            `<pre><code class="language-${escapeHtml(codeFence)}">${escapeHtml(codeLines.join("\n"))}</code></pre>`,
          );
          codeFence = null;
          codeLines = [];
        } else {
          codeLines.push(line);
        }
        continue;
      }

      if (trimmed.startsWith("```")) {
        flushParagraph();
        closeList();
        codeFence = trimmed.slice(3).trim() || "text";
        codeLines = [];
        continue;
      }

      if (!trimmed) {
        flushParagraph();
        closeList();
        continue;
      }

      if (
        trimmed.includes("|") &&
        lines[i + 1] &&
        isTableDivider(lines[i + 1])
      ) {
        flushParagraph();
        closeList();
        const headers = splitTableRow(trimmed);
        const rows = [];
        i += 2;
        while (i < lines.length && lines[i].trim().includes("|")) {
          rows.push(splitTableRow(lines[i]));
          i += 1;
        }
        i -= 1;
        output.push(
          `<table><thead><tr>${headers.map((header) => `<th>${renderInline(header)}</th>`).join("")}</tr></thead><tbody>${rows
            .map(
              (row) =>
                `<tr>${row.map((cell) => `<td>${renderInline(cell)}</td>`).join("")}</tr>`,
            )
            .join("")}</tbody></table>`,
        );
        continue;
      }

      if (/^---+$/.test(trimmed)) {
        flushParagraph();
        closeList();
        output.push("<hr />");
        continue;
      }

      const heading = trimmed.match(/^(#{1,4})\s+(.*)$/);
      if (heading) {
        flushParagraph();
        closeList();
        const level = heading[1].length;
        output.push(`<h${level}>${renderInline(heading[2])}</h${level}>`);
        continue;
      }

      const quote = trimmed.match(/^>\s?(.*)$/);
      if (quote) {
        flushParagraph();
        closeList();
        output.push(`<blockquote><p>${renderInline(quote[1])}</p></blockquote>`);
        continue;
      }

      const unordered = trimmed.match(/^[-*]\s+(.*)$/);
      if (unordered) {
        flushParagraph();
        if (listType !== "ul") {
          closeList();
          listType = "ul";
          output.push("<ul>");
        }
        output.push(`<li>${renderInline(unordered[1])}</li>`);
        continue;
      }

      const ordered = trimmed.match(/^\d+\.\s+(.*)$/);
      if (ordered) {
        flushParagraph();
        if (listType !== "ol") {
          closeList();
          listType = "ol";
          output.push("<ol>");
        }
        output.push(`<li>${renderInline(ordered[1])}</li>`);
        continue;
      }

      closeList();
      paragraph.push(trimmed);
    }

    if (codeFence) {
      output.push(`<pre><code>${escapeHtml(codeLines.join("\n"))}</code></pre>`);
    }
    flushParagraph();
    closeList();
    return output.join("");
  };

  const loadLeetCodeCount = async () => {
    const targets = ["leetcode-count-top", "leetcode-count-exp"]
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (!targets.length) return;

    try {
      const response = await fetch("https://api.github.com/repos/Willaurum/LeetCode-Solutions/contents");
      const data = await response.json();

      if (!Array.isArray(data)) {
        targets.forEach((target) => {
          target.textContent = "N/A";
        });
        return;
      }

      const folderCount = data.filter((item) => item.type === "dir").length;
      targets.forEach((target) => {
        target.textContent = folderCount;
      });
    } catch (error) {
      targets.forEach((target) => {
        target.textContent = "Error";
      });
    }
  };

  const extractKeywords = (text) =>
    [...new Set(text.toLowerCase().replace(/[^\w\s]/g, " ").split(/\s+/).filter((word) => word.length > 2))]
      .slice(0, 40)
      .join(" ");

  const initLessons = async () => {
    const list = document.getElementById("lessons-list");
    const content = document.getElementById("lessons-content");
    const loading = document.getElementById("loading");
    const searchContainer = document.getElementById("search-container");
    const searchInput = document.getElementById("lesson-search");
    const clearSearch = document.getElementById("clear-search");
    const noResults = document.getElementById("no-results");

    if (!list || !content) return;

    const showError = () => {
      if (loading) loading.textContent = "Lessons could not load.";
    };

    try {
      const manifestResponse = await fetch("pythonLessons/lessons.json");
      const manifest = await manifestResponse.json();
      const files = Array.isArray(manifest.files) ? manifest.files : [];
      const lessons = [];

      for (const [index, filename] of files.entries()) {
        const response = await fetch(`pythonLessons/${filename}`);
        if (!response.ok) continue;
        const raw = await response.text();
        const lines = raw.replace(/\r\n/g, "\n").split("\n");
        const title = lines[0].replace(/^#+\s*/, "").trim() || filename;
        const body = lines.slice(1).join("\n").trim();

        lessons.push({
          id: `lesson-${index}`,
          title,
          filename,
          body,
          keywords: extractKeywords(`${title} ${body}`),
        });
      }

      if (!lessons.length) {
        showError();
        return;
      }

      list.innerHTML = lessons
        .map(
          (lesson) =>
            `<li><a href="#${lesson.id}" data-lesson-id="${lesson.id}" data-keywords="${escapeHtml(lesson.keywords)}">${escapeHtml(lesson.title)}</a></li>`,
        )
        .join("");

      if (loading) loading.hidden = true;
      list.hidden = false;
      if (searchContainer) searchContainer.hidden = false;

      const showLesson = (lessonId, updateHash = true) => {
        const lesson = lessons.find((item) => item.id === lessonId) || lessons[0];
        const links = list.querySelectorAll("[data-lesson-id]");

        links.forEach((link) => {
          link.classList.toggle("active-lesson", link.dataset.lessonId === lesson.id);
        });

        content.innerHTML = `
          <div class="lesson-content active">
            <h1>${renderInline(lesson.title)}</h1>
            ${markdownToHtml(lesson.body)}
          </div>
        `;

        if (updateHash) {
          history.replaceState(null, "", `#${lesson.id}`);
        }
      };

      list.addEventListener("click", (event) => {
        const link = event.target.closest("[data-lesson-id]");
        if (!link) return;
        event.preventDefault();
        showLesson(link.dataset.lessonId);
      });

      const filterLessons = () => {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const items = list.querySelectorAll("li");
        let visibleCount = 0;

        items.forEach((item) => {
          const link = item.querySelector("[data-lesson-id]");
          const text = `${link.textContent} ${link.dataset.keywords}`.toLowerCase();
          const visible = !searchTerm || text.includes(searchTerm);
          item.hidden = !visible;
          if (visible) visibleCount += 1;
        });

        if (noResults) noResults.hidden = visibleCount !== 0;
        if (clearSearch) clearSearch.hidden = !searchTerm;
      };

      if (searchInput) {
        searchInput.addEventListener("input", filterLessons);
      }

      if (clearSearch) {
        clearSearch.addEventListener("click", () => {
          searchInput.value = "";
          filterLessons();
          searchInput.focus();
        });
      }

      document.addEventListener("keydown", (event) => {
        if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
          event.preventDefault();
          searchInput?.focus();
        }
      });

      const initialLesson = lessons.find((lesson) => `#${lesson.id}` === window.location.hash);
      showLesson(initialLesson ? initialLesson.id : lessons[0].id, Boolean(initialLesson));
    } catch (error) {
      showError();
    }
  };

  const initProjectCards = () => {
    const cards = document.querySelectorAll(".projects-section .project-card");

    cards.forEach((card) => {
      const details = card.querySelector("details");
      const summary = details?.querySelector("summary");
      if (!details || !summary) return;

      details.open = true;
      summary.setAttribute("aria-expanded", "false");

      summary.addEventListener("click", (event) => {
        event.preventDefault();
        const isExpanded = card.classList.toggle("is-expanded");
        summary.textContent = isExpanded ? "Show Less" : "View More";
        summary.setAttribute("aria-expanded", String(isExpanded));
        details.open = true;
      });
    });
  };

  document.addEventListener("DOMContentLoaded", () => {
    loadLeetCodeCount();
    initProjectCards();
    if (document.body.dataset.page === "lessons") {
      initLessons();
    }
  });
})();
