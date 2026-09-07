import { steps } from '../data';
import type { Step } from '../types';

export const HowItWorks = () => (
  <section className="how" id="how">
    <div className="container">
      <div className="section-head">
        <div>
          <div className="kicker">HOW IT WORKS</div>
          <h2>
            FROM GOAL
            <br />
            TO PROGRESS.
          </h2>
        </div>
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
