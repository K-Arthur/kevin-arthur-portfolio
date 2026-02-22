// Server-side metadata for About page
export const metadata = {
    title: 'About | Kevin Arthur - Product Designer',
    description: 'Product Designer with a foundation in Computer Science. I design AI interfaces, enterprise tools, and scalable systems with a focus on clarity and measurable outcomes.',
    alternates: {
        canonical: '/about',
    },
    openGraph: {
        title: 'About | Kevin Arthur - Product Designer',
        description: 'Product Designer specializing in complex systems—AI interfaces, enterprise tools, and design systems.',
    },
};

export default function AboutLayout({ children }) {
    return children;
}
