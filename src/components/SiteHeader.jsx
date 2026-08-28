import { Link } from "react-router-dom";

function NavItem({ label, to, hash, current }) {
  const ariaCurrent = current ? "page" : undefined;

  // Same-page anchors stay plain anchors so the browser handles the smooth
  // scroll exactly as it did on the static site.
  if (hash && !to) {
    return (
      <a href={hash} aria-current={ariaCurrent}>
        {label}
      </a>
    );
  }

  return (
    <Link to={hash ? { pathname: to, hash } : to} aria-current={ariaCurrent}>
      {label}
    </Link>
  );
}

export default function SiteHeader({ brandStrong, links, showResume = true }) {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link className="brand" to="/" aria-label="William Cook home">
          <span className="brand-mark" aria-hidden="true">
            WC
          </span>
          <span className="brand-text">
            <span>Portfolio</span>
            <strong>{brandStrong}</strong>
          </span>
        </Link>

        <nav className="site-nav" aria-label="Primary">
          {links.map((link) => (
            <NavItem key={link.label} {...link} />
          ))}
        </nav>

        {showResume && (
          <a
            className="nav-cta"
            href="/assets/William Cook - Resume.pdf"
            download="William Cook - Resume.pdf"
          >
            Download Resume
          </a>
        )}
      </div>
    </header>
  );
}
