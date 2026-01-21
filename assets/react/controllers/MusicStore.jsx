import React, { useState, useEffect, useCallback } from 'react';
import ControlToolbar from '../components/ControlToolbar';
import SongTable from '../components/SongTable';
import SongGallery from '../components/SongGallery';

export default function MusicStore() {
    const [locale, setLocale] = useState('en');
    const [seed, setSeed] = useState(() => Math.floor(Math.random() * 100000000));
    const [likes, setLikes] = useState(5.0);
    const [viewMode, setViewMode] = useState('table');

    const [songs, setSongs] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [expandedIndex, setExpandedIndex] = useState(null);
    const [expandedSong, setExpandedSong] = useState(null);

    const perPage = 10;

    const fetchSongs = useCallback(async (pageNum = 1, append = false) => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                seed: seed.toString(),
                locale,
                page: pageNum.toString(),
                perPage: perPage.toString(),
                likes: likes.toString(),
            });

            const response = await fetch(`/api/songs?${params}`);
            const data = await response.json();

            if (append) {
                setSongs(prev => [...prev, ...data.data]);
            } else {
                setSongs(data.data);
            }
            setPage(pageNum);
        } catch (error) {
            console.error('Error fetching songs:', error);
        } finally {
            setLoading(false);
        }
    }, [seed, locale, likes]);

    const fetchSongDetails = useCallback(async (index) => {
        try {
            const params = new URLSearchParams({
                seed: seed.toString(),
                locale,
                likes: likes.toString(),
            });

            const response = await fetch(`/api/songs/${index}?${params}`);
            const data = await response.json();
            setExpandedSong(data);
        } catch (error) {
            console.error('Error fetching song details:', error);
        }
    }, [seed, locale, likes]);

    useEffect(() => {
        fetchSongs(1);
    }, []);
    useEffect(() => {
        setPage(1);
        setExpandedIndex(null);
        setExpandedSong(null);
        fetchSongs(1);
    }, [seed, locale, likes]);

    const handleRowClick = (index) => {
        if (expandedIndex === index) {
            setExpandedIndex(null);
            setExpandedSong(null);
        } else {
            setExpandedIndex(index);
            fetchSongDetails(index);
        }
    };

    const handlePageChange = (newPage) => {
        setExpandedIndex(null);
        setExpandedSong(null);
        fetchSongs(newPage);
    };

    const handleLoadMore = () => {
        if (!loading) {
            fetchSongs(page + 1, true);
        }
    };

    const handleSeed = () => {
        setSeed(Math.floor(Math.random() * 100000000));
    };

    return (
        <div className="min-h-screen bg-background text-foreground">
            <div className="container mx-auto px-4 py-6 max-w-6xl">
                <ControlToolbar
                    locale={locale}
                    onLocaleChange={setLocale}
                    seed={seed}
                    onSeedChange={setSeed}
                    onRandomSeed={handleSeed}
                    likes={likes}
                    onLikesChange={setLikes}
                    viewMode={viewMode}
                    onViewModeChange={setViewMode}
                />

                {viewMode === 'table' ? (
                    <SongTable
                        songs={songs}
                        loading={loading}
                        page={page}
                        perPage={perPage}
                        onPageChange={handlePageChange}
                        expandedIndex={expandedIndex}
                        expandedSong={expandedSong}
                        onRowClick={handleRowClick}
                    />
                ) : (
                    <SongGallery
                        songs={songs}
                        loading={loading}
                        onLoadMore={handleLoadMore}
                        expandedIndex={expandedIndex}
                        expandedSong={expandedSong}
                        onCardClick={handleRowClick}
                    />
                )}
            </div>
        </div>
    );
}
