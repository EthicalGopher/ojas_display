import { Reveal, SectionHead } from './ui';
import { releaseNotes, techStack } from '../data';

export const Updates = () => (
  <section className="updates" id="updates" data-stage="hidden">
    <div className="container">
      <SectionHead
        kicker="Release notes"
        title={
          <>
            What&rsquo;s
            <br />
            <em>new.</em>
          </>
        }
      >
        Ojas ships often. Here is what changed in the latest builds, and what it runs on.
      </SectionHead>
      <div className="updates-layout">
        <ol className="timeline">
          {releaseNotes.map((note, i) => (
            <Reveal as="li" key={note.title} delay={i * 80}>
              <time>{note.date}</time>
              <h3>{note.title}</h3>
              <p>{note.description}</p>
            </Reveal>
          ))}
        </ol>
        <dl className="spec">
          <div className="spec-head">
            <span>System spec</span>
            <b>Build · Oct 2026</b>
          </div>
          {techStack.map((t) => (
            <div key={t.layer} className="spec-row">
              <dt>{t.layer}</dt>
              <dd>
                <b>{t.value}</b>
                <span>{t.note}</span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  </section>
);
