import React from 'react';

const StatCard = ({ icon, label, value, color }) => (
    <div className="glass-panel p-5 flex items-center gap-4">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${color}`}>
            <i className={`${icon} text-white text-xl`} />
        </div>
        <div>
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-sub)' }}>{label}</p>
            <p className="text-2xl font-extrabold" style={{ color: 'var(--text-main)' }}>{value}</p>
        </div>
    </div>
);

export default StatCard;
