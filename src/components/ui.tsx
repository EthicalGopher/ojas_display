import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';

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
}) => (
  <Reveal className="section-head">
    <div>
      <Kicker>{kicker}</Kicker>
      <h2>{title}</h2>
    </div>
    {children && <p>{children}</p>}
  </Reveal>
);

/** Fades its children up the first time they scroll into view. */
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
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          node.classList.add('in');
          io.disconnect();
        }
      },
      { rootMargin: '0px 0px -8% 0px' },
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);
  return (
    <Tag
      ref={ref as never}
      className={`reveal${className ? ` ${className}` : ''}`}
      style={{ transitionDelay: `${delay}ms` }}
      {...rest}
    >
      {children}
    </Tag>
  );
};
