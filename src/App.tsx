import { Header } from './components/Header';
import { Intro } from './components/Intro';
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
  return (
    <>
      <Intro />
      <Header />
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
    </>
  );
};

export default App;
