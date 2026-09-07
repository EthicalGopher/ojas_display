import { Kicker } from './ui';
import { feedItems } from '../data';
import type { FeedItem } from '../types';

export const Feed = () => (
  <section className="feed">
    <div className="container">
      <div className="section-head">
        <div>
          <Kicker>FROM THE OJAS FEED</Kicker>
          <h2>
            MEASURE.
            <br />
            IMPROVE.
            <br />
            COMPETE.
          </h2>
        </div>
        <p>
          Practical guidance, measurable feedback and competitive formats to
          keep every session focused from setup to score.
        </p>
      </div>
      <div className="feed-grid">
        {feedItems.map((item: FeedItem) => (
          <article key={item.label} className="feed-card">
            <div className="feed-label">{item.label}</div>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            {item.tags.map((tag) => (
              <div key={tag} className="card-link">
                {tag}
              </div>
            ))}
          </article>
        ))}
      </div>
    </div>
  </section>
);
