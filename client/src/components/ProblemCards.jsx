import React from 'react';
import './ProblemCards.css';

const PROBLEM_CARDS_DATA = [
  {
    id: 1,
    badge: '1',
    label: 'Parsing filters',
    heading: 'Resumes get filtered before humans read them.',
    body: 'Applicant tracking systems discard candidates for multi-column tables, unparsed text boxes, and missing standard headers. Qualified candidates get dropped automatically.',
    className: 'card--left',
  },
  {
    id: 2,
    badge: '2',
    label: 'Unclear benchmarks',
    heading: "Students don't know what roles expect.",
    body: 'Job postings list dozens of overlapping technologies. Without an objective baseline, candidates cannot separate core prerequisites from optional preferences.',
    className: 'card--center',
  },
  {
    id: 3,
    badge: '3',
    label: 'Boilerplate drafts',
    heading: 'Cover letters sound generic.',
    body: 'Using ungrounded generic templates yields letters that say nothing specific about actual candidate projects. Hiring managers discard them within seconds.',
    className: 'card--right',
  },
];

export default function ProblemCards() {
  return (
    <section className="problem-cards-section">
      {/* Stage */}
      <div className="problem-cards-stage">
        {PROBLEM_CARDS_DATA.map((card) => (
          <article key={card.id} className={`problem-card ${card.className}`}>
            <div className="problem-card__header">
              <span className="problem-card__badge">{card.badge}</span>
              <span className="problem-card__label">{card.label}</span>
            </div>
            <h3 className="problem-card__heading">{card.heading}</h3>
            <p className="problem-card__body">{card.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

