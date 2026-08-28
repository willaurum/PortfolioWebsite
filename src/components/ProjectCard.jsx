import { useState } from "react";

/**
 * Reproduces the markup and behaviour of a card in the projects grid.
 *
 * The original script.js forced <details> permanently open and instead toggled
 * an `is-expanded` class on the card, swapping the summary label between
 * "View More" and "Show Less" - the CSS does the collapsing with a fixed card
 * height plus a fade overlay. Same approach here.
 */
export default function ProjectCard({
  className,
  media,
  title,
  meta,
  description,
  children,
}) {
  const [expanded, setExpanded] = useState(false);

  const cardClass = [
    "project-card",
    className,
    expanded ? "is-expanded" : null,
  ]
    .filter(Boolean)
    .join(" ");

  const handleSummaryClick = (event) => {
    event.preventDefault();
    setExpanded((current) => !current);
  };

  return (
    <article className={cardClass}>
      {media}
      <div className="project-body">
        <h2>{title}</h2>
        <div className="project-meta" aria-label="Project details">
          {meta.map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>
        {description}
        <details open>
          <summary aria-expanded={expanded} onClick={handleSummaryClick}>
            {expanded ? "Show Less" : "View More"}
          </summary>
          {children}
        </details>
      </div>
    </article>
  );
}
