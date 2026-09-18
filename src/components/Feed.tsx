import { Kicker } from './ui';
import { feedItems } from '../data';
import type { FeedItem } from '../types';

export const Feed = () => (
  <section className="feed">
    <div className="container">
      <div className="section-head">
        <div>
          <Kicker>KEY PLATFORM HIGHLIGHTS</Kicker>
          <h2>
            TRACK.
            <br />
            SCREEN.
            <br />
            COMPETE.
          </h2>
        </div>
        <p>
          Instant form checking, 1v1 battle modes, and joint alignment screening
          designed to keep every workout safe and fun.
        </p>
      </div>
      <div className="feed-grid">
        {feedItems.map((item: FeedItem) => (
          <article key={item.label} className="feed-card">
            <div className="feed-label">{item.label}</div>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <div className="tags" style={{ marginTop: '20px' }}>
              {item.tags.map((tag) => (
                <span key={tag} className="tag">
                  {tag}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  </section>
);
