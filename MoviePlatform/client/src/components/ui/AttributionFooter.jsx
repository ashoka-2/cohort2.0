import React from 'react';
import { Link } from 'react-router';

const AttributionFooter = ({ type = 'standard', className = '' }) => {
    if (type === 'simple') {
        return (
            <div className={`mt-12 pt-6 border-t border-white/5 flex justify-center ${className}`}>
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-textSub opacity-30 hover:opacity-100 transition-opacity duration-700 cursor-default">
                    Design & Craft <i className="ri-heart-fill text-red-500/50 mx-0.5"></i> <span className="text-primary-light">Ashok Kumar</span>
                </p>
            </div>
        );
    }

    if (type === 'auth') {
        return (
            <div className={`mt-12 pt-6 border-t border-white/5 flex justify-center ${className}`}>
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-textSub opacity-30 hover:opacity-100 transition-opacity duration-700 cursor-default">
                    Design & Craft <i className="ri-heart-fill text-red-500/50 mx-0.5"></i> <span className="text-primary-light">Ashok Kumar</span>
                </p>
            </div>
        );
    }

    if (type === 'mood') {
        return (
            <div className={`mt-20 py-12 border-t border-white/5 flex flex-col items-center gap-4 ${className}`}>
                <div className="px-6 py-2.5 rounded-full bg-white/5 border border-white/10 flex items-center gap-3">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-textSub">
                        Synthesized <i className="ri-heart-fill text-red-500/60 mx-0.5"></i> by <span className="text-primary-light">Ashok Kumar</span>
                    </p>
                </div>
                <Link to="/" className="text-[9px] font-black uppercase tracking-[0.4em] text-textSub/30 hover:text-primary transition-colors duration-500">
                    Moodplay Cinema Platform • 2026
                </Link>
            </div>
        );
    }

    // Default 'standard' (like HomeFooter)
    return (
        <footer className={`mt-20 pt-16 pb-32 border-t border-white/5 ${className}`}>
            <div className="flex flex-col items-center gap-8">
                <div className="flex items-center gap-12 text-sm font-bold tracking-widest text-textSub uppercase">
                    <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                    <Link to="/search" className="hover:text-primary transition-colors">Search</Link>
                    <Link to="/mood" className="hover:text-primary transition-colors">Mood</Link>
                </div>

                <div className="px-6 py-3 rounded-2xl glass-panel bg-white/5 border border-white/10 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                        <i className="ri-code-s-slash-line text-lg"></i>
                    </div>
                    <p className="text-xs font-bold tracking-[0.1em] text-textSub">
                        Made with <i className="ri-heart-fill text-red-500 animate-pulse"></i> by <span className="text-primary-light">Ashok Kumar</span>
                    </p>
                </div>

                <p className="text-[10px] text-textSub/30 font-bold uppercase tracking-[0.3em] mt-4">
                    © 2026 Moodplay Cinema Platform
                </p>
            </div>
        </footer>
    );
};

export default AttributionFooter;
