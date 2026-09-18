import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Intro } from './components/Intro';
import { SystemSection } from './components/SystemSection';
import { GameModes } from './components/GameModes';
import { HealthSection } from './components/HealthSection';
import { Library } from './components/Library';
import { HowItWorks } from './components/HowItWorks';
import { BigStats } from './components/BigStats';
import { Feed } from './components/Feed';
import { FooterCta } from './components/FooterCta';
import { Footer } from './components/Footer';

const App = () => {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Intro />
        <SystemSection />
        <GameModes />
        <HealthSection />
        <Library />
        <HowItWorks />
        <BigStats />
        <Feed />
        <FooterCta />
      </main>
      <Footer />
    </>
  );
};

export default App;
