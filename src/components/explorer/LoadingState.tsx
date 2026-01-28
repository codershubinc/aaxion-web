import { motion } from 'framer-motion';

export default function LoadingState() {
    return (
        <div className="h-full flex items-center justify-center">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-12 h-12 border-4 border-accent-blue border-t-transparent rounded-full"
            />
        </div>
    );
}
