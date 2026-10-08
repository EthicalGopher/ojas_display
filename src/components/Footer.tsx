import { footerColumns, sihDetails } from '../data';
import type { FooterColumn } from '../types';

export const Footer = () => (
  <footer data-stage="hidden">
    <div className="container">
      <div className="footer-grid">
        <div>
          <a href="#" className="brand">
            <img src="/logo.svg" alt="" />
            <b>OJAS</b>
          </a>
          <p className="footer-about">
            Gamified fitness with real-time form correction and posture screening, built by
            team {sihDetails.teamName} for {sihDetails.event}.
          </p>
        </div>
        <div className="footer-links">
          {footerColumns.map((col: FooterColumn) => (
            <div key={col.title}>
              <strong>{col.title}</strong>
              {col.links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                >
                  {link.label}
                </a>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 OJAS · {sihDetails.teamName}</span>
        <span>TRAIN SAFE · MOVE ACCURATE · STAY FIT</span>
      </div>
    </div>
  </footer>
);
