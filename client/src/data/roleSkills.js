// ─── Technical Roles ────────────────────────────────────────────────
const technicalRoles = {
  "Frontend Developer": [
    "HTML", "CSS", "JavaScript", "React", "TypeScript", "Responsive Design",
    "Git", "REST APIs", "Tailwind CSS", "Webpack/Vite", "Browser DevTools", "Accessibility (a11y)"
  ],
  "Backend Developer": [
    "Node.js", "Express", "REST APIs", "SQL", "MongoDB", "Authentication (JWT/OAuth)",
    "Git", "Docker", "API Security", "Database Design", "Caching", "Testing (Unit/Integration)"
  ],
  "Full Stack Developer": [
    "HTML", "CSS", "JavaScript", "React", "Node.js", "Express", "SQL", "MongoDB",
    "REST APIs", "Git", "Authentication", "Deployment (CI/CD)", "System Design Basics"
  ],
  "Data Analyst": [
    "Excel", "SQL", "Python", "Pandas", "Data Visualization", "Statistics",
    "Power BI/Tableau", "Data Cleaning", "A/B Testing", "Communication", "Storytelling with Data"
  ],
  "AI/ML Engineer": [
    "Python", "NumPy", "Pandas", "Scikit-learn", "TensorFlow/PyTorch", "Statistics",
    "Linear Algebra", "Data Preprocessing", "Model Evaluation", "SQL", "Deep Learning Basics", "Git"
  ],
  "Mobile Developer": [
    "React Native", "Flutter", "Kotlin/Swift", "REST APIs", "Git", "UI/UX Principles",
    "State Management", "App Store Deployment", "Push Notifications", "Local Storage/SQLite"
  ],
};

// ─── Non-Technical Roles ────────────────────────────────────────────
const nonTechnicalRoles = {
  "Product Manager": [
    "Market Research", "Product Roadmapping", "Stakeholder Communication",
    "Agile/Scrum", "User Story Writing", "Prioritization Frameworks (RICE/MoSCoW)",
    "Data-Informed Decision Making", "Wireframing (Figma)", "Competitive Analysis",
    "Cross-functional Collaboration", "Basic SQL", "Product Metrics/KPIs"
  ],
  "Business Analyst": [
    "Requirements Gathering", "Process Mapping", "Stakeholder Communication",
    "Excel", "SQL", "Data Visualization", "Business Process Modeling (BPMN)",
    "Gap Analysis", "Documentation", "Agile/Scrum", "Problem Solving",
    "Presentation Skills"
  ],
};

// Combined flat map for skill lookups
const roleSkills = { ...technicalRoles, ...nonTechnicalRoles };

// Grouped structure for UI dropdowns
export const roleGroups = [
  { label: 'Technical Roles', roles: Object.keys(technicalRoles) },
  { label: 'Non-Technical Roles', roles: Object.keys(nonTechnicalRoles) },
];

export default roleSkills;
