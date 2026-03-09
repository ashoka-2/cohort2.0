import React from 'react';
import MovieForm from './MovieForm';
import AdminMovieCard from '../../components/ui/AdminMovieCard';

const MoviesTab = ({ movies, loading, showForm, setShowForm, editingMovie, setEditingMovie, saving, onSaveMovie, onDeleteMovie, onEditClick }) => {
    return (
        <div className="space-y-6">
            {/* Toolbar */}
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold border-l-4 border-violet-500 pl-3 flex items-center gap-2" style={{ color: 'var(--text-main)' }}>
                    <i className="ri-film-fill text-violet-400" /> Manage Movies
                    <span className="text-sm neumorph !rounded-full px-3 py-0.5 ml-2" style={{ color: 'var(--text-sub)' }}>{movies.length}</span>
                </h2>
                <button
                    onClick={() => { setEditingMovie(null); setShowForm(v => !v); }}
                    className={showForm ? 'neumorph px-5 py-2.5 rounded-full text-sm font-bold' : 'premium-btn text-white flex items-center gap-2 text-sm'}
                >
                    <i className={showForm ? 'ri-close-line' : 'ri-add-line'} />
                    {showForm ? 'Cancel' : 'Add Movie'}
                </button>
            </div>

            {/* Add / Edit form */}
            {showForm && (
                <div className="glass-panel p-6 shadow-xl">
                    <h3 className="font-bold text-lg mb-4 border-l-4 border-violet-500 pl-3" style={{ color: 'var(--text-main)' }}>
                        {editingMovie ? `Editing: ${editingMovie.title}` : 'Add New Movie'}
                    </h3>
                    <MovieForm
                        initial={editingMovie}
                        loading={saving}
                        onSave={onSaveMovie}
                        onCancel={() => { setShowForm(false); setEditingMovie(null); }}
                    />
                </div>
            )}

            {/* Movie grid */}
            {loading ? (
                <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {Array(8).fill(0).map((_, i) => <div key={i} className="skeleton-shimmer rounded-2xl h-72" />)}
                </div>
            ) : movies.length === 0 ? (
                <div className="glass-panel p-12 text-center space-y-3">
                    <i className="ri-film-line text-5xl" style={{ color: 'var(--text-sub)' }} />
                    <p className="font-semibold" style={{ color: 'var(--text-sub)' }}>No movies yet. Add your first one!</p>
                </div>
            ) : (
                <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {movies.map(m => (
                        <AdminMovieCard
                            key={m._id}
                            movie={m}
                            onEdit={onEditClick}
                            onDelete={onDeleteMovie}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default MoviesTab;
