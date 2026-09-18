import { steps } from '../data';
import type { Step } from '../types';
import { Kicker } from './ui';

export const HowItWorks = () => (
  <section className="how" id="how">
    <div className="container">
      <div className="section-head">
        <div>
          <Kicker>SIMPLE WORKFLOW</Kicker>
          <h2>
            HOW OJAS
            <br />
            WORKS.
          </h2>
        </div>
        <p>
          Getting started takes under ten seconds. Place your phone, choose a mode,
          and start moving with immediate feedback.
        </p>
      </div>
      <div className="steps">
        {steps.map((step: Step) => (
          <article key={step.title} className="step">
            <div className="step-num">{step.num}</div>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
          </article>
        ))}
      </div>
    </div>
  </section>
);
