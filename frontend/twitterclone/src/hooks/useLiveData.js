import { useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook for polling live data at regular intervals
 * @param {Function} fetchFunction - The function to call for fetching data
 * @param {number} interval - Polling interval in milliseconds (default: 15000 = 15s)
 * @param {Array} dependencies - Dependencies that should trigger refetch
 * @param {boolean} enabled - Whether polling is enabled (default: true)
 */
const useLiveData = (fetchFunction, interval = 15000, dependencies = [], enabled = true) => {
    const intervalRef = useRef(null);
    const isMountedRef = useRef(true);

    const fetchData = useCallback(async () => {
        if (!isMountedRef.current || !enabled) return;
        try {
            await fetchFunction();
        } catch (error) {
            console.log('Live data fetch error:', error);
        }
    }, [fetchFunction, enabled]);

    useEffect(() => {
        isMountedRef.current = true;
        
        if (!enabled) {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
            return;
        }

        // Initial fetch
        fetchData();

        // Set up polling
        intervalRef.current = setInterval(() => {
            fetchData();
        }, interval);

        return () => {
            isMountedRef.current = false;
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [...dependencies, fetchData, interval, enabled]);

    // Method to manually trigger refresh
    const refresh = useCallback(() => {
        fetchData();
    }, [fetchData]);

    return { refresh };
};

export default useLiveData;
