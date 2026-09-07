import type { ReactNode, CSSProperties } from 'react';

export type BtnProps = {
  href?: string;
  variant?: 'primary' | 'secondary';
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
};

export const BtnLink = ({
  href,
  variant = 'primary',
  className,
  style,
  children,
}: BtnProps) => {
  const classes = `btn btn-${variant}${className ? ` ${className}` : ''}`;
  if (href) {
    return (
      <a className={classes} href={href} style={style}>
        {children}
      </a>
    );
  }
  return (
    <button className={classes} style={style}>
      {children}
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
