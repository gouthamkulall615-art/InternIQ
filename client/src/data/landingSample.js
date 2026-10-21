/**
 * Fictional CS student sample resume and algorithmic ATS parser simulation.
 * This represents how a standard Applicant Tracking System (ATS) erroneously parses
 * a visually attractive, multi-column resume layout into raw, fragmented text.
 */

export const cleanResume = {
  name: 'Rohan Sharma',
  title: 'Computer Science & Engineering Student',
  contact: {
    email: 'rohan.sharma@example.edu',
    location: 'Bengaluru, India',
    github: 'github.com/rohan-sharma-dev',
    linkedin: 'linkedin.com/in/rohan-sharma',
  },
  summary:
    'Third-year CS undergraduate with hands-on experience in full-stack web development, RESTful APIs, and database modeling. Seeking a summer 2026 software engineering internship.',
  education: {
    degree: 'B.Tech in Computer Science & Engineering',
    institution: 'University Visvesvaraya College of Engineering, Bengaluru',
    period: '2023 – 2027',
    gpa: '8.6 / 10.0',
    coursework: ['Data Structures & Algorithms', 'Database Systems', 'Operating Systems', 'Computer Networks'],
  },
  skills: [
    { category: 'Languages', items: ['Python', 'JavaScript (ES6+)', 'SQL', 'C++'] },
    { category: 'Frameworks & Web', items: ['React', 'Node.js', 'Express', 'Tailwind CSS'] },
    { category: 'Databases & Tools', items: ['MongoDB', 'PostgreSQL', 'Git', 'Docker Basics', 'Postman'] },
  ],
  projects: [
    {
      title: 'Campus Event Booking Portal',
      tech: 'React, Node.js, Express, MongoDB, Tailwind CSS',
      period: 'Jan 2025 – Mar 2025',
      bullets: [
        'Architected a full-stack event registration platform used by 1,200+ monthly active campus students across 14 university clubs.',
        'Engineered secure JWT authentication and role-based permissions for club heads and student attendees.',
        'Optimized MongoDB query performance by 35% utilizing compound indexing on date and organizer fields.',
      ],
    },
    {
      title: 'Distributed Key-Value Cache Engine',
      tech: 'Python, Sockets, Multithreading',
      period: 'Sep 2024 – Nov 2024',
      bullets: [
        'Implemented an in-memory key-value cache supporting GET, SET, and custom time-to-live (TTL) key expiration.',
        'Handled 450 concurrent socket client connections using non-blocking I/O and thread pooling with sub-5ms latency.',
        'Wrote 40+ unit and integration tests achieving 92% branch coverage using pytest.',
      ],
    },
  ],
};

/**
 * Derives the ATS view from the clean data above:
 * 1. Simulates multi-column coordinate parsing failures by interleaving left-column
 *    and right-column lines sequentially across the PDF page stream.
 * 2. Corrupts standard typographic bullets (•) into stray/unrecognized characters ('?' and raw symbols).
 * 3. Strips the formatted Skills category container entirely because graphic boxes are skipped by older parsers.
 * 4. Truncates text mid-sentence where fixed-width parsing limits clip content.
 * 5. Outputs a line-by-line array for staggered terminal-style rendering.
 */
export function generateAtsParsedResume(clean) {
  const leftCol = [
    clean.name.toUpperCase(),
    clean.title,
    `Email: ${clean.contact.email}`,
    `Location: ${clean.contact.location}`,
    'PROJECTS',
    clean.projects[0].title,
    clean.projects[0].tech,
    `? ${clean.projects[0].bullets[0].slice(0, 78)}...`,
    `? ${clean.projects[0].bullets[1]}`,
    `? ${clean.projects[0].bullets[2]}`,
    clean.projects[1].title,
    clean.projects[1].tech,
    `? ${clean.projects[1].bullets[0].slice(0, 72)} [TRUNCATED]`,
    `? ${clean.projects[1].bullets[1]}`,
    `? ${clean.projects[1].bullets[2]}`,
  ];

  const rightCol = [
    'EDUCATION',
    clean.education.degree,
    clean.education.institution,
    `GPA: ${clean.education.gpa} | ${clean.education.period}`,
    'COURSEWORK',
    clean.education.coursework.join(' | '),
    'SUMMARY',
    clean.summary.slice(0, 96) + ' [LINE BREAK CORRUPTED]',
    '[SKILLS SECTION UNPARSED - GRAPHICAL TABLE REJECTED]',
    'ERROR: TABLE BOUNDARY NOT RECOGNIZED',
  ];

  // Interleave left and right columns to mimic classic PDF stream extraction bug
  const interleavedLines = [];
  const maxLen = Math.max(leftCol.length, rightCol.length);
  for (let i = 0; i < maxLen; i++) {
    if (i < leftCol.length) interleavedLines.push(leftCol[i]);
    if (i < rightCol.length && i % 2 === 0) interleavedLines.push(`>> ${rightCol[i]}`);
  }

  return {
    rawLines: interleavedLines,
    detectedSkills: ['Python', 'SQL'],
    missingSkills: ['React', 'Node.js', 'MongoDB', 'Git'],
    detectedSkillsCount: 2,
    missingSkillsCount: 4,
    atsScore: '4.2 / 10',
    atsNote: '4 core skills not detected · Layout desynchronized',
  };
}

export const atsSample = generateAtsParsedResume(cleanResume);
