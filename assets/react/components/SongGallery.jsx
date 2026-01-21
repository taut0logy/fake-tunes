import React, { useEffect, useRef, useCallback } from 'react';
import SongCard from './SongCard';

export default function SongGallery({
    songs,
    loading,
    onLoadMore,
    expandedIndex,
    expandedSong,
    onCardClick,
}) {
    const observerRef = useRef(null);
    const loadMoreRef = useRef(null);

    const handleObserver = useCallback((entries) => {
        const target = entries[0];
        if (target.isIntersecting && !loading) {
            onLoadMore();
        }
    }, [loading, onLoadMore]);

    useEffect(() => {
        if (observerRef.current) {
            observerRef.current.disconnect();
        }

        observerRef.current = new IntersectionObserver(handleObserver, {
            root: null,
            rootMargin: '100px',
            threshold: 0,
        });

        if (loadMoreRef.current) {
            observerRef.current.observe(loadMoreRef.current);
        }

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [handleObserver]);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {songs.map((song) => (
                    <SongCard
                        key={song.index}
                        song={song}
                        isExpanded={expandedIndex === song.index}
                        expandedSong={expandedIndex === song.index ? expandedSong : null}
                        onClick={() => onCardClick(song.index)}
                    />
                ))}
            </div>

            <div ref={loadMoreRef} className="py-4 flex justify-center">
                {loading && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <div className="animate-spin h-5 w-5 border-2 border-current border-t-transparent rounded-full" />
                        <span>Loading more songs...</span>
                    </div>
                )}
            </div>
        </div>
    );
}
