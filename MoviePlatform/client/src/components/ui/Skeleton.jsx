// Skeleton components for different layouts

// Movie / TV card skeleton (2:3 aspect poster)
export const MovieCardSkeleton = () => (
    <div className="rounded-xl overflow-hidden skeleton-shimmer aspect-[2/3] w-full" />
);

// Actor / person card skeleton (same 2:3 aspect)
export const ActorCardSkeleton = () => (
    <div className="rounded-xl overflow-hidden skeleton-shimmer aspect-[2/3] w-full" />
);

// Full MovieDetails page skeleton
export const MovieDetailsSkeleton = () => (
    <div className="pb-20 space-y-8 animate-pulse">
        {/* Hero */}
        <div className="w-full h-[70vh] rounded-xl skeleton-shimmer" />

        <div className="glass-panel p-6 space-y-4">
            <div className="h-6 w-48 rounded-full skeleton-shimmer" />
            <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar">
                {Array(6).fill(0).map((_, i) => (
                    <div key={i} className="min-w-[120px] md:min-w-[140px] space-y-2 shrink-0">
                        <div className="w-full aspect-[2/3] rounded-lg skeleton-shimmer" />
                        <div className="h-2.5 w-3/4 rounded-full skeleton-shimmer mx-auto" />
                        <div className="h-2 w-1/2 rounded-full skeleton-shimmer mx-auto" />
                    </div>
                ))}
            </div>
        </div>

        {/* Recommendations grid */}
        <div className="glass-panel p-6 space-y-4">
            <div className="h-6 w-48 rounded-full skeleton-shimmer" />
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {Array(5).fill(0).map((_, i) => <MovieCardSkeleton key={i} />)}
            </div>
        </div>
    </div>
);

// ActorDetails page skeleton
export const ActorDetailsSkeleton = () => (
    <div className="pb-20 space-y-12 animate-pulse">
        {/* Backdrop hero */}
        <div className="w-full h-[60vh] rounded-b-3xl skeleton-shimmer -mt-8 md:-mt-12" />

        <div className="max-w-7xl mx-auto px-4 md:px-8 mt-24 md:mt-32">
            <div className="flex flex-col lg:flex-row gap-12">
                {/* Info panel */}
                <div className="lg:w-1/3">
                    <div className="glass-panel p-8 space-y-6">
                        <div className="h-6 w-36 rounded-full skeleton-shimmer" />
                        {Array(4).fill(0).map((_, i) => (
                            <div key={i} className="space-y-1">
                                <div className="h-2 w-16 rounded-full skeleton-shimmer" />
                                <div className="h-4 w-3/4 rounded-full skeleton-shimmer" />
                            </div>
                        ))}
                    </div>
                </div>
                {/* Biography */}
                <div className="lg:w-2/3">
                    <div className="glass-panel p-8 space-y-4">
                        <div className="h-6 w-36 rounded-full skeleton-shimmer" />
                        {Array(6).fill(0).map((_, i) => (
                            <div key={i} className={`h-3 rounded-full skeleton-shimmer ${i % 3 === 2 ? 'w-2/3' : 'w-full'}`} />
                        ))}
                    </div>
                </div>
            </div>
        </div>

        {/* Starring-in grid */}
        <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="h-7 w-48 rounded-full skeleton-shimmer mb-8" />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {Array(10).fill(0).map((_, i) => <MovieCardSkeleton key={i} />)}
            </div>
        </div>
    </div>
);

// Search results skeletons (grid of cards)
export const SearchSkeleton = ({ count = 10 }) => (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {Array(count).fill(0).map((_, i) => <MovieCardSkeleton key={i} />)}
    </div>
);

// Default export for backward-compat (movie card skeleton)
const Skeleton = () => <MovieCardSkeleton />;
export default Skeleton;
