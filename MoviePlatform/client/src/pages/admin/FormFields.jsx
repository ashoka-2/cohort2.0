import React from 'react';

export const InputField = ({ label, icon, ...props }) => (
    <div>
        <label className="block text-xs font-bold uppercase tracking-widest mb-1.5" style={{ color: 'var(--text-sub)' }}>
            <i className={`${icon} mr-1`} />{label}
        </label>
        <input
            {...props}
            className="w-full rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-violet-500 transition"
            style={{ background: 'var(--bg)', color: 'var(--text-main)', border: '1px solid var(--glass-border)' }}
        />
    </div>
);

export const TextareaField = ({ label, icon, ...props }) => (
    <div>
        <label className="block text-xs font-bold uppercase tracking-widest mb-1.5" style={{ color: 'var(--text-sub)' }}>
            <i className={`${icon} mr-1`} />{label}
        </label>
        <textarea
            {...props}
            className="w-full rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-violet-500 transition resize-none"
            style={{ background: 'var(--bg)', color: 'var(--text-main)', border: '1px solid var(--glass-border)' }}
        />
    </div>
);
