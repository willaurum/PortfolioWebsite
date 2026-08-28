export default function SiteFooter({ mark }) {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <p className="footer-mark">{mark}</p>
        <p>&copy; 2026 William Cook. All rights reserved.</p>
      </div>
    </footer>
  );
}
