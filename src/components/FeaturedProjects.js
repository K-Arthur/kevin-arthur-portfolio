import { CloudinaryImage } from './OptimizedImage';
import Link from 'next/link';
import { FaArrowRight, FaLock } from '@/lib/icons';
import { cn } from '@/lib/utils';
import ScrollRevealContainer, { ScrollRevealItem } from './ui/ScrollRevealContainer';

export function FeaturedProjects({ posts = [] }) {
    if (!posts || posts.length === 0) return null;

    return (
        <div className="w-full space-y-24 md:space-y-32">
            {posts.map((post, index) => {
                const isEven = index % 2 === 0;

                return (
                    <ScrollRevealContainer
                        key={post.id}
                        variant="fadeUp"
                        className="group relative w-full transition-transform duration-300 hover:-translate-y-1"
                    >
                        <div className={cn(
                            "flex flex-col gap-8 md:gap-12 items-center",
                            isEven ? "lg:flex-row" : "lg:flex-row-reverse"
                        )}>
                            {/* Image Side (Massive, Edge-to-Edge feel) */}
                            <div className="w-full lg:w-3/5 relative">
                                <Link href={`/case-studies/${post.id}`} className="block relative w-full aspect-[4/3] md:aspect-[16/10] overflow-hidden rounded-2xl md:rounded-[2rem] bg-card border border-white/5 transition-[border-color,box-shadow] duration-500 group-hover:border-primary/30 group-hover:shadow-2xl group-hover:shadow-primary/10">
                                    <div className="absolute inset-0 z-10 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-40" />

                                    {post.heroImage ? (
                                        <CloudinaryImage
                                            src={post.heroImage}
                                            alt={post.heroImageAlt || post.title}
                                            fill
                                            preset="featured"
                                            className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                                            sizes="(max-width: 768px) 100vw, 60vw"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-muted/20">
                                            <span className="text-muted-foreground">Image unavailable</span>
                                        </div>
                                    )}

                                    {/* Hover Overlay Hint */}
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-16 h-16 bg-background/80 backdrop-blur-md rounded-full flex items-center justify-center opacity-0 scale-50 transition-all duration-300 group-hover:opacity-100 group-hover:scale-100 shadow-xl border border-primary/20">
                                        <FaArrowRight className="w-5 h-5 text-primary -rotate-45" />
                                    </div>
                                </Link>
                            </div>

                            {/* Content Side (Typography focused) */}
                            <div className="w-full lg:w-2/5 flex flex-col justify-center space-y-5 md:space-y-6 pl-4 lg:pl-0">

                                {/* Industry / Expertise Tags */}
                                <div className="flex flex-wrap gap-2">
                                    <span className="px-3 py-1 text-xs font-medium bg-card text-muted-foreground border border-border/40 rounded-full capitalize">
                                        {post.industry}
                                    </span>
                                    <span className="px-3 py-1 text-xs font-semibold bg-primary/10 text-primary border border-primary/20 rounded-full uppercase tracking-wider">
                                        {post.role}
                                    </span>
                                    {post.protected && (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium bg-[#1a1a1a] text-amber-500/90 border border-amber-500/20 rounded-full whitespace-nowrap">
                                            <FaLock className="w-3 h-3" />
                                            Available on request
                                        </span>
                                    )}
                                </div>

                                {/* Metrics First — Then Title */}
                                {post.results && post.results.length > 0 && (
                                    <div className="inline-flex flex-wrap gap-x-6 gap-y-2">
                                        {post.results.slice(0, 1).map((res, i) => (
                                            <div key={i} className="flex flex-col">
                                                <span className="text-4xl md:text-5xl font-bold tracking-tighter text-primary">
                                                    {res.value}
                                                </span>
                                                <span className="text-xs font-semibold text-foreground uppercase tracking-wider mt-0.5">
                                                    {res.label}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="space-y-3">
                                    <Link href={`/case-studies/${post.id}`} className="group-hover:text-primary transition-colors">
                                        <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-[1.15] text-balance text-foreground">
                                            {post.title}
                                        </h3>
                                    </Link>
                                    <p className="text-base md:text-lg text-muted-enhanced leading-relaxed text-pretty max-w-xl">
                                        {post.summary || post.metaDescription}
                                    </p>
                                </div>

                                {/* Secondary Metrics */}
                                {post.results && post.results.length > 1 && (
                                    <div className="inline-flex flex-wrap gap-x-6 gap-y-2 pt-3 border-t border-border/20">
                                        {post.results.slice(1, 3).map((res, i) => (
                                            <div key={i} className="flex flex-col pt-2">
                                                <span className="text-xl md:text-2xl font-bold tracking-tighter text-foreground">
                                                    {res.value}
                                                </span>
                                                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider mt-0.5">
                                                    {res.label}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* CTA */}
                                <div className="pt-2">
                                    <Link
                                        href={`/case-studies/${post.id}`}
                                        className="inline-flex items-center gap-2 text-primary font-semibold text-base hover:text-primary/80 transition-colors group/link"
                                    >
                                        Explore Case Study
                                        <FaArrowRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-1" />
                                    </Link>
                                </div>

                            </div>
                        </div>
                    </ScrollRevealContainer>
                );
            })}
        </div>
    );
}
