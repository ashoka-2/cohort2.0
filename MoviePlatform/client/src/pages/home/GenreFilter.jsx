import GenreBar from '../../components/ui/GenreBar';

const GenreFilter = ({ genres, selectedGenreId, onGenreClick, onClearGenre }) => {
    if (genres.length === 0) return null;

    return (
        <section className="gsap-section glass-panel p-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold border-l-4 border-primary pl-4 tracking-wider flex items-center gap-2">
                    <i className="ri-filter-3-line text-primary"></i> Browse by Genre
                </h2>
            </div>
            <GenreBar
                genres={genres}
                selectedId={selectedGenreId}
                onGenreClick={onGenreClick}
                allText="All Genres"
            />
        </section>
    );
};

export default GenreFilter;
