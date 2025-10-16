import React, { useState, useEffect } from 'react';

/**
 * Live indicator component - shows a pulsing dot when data is being updated
 */
const LiveIndicator = ({ isUpdating = false, showLabel = true }) => {
    const [pulse, setPulse] = useState(false);

    useEffect(() => {
        if (isUpdating) {
            setPulse(true);
            const timer = setTimeout(() => setPulse(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [isUpdating]);

    return (
        <div className='flex items-center gap-2 text-xs text-gray-500'>
            <div className='relative flex items-center'>
                <span className={`block h-2 w-2 rounded-full ${pulse ? 'bg-green-500 animate-pulse' : 'bg-green-500'}`}></span>
                {pulse && (
                    <span className='absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping'></span>
                )}
            </div>
            {showLabel && <span className='font-medium'>Live</span>}
        </div>
    );
};

export default LiveIndicator;
