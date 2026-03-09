import React, { useEffect, useCallback } from 'react';
import MoodScanner from '../../features/mood/components/MoodScanner';
import { useMoodMovies } from '../../features/mood/hooks/useMoodMovies';

// Internal Components
import MoodHero from './MoodHero';
import MoodDisplay from './MoodDisplay';
import MoodResults from './MoodResults';
import AttributionFooter from '../../components/ui/AttributionFooter';

const MoodRecommendation = () => {
    const {
        mood,
        movies,
        isFetchingMovies,
        hasMore,
        handleMoodDetected,
        fetchMoreMovies,
        resetMood
    } = useMoodMovies();

    // Infinite scroll handler
    const handleScroll = useCallback(() => {
        if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 200) {
            fetchMoreMovies();
        }
    }, [fetchMoreMovies]);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    return (
        <div className="max-w-[1400px] mx-auto min-h-screen py-10 px-4 sm:px-6 lg:px-8">
            {/* Top Layout: Left Info, Right Scanner */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch mb-16 lg:min-h-[500px]">

                {/* Left: Info & Detected Mood */}
                <div className="flex flex-col h-full space-y-8 lg:pr-8 justify-center">
                    <MoodHero />
                    <div className="flex-1 mt-auto">
                        <MoodDisplay mood={mood} onReset={resetMood} />
                    </div>
                </div>

                {/* Right: Scanner */}
                <div className="glass-card p-6 md:p-8 rounded-[3rem] relative overflow-hidden h-full flex flex-col justify-center">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-violet-600/5 blur-[80px] rounded-full"></div>
                    <MoodScanner onMoodDetected={handleMoodDetected} />
                </div>
            </div>

            {/* Bottom: Movies Grid */}
            <MoodResults
                mood={mood}
                movies={movies}
                isFetchingMovies={isFetchingMovies}
                hasMore={hasMore}
            />

            <AttributionFooter type="mood" />

            <style>{`
                @keyframes gradient-x {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                .animate-gradient-x {
                    background-size: 200% 200%;
                    animation: gradient-x 5s ease infinite;
                }
            `}</style>
        </div>
    );
};

export default MoodRecommendation;
