import React, { useState, useRef, useEffect } from 'react';
import * as Tone from 'tone';
import seedrandom from 'seedrandom';
import { Play, Pause, Volume2, VolumeX, Repeat } from 'lucide-react';
import { Button } from './ui/button';
import { Slider } from './ui/slider';

const SCALES = {
    major: [0, 2, 4, 5, 7, 9, 11],
    minor: [0, 2, 3, 5, 7, 8, 10],
    pentatonic: [0, 2, 4, 7, 9],
    blues: [0, 3, 5, 6, 7, 10],
};

const BASE_NOTES = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

export default function AudioPlayer({ audioSeed, title }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [volume, setVolume] = useState(0.7);
    const [muted, setMuted] = useState(false);
    const [repeat, setRepeat] = useState(true);
    const [duration] = useState(30);

    const synthRef = useRef(null);
    const seqRef = useRef(null);
    const intvlRef = useRef(null);
    const startRef = useRef(null);
    const repeatRef = useRef(repeat);

    useEffect(() => {
        repeatRef.current = repeat;
        if (seqRef.current) {
            seqRef.current.loop = repeat;
        }
    }, [repeat]);

    const generateMelody = (seed, targetDuration) => {
        const rng = seedrandom(seed.toString());
        const scaleNames = Object.keys(SCALES);
        const scale = SCALES[scaleNames[Math.floor(rng() * scaleNames.length)]];
        const baseOctave = 3 + Math.floor(rng() * 2);

        const melody = [];
        const nds = [0.2, 0.25, 0.3, 0.4, 0.5];

        let prevIdx = Math.floor(rng() * scale.length);
        let currTime = 0;

        while (currTime < targetDuration) {
            const jump = Math.floor(rng() * 5) - 2; // -2 to +2
            prevIdx = Math.max(0, Math.min(scale.length - 1, prevIdx + jump));

            const semitone = scale[prevIdx];
            const octave = baseOctave + Math.floor(semitone / 12);
            const idx = semitone % 12;

            const noteMap = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
            const note = noteMap[idx] + octave;

            const durations = ['8n', '4n', '16n'];
            const dur = durations[Math.floor(rng() * durations.length)];

            melody.push({ note, duration: dur, time: currTime });

            currTime += nds[Math.floor(rng() * nds.length)];
        }

        return melody;
    };
    const initAudio = async () => {
        if (synthRef.current) return;

        await Tone.start();

        const reverb = new Tone.Reverb({ decay: 2, wet: 0.3 }).toDestination();
        synthRef.current = new Tone.PolySynth(Tone.Synth, {
            oscillator: { type: 'sine' },
            envelope: {
                attack: 0.05,
                decay: 0.2,
                sustain: 0.3,
                release: 0.8,
            },
        }).connect(reverb);

        synthRef.current.volume.value = muted ? -Infinity : Tone.gainToDb(volume);

        const melody = generateMelody(audioSeed, duration);

        seqRef.current = new Tone.Part((time, note) => {
            synthRef.current.triggerAttackRelease(note.note, note.duration, time);
        }, melody.map(n => [n.time, n]));

        seqRef.current.loop = repeat;
        seqRef.current.loopEnd = duration;
        seqRef.current.start(0);
    };

    const startPlayback = async () => {
        try {
            await initAudio();

            Tone.Transport.start();
            setIsPlaying(true);


            if (intvlRef.current) clearInterval(intvlRef.current);

            intvlRef.current = setInterval(() => {
                const currentTime = Tone.Transport.seconds;

                if (!repeatRef.current && currentTime >= duration) {
                    stopPlayback();
                } else {
                    setProgress((currentTime % duration) / duration * 100);
                    setProgress((currentTime % duration) / duration * 100);
                }
            }, 100);

        } catch (error) {
            console.error('Error starting playback:', error);
        }
    };

    const pausePlayback = () => {
        Tone.Transport.pause();
        setIsPlaying(false);
        if (intvlRef.current) {
            clearInterval(intvlRef.current);
            intvlRef.current = null;
        }
    };

    const stopPlayback = () => {
        pausePlayback();
        Tone.Transport.stop();
        Tone.Transport.seconds = 0;
        setProgress(0);

        if (seqRef.current) {
            seqRef.current.dispose();
            seqRef.current = null;
        }

        if (synthRef.current) {
            synthRef.current.dispose();
            synthRef.current = null;
        }
    };

    const togglePlayback = () => {
        if (isPlaying) {
            pausePlayback();
        } else {
            startPlayback();
        }
    };

    useEffect(() => {
        return () => {
            stopPlayback();
        };
    }, [audioSeed]);

    const handleVolumeChange = (value) => {
        setVolume(value[0]);
        if (synthRef.current) {
            synthRef.current.volume.value = muted ? -Infinity : Tone.gainToDb(value[0]);
        }
    };

    const toggleMute = () => {
        setMuted(!muted);
        if (synthRef.current) {
            synthRef.current.volume.value = !muted ? -Infinity : Tone.gainToDb(volume);
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleSeek = (value) => {
        const percentage = value[0];
        const newTime = (percentage / 100) * duration;
        setProgress(percentage);

        if (isPlaying) {
            startRef.current = Date.now() - (newTime * 1000);
            Tone.Transport.seconds = newTime;
        }
    };

    const currentTime = (progress / 100) * duration;

    return (
        <div className="flex items-center gap-3 w-full">
            <Button
                variant="default"
                size="icon"
                className="h-10 w-10 rounded-full flex-shrink-0"
                onClick={togglePlayback}
            >
                {isPlaying ? (
                    <Pause className="h-5 w-5" />
                ) : (
                    <Play className="h-5 w-5 ml-0.5" />
                )}
            </Button>

            <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 flex-shrink-0"
                onClick={toggleMute}
            >
                {muted ? (
                    <VolumeX className="h-4 w-4" />
                ) : (
                    <Volume2 className="h-4 w-4" />
                )}
            </Button>

            <Button
                variant="ghost"
                size="icon"
                className={`h-8 w-8 flex-shrink-0 ${repeat ? 'text-primary' : 'text-muted-foreground'}`}
                onClick={() => setRepeat(!repeat)}
                title={repeat ? 'Repeat On' : 'Repeat Off'}
            >
                <Repeat className="h-4 w-4" />
            </Button>

            <div className="flex-1 flex items-center gap-2">
                <Slider
                    value={[progress]}
                    onValueChange={handleSeek}
                    max={100}
                    step={0.1}
                    className="flex-1 cursor-pointer"
                />
                <span className="text-xs text-muted-foreground font-mono w-12 text-right">
                    {formatTime(currentTime)}
                </span>
            </div>
        </div>
    );
}
