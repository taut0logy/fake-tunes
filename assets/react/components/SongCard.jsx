import React from 'react';
import { ThumbsUp, Music, Disc3 } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import SongDetails from './SongDetails';

export default function SongCard({ song, isExpanded, expandedSong, onClick }) {
    return (
        <Sheet open={isExpanded} onOpenChange={(open) => !open && onClick()}>
            <SheetTrigger asChild>
                <div
                    className="group relative bg-card rounded-lg border border-border overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer"
                    onClick={onClick}
                >
                    <div className="aspect-square relative overflow-hidden">
                        <img
                            src={song.coverUrl}
                            alt={`${song.title} cover`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                        />

                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Music className="h-10 w-10 text-white" />
                        </div>
                        <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-medium shadow">
                            <span>{song.likes}</span>
                            <ThumbsUp className="h-3 w-3" />
                        </div>

                        <div className="absolute top-2 right-2 bg-black/60 text-white px-2 py-0.5 rounded text-xs font-mono">
                            #{song.index}
                        </div>
                    </div>
                    <div className="p-3">
                        <h3 className="font-medium text-sm truncate" title={song.title}>
                            {song.title}
                        </h3>
                        <p className="text-xs text-muted-foreground truncate" title={song.artist}>
                            {song.artist}
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                            {song.album !== 'Single' && <Disc3 className="h-3 w-3 text-muted-foreground/70" />}
                            <span className="text-xs text-muted-foreground/70 truncate">
                                {song.album}
                            </span>
                        </div>
                    </div>
                </div>
            </SheetTrigger>

            <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
                <SheetHeader>
                    <SheetTitle>{song.title}</SheetTitle>
                </SheetHeader>
                <div className="mt-4">
                    <SongDetails song={expandedSong || song} loading={!expandedSong} />
                </div>
            </SheetContent>
        </Sheet>
    );
}
