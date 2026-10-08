import { useRef } from 'react';
import { Reveal, SectionHead } from './ui';
import { releaseNotes, techStack } from '../data';
import { ScrollTrigger, gsap, reducedMotion, useGSAP } from '../lib/motion';

export const Updates = () => {
  const timeline = useRef<HTMLDivElement>(null);

  // the orange tracker runs down the timeline with the scroll (and back up again),
  // lighting each release as it passes
  useGSAP(
    () => {
      if (reducedMotion()) return;
      const list = timeline.current?.querySelector('ol');
      if (!list) return;
      const range = {
        trigger: list,
        start: 'top 60%',
        end: 'bottom 60%',
        scrub: 0.6,
      };
      gsap.fromTo(
        '.timeline-fill',
        { scaleY: 0 },
        { scaleY: 1, ease: 'none', scrollTrigger: range },
      );
      gsap.fromTo(
        '.timeline-dot',
        { y: 0 },
        {
          y: () => list.offsetHeight,
          ease: 'none',
          scrollTrigger: { ...range, invalidateOnRefresh: true },
        },
      );
      list.querySelectorAll('li').forEach((li) =>
        ScrollTrigger.create({
          trigger: li,
          start: 'top 60%',
          end: 'bottom 60%',
          toggleClass: 'active',
        }),
      );
    },
    { scope: timeline },
  );

  return (
    <section className="updates beside-right" id="updates" data-stage="updates">
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
          <div className="timeline-wrap" ref={timeline}>
            <span className="timeline-fill" aria-hidden />
            <span className="timeline-dot" aria-hidden />
            <ol className="timeline">
              {releaseNotes.map((note, i) => (
                <Reveal as="li" key={note.title} delay={i * 80}>
                  <time>{note.date}</time>
                  <h3>{note.title}</h3>
                  <p>{note.description}</p>
                </Reveal>
              ))}
            </ol>
          </div>
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
};
