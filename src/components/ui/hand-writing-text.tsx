import dynamic from 'next/dynamic';

const HandWrittenDecoration = dynamic(() => import('./hand-writing-decoration'), {
    ssr: false,
    loading: () => null
});

interface HandWrittenTitleProps {
    title?: string;
    subtitle?: string;
    highlightedText?: string;
}

function HandWrittenTitle({
    title = "Let's Create Something",
    subtitle,
    highlightedText = "Amazing Together",
}: HandWrittenTitleProps) {
    return (
        <div className="w-full max-w-4xl mx-auto py-16 md:py-20 flex flex-col items-center text-center">
            <div className="relative inline-block mx-auto">
                <HandWrittenDecoration />
                <h1
                    className="relative z-10 text-4xl md:text-6xl font-bold tracking-tight text-foreground flex flex-col items-center gap-2 animate-fade-in-up"
                >
                    {title}
                    {highlightedText && (
                        <span className="text-primary">{highlightedText}</span>
                    )}
                </h1>
            </div>
            
            {subtitle && (
                <p
                    className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mt-10 md:mt-12 animate-fade-in-up animation-delay-200"
                >
                    {subtitle}
                </p>
            )}
        </div>
    );
}

export { HandWrittenTitle };
