import { Kicker, BtnLink } from './ui';

export const FooterCta = () => (
  <section className="footer-cta">
    <div className="container">
      <Kicker style={{ color: '#fff' }}>YOUR NEXT SESSION</Kicker>
      <h2>
        START YOUR
        <br />
        NEXT SESSION.
      </h2>
      <p>
        Focused workouts, movement feedback and clear progress — all in one
        place.
      </p>
      <BtnLink href="#workouts" variant="secondary" style={{ borderColor: '#fff' }}>
        EXPLORE WORKOUTS →
      </BtnLink>
    </div>
  </section>
);
