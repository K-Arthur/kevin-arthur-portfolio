import { FaUsers, FaVial, FaFigma, FaCode, FaVideo, FaSyncAlt, FaDatabase, FaBrain, FaPaintBrush, FaBullhorn } from 'react-icons/fa';
import { SiPhp } from 'react-icons/si';
import { BsDiagram3, BsWindow, BsGit, BsPalette2 } from 'react-icons/bs';

export const personalInfo = {
  name: 'Kevin Arthur',
  location: 'Vancouver, Canada',
  email: 'hello@kevinarthur.design',
  phone: '+1 672-380-2593',
  tel: '+16723802593',
  summary: "I take complex products from research and Figma to production React and TypeScript. Based in Vancouver, open to remote roles in Canada.",
  heroTitle1: 'Design Engineer',
  heroTitle2: 'Product Designer',
  differentiationStatement: 'I design product interfaces and ship them in code — React, TypeScript, and Next.js — for teams that need both craft and implementation.',
};

export const recognition = [
  {
    type: 'impact',
    value: '20+',
    label: 'Projects',
    context: 'Product design and frontend work across healthtech, SaaS, and tools',
    confirmed: false,
  },
  {
    type: 'impact',
    value: '2018',
    label: 'Designing since',
    context: 'Independent design practice through product and engineering roles',
    confirmed: false,
  },
];

export const featuredCaseStudy = {
  id: 'varve',
  title: 'Varve: a local-first design suite I designed and shipped in code',
  summary: 'Founder and designer-engineer of Varve, a free, local-first design suite in public beta (v0.5.0) — six task workspaces on a React/TypeScript editor and a Rust/WASM engine.',
  heroImage: '/images/case-studies/varve/workspace-light.png',
  heroImageAlt: 'Varve editor in light mode: Layers of time poster on the canvas, layers list on the left, typography inspector on the right',
  role: 'Founder, Designer & Engineer',
  industry: 'creative-tools',
  results: [
    { value: 'v0.5.0', label: 'Public beta' },
    { value: '6', label: 'Task workspaces' },
    { value: '25', label: 'GitHub stars' },
  ],
  href: '/case-studies/varve',
};

export const socialProfiles = {
  linkedin: 'https://www.linkedin.com/in/kevinoarthur/',
  behance: 'https://www.behance.net/arthurkevin',
  github: 'https://github.com/K-Arthur',
};

export const skills = {
  'Core Competencies': [
    { name: 'User-centered Design', icon: <FaUsers /> },
    { name: 'Wireframing & Prototyping', icon: <BsDiagram3 /> },
    { name: 'User Research', icon: <FaUsers /> },
    { name: 'Usability Testing', icon: <FaVial /> },
    { name: 'Heuristic Evaluation', icon: <FaBrain /> },
    { name: 'Agile Methodology', icon: <FaSyncAlt /> },
    { name: 'Marketing & Branding', icon: <FaBullhorn /> },
    { name: 'Visual Design', icon: <FaPaintBrush /> },
  ],
  'Technical Skills': [
    { name: 'Figma', icon: <FaFigma /> },
    { name: 'Adobe Suite', icon: <BsPalette2 /> },
    { name: 'HTML/CSS/JS', icon: <FaCode /> },
    { name: 'PHP', icon: <SiPhp /> },
    { name: 'Database Management', icon: <FaDatabase /> },
    { name: 'Version Control', icon: <BsGit /> },
    { name: 'Video Editing', icon: <FaVideo /> },
    { name: 'Cross-platform OS', icon: <BsWindow /> },
  ],
};

export const education = [
  {
    degree: 'MSc Applied Computer Science, Fairleigh Dickinson University Vancouver, expected Dec 2026',
    institution: '',
    period: '',
    compact: true,
  },
  {
    degree: 'BSc Computer Science',
    institution: 'Kwame Nkrumah University of Science And Technology',
    period: 'Graduated November 2023',
    compact: true,
  },
];

export const professionalExperience = [
  {
    role: 'Founder, Designer & Engineer',
    company: 'Varve',
    location: 'Vancouver, Canada',
    period: 'Jun 2026 – Present',
    description: 'I design and ship Varve, a free, local-first design suite: a React/TypeScript editor on a Rust/WASM engine, its own DTCG token design system, and six task workspaces. Public beta v0.5.0 on Linux, macOS and Windows. Source-available under FSL-1.1-MIT.',
    highlights: [
      'Product direction, interface design, and production editor code',
      'Local-first desktop app — no account required',
      'Browser demo at varve.studio/try',
    ],
  },
  {
    role: 'Product Designer',
    company: 'minoHealth AI Labs',
    location: 'Accra, Ghana',
    period: 'November 2023 – May 2025',
    description: 'Owned product design for clinical-AI tools, including Moremi AI. Designed clinical workflows, AI-uncertainty states, and a WCAG 2.2-oriented component system used by clinicians on phones and desktops.',
    highlights: [
      'Clinical workflows and AI-uncertainty states',
      'Component system used on phones and desktops',
    ],
  },
  {
    role: 'Freelance UI/UX Designer',
    company: 'Self Employed',
    location: 'Remote',
    period: 'April 2018 – Current',
    description: 'Independent product and interface design across fintech, e-commerce, and SaaS — research through handoff and production UI.',
    highlights: ['End-to-end design from research to handoff', 'Design systems and component libraries'],
  },
  {
    role: 'UI/UX Design Intern',
    company: 'Charles Technology Africa Ltd',
    location: 'Accra, Ghana',
    period: 'November 2021 – January 2022',
    description: 'Supported enterprise application design alongside senior designers.',
    compact: true,
  },
  {
    role: 'Creative Designer',
    company: 'SISCODE/GH',
    location: 'Accra, Ghana',
    period: 'August 2021 – January 2022',
    description: 'Brand identity systems and visual design in a collaborative agency environment.',
    highlights: ['Brand identity systems', 'Mentored junior designers'],
  },
];

export const expertiseAreas = [
  {
    title: 'Design Engineering',
    description: 'Shipping the interface in React and TypeScript — tokens, components, and the editor chrome — not just handing off mocks.',
    caseStudyId: 'varve',
  },
  {
    title: 'AI & Complex Interfaces',
    description: 'Designing for uncertainty, confidence scoring, and human-in-the-loop workflows. Clinical-AI tools and developer tools where the UI is the contract.',
    caseStudyId: 'moremi-ai-multimodal-medical-platform',
  },
  {
    title: 'Product Design',
    description: 'End-to-end product design from research to launch. I identify high-leverage problems and design solutions that balance user needs with technical constraints.',
    caseStudyId: null,
  },
];

export const designPhilosophy = "Great design happens when strategy meets implementation. I design for uncertainty in AI products, and I ship the interface in code so the tokens, states, and constraints stay honest.";

export const projects = {
  behance: {
    name: 'Behance Portfolio',
    url: 'https://www.behance.net/arthurkevin',
    description: 'Showcases personal design projects.',
  },
};
