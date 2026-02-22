import { FaPencilRuler, FaUsers, FaVial, FaFigma, FaCode, FaVideo, FaSyncAlt, FaDatabase, FaBrain, FaPaintBrush, FaBullhorn } from 'react-icons/fa';
import { SiAdobecreativecloud, SiPhp } from 'react-icons/si';
import { BsDiagram3, BsWindow, BsGit } from 'react-icons/bs';

export const personalInfo = {
  name: 'Kevin Arthur',
  location: 'Vancouver, Canada',
  email: 'hello@kevinarthur.design',
  phone: '+1 (236) 833-7610',
  summary: "Product Designer with a foundation in Computer Science and experience shipping complex products across AI, healthcare, and fintech. I've led design for platforms serving 500+ facilities, built scalable design systems, and created interfaces that balance technical constraints with user needs. My work bridges design and engineering—translating complex requirements into intuitive experiences.",
  heroTitle1: 'Product Designer',
  heroTitle2: '& Design Engineer',
  differentiationStatement: 'I help product teams across fintech, SaaS, healthcare, and emerging tech ship clear, scalable experiences—from AI interfaces to enterprise workflows, strategy through implementation.',
};

export const recognition = [
  {
    type: 'media',
    name: 'CNN',
    description: 'Featured on CNN',
    context: 'Breakthrough African AI application',
    logoPath: null,
    url: null,
  },
  {
    type: 'award',
    name: 'Forbes 30 Under 30',
    description: 'Lead Designer on Forbes 30 Under 30 project',
    context: 'MinoHealth CEO featured for healthcare innovation',
    logoPath: null,
    url: null,
  },
  {
    type: 'impact',
    value: '50+',
    label: 'Projects Delivered',
    context: 'Across fintech, SaaS, e-commerce, and healthtech',
  },
  {
    type: 'impact',
    value: '7+',
    label: 'Years Experience',
    context: 'Design and development from concept to launch',
  },
  {
    type: 'impact',
    value: '10+',
    label: 'Industries Served',
    context: 'From startups to enterprise and global partners',
  },
];

export const featuredCaseStudy = {
  id: 'moremi-ai-multimodal-medical-platform',
  title: 'Achieving 97% Diagnostic Accuracy and 15x Faster Diagnoses through Mobile-First AI Design',
  summary: "Led the UX design for Moremi AI, Africa's first multimodal medical AI platform, achieving 97% diagnostic accuracy and serving healthcare providers across Ghana, Nigeria, and Kenya.",
  heroImage: 'https://res.cloudinary.com/dov1tv077/image/upload/v1752155990/Welcome_screen_uwdoot.png',
  heroImageAlt: 'Mobile UI for AI Radiology Dashboard showing diagnostic analysis interface with 97% accuracy metrics',
  role: 'Lead UI/UX Designer',
  industry: 'Healthtech',
  results: [
    { value: '97%', label: 'Diagnostic Accuracy' },
    { value: '500+', label: 'Healthcare Facilities' },
    { value: '15x', label: 'Faster Diagnosis' },
  ],
  href: '/case-studies/moremi-ai-multimodal-medical-platform',
};

export const socialProfiles = {
  linkedin: 'https://www.linkedin.com/in/kevinoarthur/',
  behance: 'https://www.behance.net/arthurkevin',
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
    { name: 'Adobe Suite', icon: <SiAdobecreativecloud /> },
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
    degree: 'Master of Science in Applied Computer Science',
    institution: 'Fairleigh Dickinson University, Vancouver, BC',
    period: 'Currently pursuing (Expected December 2026)',
  },
  {
    degree: 'Bachelor of Science in Computer Science',
    institution: 'Kwame Nkrumah University of Science And Technology, Kumasi, Ghana',
    period: 'Graduated November 2023',
    details: [
      'Honours: Second Class Upper',
      'Capstone Project: Diabetic Retinopathy Detection Using Deep Learning',
    ],
  },
  {
    degree: 'High School Diploma',
    institution: 'St. Augustine\'s College, Cape Coast, Ghana',
    period: 'Graduated June 2019',
    details: ['Key Subjects: Math (A1), Physics (A1), Elective Math (B2), Science (B2)'],
  },
];

export const professionalExperience = [
    {
        role: 'Product Designer',
        company: 'MinoHealth AI Labs',
        location: 'Accra, Ghana',
        period: 'November 2023 - May 2025',
        description: "Led UX design for Africa's first multimodal medical AI platform. Achieved 97% diagnostic accuracy, served 500+ healthcare facilities, featured on CNN. Designed interfaces for AI systems with transparent uncertainty handling and human-in-the-loop workflows.",
        highlights: ['97% diagnostic accuracy (outperformed 75-86% radiologist baseline)', '500+ healthcare facilities across Ghana, Nigeria, Kenya', 'Featured on CNN; Forbes 30 Under 30 project', '15x faster diagnosis (45 min → 3 min)'],
    },
    {
        role: 'Freelance UI/UX Designer',
        company: 'Self Employed',
        location: 'Remote',
        period: 'April 2018 - Current',
        description: 'Built design consultancy serving 10+ clients across fintech, e-commerce, and SaaS. Consistently delivered measurable improvements in conversion and user satisfaction.',
        highlights: ['10+ clients across fintech, e-commerce, SaaS', 'End-to-end design from research to handoff', 'Design systems and component libraries'],
    },
    {
        role: 'UI/UX Design Intern',
        company: 'Charles Technology Africa Ltd',
        location: 'Accra, Ghana',
        period: 'November 2021 - January 2022',
        description: 'Contributed to 5+ enterprise applications in fast-paced technology environment, supporting senior designers while developing strong analytical thinking and design problem-solving skills.',
        highlights: ['5+ enterprise applications', 'Collaboration with senior designers', 'Analytical and design problem-solving'],
    },
    {
        role: 'Creative Designer',
        company: 'SISCODE/GH',
        location: 'Accra, Ghana',
        period: 'August 2021 - January 2022',
        description: 'Developed comprehensive brand identity systems and visual design frameworks while mentoring junior team members and maintaining high design standards in collaborative agency environment.',
        highlights: ['Brand identity systems', 'Mentored junior designers', 'High design standards in agency environment'],
    },
];

export const expertiseAreas = [
  {
    title: 'AI & Complex Interfaces',
    description: 'Designing for uncertainty, confidence scoring, and human-in-the-loop workflows. Experience with healthcare AI, diagnostic tools, and technical products where clarity is critical.',
    caseStudyId: 'moremi-ai-multimodal-medical-platform',
  },
  {
    title: 'Design Systems',
    description: 'Component libraries and patterns that scale. Built systems used across 500+ facilities, reducing design debt and improving design-to-dev handoff.',
    caseStudyId: 'moremi-collaborate',
  },
  {
    title: 'Product Design',
    description: 'End-to-end product design from research to launch. I identify high-leverage problems and design solutions that balance user needs with technical constraints.',
    caseStudyId: null,
  },
];

export const designPhilosophy = "I believe great design happens when strategy meets creativity. Every project I take on is an opportunity to solve real problems and create meaningful impact through thoughtful, user-centered design. For AI products, that means designing for uncertainty—making confidence levels visible, enabling human override, and keeping the human in the loop.";

export const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Product Design Lead',
    company: 'MedFlow Health',
    quote: 'This checklist saved our team weeks of back-and-forth with developers. The handoff is now seamless.',
    initials: 'SC',
    rating: 5,
  },
  {
    name: 'Marcus Johnson',
    role: 'Senior Frontend Developer',
    company: 'PayStream',
    quote: 'Finally, a design system that speaks my language. The semantic tokens and state management rules are exactly what we needed.',
    initials: 'MJ',
    rating: 5,
  },
  {
    name: 'Emily Rodriguez',
    role: 'UX Manager',
    company: 'CloudSync SaaS',
    quote: 'We implemented this checklist across 3 product teams. Developer questions dropped by 80% in first month.',
    initials: 'ER',
    rating: 5,
  },
];

export const projects = {
    behance: {
        name: 'Behance Portfolio',
        url: 'https://www.behance.net/arthurkevin',
        description: 'Showcases personal design projects.',
    },
};