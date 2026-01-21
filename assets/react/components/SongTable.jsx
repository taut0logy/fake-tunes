import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import SongDetails from './SongDetails';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from './ui/pagination';

export default function SongTable({
    songs,
    loading,
    page,
    perPage,
    onPageChange,
    expandedIndex,
    expandedSong,
    onRowClick,
}) {
    const getRange = () => {
        const range = [];
        const start = Math.max(1, page - 2);
        const end = Math.min(page + 2, start + 4);

        for (let i = start; i <= end; i++) {
            range.push(i);
        }
        return range;
    };

    return (
        <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
            <div className="grid grid-cols-[50px_1fr_1fr_1fr_120px] gap-4 px-4 py-3 bg-muted/50 border-b border-border font-medium text-sm text-muted-foreground">
                <div className="text-center">#</div>
                <div>Song</div>
                <div>Artist</div>
                <div>Album</div>
                <div>Genre</div>
            </div>

            <div className="divide-y divide-border">
                {loading && songs.length === 0 ? (
                    <div className="px-4 py-8 text-center text-muted-foreground">
                        Loading songs...
                    </div>
                ) : songs.length === 0 ? (
                    <div className="px-4 py-8 text-center text-muted-foreground">
                        No songs found
                    </div>
                ) : (
                    songs.map((song) => (
                        <React.Fragment key={song.index}>
                            <div
                                className={`grid grid-cols-[50px_1fr_1fr_1fr_120px] gap-4 px-4 py-3 hover:bg-muted/30 cursor-pointer transition-colors ${expandedIndex === song.index ? 'bg-muted/50' : ''
                                    }`}
                                onClick={() => onRowClick(song.index)}
                            >
                                <div className="flex items-center justify-center gap-1 text-muted-foreground">
                                    {expandedIndex === song.index ? (
                                        <ChevronUp className="h-4 w-4" />
                                    ) : (
                                        <ChevronDown className="h-4 w-4" />
                                    )}
                                    <span className="font-medium">{song.index}</span>
                                </div>
                                <div className="font-medium truncate">{song.title}</div>
                                <div className="text-muted-foreground truncate">{song.artist}</div>
                                <div className={`truncate ${song.album === 'Single' ? 'text-muted-foreground italic' : ''}`}>
                                    {song.album}
                                </div>
                                <div className="text-muted-foreground truncate">{song.genre}</div>
                            </div>

                            {expandedIndex === song.index && (
                                <div className="bg-muted/20 border-t border-border">
                                    <SongDetails
                                        song={expandedSong || song}
                                        loading={!expandedSong}
                                    />
                                </div>
                            )}
                        </React.Fragment>
                    ))
                )}
            </div>

            <div className="px-4 py-3 border-t border-border flex justify-center">
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                onClick={() => page > 1 && onPageChange(page - 1)}
                                className={page <= 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                            />
                        </PaginationItem>

                        {getRange().map((pageNum) => (
                            <PaginationItem key={pageNum}>
                                <PaginationLink
                                    onClick={() => onPageChange(pageNum)}
                                    isActive={pageNum === page}
                                    className="cursor-pointer"
                                >
                                    {pageNum}
                                </PaginationLink>
                            </PaginationItem>
                        ))}

                        <PaginationItem>
                            <PaginationNext
                                onClick={() => onPageChange(page + 1)}
                                className="cursor-pointer"
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </div>
    );
}
