'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useAppState } from '@/context/AppContext';
import TitleBar from '@/components/TitleBar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { isAuthenticated } = useAppState();
    const router = useRouter();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (!isAuthenticated) {
                router.push('/login');
            }
            setIsChecking(false);
        }, 100);

        return () => clearTimeout(timer);
    }, [isAuthenticated, router]);

    if (isChecking && !isAuthenticated) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-[#121212] text-white">
                <div className="flex flex-col items-center gap-2">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                    <p className="text-gray-400 text-sm">Validating session...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return <>  <TitleBar />{children}</>;
}
