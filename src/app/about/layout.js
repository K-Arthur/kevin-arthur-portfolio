// Server-side metadata for About page
export const metadata = {
    title: 'About',
    description: 'Product Designer with a Computer Science foundation. I design AI interfaces, enterprise tools, and scalable systems with a focus on clarity and measurable outcomes.',
    alternates: {
        canonical: '/about',
    },
    openGraph: {
        title: 'About Kevin Arthur | Product Designer',
        description: 'Product Designer specializing in AI interface design, healthcare UX, and complex enterprise systems.',
    },
};

export default function AboutLayout({ children }) {
    return children;
}
