import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Shuffle, LayoutGrid, List } from 'lucide-react';

export default function ControlToolbar({
    locale,
    onLocaleChange,
    seed,
    onSeedChange,
    onRandomSeed,
    likes,
    onLikesChange,
    viewMode,
    onViewModeChange,
}) {
    const handleSeedInputChange = (e) => {
        const value = e.target.value.replace(/\D/g, '');
        onSeedChange(value ? parseInt(value, 10) : 0);
    };

    return (
        <div className="flex flex-wrap items-center gap-4 p-4 mb-6 bg-card/80 backdrop-blur-md rounded-lg border border-border shadow-sm sticky top-4 z-50">
            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-muted-foreground">Language</label>
                <Select value={locale} onValueChange={onLocaleChange}>
                    <SelectTrigger className="w-[150px]">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="en">English (US)</SelectItem>
                        <SelectItem value="de">Deutsch (DE)</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-muted-foreground">Seed</label>
                <div className="flex items-center gap-2">
                    <Input
                        type="text"
                        value={seed}
                        onChange={handleSeedInputChange}
                        className="w-[140px] font-mono"
                        placeholder="Enter seed..."
                    />
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={onRandomSeed}
                        title="Generate random seed"
                    >
                        <Shuffle className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div className="flex flex-col gap-1.5 flex-1 min-w-[200px] max-w-[300px]">
                <div className="flex justify-between">
                    <label className="text-xs font-medium text-muted-foreground">Likes</label>
                    <span className="text-xs font-mono text-muted-foreground">{likes.toFixed(1)}</span>
                </div>
                <Slider
                    value={[likes]}
                    onValueChange={(value) => onLikesChange(value[0])}
                    min={0}
                    max={10}
                    step={0.1}
                    className="w-full"
                />
            </div>

            <div className="flex flex-col gap-1.5 ml-auto">
                <label className="text-xs font-medium text-muted-foreground">View</label>
                <div className="flex rounded-md border border-border overflow-hidden">
                    <Button
                        variant={viewMode === 'table' ? 'default' : 'ghost'}
                        size="icon"
                        className="rounded-none"
                        onClick={() => onViewModeChange('table')}
                        title="Table View"
                    >
                        <List className="h-4 w-4" />
                    </Button>
                    <Button
                        variant={viewMode === 'gallery' ? 'default' : 'ghost'}
                        size="icon"
                        className="rounded-none"
                        onClick={() => onViewModeChange('gallery')}
                        title="Gallery View"
                    >
                        <LayoutGrid className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
