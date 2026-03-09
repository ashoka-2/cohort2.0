import React from 'react';

export const ConfirmModal = ({ message, onConfirm, onCancel }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div className="glass-panel p-8 max-w-sm w-full mx-4 space-y-4 shadow-2xl">
            <div className="w-14 h-14 rounded-full bg-red-500/20 flex items-center justify-center mx-auto">
                <i className="ri-alert-fill text-red-400 text-2xl" />
            </div>
            <p className="text-center font-semibold" style={{ color: 'var(--text-main)' }}>{message}</p>
            <div className="flex gap-3">
                <button onClick={onCancel} className="flex-1 py-2.5 rounded-full font-bold text-sm transition hover:bg-white/10" style={{ color: 'var(--text-sub)' }}>
                    Cancel
                </button>
                <button onClick={onConfirm} className="flex-1 py-2.5 rounded-full font-bold text-sm bg-red-600 hover:bg-red-700 text-white transition">
                    Confirm
                </button>
            </div>
        </div>
    </div>
);

export const Toast = ({ msg, type }) => (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl shadow-2xl font-semibold text-sm
        ${type === 'success' ? 'bg-green-600/90 text-white' : 'bg-red-600/90 text-white'}`}>
        <i className={type === 'success' ? 'ri-checkbox-circle-fill text-lg' : 'ri-error-warning-fill text-lg'} />
        {msg}
    </div>
);
