"use client";
import { useVlc } from '@/hooks/useVlc';
import { 
    Play, Pause, Square, FastForward, Rewind, Monitor, Info, ChevronLeft,
    Volume2, VolumeX, Maximize, Settings, Gauge 
} from 'lucide-react';
import { useState, useRef } from 'react';

interface Movie {
    title: string;
    description: string;
    poster_path?: string;
}

interface VlcRemoteProps {
    movie: Movie | null;
    onBack?: () => void;
}

export default function VlcRemote({ movie, onBack }: VlcRemoteProps) {
    const { 
        isConnected, playing: isPlaying, time, length, volume, rate, 
        togglePlay, seek, stop, setVolume, setRate, 
        toggleFullscreen, cycleAudio, cycleSubs, meta 
    } = useVlc();
    const [showDebug, setShowDebug] = useState(false);

    // Timeline Hover States
    const [hoverTime, setHoverTime] = useState<string | null>(null);
    const [hoverPos, setHoverPos] = useState<number>(0);
    const progressBarRef = useRef<HTMLDivElement>(null);

    const formatTime = (s: number) => {
        if (!s || isNaN(s)) return "00:00:00";
        return new Date(s * 1000).toISOString().substr(11, 8);
    };

    const getProgress = () => {
        if (!length || length === 0) return 0;
        return (time / length) * 100;
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVal = e.target.value;
        const seekTime = (parseInt(newVal) / 100) * length;
        seek(`${Math.floor(seekTime)}`);
    };

    // Calculate time based on mouse position
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!progressBarRef.current || length === 0) return;

        const rect = progressBarRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left; // X position within the element.
        const width = rect.width;

        // Calculate percentage (0 to 1)
        const percent = Math.max(0, Math.min(1, x / width));

        setHoverPos(percent * 100);
        setHoverTime(formatTime(percent * length));
    };

    const handleMouseLeave = () => {
        setHoverTime(null);
    };

    // --- STATE: NO MOVIE SELECTED ---
    if (!movie) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center bg-[#0a0a0a] border-l border-white/5 text-gray-500 min-h-[50vh]">
                <div className="p-6 md:p-8 rounded-full bg-white/5 mb-4 animate-in zoom-in-50 duration-500">
                    <Monitor size={48} className="opacity-50" />
                </div>
                <p className="text-lg font-medium">Select a movie to launch VLC</p>
            </div>
        );
    }

    // --- STATE: CONNECTING TO VLC ---
    if (!isConnected) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center bg-[#0a0a0a] border-l border-white/5 text-white min-h-[50vh]">
                <div className="relative">
                    <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full animate-pulse" />
                    <Monitor className="w-16 h-16 mb-4 text-blue-500 relative z-10 animate-bounce" />
                </div>
                <h2 className="text-xl font-bold mt-4 animate-in slide-in-from-bottom-2 fade-in duration-700">Launching VLC...</h2>
                <p className="text-gray-400 mt-2 text-sm animate-in slide-in-from-bottom-3 fade-in duration-1000 delay-150">
                    Establishing secure connection to player...
                </p>
            </div>
        );
    }

    // --- STATE: ACTIVE REMOTE ---
    return (
        <div className="flex-1 h-[calc(100vh-8rem)] relative bg-[#0a0a0a] rounded-2xl overflow-hidden group shadow-2xl border border-white/5 flex flex-col">

            {/* Back Button */}
            {onBack && (
                <button
                    onClick={onBack}
                    className="absolute top-6 left-6 z-50 p-2 bg-black/40 backdrop-blur-md rounded-full border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-all hover:scale-105"
                >
                    <ChevronLeft size={24} />
                </button>
            )}

            {/* 1. Immersive Background Layer */}
            {movie.poster_path && (
                <div className="absolute inset-0 z-0 select-none pointer-events-none">
                    <div
                        className="absolute inset-0 bg-cover bg-center  bg-no-repeat transition-transform duration-[60s] ease-linear group-hover:scale-105 opacity-50 md:opacity-60"
                        style={{ backgroundImage: `url(${movie.poster_path})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/90 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/70 to-transparent" />
                </div>
            )}

            {/* 2. Scrollable Content Area */}
            <div className="relative z-10 flex-1 overflow-y-auto custom-scrollbar p-6 md:p-12 lg:p-16 flex flex-col">

                {/* Spacer to push content to bottom */}
                <div className="flex-1 min-h-[20vh]" />

                {/* Content Wrapper */}
                <div className="w-full max-w-5xl mx-auto space-y-6 md:space-y-8 animate-in slide-in-from-bottom-10 duration-700 fade-in">

                    {/* Meta Section */}
                    <div className="space-y-4 md:space-y-6">
                        {/* Status Badge */}
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 shadow-lg">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
                                <span className="text-[10px] uppercase tracking-widest text-green-400 font-bold">Live VLC</span>
                            </div>
                        </div>

                        {/* Title - Responsive Sizes */}
                        <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold tracking-tight text-white drop-shadow-2xl leading-none">
                            {movie.title}
                        </h1>

                        {/* Description - Clamped Text */}
                        <p className="text-sm md:text-lg lg:text-xl text-gray-300 line-clamp-3 md:line-clamp-4 max-w-2xl drop-shadow-lg font-medium leading-relaxed">
                            {movie.description || "No description available for this title."}
                        </p>
                    </div>

                    {/* Progress Bar Section with Hover Tooltip */}
                    {length > 0 && (
                        <div className="flex flex-col gap-2 max-w-2xl">
                            {/* Time Labels */}
                            <div className="flex items-center justify-between text-xs font-mono text-gray-400 font-medium tracking-wide">
                                <span>{formatTime(time)}</span>
                                <span>{formatTime(length)}</span>
                            </div>

                            {/* Seek Bar Wrapper */}
                            <div
                                className="group/seek relative h-6 flex items-center cursor-pointer"
                                ref={progressBarRef}
                                onMouseMove={handleMouseMove}
                                onMouseLeave={handleMouseLeave}
                            >
                                {/* Tooltip (Only visible on hover) */}
                                {hoverTime && (
                                    <div
                                        className="absolute -top-10 -translate-x-1/2 bg-white text-black text-xs font-bold px-2 py-1 rounded shadow-lg pointer-events-none z-30 whitespace-nowrap"
                                        style={{ left: `${hoverPos}%` }}
                                    >
                                        {hoverTime}
                                        {/* Little triangle arrow */}
                                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-white" />
                                    </div>
                                )}

                                {/* Background Track */}
                                <div className="h-1.5 bg-white/20 rounded-full w-full overflow-hidden backdrop-blur-sm relative">
                                    {/* Filled Track */}
                                    <div
                                        className="absolute inset-y-0 left-0 bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)] transition-all duration-100 ease-linear"
                                        style={{ width: `${getProgress()}%` }}
                                    />

                                    {/* Hover Preview Track (Lighter background where mouse is) */}
                                    {hoverTime && (
                                        <div
                                            className="absolute inset-y-0 left-0 bg-white/10 pointer-events-none"
                                            style={{ width: `${hoverPos}%` }}
                                        />
                                    )}
                                </div>

                                {/* Actual Range Input (Invisible but functional) */}
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={getProgress()}
                                    onChange={handleSeek}
                                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-20"
                                />
                            </div>
                        </div>
                    )}

                    {/* Controls Section */}
                    <div className="flex flex-col gap-6 animate-in slide-in-from-bottom-12 duration-1000 delay-100 fade-in pb-4">
                        
                        {/* Row 1: Main Transport Controls */}
                        <div className="flex flex-wrap items-center gap-4">
                            <button
                                onClick={togglePlay}
                                className="flex-1 sm:flex-none flex items-center justify-center gap-3 bg-white text-black px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold hover:bg-gray-200 transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.15)] group/btn whitespace-nowrap"
                            >
                                {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
                                <span className="text-base md:text-lg">{isPlaying ? "Pause" : "Play"}</span>
                            </button>

                            <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md p-1 rounded-full border border-white/10">
                                <button onClick={() => seek('-15')} className="p-3 rounded-full hover:bg-white/10 text-white transition-all active:scale-95">
                                    <Rewind size={20} />
                                </button>
                                <div className="w-px h-6 bg-white/10" />
                                <button onClick={() => seek('+15')} className="p-3 rounded-full hover:bg-white/10 text-white transition-all active:scale-95">
                                    <FastForward size={20} />
                                </button>
                            </div>

                            {/* Volume Slider */}
                            <div className="hidden md:flex items-center gap-3 bg-black/40 backdrop-blur-md px-4 py-3 rounded-xl border border-white/10 ml-auto">
                                <button onClick={() => setVolume(0)} className="text-gray-400 hover:text-white">
                                    {volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
                                </button>
                                <input 
                                    type="range" min="0" max="320" value={volume} 
                                    onChange={(e) => setVolume(parseInt(e.target.value))}
                                    className="w-24 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
                                />
                            </div>
                        </div>

                        {/* Row 2: Advanced Toggles */}
                        <div className="flex flex-wrap items-center gap-3 justify-between md:justify-start">
                            
                            {/* Playback Speed */}
                            <button onClick={() => setRate(rate === 1 ? 1.5 : rate === 1.5 ? 2 : 1)} className="px-4 py-2 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 text-sm font-medium text-gray-300 flex items-center gap-2 transition-all">
                                <Gauge size={16} />
                                <span>{rate}x</span>
                            </button>

                            {/* Audio Track Cycle */}
                            <button onClick={cycleAudio} className="px-4 py-2 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 text-sm font-medium text-gray-300 flex items-center gap-2 transition-all">
                                <Settings size={16} />
                                <span>Audio</span>
                            </button>
                            
                            {/* Subtitle Cycle */}
                            <button onClick={cycleSubs} className="px-4 py-2 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 text-sm font-medium text-gray-300 flex items-center gap-2 transition-all">
                                <span className="font-bold border border-gray-400 rounded px-1 text-[10px]">CC</span>
                                <span>Subs</span>
                            </button>

                            <div className="flex-1 hidden md:block" />

                            {/* Utility Buttons */}
                            <div className="flex items-center gap-2">
                                <button onClick={toggleFullscreen} className="p-3 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 border border-white/5" title="Toggle Fullscreen">
                                    <Maximize size={18} />
                                </button>
                                <button onClick={() => setShowDebug(!showDebug)} className={`p-3 rounded-lg border transition-all ${showDebug ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' : 'bg-white/5 text-gray-300 border-white/5 hover:bg-white/10'}`}>
                                    <Info size={18} />
                                </button>
                                <button onClick={stop} className="p-3 rounded-lg bg-red-500/10 text-red-200 hover:bg-red-500/20 border border-red-500/10">
                                    <Square size={18} fill="currentColor" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Technical Details Panel (Responsive Grid) */}
                    {showDebug && (
                        <div className="w-full max-w-2xl mt-4 bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 md:p-6 shadow-2xl animate-in fade-in slide-in-from-bottom-4">
                            <h3 className="text-blue-400 font-bold mb-4 text-xs uppercase tracking-wider border-b border-white/5 pb-2">
                                Stream Metadata
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 text-sm font-mono text-xs md:text-sm">
                                <div>
                                    <span className="block text-gray-500 text-[10px] md:text-xs uppercase mb-1">Video</span>
                                    <span className="text-white break-words">
                                        {meta?.category?.["Stream 0"]?._type === "Video"
                                            ? meta?.category?.["Stream 0"]?.Resolution
                                            : (meta?.category?.["Stream 1"]?.Resolution || "Checking...")}
                                    </span>
                                </div>
                                <div>
                                    <span className="block text-gray-500 text-[10px] md:text-xs uppercase mb-1">Audio</span>
                                    <span className="text-white break-words">
                                        {meta?.category?.["Stream 1"]?.Codec || "Checking..."}
                                    </span>
                                </div>
                                <div className="sm:col-span-2">
                                    <span className="block text-gray-500 text-[10px] md:text-xs uppercase mb-1">Source</span>
                                    <div className="p-2 bg-white/5 rounded border border-white/5 text-gray-400 text-[10px] md:text-xs break-all">
                                        {meta?.category?.meta?.filename || "Loading..."}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}