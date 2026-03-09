import React from 'react';

const UsersTable = ({ users, search, onSearchChange, onBanUser, onDeleteUser, loading }) => {
    return (
        <div className="space-y-6">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
                <h2 className="text-xl font-bold border-l-4 border-blue-500 pl-3 flex items-center gap-2" style={{ color: 'var(--text-main)' }}>
                    <i className="ri-group-fill text-blue-400" /> Manage Users
                    <span className="text-sm neumorph !rounded-full px-3 py-0.5 ml-2" style={{ color: 'var(--text-sub)' }}>{users.length}</span>
                </h2>
                {/* Search */}
                <div className="relative">
                    <i className="ri-search-line absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-sub)' }} />
                    <input
                        value={search} onChange={e => onSearchChange(e.target.value)}
                        placeholder="Search users…"
                        className="pl-10 pr-4 py-2.5 rounded-full text-sm border focus:outline-none focus:ring-2 focus:ring-violet-500 transition w-56"
                        style={{ background: 'var(--bg)', color: 'var(--text-main)', borderColor: 'var(--glass-border)' }}
                    />
                </div>
            </div>

            <div className="glass-panel overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-xs font-bold uppercase tracking-widest" style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-sub)' }}>
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Email</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Joined</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                        <td colSpan="6" className="px-6 py-4">
                                            <div className="h-10 w-full rounded-lg skeleton-shimmer" />
                                        </td>
                                    </tr>
                                ))
                            ) : users.map(u => (
                                <tr key={u._id} className="hover:bg-white/3 transition" style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                                                {u.username.charAt(0).toUpperCase()}
                                            </div>
                                            <span className="font-semibold text-sm" style={{ color: 'var(--text-main)' }}>{u.username}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm" style={{ color: 'var(--text-sub)' }}>{u.email}</td>
                                    <td className="px-6 py-4">
                                        {u.isAdmin
                                            ? <span className="text-xs px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-400 font-bold">Admin</span>
                                            : <span className="text-xs px-2.5 py-1 rounded-full bg-gray-500/20 font-bold" style={{ color: 'var(--text-sub)' }}>User</span>
                                        }
                                    </td>
                                    <td className="px-6 py-4">
                                        {u.isBanned
                                            ? <span className="text-xs px-2.5 py-1 rounded-full bg-red-500/20 text-red-400 font-bold flex items-center gap-1 w-fit"><i className="ri-forbid-line" />Banned</span>
                                            : <span className="text-xs px-2.5 py-1 rounded-full bg-green-500/20 text-green-400 font-bold flex items-center gap-1 w-fit"><i className="ri-check-line" />Active</span>
                                        }
                                    </td>
                                    <td className="px-6 py-4 text-xs" style={{ color: 'var(--text-sub)' }}>
                                        {new Date(u.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            {!u.isAdmin && (
                                                <>
                                                    <button onClick={() => onBanUser(u)}
                                                        className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold transition
                                                            ${u.isBanned
                                                                ? 'bg-green-500/10 hover:bg-green-500/20 text-green-400'
                                                                : 'bg-orange-500/10 hover:bg-orange-500/20 text-orange-400'}`}>
                                                        <i className={u.isBanned ? 'ri-arrow-go-back-line' : 'ri-forbid-line'} />
                                                        {u.isBanned ? 'Unban' : 'Ban'}
                                                    </button>
                                                    <button onClick={() => onDeleteUser(u)}
                                                        className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold transition bg-red-500/10 hover:bg-red-500/20 text-red-400">
                                                        <i className="ri-delete-bin-line" /> Delete
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {!loading && users.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-sm" style={{ color: 'var(--text-sub)' }}>
                                        {search ? `No users matching "${search}"` : 'No users found'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default UsersTable;
