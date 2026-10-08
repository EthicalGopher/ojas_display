import { useEffect, useState } from 'react';
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
        <a href="#" className="brand" aria-label="OJAS home">
          <img src="/logo.svg" alt="" />
          <b>OJAS</b>
          <span className="brand-chip">
            {sihDetails.teamName} · SIH 2026
          </span>
        </a>

        <nav className={`nav-links${menuOpen ? ' open' : ''}`}>
          {navLinks.map((link: NavLink) => (
            <a key={link.label} href={link.href} onClick={() => setMenuOpen(false)}>
              {link.label}
            </a>
          ))}
        </nav>

        <div className="nav-right">
          <button
            type="button"
            className="btn btn-primary nav-download"
            onClick={handleDownload}
            disabled={loading}
            aria-label="Download OJAS APK"
          >
            {loading ? 'Loading' : 'Get APK'}
          </button>
          <button
            type="button"
            className="menu"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? 'CLOSE' : 'MENU'}
          </button>
        </div>
      </div>
    </header>
  );
};
