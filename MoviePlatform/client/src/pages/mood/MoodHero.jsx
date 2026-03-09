import React from 'react';

const MoodHero = () => (
    <header className="text-center md:text-left pt-2">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-600/10 border border-violet-500/20 text-violet-400 text-[10px] font-black tracking-widest uppercase mb-4 animate-in slide-in-from-bottom-2 duration-700">
            <i className="ri-brain-line"></i> AI POWERED EXPERIENCE
        </div>
        <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 drop-shadow leading-tight" style={{ color: 'var(--text-main)' }}>
            Your Face. <span className="bg-gradient-to-r from-violet-500 to-violet-700 bg-clip-text text-transparent animate-gradient-x px-1">Your Movie</span>.
        </h1>
        <p className="text-sm md:text-base font-medium mt-4 leading-relaxed opacity-80" style={{ color: 'var(--text-sub)' }}>
            Our biometric AI analysis maps your current micro-expressions to over 20,000 film entries. Center yourself and let the vision engine work.
        </p>
    </header>
);

export default MoodHero;
