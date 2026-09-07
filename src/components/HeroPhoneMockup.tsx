import { useState, useEffect, useRef } from 'react';
import { IPhoneMockup } from 'react-device-mockup';

export const HeroPhoneMockup = () => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [screenWidth, setScreenWidth] = useState<number>(340);

  useEffect(() => {
    const node = wrapRef.current;
    if (!node) return;
    const update = () => {
      const w = node.clientWidth;
      setScreenWidth(Math.min(400, Math.max(280, w - 40)));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(node);
    return () => ro.disconnect();
  }, []);

  return (
    <div className="hero-mockup-wrap" ref={wrapRef}>
      <IPhoneMockup
        screenWidth={screenWidth}
        screenType="island"
        frameColor="#55555a"
        statusbarColor="#1d1d20"
        hideStatusBar
        hideNavBar
      >
        <img
          src="/hero-image.jpeg"
          alt="OJAS workout app screen"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
        />
      </IPhoneMockup>
    </div>
  );
};
