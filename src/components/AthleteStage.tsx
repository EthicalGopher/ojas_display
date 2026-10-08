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

  useGSAP(() => {
    const enter = (s: Slot) => {
      stage.slot = s;
      setSlot(s);
    };
    const triggers = Array.from(document.querySelectorAll<HTMLElement>('[data-stage]')).map((el) => {
      const s = SLOTS[el.dataset.stage ?? 'hidden'] ?? SLOTS.hidden;
      return ScrollTrigger.create({
        trigger: el,
        start: 'top 55%',
        end: 'bottom 55%',
        // after the pinned sections, so their spacers are already measured
        refreshPriority: -1,
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
    <div className={`athlete-stage side-${slot.side}${slot.visible ? '' : ' off'}`} aria-hidden>
      <Suspense fallback={<div className="stage-fallback">INITIALISING POSE ENGINE</div>}>
        <HeroScene active={slot.visible} onStats={broadcastStats} />
      </Suspense>
    </div>
  );
};
