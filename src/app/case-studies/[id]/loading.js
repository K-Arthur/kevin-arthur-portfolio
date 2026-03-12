export default function CaseStudyLoading() {
  return (
    <div className="min-h-screen pt-24 pb-32">
      <div className="container-responsive">
        <div className="max-w-4xl mx-auto animate-pulse space-y-12">
          {/* Back button skeleton */}
          <div className="h-10 w-32 bg-muted/50 rounded-full" />

          {/* Hero title skeleton */}
          <div className="space-y-4 pt-12">
            <div className="h-16 md:h-24 bg-muted/50 rounded-xl w-full" />
            <div className="h-16 md:h-24 bg-muted/50 rounded-xl w-3/4" />
          </div>

          {/* Meta data skeleton */}
          <div className="flex gap-4 pt-6">
            <div className="h-8 w-24 bg-muted/30 rounded-full" />
            <div className="h-8 w-32 bg-muted/30 rounded-full" />
            <div className="h-8 w-28 bg-muted/30 rounded-full" />
          </div>

          {/* Summary / Hero Image skeleton */}
          <div className="h-[40vh] md:h-[60vh] bg-muted/20 rounded-3xl w-full mt-12" />

          {/* Content skeleton */}
          <div className="space-y-6 mt-16 max-w-3xl">
            <div className="h-8 bg-muted/40 rounded-lg w-64 mb-8" />
            <div className="h-4 bg-muted/30 rounded w-full" />
            <div className="h-4 bg-muted/30 rounded w-full" />
            <div className="h-4 bg-muted/30 rounded w-5/6" />
            <div className="h-4 bg-muted/30 rounded w-4/6" />
          </div>
        </div>
      </div>
    </div>
  );
}
