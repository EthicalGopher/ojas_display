import { useRef, type CSSProperties, type ReactNode } from 'react';
import { SplitText, gsap, reducedMotion, useGSAP } from '../lib/motion';

export type BtnProps = {
  href?: string;
  variant?: 'primary' | 'secondary' | 'light' | 'ghost-light';
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
};

const isExternal = (href: string) => href.startsWith('http');

export const BtnLink = ({ href, variant = 'primary', className, style, children }: BtnProps) => {
  const classes = `btn btn-${variant}${className ? ` ${className}` : ''}`;
  const content = (
    <>
      {children}
      <span className="arrow" aria-hidden>
        &rarr;
      </span>
    </>
  );
  if (href) {
    return (
      <a
        className={classes}
        href={href}
        style={style}
        target={isExternal(href) ? '_blank' : undefined}
        rel={isExternal(href) ? 'noopener noreferrer' : undefined}
      >
        {content}
      </a>
    );
  }
  return (
    <button className={classes} style={style}>
      {content}
    </button>
  );
};

export const Kicker = ({
  className,
  style,
  children,
}: {
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) => (
  <div className={`kicker${className ? ` ${className}` : ''}`} style={style}>
    {children}
  </div>
);

export const SectionHead = ({
  kicker,
  title,
  children,
}: {
  kicker: string;
  title: ReactNode;
  children?: ReactNode;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  // each heading line slides up out of its own mask as the section arrives
  useGSAP(
    () => {
      if (reducedMotion()) return;
      SplitText.create('h2', {
        type: 'lines',
        mask: 'lines',
        autoSplit: true,
        onSplit: (self) =>
          gsap.from(self.lines, {
            yPercent: 110,
            duration: 1.1,
            ease: 'expo.out',
            stagger: 0.09,
            scrollTrigger: { trigger: ref.current, start: 'top 85%', once: true },
          }),
      });
      gsap.from('.kicker, p', {
        y: 24,
        autoAlpha: 0,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.1,
        scrollTrigger: { trigger: ref.current, start: 'top 85%', once: true },
      });
    },
    { scope: ref },
  );
  return (
    <div className="section-head" ref={ref}>
      <div>
        <Kicker>{kicker}</Kicker>
        <h2>{title}</h2>
      </div>
      {children && <p>{children}</p>}
    </div>
  );
};

/** Rises into place the first time it scrolls into view. */
export const Reveal = ({
  as: Tag = 'div',
  className,
  delay = 0,
  children,
  ...rest
}: {
  as?: 'div' | 'article' | 'li';
  className?: string;
  delay?: number;
  children: ReactNode;
} & Record<string, unknown>) => {
  const ref = useRef<HTMLElement>(null);
  useGSAP(() => {
    if (reducedMotion() || !ref.current) return;
    gsap.from(ref.current, {
      y: 48,
      autoAlpha: 0,
      duration: 1,
      delay: delay / 1000,
      ease: 'power3.out',
      scrollTrigger: { trigger: ref.current, start: 'top 90%', once: true },
    });
  });
  return (
    <Tag ref={ref as never} className={className} {...rest}>
      {children}
    </Tag>
  );
};
