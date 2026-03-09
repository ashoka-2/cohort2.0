export const getTitleGradient = (title = '') => {
    const gradients = [
        'from-violet-600 to-fuchsia-700',
        'from-blue-600 to-cyan-700',
        'from-rose-600 to-pink-700',
        'from-amber-500 to-orange-700',
        'from-emerald-600 to-teal-700',
        'from-indigo-600 to-blue-800',
        'from-red-600 to-rose-800',
        'from-green-600 to-emerald-800',
    ];
    const idx = title.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % gradients.length;
    return gradients[idx];
};
