import { footerColumns } from '../data';
import type { FooterColumn } from '../types';

export const Footer = () => (
  <footer>
    <div className="container">
      <div className="footer-grid">
        <div className="footer-brand">OJAS</div>
        <div className="footer-links">
          {footerColumns.map((col: FooterColumn) => (
            <div key={col.title}>
              <strong>{col.title}</strong>
              {col.links.map((link) => (
                <a key={link.label} href={link.href}>
                  {link.label}
                </a>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 OJAS. All rights reserved.</span>
        <span>TRAIN SMART · MOVE WELL · STAY CONSISTENT</span>
      </div>
    </div>
  </footer>
);
