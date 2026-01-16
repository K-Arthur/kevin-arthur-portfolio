// Server-side metadata for About page
export const metadata = {
    title: 'About Kevin Arthur | Design Engineer & AI Interface Specialist',
    description: 'Design Engineer with expertise in AI interface design, healthcare UX, and design systems. Master\'s in Applied Computer Science. Led design at AI healthcare startup serving 500+ facilities across Africa.',
    alternates: {
        canonical: '/about',
    },
    openGraph: {
        title: 'About Kevin Arthur | Design Engineer & AI Interface Specialist',
        description: 'Design Engineer specializing in AI interface design and healthcare UX',
    },
};

export default function AboutLayout({ children }) {
    return children;
}
