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
      // IMPORTANT: Replace this URL with your actual Vercel function URL
      const response = await fetch('https://your-vercel-function-url.vercel.app/api/fetch-historical-orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          webhookStartDate: '2024-01-01T00:00:00Z' // Adjust this date as needed
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