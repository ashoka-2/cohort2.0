import { Link, useLocation } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import { logoutUserThunk } from '../../features/auth/authSlice';
import { toggleTheme } from '../../features/theme/themeSlice';

const NAV_MAIN = [
    { name: 'Home', path: '/', icon: 'ri-home-5-fill' },
    { name: 'Search', path: '/search', icon: 'ri-search-2-line' },
    { name: 'Mood', path: '/mood', icon: 'ri-emotion-line' },
    { name: 'Movies', path: '/movies', icon: 'ri-film-fill' },
    { name: 'TV Shows', path: '/tv', icon: 'ri-tv-2-fill' },
    { name: 'Recently Added', path: '/recent', icon: 'ri-time-fill' },
];

const NAV_USER = [
    { name: 'Favorites', path: '/favorites', icon: 'ri-heart-3-fill', requireAuth: true },
    { name: 'Admin Panel', path: '/admin', icon: 'ri-shield-user-fill', requireAdmin: true },
];

const Sidebar = () => {
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const { mode } = useSelector((state) => state.theme);
    const dispatch = useDispatch();
    const location = useLocation();

    const handleLogout = () => dispatch(logoutUserThunk());
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const visibleUser = NAV_USER.filter(l => {
        if (l.requireAdmin) return user?.isAdmin;
        if (l.requireAuth) return isAuthenticated;
        return true;
    });

    // Determine the 5 links for mobile bottom nav
    const mobileBottomLinks = [
        NAV_MAIN[0], // Home
        NAV_MAIN[1], // Search
        NAV_MAIN[2], // Mood
        NAV_MAIN[3], // Movies
        NAV_MAIN[4], // TV Shows
    ];

    const mobileMenuLinks = [
        NAV_MAIN[5], // Recently Added
        ...visibleUser
    ];

    const isActive = (path) => location.pathname === path;

    const LinkItem = ({ link, iconOnly = false }) => (
        <Link
            key={link.name}
            to={link.path}
            title={link.name}
            className={`group flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-[0.4s] cubic-bezier(0.19, 1, 0.22, 1) font-bold text-[15px] border
                ${isActive(link.path)
                    ? 'bg-violet-600/15 text-violet-300 border-violet-500/30 shadow-lg shadow-violet-500/20 backdrop-blur-md translate-x-1'
                    : 'text-textSub border-transparent hover:text-textMain hover:bg-white/5 hover:border-white/10 hover:translate-x-1'
                }
                ${iconOnly ? 'justify-center px-0 flex-1' : ''}`}
        >
            <i className={`${link.icon} text-xl ${isActive(link.path) ? 'text-violet-400 drop-shadow-md' : 'text-textSub/70 group-hover:text-violet-400 transition-colors duration-300'}`}></i>
            {!iconOnly && <span className="leading-none tracking-wide">{link.name}</span>}
        </Link>
    );

    return (
        <>
            {/* ─── Desktop Sidebar ─────────────────────────────────── */}
            <aside
                className="hidden md:flex flex-col fixed top-0 left-0 h-screen w-64 z-50"
                style={{
                    background: 'var(--sidebar-bg)',
                    backdropFilter: 'blur(24px)',
                    WebkitBackdropFilter: 'blur(24px)',
                    borderRight: '1px solid var(--glass-border)',
                }}
            >
                {/* Logo */}
                <div className="flex items-center gap-3 px-7 h-24 border-b group" style={{ borderColor: 'var(--glass-border)' }}>
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-600 to-violet-800 flex items-center justify-center shadow-lg shadow-violet-500/40 transform transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                        <i className="ri-play-circle-fill text-white text-xl"></i>
                    </div>
                    <span className="font-black text-2xl tracking-tighter" style={{ color: 'var(--text-main)' }}>
                        Mood<span className="bg-gradient-to-r from-violet-500 to-violet-700 bg-clip-text text-transparent">play</span>
                    </span>
                </div>

                {/* Main nav */}
                <nav
                    data-lenis-prevent
                    className="flex-1 overflow-y-auto px-4 py-6 space-y-2 thin-scrollbar"
                >
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] px-4 pb-3 opacity-60" style={{ color: 'var(--text-sub)' }}>Browse</p>
                    {NAV_MAIN.map(link => <LinkItem key={link.path} link={link} />)}
                </nav>

                {/* Bottom toolbar */}
                <div className="px-4 py-5 border-t relative" style={{ borderColor: 'var(--glass-border)' }}>
                    {/* User area & Popup */}
                    {isAuthenticated ? (
                        <div className="relative">
                            {/* The Animated Popup Menu */}
                            <div className={`absolute bottom-[110%] left-0 w-full p-2 rounded-[1.5rem] border shadow-2xl backdrop-blur-3xl transition-all duration-300 origin-bottom ${isProfileOpen ? 'opacity-100 scale-100 pointer-events-auto translate-y-0' : 'opacity-0 scale-95 pointer-events-none translate-y-4'}`} style={{ background: 'var(--glass-bg)', borderColor: 'var(--glass-border)' }}>
                                <div className="space-y-1">
                                    {visibleUser.map(link => (
                                        <Link
                                            key={link.path}
                                            to={link.path}
                                            onClick={() => setIsProfileOpen(false)}
                                            className="flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-[0.4s] font-bold text-[14px] text-textSub border border-transparent hover:text-textMain hover:bg-white/5 hover:border-white/10 group"
                                        >
                                            <i className={`${link.icon} text-lg group-hover:text-violet-400 group-hover:scale-110 transition-transform`}></i>
                                            <span className="tracking-wide group-hover:translate-x-1 transition-transform">{link.name}</span>
                                        </Link>
                                    ))}
                                    <div className="h-px bg-white/10 my-2 mx-3"></div>
                                    <button
                                        onClick={() => dispatch(toggleTheme())}
                                        className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl transition-all duration-[0.4s] font-bold text-[14px] text-textSub border border-transparent hover:text-textMain hover:bg-white/5 hover:border-white/10 group"
                                    >
                                        <div className="flex items-center gap-3.5">
                                            {mode === 'dark'
                                                ? <><i className="ri-sun-line text-lg group-hover:text-amber-400 group-hover:scale-110 transition-transform"></i><span className="tracking-wide group-hover:translate-x-1 transition-transform">Light Mode</span></>
                                                : <><i className="ri-moon-clear-fill text-lg group-hover:text-violet-400 group-hover:scale-110 transition-transform"></i><span className="tracking-wide group-hover:translate-x-1 transition-transform">Dark Mode</span></>
                                            }
                                        </div>
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-[0.4s] font-bold text-[14px] text-red-500/80 border border-transparent hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 group"
                                    >
                                        <i className="ri-logout-circle-line text-lg group-hover:scale-110 transition-transform"></i>
                                        <span className="tracking-wide group-hover:translate-x-1 transition-transform">Sign Out</span>
                                    </button>
                                </div>
                            </div>

                            {/* Profile Button toggle */}
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="w-full flex items-center gap-3 px-3 py-3 rounded-[1.25rem] border transition-all duration-300 group hover:border-primary/30"
                                style={{ background: isProfileOpen ? 'var(--glass-bg)' : 'transparent', borderColor: isProfileOpen ? 'var(--primary-light)' : 'transparent' }}
                            >
                                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-violet-500 to-violet-700 flex items-center justify-center text-white font-black text-base flex-shrink-0 shadow-lg shadow-primary/30 group-hover:scale-105 transition-transform duration-300">
                                    {user?.username?.charAt(0).toUpperCase() || 'U'}
                                </div>
                                <div className="min-w-0 text-left flex-1">
                                    <p className="text-[15px] font-bold truncate leading-tight tracking-wide group-hover:text-primary transition-colors" style={{ color: 'var(--text-main)' }}>{user?.username || 'User'}</p>
                                    <p className="text-[10px] text-primary font-extrabold uppercase tracking-widest mt-0.5">Member</p>
                                </div>
                                <i className={`ri-arrow-up-s-line text-xl text-textSub transition-transform duration-300 ${isProfileOpen ? 'rotate-180 text-primary' : 'group-hover:text-primary'}`}></i>
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <button
                                onClick={() => dispatch(toggleTheme())}
                                className="w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-[0.4s] border border-transparent hover:bg-white/5 hover:border-white/10 font-bold text-[15px] group hover:translate-x-1"
                                style={{ color: 'var(--text-sub)' }}
                            >
                                {mode === 'dark'
                                    ? <><i className="ri-sun-line text-xl text-amber-400 group-hover:scale-110 transition-transform"></i><span className="tracking-wide" style={{ color: 'var(--text-main)' }}>Light Mode</span></>
                                    : <><i className="ri-moon-clear-fill text-xl text-violet-400 group-hover:scale-110 transition-transform"></i><span className="tracking-wide" style={{ color: 'var(--text-main)' }}>Dark Mode</span></>
                                }
                            </button>
                            <Link
                                to="/login"
                                className="premium-btn flex items-center justify-center gap-3 w-full text-center py-4"
                            >
                                <i className="ri-login-circle-line text-lg"></i> Sign In
                            </Link>
                        </div>
                    )}
                </div>
            </aside>

            {/* ─── Mobile Top Header ───────────────────────────────── */}
            <header
                className="md:hidden fixed top-4 mx-5 h-16 z-50 rounded-[1.5rem] mobile-header-glass transition-all duration-500 relative"
            >
                <div className="w-full h-full flex items-center justify-between px-6">
                    <Link to="/" className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-violet-800 flex items-center justify-center transform transition-transform group-hover:scale-110 shadow-lg shadow-violet-500/40">
                            <i className="ri-play-circle-fill text-white text-sm"></i>
                        </div>
                        <span className="font-black text-xl tracking-tighter" style={{ color: 'var(--text-main)' }}>
                            Mood<span className="bg-gradient-to-r from-violet-500 to-violet-700 bg-clip-text text-transparent">play</span>
                        </span>
                    </Link>

                    {/* Trigger Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-105 relative"
                        style={{ zIndex: 52 }}
                    >
                        {isAuthenticated ? (
                            <div className="w-9 h-9 flex items-center justify-center rounded-full bg-gradient-to-tr from-violet-500 to-violet-700 text-white font-black text-sm shadow-md shadow-primary/30">
                                {user?.username?.charAt(0).toUpperCase() || 'U'}
                            </div>
                        ) : (
                            <div className="w-9 h-9 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-textSub transition-all hover:text-white">
                                <i className={`ri-menu-4-line text-lg transition-transform duration-300 ${isMobileMenuOpen ? 'rotate-90 text-primary' : ''}`}></i>
                            </div>
                        )}
                    </button>
                </div>

                {/* Invisible Backdrop to close menu */}
                {isMobileMenuOpen && (
                    <div
                        className="fixed inset-0"
                        style={{ zIndex: 49 }}
                        onClick={() => setIsMobileMenuOpen(false)}
                    ></div>
                )}

                {/* Animated Mobile Popup Menu */}
                <div
                    className={`absolute top-[10%] left-[50%] -translate-x-1/2 w-64 rounded-[1.5rem] shadow-2xl transition-all duration-300 origin-top-right premium-popup z-[53] ${isMobileMenuOpen ? 'opacity-100 scale-100 pointer-events-auto translate-y-0' : 'opacity-0 scale-95 pointer-events-none'}`}
                >
                    {/* Shine layer for effects */}
                    <div className="shine-layer"></div>

                    <div className="relative z-10 p-3 space-y-3">
                        {mobileMenuLinks.map(link => (
                            <Link
                                key={link.name}
                                to={link.path}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-[0.4s] font-bold text-[14px] text-textSub border border-transparent hover:text-textMain hover:bg-white/5 hover:border-white/10 group"
                            >
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isActive(link.path) ? 'bg-violet-600/20 text-violet-400' : 'bg-white/5 group-hover:bg-violet-600/10 group-hover:text-violet-400'} transition-colors`}>
                                    <i className={`${link.icon} text-lg transition-transform group-hover:scale-110 drop-shadow-md`}></i>
                                </div>
                                <span className="tracking-wide group-hover:translate-x-1 transition-transform">{link.name}</span>
                            </Link>
                        ))}

                        <div className="h-px bg-white/10 my-3 mx-4"></div>
                        {/* Theme Toggle and logout buttons... */}
                        <button
                            onClick={() => {
                                dispatch(toggleTheme());
                                setIsMobileMenuOpen(false);
                            }}
                            className="w-full flex items-center justify-between gap-4 px-4 py-3.5 rounded-xl transition-all duration-[0.4s] font-bold text-[14px] text-textSub border border-transparent hover:text-textMain hover:bg-white/5 hover:border-white/10 group"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/5 group-hover:bg-white/10 text-textSub transition-colors">
                                    {mode === 'dark'
                                        ? <i className="ri-sun-line text-lg transition-transform group-hover:scale-110 group-hover:text-amber-400"></i>
                                        : <i className="ri-moon-clear-fill text-lg transition-transform group-hover:scale-110 text-violet-400 group-hover:text-violet-300"></i>
                                    }
                                </div>
                                <span className="tracking-wide group-hover:translate-x-1 transition-transform">{mode === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                            </div>
                        </button>

                        {isAuthenticated ? (
                            <button
                                onClick={() => {
                                    handleLogout();
                                    setIsMobileMenuOpen(false);
                                }}
                                className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-[0.4s] font-bold text-[14px] text-red-500/80 border border-transparent hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 group mt-1"
                            >
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-red-500/5 group-hover:bg-red-500/10 transition-colors">
                                    <i className="ri-logout-circle-line text-lg group-hover:scale-110 transition-transform drop-shadow-md"></i>
                                </div>
                                <span className="tracking-wide group-hover:translate-x-1 transition-transform">Sign Out</span>
                            </button>
                        ) : (
                            <Link
                                to="/login"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="w-full flex items-center justify-center gap-3 px-4 py-4 mt-2 rounded-xl transition-all duration-[0.4s] font-bold text-[15px] text-white bg-gradient-to-r from-violet-600 to-violet-800 shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 hover:scale-[1.02]"
                            >
                                <i className="ri-login-circle-line text-lg"></i>
                                <span className="tracking-wide">Sign In</span>
                            </Link>
                        )}
                    </div>
                </div>
            </header>

            {/* ─── Mobile Bottom Nav (icons only) ─────────────────── */}
            <nav
                className="md:hidden fixed bottom-4 inset-x-4 z-[60] flex items-center justify-around px-2 h-[60px] rounded-[2rem] shadow-2xl shadow-black/50"
                style={{
                    background: 'rgba(9, 9, 11, 0.75)',
                    backdropFilter: 'blur(24px)',
                    WebkitBackdropFilter: 'blur(24px)',
                    border: '1px solid var(--glass-border)',
                }}
            >
                {
                    mobileBottomLinks.map(link => (
                        <Link
                            key={link.path}
                            to={link.path}
                            title={link.name}
                            className={`flex flex-col items-center justify-center w-12 h-12 rounded-[1.25rem] transition-all duration-[0.5s] cubic-bezier(0.19, 1, 0.22, 1)
                            ${isActive(link.path)
                                    ? 'bg-violet-600/20 text-violet-400 border border-violet-500/30 shadow-xl shadow-violet-500/20 scale-[1.05]'
                                    : 'text-white/50 hover:text-white/90 hover:bg-white/5'
                                }`}
                        >
                            <i className={`${link.icon} text-[22px] ${isActive(link.path) ? 'drop-shadow-lg text-violet-300' : ''}`}></i>
                        </Link>
                    ))
                }
            </nav >
        </>
    );
};

export default Sidebar;
