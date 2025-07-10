import { FaPencilRuler, FaUsers, FaVial, FaFigma, FaCode, FaVideo, FaSyncAlt, FaDatabase, FaBrain, FaPaintBrush, FaBullhorn } from 'react-icons/fa';
import { SiAdobecreativecloud, SiPhp } from 'react-icons/si';
import { BsDiagram3, BsWindow, BsGit } from 'react-icons/bs';

export const personalInfo = {
  name: 'Kevin Arthur',
  location: 'Vancouver, Canada',
  email: 'arthurkevin27@gmail.com',
  phone: '+1 (236) 833-7610',
  summary: "I'm a designer and developer who bridges the gap between creative vision and technical execution. With a foundation in Computer Science and a passion for user-centered design, I transform complex problems into intuitive, beautiful, and functional digital experiences. My journey has taken me from leading design at an AI healthcare startup to pursuing a Master's degree to deepen my technical expertise. I thrive on solving real-world challenges and creating products that people genuinely love to use.",
};

export const socialProfiles = {
  linkedin: 'https://www.linkedin.com/in/kevin-arthur-bb2235ba/',
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
    { name: 'Digital Marketing & Brand Strategy', icon: <FaBullhorn /> },
    { name: 'Visual Design', icon: <FaPaintBrush /> },
  ],
  'Technical Skills': [
    { name: 'Figma', icon: <FaFigma /> },
    { name: 'Adobe Suite', icon: <SiAdobecreativecloud /> },
    { name: 'HTML, CSS, & JavaScript', icon: <FaCode /> },
    { name: 'PHP', icon: <SiPhp /> },
    { name: 'Database Management (MySQL, PostgreSQL)', icon: <FaDatabase /> },
    { name: 'Version Control (Git, GitHub)', icon: <BsGit /> },
    { name: 'Video Editing', icon: <FaVideo /> },
    { name: 'Cross-platform OS (Windows, Linux, MacOS)', icon: <BsWindow /> },
  ],
};

export const education = [
  {
    degree: 'Master of Science in Applied Computer Science',
    institution: 'Fairleigh Dickinson University, Vancouver, BC',
    period: 'Expected in December 2026',
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
        description: 'Led comprehensive UX/UI design strategy for AI-powered healthcare platform, achieving 15% increase in user engagement through data-driven design decisions and cross-functional collaboration.',
    },
    {
        role: 'Freelance UI/UX Designer',
        company: 'Self Employed',
        location: 'Remote',
        period: 'April 2018 - Current',
        description: 'Built successful design consultancy serving 10+ clients across fintech, e-commerce, and SaaS industries, consistently delivering high-impact solutions that improved conversion rates and user satisfaction.',
    },
    {
        role: 'UI/UX Design Intern',
        company: 'Charles Technology Africa Ltd',
        location: 'Accra, Ghana',
        period: 'November 2021 - January 2022',
        description: 'Contributed to 5+ enterprise applications in fast-paced technology environment, supporting senior designers while developing strong analytical thinking and design problem-solving skills.',
    },
    {
        role: 'Creative Designer',
        company: 'SISCODE/GH',
        location: 'Accra, Ghana',
        period: 'August 2021 - January 2022',
        description: 'Developed comprehensive brand identity systems and visual design frameworks while mentoring junior team members and maintaining high design standards in collaborative agency environment.',
    },
];

export const projects = {
    behance: {
        name: 'Behance Portfolio',
        url: 'https://www.behance.net/arthurkevin',
        description: 'Showcases personal design projects.',
    },
};