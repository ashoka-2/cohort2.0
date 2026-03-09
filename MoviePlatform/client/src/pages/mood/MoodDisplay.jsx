import React from 'react';
import { MOOD_THEMES } from './MoodConstants';

const MoodDisplay = ({ mood, onReset }) => {
    const theme = MOOD_THEMES[mood] || MOOD_THEMES.Neutral;

    if (!mood) {
        return (
            <div className="flex flex-col md:flex-row items-center justify-start gap-6 p-6 glass-card rounded-3xl border border-dashed border-white/10 bg-white/[0.02] shadow-xl animate-in zoom-in duration-1000">
                <div className="relative shrink-0">
                    <div className="absolute inset-0 bg-violet-600/20 blur-[40px] rounded-full animate-pulse"></div>
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center relative z-10 border border-white/10 transition-transform duration-700">
                        <i className="ri-sparkling-2-line text-2xl text-violet-400"></i>
                    </div>
                </div>
                <div className="space-y-1 text-center md:text-left">
                    <h3 className="text-lg font-black tracking-tight" style={{ color: 'var(--text-main)' }}>Waiting for Scan</h3>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--text-sub)' }}>
                        Your detected mood will appear here.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className={`flex flex-col justify-center p-6 rounded-3xl bg-gradient-to-br ${theme.gradient} animate-in zoom-in duration-700 shadow-2xl ${theme.shadow}`}>
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
                <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-xl flex items-center justify-center border border-white/20 shadow-xl shrink-0 transition-transform group-hover:scale-105">
                    <i className={`${theme.icon} text-3xl text-white drop-shadow-md`}></i>
                </div>
                <div className="flex-1 space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">DETECTED MOOD</p>
                    <h2 className="text-3xl font-black text-white drop-shadow-xl tracking-tight leading-none">{mood}</h2>
                    <p className="text-violet-200/90 font-medium italic text-sm tracking-tight mt-1">"{theme.tagline}"</p>
                </div>
                <div className="sm:ml-auto">
                    <button
                        onClick={onReset}
                        className="px-5 py-3 mt-4 sm:mt-0 rounded-xl bg-black/10 hover:bg-black/20 text-white font-bold transition-all flex items-center justify-center gap-2 backdrop-blur-sm text-sm whitespace-nowrap"
                    >
                        <i className="ri-refresh-line text-lg"></i> Scan Again
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MoodDisplay;
