import React from 'react';
import StatCard from './StatCard';

const OverviewTab = ({ movies, users, loading }) => {
    if (loading) {
        return (
            <div className="space-y-8 animate-pulse">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Array(4).fill(0).map((_, i) => <div key={i} className="h-28 rounded-2xl skeleton-shimmer" />)}
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="glass-panel p-6 h-96 skeleton-shimmer" />
                    <div className="glass-panel p-6 h-96 skeleton-shimmer" />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard icon="ri-film-fill" label="Total Movies" value={movies.length} color="bg-gradient-to-br from-violet-600 to-fuchsia-500" />
                <StatCard icon="ri-group-fill" label="Total Users" value={users.length} color="bg-gradient-to-br from-blue-600 to-cyan-500" />
                <StatCard icon="ri-forbid-2-fill" label="Banned" value={users.filter(u => u.isBanned).length} color="bg-gradient-to-br from-red-600 to-orange-500" />
                <StatCard icon="ri-shield-user-fill" label="Admins" value={users.filter(u => u.isAdmin).length} color="bg-gradient-to-br from-green-600 to-emerald-500" />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Recent movies */}
                <div className="glass-panel p-6 space-y-4">
                    <h3 className="font-bold text-lg flex items-center gap-2 border-l-4 border-violet-500 pl-3" style={{ color: 'var(--text-main)' }}>
                        <i className="ri-film-fill text-violet-400" /> Recent Movies
                    </h3>
                    {movies.slice(0, 5).map(m => (
                        <div key={m._id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition">
                            <img src={m.posterUrl} alt={m.title} className="w-10 h-14 object-cover rounded-lg" />
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-sm truncate" style={{ color: 'var(--text-main)' }}>{m.title}</p>
                                <p className="text-xs" style={{ color: 'var(--text-sub)' }}>{m.genre} • {m.releaseDate?.substring(0, 4)}</p>
                            </div>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-400 font-bold">{m.category}</span>
                        </div>
                    ))}
                    {movies.length === 0 && <p className="text-sm text-center py-4" style={{ color: 'var(--text-sub)' }}>No movies yet</p>}
                </div>

                {/* Recent users */}
                <div className="glass-panel p-6 space-y-4">
                    <h3 className="font-bold text-lg flex items-center gap-2 border-l-4 border-blue-500 pl-3" style={{ color: 'var(--text-main)' }}>
                        <i className="ri-group-fill text-blue-400" /> Recent Users
                    </h3>
                    {users.slice(0, 5).map(u => (
                        <div key={u._id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                                {u.username.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-sm truncate" style={{ color: 'var(--text-main)' }}>{u.username}</p>
                                <p className="text-xs truncate" style={{ color: 'var(--text-sub)' }}>{u.email}</p>
                            </div>
                            <div className="flex items-center gap-1">
                                {u.isAdmin && <span className="text-xs px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-400 font-bold">Admin</span>}
                                {u.isBanned && <span className="text-xs px-2.5 py-1 rounded-full bg-red-500/20 text-red-400 font-bold">Banned</span>}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default OverviewTab;
