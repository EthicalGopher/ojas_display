import { useState, useEffect } from 'react';
import type { NavLink } from '../types';
import { navLinks } from '../data';
import { getContent } from '../lib/contentApi';

export const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [apkLink, setApkLink] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApk = async () => {
      try {
        const content = await getContent();
        setApkLink(content.apkLink);
      } catch {
        setApkLink(null);
      } finally {
        setLoading(false);
      }
    };

    fetchApk();
  }, []);

  const handleDownload = () => {
    const link = apkLink;
    if (!link) return;
    window.open(link, '_blank', 'noopener,noreferrer,noreferer');
  };

  return (
    <header className="nav">
      <div className="container nav-inner">
        <a href="#" className="logo">
          OJAS
        </a>
        <nav
          className="nav-links"
          style={{
            display: menuOpen ? 'flex' : '',
            ...(menuOpen
              ? {
                  position: 'absolute',
                  top: '76px',
                  left: '0',
                  right: '0',
                  padding: '22px',
                  background: '#2B2B2E',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                }
              : {}),
          }}
        >
          {navLinks.map((link: NavLink) => (
            <a key={link.label} href={link.href} onClick={() => setMenuOpen(false)}>
              {link.label}
            </a>
          ))}
        </nav>
        <button
          type="button"
          className="nav-download"
          onClick={handleDownload}
          disabled={loading || !apkLink}
          aria-label={apkLink ? 'Download OJAS APK' : 'APK not available'}
        >
          {loading ? 'Loading…' : 'DOWNLOAD APK'}
        </button>
        <button
          type="button"
          className="menu"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          ☰
        </button>
      </div>
    </header>
  );
};
