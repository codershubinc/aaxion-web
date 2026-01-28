import { motion } from 'framer-motion';
import { Folder } from 'lucide-react';

export default function EmptyState() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="h-full flex flex-col items-center justify-center text-dark-muted"
        >
            <Folder size={64} className="mb-4 opacity-50" />
            <p>This folder is empty</p>
        </motion.div>
    );
}
