import { steps } from '../data';
import type { Step } from '../types';
import { Reveal, SectionHead } from './ui';

export const HowItWorks = () => (
  <section className="how beside-right" id="how" data-stage="flow">
    <div className="container">
      <SectionHead
        kicker="How it works"
        title={
          <>
            Ten seconds
            <br />
            to <em>start.</em>
          </>
        }
      >
        No wearables, no sensors, no gym. A phone, a wall to lean it on, and some floor space.
      </SectionHead>
      <div className="steps">
        {steps.map((step: Step, i) => (
          <Reveal as="article" key={step.title} className="step" delay={i * 120}>
            <div className="step-line">
              <i />
            </div>
            <div className="step-num">STEP {step.num}</div>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);
