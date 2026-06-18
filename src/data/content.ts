/* ============================================================
   Single source of truth for all portfolio content.
   ============================================================ */

export const profile = {
  name: 'Tirth Patel',
  email: 't.patel76@vikes.csohio.edu',
  github: 'https://github.com/tirth6851',
  githubLabel: 'github.com/tirth6851',
  linkedin: 'https://www.linkedin.com/in/tirth-patel2093',
  linkedinLabel: 'linkedin.com/in/tirth-patel2093',
  location: 'Cleveland, Ohio, United States',
  resume: 'resume.pdf',
  photo: 'me-pic.jpeg',
}

/** Phrases the hero scramble cycles through once, then settles on the first. */
export const heroStrings = {
  logoPhrases: ['Tirth Patel', 'CS @ Cleveland State', 'Python & Java'],
  titlePhrases: [
    'Engineering Intelligent Systems',
    'Backend & AI Developer',
    'Fall 2026 SWE Intern',
  ],
  descPhrases: [
    'CS @ Cleveland State · GPA 3.54',
    'Building scalable Python & Java applications',
    'Recommendation systems & backend development',
  ],
}

export const badges = [
  'Open to Fall 2026 SWE Internships',
  'GPA 3.54',
  'Cleveland, OH · Open to relocation',
]

export const about =
  'I am a Computer Science student focused on building strong programming fundamentals in Java and Python. I enjoy developing clean, modular programs and improving them through iteration and testing. As a STEM Peer Teacher, I regularly explain complex problems clearly and guide students through structured problem-solving. I am currently seeking a Fall 2026 internship where I can contribute to real-world software projects while continuing to strengthen my engineering foundations.'

export interface Stat {
  /** Numeric target the counter animates toward. */
  value: number
  /** Decimal places to render (for GPA). */
  decimals?: number
  suffix?: string
  prefix?: string
  label: string
}

export const stats: Stat[] = [
  { value: 10, suffix: '+', label: 'Java programs built' },
  { value: 10, label: 'CS50P problem sets' },
  { value: 3.54, decimals: 2, label: 'Cumulative GPA' },
  { value: 2026, label: 'Available — Fall' },
]

export interface Project {
  title: string
  tags: string[]
  details: string[]
  links: { label: string; href: string }[]
}

export const projects: Project[] = [
  {
    title: 'WatchNextAI',
    tags: [
      'Python',
      'Flask',
      'REST APIs',
      'TMDB API',
      'Supabase',
      'PostgreSQL',
      'TF-IDF',
      'Cosine Similarity',
    ],
    details: [
      'Built a content-based recommendation engine using TF-IDF vectorization and cosine similarity to match users to movies across genre, cast, and keyword metadata.',
      'Designed a 3-tier pipeline: TMDB API ingestion → Supabase (PostgreSQL) storage → TF-IDF similarity scoring → Flask REST backend → Jinja2 frontend.',
      'Deployed live on Render with Flask routing, Jinja2 templating, and environment-based secret management via python-dotenv.',
    ],
    links: [
      { label: 'Live Demo', href: 'https://watchnextai.onrender.com' },
      { label: 'View on GitHub', href: 'https://github.com/tirth6851/watchnextai' },
    ],
  },
  {
    title: 'Java Programming Projects',
    tags: ['Java', 'OOP', 'Data Structures'],
    details: [
      'Implemented 10+ Java programs applying OOP principles — encapsulation, inheritance, and polymorphism — across custom class hierarchies.',
      'Applied core data structures (ArrayList, HashMap, Stack) and control-flow patterns for input validation, data processing, and file persistence.',
      'Refactored programs iteratively using structured debugging to improve readability and reduce runtime errors.',
    ],
    links: [{ label: 'View on GitHub', href: 'https://github.com/tirth6851/Java-CIS151' }],
  },
  {
    title: 'CS50P — Python Programming (Harvard)',
    tags: ['Python', 'Unit Testing', 'File I/O', 'OOP', 'Regex'],
    details: [
      "Completed Harvard's CS50P curriculum — 10 problem sets covering file I/O, regular expressions, OOP, and API integration.",
      "Wrote pytest unit tests for each submission, enforced by the course's automated grader.",
    ],
    links: [{ label: 'View on GitHub', href: 'https://github.com/tirth6851' }],
  },
]

export interface Experience {
  role: string
  company: string
  date: string
  bullets: string[]
}

export const experiences: Experience[] = [
  {
    role: 'STEM Peer Teacher — Precalculus I (MTH 167)',
    company: 'Cleveland State University',
    date: 'July 2025 – Present',
    bullets: [
      'Selected through competitive hiring to support student learning in Precalculus I.',
      'Guide students through algebra, trigonometry, and functions during class sessions.',
      'Collaborate with faculty to reinforce key concepts and structured problem solving.',
      'Provide individualized support and encourage active participation in class.',
    ],
  },
  {
    role: 'Operations Assistant',
    company: 'CENTERS, LLC at Cleveland State University',
    date: 'January 2026 – Present',
    bullets: [
      'Provide front-line customer service to members and guests at the recreation center.',
      'Enforce facility policies and support emergency procedures to maintain a safe environment.',
      'Monitor facility operations, assist with incident response, and maintain cleanliness standards.',
      'Collaborate with supervisors and student staff to coordinate daily operations.',
    ],
  },
  {
    role: 'OpSTEM Representative & Billiards Club Secretary',
    company: 'Cleveland State University',
    date: '2024 – Present',
    bullets: [
      'Promote STEM engagement and support events for underrepresented students in technology.',
      'Coordinate Billiards Club communication, meeting logistics, and event planning.',
      'Build leadership, organization, and teamwork skills through campus involvement.',
    ],
  },
]

export interface Skill {
  name: string
  /** Primary = use in every project · Familiar = know and have used · Learning = currently building */
  tier: 'Primary' | 'Familiar' | 'Learning'
}

export interface SkillCategory {
  title: string
  skills: Skill[]
}

export const skillCategories: SkillCategory[] = [
  {
    title: 'Languages',
    skills: [
      { name: 'Python', tier: 'Primary' },
      { name: 'Java', tier: 'Primary' },
      { name: 'JavaScript', tier: 'Familiar' },
      { name: 'SQL', tier: 'Familiar' },
    ],
  },
  {
    title: 'Web & Backend',
    skills: [
      { name: 'Flask', tier: 'Primary' },
      { name: 'REST APIs', tier: 'Primary' },
      { name: 'PostgreSQL', tier: 'Familiar' },
      { name: 'Jinja2', tier: 'Familiar' },
      { name: 'HTML', tier: 'Familiar' },
      { name: 'CSS', tier: 'Familiar' },
    ],
  },
  {
    title: 'Concepts',
    skills: [
      { name: 'Object-Oriented Programming', tier: 'Primary' },
      { name: 'Data Structures', tier: 'Primary' },
      { name: 'Algorithms', tier: 'Familiar' },
      { name: 'NLP', tier: 'Familiar' },
      { name: 'Recommendation Systems', tier: 'Familiar' },
    ],
  },
  {
    title: 'Tools',
    skills: [
      { name: 'Git', tier: 'Primary' },
      { name: 'GitHub', tier: 'Primary' },
      { name: 'VS Code', tier: 'Primary' },
      { name: 'Supabase', tier: 'Familiar' },
      { name: 'Render', tier: 'Familiar' },
      { name: 'pytest', tier: 'Familiar' },
      { name: 'Linux', tier: 'Learning' },
    ],
  },
]

export const navItems = [
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'skills', label: 'Skills' },
  { id: 'contact', label: 'Contact' },
]
