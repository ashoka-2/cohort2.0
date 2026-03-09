import React from 'react';
import { Link } from 'react-router';

const FavoritesEmpty = () => (
    <div className="flex flex-col items-center justify-center py-24 gap-6 glass-panel">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-600/20 to-fuchsia-500/20 border border-fuchsia-500/30 flex items-center justify-center">
            <i className="ri-heart-3-line text-fuchsia-400 text-3xl"></i>
        </div>
        <div className="text-center space-y-2">
            <p className="text-xl font-semibold" style={{ color: 'var(--text-main)' }}>No favorites yet</p>
            <p className="text-sm" style={{ color: 'var(--text-sub)' }}>Start adding movies and TV shows you love!</p>
        </div>
        <Link to="/" className="premium-btn text-white flex items-center gap-2">
            <i className="ri-compass-3-line"></i> Explore
        </Link>
    </div>
);

export default FavoritesEmpty;
