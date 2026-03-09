import React, { useEffect } from 'react';
import YouTube from 'react-youtube';

const VideoModal = ({ trailer, media, title, onClose, isPlaying }) => {
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        if (isPlaying) {
            window.addEventListener('keydown', handleEsc);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            window.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = 'unset';
        };
    }, [isPlaying, onClose]);

    if (!isPlaying || !trailer) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 animate-in fade-in zoom-in-95 duration-500">
            {/* Immersive Backdrop Blur */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-2xl"
                onClick={onClose}
            />

            {/* Background Reflection (Blurred Backdrop) */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
                {media.backdrop_path && (
                    <img
                        src={`https://image.tmdb.org/t/p/original${media.backdrop_path}`}
                        alt=""
                        className="w-full h-full object-cover blur-[100px] scale-150"
                    />
                )}
            </div>

            <div className="w-full max-w-6xl aspect-video bg-black rounded-[2.5rem] overflow-hidden relative shadow-[0_0_120px_rgba(124,58,237,0.4)] border border-white/10 glass-panel">
                {/* Modal Header */}
                <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-black/80 to-transparent z-10 hidden md:flex items-center justify-between px-10 pointer-events-none">
                    <div className="flex items-center gap-4">
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]"></div>
                        <span className="text-[10px] font-black text-white/40 tracking-[0.3em] uppercase">Now Screening</span>
                        <h4 className="text-white/90 font-bold tracking-tight text-lg drop-shadow">{title}</h4>
                    </div>
                </div>

                <YouTube
                    videoId={trailer.key}
                    opts={{
                        width: '100%',
                        height: '100%',
                        playerVars: {
                            autoplay: 1,
                            modestbranding: 1,
                            rel: 0,
                            iv_load_policy: 3,
                            showinfo: 0
                        }
                    }}
                    className="w-full h-full scale-[1.005]"
                    onEnd={onClose}
                />
            </div>

            {/* Close Button - NOW OUTSIDE the preview container */}
            <button
                onClick={onClose}
                className="fixed top-6 right-6 md:top-10 md:right-10 group z-[110] transition-all active:scale-95"
            >
                <div className="w-14 h-14 rounded-full bg-white/10 hover:bg-red-500 backdrop-blur-2xl border border-white/20 flex items-center justify-center text-white transition-all duration-300 group-hover:scale-110 group-hover:rotate-90 shadow-2xl group-hover:shadow-red-500/40">
                    <i className="ri-close-line text-3xl" />
                </div>
            </button>
        </div>
    );
};

export default VideoModal;
