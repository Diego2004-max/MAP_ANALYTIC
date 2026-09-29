/**
 * @file useReports.js
 * @description Custom hook for fetching and managing territorial anomaly states.
 */
import { useState, useEffect, useCallback } from 'react';

export const useReports = () => {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReports = useCallback(async () => {
    setIsLoading(true);
    try {
      // Endpoint connection simulation (Replace with fetch('http://localhost:5000/api/v1/reports'))
      await new Promise(resolve => setTimeout(resolve, 600));
      const mockData = [
        { id: 1, category: 'INFRASTRUCTURE', severity: 'CRITICAL', description: 'Major structural bridge fissure reported.', status: 'PENDING', location: 'South Highway' },
        { id: 2, category: 'ENVIRONMENTAL', severity: 'MEDIUM', description: 'Unauthorized chemical runoff near water reserve.', status: 'RESOLVED', location: 'Industrial Zone' },
        { id: 3, category: 'SECURITY', severity: 'HIGH', description: 'Dark sector due to multiple non-functional streetlights.', status: 'PENDING', location: 'Downtown Block 3' }
      ];
      setReports(mockData);
      setError(null);
    } catch (err) {
      setError('Unable to fetch spatial anomaly data from server.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  return { reports, isLoading, error, refetch: fetchReports };
};