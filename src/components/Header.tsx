import { useState, useEffect } from 'react';
import type { NavLink } from '../types';
import { navLinks, projectLinks, sihDetails } from '../data';
import { getContent } from '../lib/contentApi';

export const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [apkLink, setApkLink] = useState<string>(projectLinks.apk);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchApk = async () => {
      setLoading(true);
      try {
        const content = await getContent();
        if (content.apkLink) {
          setApkLink(content.apkLink);
        }
      } catch {
        // Keep default APK link
      } finally {
        setLoading(false);
      }
    };

    fetchApk();
  }, []);

  const handleDownload = () => {
    window.open(apkLink, '_blank', 'noopener,noreferrer');
  };

  return (
    <header className="nav">
      <div className="container nav-inner">
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <a href="#" className="logo">
            OJAS
          </a>
          <span
            style={{
              fontSize: '11px',
              background: '#37373a',
              border: '1px solid rgba(255,255,255,0.18)',
              padding: '3px 8px',
              borderRadius: '4px',
              color: '#fff',
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
            }}
          >
            {sihDetails.teamName} · SIH 2026
          </span>
        </div>

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

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            type="button"
            className="nav-download"
            onClick={handleDownload}
            disabled={loading}
            aria-label="Download OJAS APK"
          >
            {loading ? 'Loading...' : 'DOWNLOAD APK'}
          </button>
          <button
            type="button"
            className="menu"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            MENU
          </button>
        </div>
      </div>
    </header>
  );
};
