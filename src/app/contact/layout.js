// Server-side metadata for Contact page
export const metadata = {
    title: 'Contact',
    description: 'Get in touch to discuss product design, AI interfaces, healthcare UX, or design systems. Available for consulting and full-time roles in Vancouver and remote.',
    alternates: {
        canonical: '/contact',
    },
    openGraph: {
        title: 'Contact Kevin Arthur | Product Designer',
        description: 'Get in touch to discuss your next AI interface or healthcare UX project.',
    },
};

export default function ContactLayout({ children }) {
    return children;
}
