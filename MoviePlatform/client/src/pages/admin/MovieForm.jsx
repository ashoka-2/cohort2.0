import React, { useState } from 'react';
import { extractYouTubeId, EMPTY_FORM } from './AdminUtils';
import { InputField, TextareaField } from './FormFields';

const MovieForm = ({ initial, onSave, onCancel, loading }) => {
    const [form, setForm] = useState(initial || EMPTY_FORM);
    const ytId = extractYouTubeId(form.trailerUrl);

    const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
    const handle = e => set(e.target.name, e.target.value);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(form);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField label="Movie Title" icon="ri-film-line" name="title" value={form.title} onChange={handle} required placeholder="e.g. Inception" />
                <InputField label="Movie ID (TMDB)" icon="ri-hashtag" name="movieId" value={form.movieId} onChange={handle} placeholder="e.g. 27205" />
            </div>

            <TextareaField label="Description" icon="ri-align-left" name="description" value={form.description} onChange={handle} rows={3} required placeholder="Short description..." />

            <InputField label="Poster Image URL" icon="ri-image-line" name="posterUrl" value={form.posterUrl} onChange={handle} required placeholder="https://..." />

            {form.posterUrl && (
                <img src={form.posterUrl} alt="Preview" className="w-24 h-36 object-cover rounded-lg border" style={{ borderColor: 'var(--glass-border)' }} />
            )}

            <InputField label="Trailer YouTube URL" icon="ri-youtube-line" name="trailerUrl" value={form.trailerUrl} onChange={handle} required placeholder="https://youtube.com/watch?v=..." />

            {/* Live YouTube preview */}
            {ytId && (
                <div className="relative group/preview mt-4">
                    <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-2xl blur opacity-25 group-hover/preview:opacity-50 transition duration-1000 group-hover/preview:duration-200 animate-pulse"></div>
                    <div className="relative rounded-2xl overflow-hidden aspect-video border border-white/10 shadow-2xl bg-black">
                        <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                            <span className="text-[9px] font-black text-white/80 tracking-widest uppercase">Live Preview</span>
                        </div>
                        <iframe
                            src={`https://www.youtube.com/embed/${ytId}?modestbranding=1`}
                            className="w-full h-full"
                            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            title="Trailer preview"
                        />
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField label="Release Date" icon="ri-calendar-line" type="date" name="releaseDate"
                    value={form.releaseDate ? form.releaseDate.substring(0, 10) : ''}
                    onChange={handle} required />
                <InputField label="Genre" icon="ri-price-tag-3-line" name="genre" value={form.genre} onChange={handle} required placeholder="Action, Sci-Fi..." />
            </div>

            <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-1.5" style={{ color: 'var(--text-sub)' }}>
                    <i className="ri-layout-grid-line mr-1" />Category
                </label>
                <select
                    name="category" value={form.category} onChange={handle} required
                    className="w-full rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-violet-500 transition"
                    style={{ background: 'var(--bg)', color: 'var(--text-main)', border: '1px solid var(--glass-border)' }}
                >
                    <option value="Movie">Movie</option>
                    <option value="TV Show">TV Show</option>
                </select>
            </div>

            <div className="flex gap-3 pt-2">
                <button type="submit" disabled={loading}
                    className="flex-1 premium-btn text-white flex items-center justify-center gap-2">
                    {loading
                        ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Saving…</>
                        : <><i className="ri-save-line" />{initial ? 'Update Movie' : 'Publish Movie'}</>
                    }
                </button>
                {onCancel && (
                    <button type="button" onClick={onCancel}
                        className="px-5 py-2.5 rounded-full font-bold text-sm transition hover:bg-white/10"
                        style={{ color: 'var(--text-sub)' }}>
                        Cancel
                    </button>
                )}
            </div>
        </form>
    );
};

export default MovieForm;
