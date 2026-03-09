import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { apiService } from '../../services/api.service';
import { Link, useNavigate } from 'react-router';

// Internal Components
import OverviewTab from './OverviewTab';
import MoviesTab from './MoviesTab';
import UsersTable from './UsersTable';
import { ConfirmModal, Toast } from './Modals';

const Admin = () => {
    const { user } = useSelector(state => state.auth);
    const navigate = useNavigate();

    const [movies, setMovies] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');
    const [editingMovie, setEditingMovie] = useState(null);  // null = add mode
    const [showForm, setShowForm] = useState(false);
    const [confirm, setConfirm] = useState(null);           // { msg, action }
    const [toast, setToast] = useState(null);               // { msg, type }
    const [search, setSearch] = useState('');

    // ── helpers ──
    const showToast = (msg, type = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    const fetchData = useCallback(async () => {
        try {
            const [moviesData, usersData] = await Promise.all([
                apiService.adminGetMovies(),
                apiService.adminGetUsers(),
            ]);
            setMovies(moviesData);
            setUsers(usersData);
        } catch (err) {
            showToast('Failed to load data', 'error');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (user?.isAdmin) fetchData();
    }, [user, fetchData]);

    // ── access guards ──
    if (!user) return (
        <div className="flex flex-col items-center justify-center h-[70vh] gap-4 glass-panel">
            <i className="ri-lock-2-fill text-5xl text-violet-400" />
            <h2 className="text-2xl font-bold" style={{ color: 'var(--text-main)' }}>Sign In Required</h2>
            <Link to="/login" className="premium-btn text-white">Sign In</Link>
        </div>
    );

    if (!user?.isAdmin) return (
        <div className="flex flex-col items-center justify-center h-[70vh] gap-4 glass-panel">
            <i className="ri-shield-cross-fill text-5xl text-red-400" />
            <h2 className="text-2xl font-bold text-red-400">Access Denied</h2>
            <p className="text-sm" style={{ color: 'var(--text-sub)' }}>You don't have permission to view this page.</p>
            <button onClick={() => navigate('/')} className="premium-btn text-white">Go Home</button>
        </div>
    );

    // ── movie actions ──
    const handleSaveMovie = async (form) => {
        setSaving(true);
        try {
            if (editingMovie) {
                await apiService.adminUpdateMovie(editingMovie._id, form);
                showToast('Movie updated successfully');
            } else {
                await apiService.adminAddMovie(form);
                showToast('Movie published successfully');
            }
            setShowForm(false);
            setEditingMovie(null);
            fetchData();
        } catch {
            showToast('Failed to save movie', 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteMovie = (id) => {
        setConfirm({
            msg: 'Permanently delete this movie?',
            action: async () => {
                await apiService.adminDeleteMovie(id);
                showToast('Movie deleted');
                fetchData();
                setConfirm(null);
            }
        });
    };

    // ── user actions ──
    const handleBanUser = (u) => {
        setConfirm({
            msg: u.isBanned ? `Unban ${u.username}?` : `Ban ${u.username}?`,
            action: async () => {
                await apiService.adminBanUser(u._id);
                showToast(`User ${u.isBanned ? 'unbanned' : 'banned'}`);
                fetchData();
                setConfirm(null);
            }
        });
    };

    const handleDeleteUser = (u) => {
        setConfirm({
            msg: `Permanently delete user "${u.username}"? This cannot be undone.`,
            action: async () => {
                await apiService.adminDeleteUser(u._id);
                showToast('User deleted');
                fetchData();
                setConfirm(null);
            }
        });
    };

    // ── filtered users ──
    const filteredUsers = users.filter(u =>
        u.username.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    );

    const TABS = [
        { id: 'overview', label: 'Overview', icon: 'ri-dashboard-3-line' },
        { id: 'movies', label: 'Movies', icon: 'ri-film-fill' },
        { id: 'users', label: 'Users', icon: 'ri-group-fill' },
    ];

    return (
        <div className="pb-16 space-y-8">
            {/* ── Modals ── */}
            {confirm && (
                <ConfirmModal
                    message={confirm.msg}
                    onConfirm={confirm.action}
                    onCancel={() => setConfirm(null)}
                />
            )}
            {toast && <Toast msg={toast.msg} type={toast.type} />}

            {/* ── Header ── */}
            <div className="glass-panel p-5 md:p-6 flex flex-col lg:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-3 w-full lg:w-auto">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/30 flex-shrink-0">
                        <i className="ri-shield-user-fill text-white text-lg md:text-xl" />
                    </div>
                    <div className="min-w-0">
                        <h1 className="text-xl md:text-2xl font-extrabold truncate" style={{ color: 'var(--text-main)' }}>Admin Dashboard</h1>
                        <p className="text-[10px] md:text-xs" style={{ color: 'var(--text-sub)' }}>Welcome back, {user.username}</p>
                    </div>
                </div>

                {/* Tab nav */}
                <div className="flex w-full lg:w-auto overflow-x-auto hide-scrollbar rounded-2xl p-1 gap-1" style={{ background: 'var(--bg)' }}>
                    {TABS.map(tab => (
                        <button key={tab.id} onClick={() => { setActiveTab(tab.id); setShowForm(false); }}
                            className={`flex flex-1 lg:flex-none items-center justify-center gap-2 px-4 md:px-5 py-2 rounded-xl text-xs md:text-sm font-bold transition-all whitespace-nowrap
                                ${activeTab === tab.id
                                    ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg'
                                    : 'hover:text-violet-400'}`}
                            style={{ color: activeTab === tab.id ? '#fff' : 'var(--text-sub)' }}
                        >
                            <i className={tab.icon} />{tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Tabs Content ── */}
            <div className="animate-fade-in">
                {activeTab === 'overview' && (
                    <OverviewTab movies={movies} users={users} loading={loading} />
                )}

                {activeTab === 'movies' && (
                    <MoviesTab
                        movies={movies}
                        loading={loading}
                        showForm={showForm}
                        setShowForm={setShowForm}
                        editingMovie={editingMovie}
                        setEditingMovie={setEditingMovie}
                        saving={saving}
                        onSaveMovie={handleSaveMovie}
                        onDeleteMovie={handleDeleteMovie}
                        onEditClick={(movie) => {
                            setEditingMovie(movie);
                            setShowForm(true);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                    />
                )}

                {activeTab === 'users' && (
                    <UsersTable
                        users={filteredUsers}
                        search={search}
                        onSearchChange={setSearch}
                        onBanUser={handleBanUser}
                        onDeleteUser={handleDeleteUser}
                        loading={loading}
                    />
                )}
            </div>

            {/* ─── Footer ─────────────────────────────────────────── */}
            <div className="mt-12 py-8 border-t border-white/5 flex justify-center">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-textSub opacity-30 hover:opacity-100 transition-opacity duration-500">
                    Engineered with <i className="ri-heart-fill text-red-500 animate-pulse mx-0.5"></i> by <span className="text-primary-light">Ashok Kumar</span>
                </p>
            </div>
        </div>
    );
};

export default Admin;
