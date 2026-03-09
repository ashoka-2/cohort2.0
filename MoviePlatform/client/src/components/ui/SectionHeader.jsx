import React from 'react';

const SectionHeader = ({ title, highlight, badge1, badge2, className = '' }) => (
    <div className={`flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 mt-4 ${className}`}>
        <h2 className="gsap-title text-4xl lg:text-5xl font-extrabold tracking-tight drop-shadow leading-tight" style={{ color: 'var(--text-main)' }}>
            {title} <span className="bg-gradient-to-r from-violet-500 to-violet-700 bg-clip-text text-transparent">{highlight}</span>
        </h2>
        <div className="flex gap-3 text-sm font-bold">
            {badge1 && (
                <span className="px-5 py-2 rounded-full bg-violet-600/10 border border-violet-500/20 text-violet-400 backdrop-blur-md">
                    {badge1}
                </span>
            )}
            {badge2 && (
                <span className="px-5 py-2 rounded-full bg-white/5 border border-glassBorder text-textSub/60 backdrop-blur-md">
                    {badge2}
                </span>
            )}
        </div>
    </div>
);

export default SectionHeader;
