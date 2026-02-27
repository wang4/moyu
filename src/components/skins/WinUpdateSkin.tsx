import React, { useState, useEffect } from 'react';

// A fake Windows 10/11 Update Screen
export const WinUpdateSkin: React.FC = () => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // Very slow progression to look real
        const interval = setInterval(() => {
            setProgress(p => {
                if (p >= 100) return 100;
                // Random jump between 0 and 2
                return p + Math.floor(Math.random() * 3);
            });
        }, 4500);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fixed inset-0 bg-[#0078D7] flex flex-col items-center justify-center text-white font-sans cursor-none select-none z-[9999]">
            <div className="flex flex-col items-center -mt-24">
                {/* Simple CSS Spinner */}
                <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mb-8"></div>

                <h1 className="text-3xl font-light tracking-wide mb-4">Configuring updates</h1>

                <div className="text-xl font-light tracking-wide mb-2 text-center">
                    {progress}% complete<br />
                    Don't turn off your computer.
                </div>
            </div>
        </div>
    );
};
