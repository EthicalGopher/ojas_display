import { Suspense, lazy, useState } from 'react';
import { ScrollTrigger, useGSAP } from '../lib/motion';
import { SLOTS, broadcastStats, stage, type Slot } from '../lib/stage';

const HeroScene = lazy(() => import('../three/HeroScene'));

/**
 * One fixed 3D layer behind the whole page: the athlete follows the visitor
 * down it, changing exercise, side and camera angle per section.
 */
export const AthleteStage = () => {
  const [slot, setSlot] = useState<Slot>(SLOTS.hero);
  // sections with solid backgrounds currently filling the whole screen
  const [covering, setCovering] = useState(0);

  useGSAP(() => {
    const covers = new Set<HTMLElement>();
    const enter = (s: Slot) => {
      stage.slot = s;
      setSlot(s);
    };
    const triggers = Array.from(document.querySelectorAll<HTMLElement>('[data-stage]')).map((el) => {
      const s = SLOTS[el.dataset.stage ?? 'hidden'] ?? SLOTS.hidden;
      // after the pinned sections, so their spacers are already measured
      const refreshPriority = -1;
      if (!s.visible) {
        // a solid section never changes what she is doing; it only pauses rendering
        // while it fills the screen, so she never freezes in a visible strip above it.
        // Sections shorter than the screen (the footer) can't fill it; ScrollTrigger
        // clamps their range to the page end, so they must not count.
        return ScrollTrigger.create({
          trigger: el,
          start: 'top top',
          end: 'bottom bottom',
          refreshPriority,
          onToggle: (self) => {
            if (self.isActive && el.offsetHeight >= window.innerHeight) covers.add(el);
            else covers.delete(el);
            setCovering(covers.size);
          },
        });
      }
      return ScrollTrigger.create({
        trigger: el,
        start: 'top 55%',
        end: 'bottom 55%',
        refreshPriority,
        onToggle: (self) => self.isActive && enter(s),
        onUpdate: (self) => {
          if (stage.slot === s) stage.progress = self.progress;
        },
      });
    });
    ScrollTrigger.refresh();
    return () => triggers.forEach((t) => t.kill());
  });

  return (
    <div className={`athlete-stage side-${slot.side}`} aria-hidden>
      <Suspense fallback={<div className="stage-fallback">INITIALISING POSE ENGINE</div>}>
        <HeroScene active={covering === 0} onStats={broadcastStats} />
      </Suspense>
    </div>
  );
};
