import React from 'react';
import AudioPlayer from './AudioPlayer';
import { ThumbsUp } from 'lucide-react';

export default function SongDetails({ song, loading }) {
    if (loading) {
        return (
            <div className="p-6 flex items-center justify-center">
                <div className="animate-pulse text-muted-foreground">Loading details...</div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex gap-6">
                {/* Cover Art */}
                <div className="flex-shrink-0 relative">
                    <img
                        src={song.coverUrl}
                        alt={`${song.title} cover`}
                        className="w-[160px] h-[160px] rounded-lg shadow-lg object-cover"
                        loading="lazy"
                    />
                    {/* Likes Badge */}
                    <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-primary text-primary-foreground px-2 py-1 rounded-full text-sm font-medium shadow">
                        <span>{song.likes}</span>
                        <ThumbsUp className="h-3.5 w-3.5" />
                    </div>
                </div>

                {/* Song Info */}
                <div className="flex-1 min-w-0">
                    {/* Title and Audio */}
                    <div className="flex items-start gap-4 mb-3">
                        <div className="flex-1">
                            <h2 className="text-2xl font-bold mb-1">{song.title}</h2>
                            <p className="text-muted-foreground">
                                from <span className="font-medium text-foreground">{song.album}</span>
                                {' '}by <span className="font-medium text-foreground">{song.artist}</span>
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                                {song.recordLabel}, {song.year}
                            </p>
                        </div>
                    </div>

                    {/* Audio Player */}
                    <div className="mb-4 max-w-md">
                        <AudioPlayer audioSeed={song.audioSeed} title={song.title} />
                    </div>

                    {/* Lyrics */}
                    {song.lyrics && song.lyrics.length > 0 && (
                        <div className="mt-4">
                            <h3 className="text-sm font-medium text-muted-foreground mb-2">Lyrics</h3>
                            <div className="space-y-1 max-h-[200px] overflow-y-auto">
                                {song.lyrics.map((line, index) => (
                                    <p
                                        key={index}
                                        className={`text-sm ${index % 4 === 2 ? 'italic font-medium' : 'text-muted-foreground'
                                            }`}
                                    >
                                        {line}
                                    </p>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
