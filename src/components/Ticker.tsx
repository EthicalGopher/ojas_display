import { tickerItems } from '../data';

export const Ticker = () => (
  <section className="ticker" data-stage="hidden" aria-label="Features">
    <div className="ticker-track">
      {[...tickerItems, ...tickerItems].map((item, i) => (
        <span key={i} aria-hidden={i >= tickerItems.length}>
          {item}
        </span>
      ))}
    </div>
  </section>
);
