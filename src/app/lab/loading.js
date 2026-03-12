export default function LabLoading() {
  return (
    <div className="min-h-screen pt-24 pb-32">
      <div className="container-responsive">
        <div className="animate-pulse space-y-12">
          {/* Hero skeleton */}
          <div className="space-y-6 flex flex-col items-center justify-center pt-8">
            <div className="h-12 md:h-20 bg-muted/50 rounded-lg w-3/4 max-w-md" />
            <div className="h-6 md:h-8 bg-muted/50 rounded-lg w-full max-w-2xl" />
            <div className="h-4 md:h-6 bg-muted/50 rounded-lg w-5/6 max-w-xl" />
            <div className="h-14 bg-muted/30 rounded-xl w-48 mt-4" />
          </div>

          {/* Trust strip skeleton */}
          <div className="h-24 bg-muted/20 rounded-2xl w-full mt-16" />

          {/* Featured items skeleton */}
          <div className="space-y-8 mt-24">
            <div className="h-10 bg-muted/40 rounded-lg w-64" />
            
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="h-[400px] bg-muted/30 rounded-3xl" />
              <div className="h-[400px] bg-muted/30 rounded-3xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
