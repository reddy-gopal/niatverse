import React, { useRef, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';

interface Video {
    id: string;
    title: string;
    url: string;
    tag: string;
}

const videos: Video[] = [
    {
        id: '-WVx9_pTqhM',
        title: 'NIAT X EAMCET Colleges',
        url: 'https://www.youtube.com/watch?v=-WVx9_pTqhM',
        tag: 'Admissions',
    },
    {
        id: 'bAPP4fh9GDc',
        title: 'NIAT Admissions 2026 Explained: 4 Steps to Apply After 12th',
        url: 'https://www.youtube.com/watch?v=bAPP4fh9GDc',
        tag: 'Admissions',
    },
    {
        id: 'ZCSDiXavVrU',
        title: "Don't Join NIAT Before Watching This | Honest 1st Year Review",
        url: 'https://www.youtube.com/watch?v=ZCSDiXavVrU',
        tag: 'Student Review',
    },
    {
        id: '_wAi9c5HGEQ',
        title: 'Is NIAT Worth it in 2026 | Honest NIAT Review',
        url: 'https://www.youtube.com/watch?v=_wAi9c5HGEQ',
        tag: 'Student Review',
    },
    {
        id: 'uY2hEQqac9s',
        title: 'NIAT NAT Exam Full Details | Syllabus, Pattern & Preparation Strategy',
        url: 'https://www.youtube.com/watch?v=uY2hEQqac9s',
        tag: 'Exam Prep',
    },
];

const VideoCarousel: React.FC = () => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const { current } = scrollContainerRef;
            // Get the width of one card plus gap
            const cardWidth = current.querySelector('.video-card')?.clientWidth || 280;
            const gap = 24; // 1.5rem (gap-6)
            const scrollAmount = cardWidth + gap;

            current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth',
            });
        }
    };

    const getTagColor = (tag: string) => {
        switch (tag) {
            case 'Admissions':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'Student Review':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'Exam Prep':
                return 'bg-orange-100 text-orange-800 border-orange-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <section
            ref={sectionRef}
            className={`py-12 bg-section transition-opacity duration-1000 ease-in-out ${isVisible ? 'opacity-100' : 'opacity-0'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
                    <div>
                        <h2 className="font-display text-2xl md:text-3xl font-bold text-black mb-2 flex items-center gap-2">
                            📺 Watch & Learn
                        </h2>
                        <p className="text-[#64748b]">Real students. Real experiences. No filter.</p>
                    </div>
                    <div className="hidden sm:flex items-center gap-3">
                        <button
                            onClick={() => scroll('left')}
                            className="p-2 rounded-full bg-white shadow hover:bg-gray-50 text-gray-700 transition-colors border border-gray-100"
                            aria-label="Scroll left"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => scroll('right')}
                            className="p-2 rounded-full bg-white shadow hover:bg-gray-50 text-gray-700 transition-colors border border-gray-100"
                            aria-label="Scroll right"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Carousel Container */}
                <div className="relative -mx-4 sm:mx-0">
                    <div
                        ref={scrollContainerRef}
                        className="flex overflow-x-auto snap-x snap-mandatory gap-6 px-4 sm:px-0 scrollbar-hide pb-4"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {videos.map((video) => (
                            <a
                                key={video.id}
                                href={video.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="video-card flex-none w-[85vw] sm:w-[calc(50%-12px)] md:w-[calc(33.333%-16px)] lg:w-[280px] snap-center bg-white rounded-xl shadow-card overflow-hidden transition-all duration-300 hover:scale-[1.03] hover:shadow-lg border border-transparent hover:border-[#991b1b]/20 flex flex-col group"
                            >
                                <div className="relative aspect-video overflow-hidden">
                                    <img
                                        src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
                                        alt={video.title}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                        <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                                            <Play className="w-6 h-6 text-[#991b1b] ml-1" />
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 flex flex-col flex-grow">
                                    <div className="mb-3">
                                        <span
                                            className={`inline-block px-2.5 py-1 rounded-md text-xs font-medium border ${getTagColor(
                                                video.tag
                                            )}`}
                                        >
                                            {video.tag}
                                        </span>
                                    </div>
                                    <h3 className="font-display font-bold text-gray-900 leading-snug line-clamp-2 mb-4">
                                        {video.title}
                                    </h3>

                                    <div className="mt-auto">
                                        <div className="inline-flex items-center justify-center w-full py-2 px-4 rounded-lg bg-gray-50 text-[#991b1b] font-medium text-sm group-hover:bg-[#991b1b] group-hover:text-white transition-colors duration-300">
                                            <Play className="w-4 h-4 mr-1.5 fill-current" />
                                            Watch
                                        </div>
                                    </div>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>

                {/* Mobile controls */}
                <div className="flex sm:hidden items-center justify-center gap-4 mt-6">
                    <button
                        onClick={() => scroll('left')}
                        className="p-3 rounded-full bg-white shadow text-gray-700 active:bg-gray-50 border border-gray-100"
                        aria-label="Scroll left"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => scroll('right')}
                        className="p-3 rounded-full bg-white shadow text-gray-700 active:bg-gray-50 border border-gray-100"
                        aria-label="Scroll right"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
            <style dangerouslySetInnerHTML={{
                __html: `
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
      `}} />
        </section>
    );
};

export default VideoCarousel;
