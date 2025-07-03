// React hook for fetching historical orders
import { useState } from 'react';

export const useHistoricalOrders = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const fetchHistoricalOrders = async (email) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // CORRECTED: Remove .js extension from URL
      const response = await fetch('https://simplyonline-webhook-handler-projec.vercel.app/api/fetch-historical-orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          webhookStartDate: '2023-01-01T00:00:00Z'
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch historical orders');
      }

      setSuccess(true);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    fetchHistoricalOrders,
    loading,
    error,
    success
  };
};