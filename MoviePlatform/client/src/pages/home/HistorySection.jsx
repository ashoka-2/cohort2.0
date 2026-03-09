import React from 'react';

const HistorySection = ({ historyItems, historyStatus, renderContent }) => {
    if (historyItems.length === 0) return null;

    return (
        <section className="gsap-section glass-panel p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold border-l-4 border-primary pl-4 tracking-wider flex items-center gap-2">
                    <i className="ri-history-line text-primary"></i> Recently Played
                </h2>
            </div>
            <div className="flex overflow-x-auto gap-6 pb-4 hide-scrollbar hover:hide-scrollbar">
                {renderContent(historyItems.slice(0, 10), historyStatus === 'loading', historyStatus).map((Card, i) => (
                    <div key={Card.props.movie.id || Card.props.movie._id} className="min-w-[150px] md:min-w-[200px] flex-shrink-0 neumorph-inset p-2 rounded-2xl">
                        {Card}
                    </div>
                ))}
            </div>
        </section>
    );
};

export default HistorySection;
