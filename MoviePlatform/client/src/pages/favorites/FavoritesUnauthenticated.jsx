import React from 'react';
import { Link } from 'react-router';

const FavoritesUnauthenticated = () => (
    <div className="flex flex-col items-center justify-center py-24 gap-6 glass-panel rounded-[3rem]">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-600 to-violet-800 flex items-center justify-center shadow-lg shadow-violet-500/30">
            <i className="ri-heart-3-fill text-white text-3xl"></i>
        </div>
        <p className="text-xl font-semibold" style={{ color: 'var(--text-sub)' }}>Sign in to see your favorites</p>
        <Link to="/login" className="premium-btn text-white">Sign In</Link>
    </div>
);

export default FavoritesUnauthenticated;
