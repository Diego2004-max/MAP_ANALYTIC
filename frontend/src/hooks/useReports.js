/**
 * @file useReports.js
 * @description Custom hook for fetching real data from the Express backend API.
 */
import { useState, useEffect, useCallback } from 'react';

const API_BASE_URL = 'http://localhost:5000/api/v1';

export const useReports = () => {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReports = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/reports`);
      if (!response.ok) {
        throw new Error('Failed to fetch reports from server.');
      }
      const result = await response.json();
      // Map backend fields to frontend interface if needed
      setReports(result.data || []);
      setError(null);
    } catch (err) {
      setError('Unable to connect to Map Analytic backend server.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createReport = async (reportData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/reports`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reportData),
      });
      if (!response.ok) throw new Error('Failed to submit report.');
      await fetchReports(); // Refresh list after creation
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  return { reports, isLoading, error, refetch: fetchReports, createReport };
};