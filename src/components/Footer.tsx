import { footerColumns, sihDetails } from '../data';
import type { FooterColumn } from '../types';

export const Footer = () => (
  <footer>
    <div className="container">
      <div className="footer-grid">
        <div>
          <div className="footer-brand">OJAS</div>
          <p style={{ color: '#999', fontSize: '14px', marginTop: '8px', maxWidth: '340px' }}>
            {sihDetails.teamName} — Gamified Fitness, Real-Time Form Correction, and Health Screening.
          </p>
          <div style={{ marginTop: '16px', fontSize: '12px', color: '#B9B9BE' }}>
            {sihDetails.event} | {sihDetails.problemTitle}
          </div>
        </div>
        <div className="footer-links">
          {footerColumns.map((col: FooterColumn) => (
            <div key={col.title}>
              <strong>{col.title}</strong>
              {col.links.map((link) => (
                <a key={link.label} href={link.href} target={link.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer">
                  {link.label}
                </a>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 OJAS ({sihDetails.teamName}). All rights reserved.</span>
        <span>TRAIN SAFE · MOVE ACCURATE · STAY FIT</span>
      </div>
    </div>
  </footer>
);
