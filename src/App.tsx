import { Header } from './components/Header';
import { ScrollSmoother, reducedMotion, scrollToHash, useGSAP } from './lib/motion';
import { Intro } from './components/Intro';
import { AthleteStage } from './components/AthleteStage';
import { WordTunnel } from './components/WordTunnel';
import { Hero } from './components/Hero';
import { Ticker } from './components/Ticker';
import { SystemSection } from './components/SystemSection';
import { AppScreens } from './components/AppScreens';
import { GameModes } from './components/GameModes';
import { Ranks } from './components/Ranks';
import { HealthSection } from './components/HealthSection';
import { Library } from './components/Library';
import { HowItWorks } from './components/HowItWorks';
import { Updates } from './components/Updates';
import { FooterCta } from './components/FooterCta';
import { Footer } from './components/Footer';

const App = () => {
  // GSAP ScrollSmoother replaces native scrolling; the fixed header and intro sit outside it
  useGSAP(() => {
    if (reducedMotion()) return;
    ScrollSmoother.create({
      wrapper: '#smooth-wrapper',
      content: '#smooth-content',
      smooth: 1.25,
      smoothTouch: 0.12,
      effects: true,
      normalizeScroll: true,
    });
    // in-page links go through the smoother so they glide instead of jumping
    const onClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!link) return;
      e.preventDefault();
      scrollToHash(link.getAttribute('href') ?? '#');
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  });

  return (
    <>
      <Intro />
      <Header />
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <main>
            <Hero />
            <Ticker />
            <WordTunnel />
            <SystemSection />
            <AppScreens />
            <GameModes />
            <Ranks />
            <HealthSection />
            <Library />
            <HowItWorks />
            <Updates />
            <FooterCta />
          </main>
          <Footer />
        </div>
      </div>
      {/* fixed behind the content; mounted last so the section pins exist when it measures */}
      <AthleteStage />
    </>
  );
};

export default App;
