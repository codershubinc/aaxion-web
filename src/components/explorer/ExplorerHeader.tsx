import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Home, ChevronRight, Grid, List } from 'lucide-react';

interface ExplorerHeaderProps {
    pathParts: string[];
    viewMode: 'grid' | 'list';
    setViewMode: (mode: 'grid' | 'list') => void;
    goBack: () => void;
    goForward: () => void;
    canGoBack: boolean;
    canGoForward: boolean;
    navigateToPath: (index: number) => void;
    rootPath: string;
    onPathChange: (path: string) => void;
}

export default function ExplorerHeader({
    pathParts,
    viewMode,
    setViewMode,
    goBack,
    goForward,
    canGoBack,
    canGoForward,
    navigateToPath,
    rootPath,
    onPathChange
}: ExplorerHeaderProps) {
    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-3 sm:px-6 py-3 sm:py-4 border-b border-dark-border gap-2 sm:gap-0">
            <div className="flex items-center space-x-2 text-xs sm:text-sm overflow-x-auto scrollbar-hide max-w-full">
                {/* Navigation Buttons */}
                <div className="flex items-center space-x-1 mr-2 flex-shrink-0">
                    <motion.button
                        whileHover={{ scale: canGoBack ? 1.05 : 1 }}
                        whileTap={{ scale: canGoBack ? 0.95 : 1 }}
                        onClick={goBack}
                        disabled={!canGoBack}
                        className={`p-1.5 sm:p-2 rounded-lg transition-colors ${canGoBack
                            ? 'hover:bg-dark-hover text-dark-text'
                            : 'text-dark-muted cursor-not-allowed opacity-50'
                            }`}
                        title="Go back"
                    >
                        <ArrowLeft size={16} className="sm:w-[18px] sm:h-[18px]" />
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: canGoForward ? 1.05 : 1 }}
                        whileTap={{ scale: canGoForward ? 0.95 : 1 }}
                        onClick={goForward}
                        disabled={!canGoForward}
                        className={`p-1.5 sm:p-2 rounded-lg transition-colors ${canGoForward
                            ? 'hover:bg-dark-hover text-dark-text'
                            : 'text-dark-muted cursor-not-allowed opacity-50'
                            }`}
                        title="Go forward"
                    >
                        <ArrowRight size={16} className="sm:w-[18px] sm:h-[18px]" />
                    </motion.button>
                </div>
                {/* Home Button */}
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => rootPath && onPathChange(rootPath)}
                    className="flex items-center space-x-1 px-2 py-1 rounded-lg text-dark-text hover:text-accent-blue hover:bg-dark-hover transition-colors flex-shrink-0"
                    title="Go to home"
                >
                    <Home size={14} className="sm:w-4 sm:h-4" />
                    <span className="font-medium text-xs sm:text-sm">Home</span>
                </motion.button>

                {pathParts.length > 0 && <ChevronRight size={14} className="sm:w-4 sm:h-4 text-dark-muted flex-shrink-0" />}

                {pathParts.map((part, index) => (
                    <div key={index} className="flex items-center space-x-2 flex-shrink-0">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            onClick={() => navigateToPath(index)}
                            className="text-dark-text hover:text-accent-blue transition-colors text-xs sm:text-sm truncate max-w-[120px] sm:max-w-none">
                            {part}
                        </motion.button>
                        {index < pathParts.length - 1 && (
                            <ChevronRight size={14} className="sm:w-4 sm:h-4 text-dark-muted" />
                        )}
                    </div>
                ))}
            </div>

            <div className="flex items-center space-x-1 sm:space-x-2">
                <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 sm:p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-accent-blue text-white' : 'bg-dark-hover text-dark-text'}`}
                    title="Grid view"
                >
                    <Grid size={16} className="sm:w-[18px] sm:h-[18px]" />
                </button>

                <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 sm:p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-accent-blue text-white' : 'bg-dark-hover text-dark-text'}`}
                    title="List view"
                >
                    <List size={16} className="sm:w-[18px] sm:h-[18px]" />
                </button>
            </div>
        </div>
    );
}
