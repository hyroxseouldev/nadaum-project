'use client';

import { useState, useEffect } from 'react';
import { getCafes } from '@/lib/actions';

export default function UploadTestPage() {
  const [loading, setLoading] = useState(true);
  const [cafes, setCafes] = useState([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCafes = async () => {
      try {
        console.log('Starting to load cafes...');
        const cafeList = await getCafes();
        console.log('Cafes loaded successfully:', cafeList);
        setCafes(cafeList);
      } catch (err) {
        console.error('Error loading cafes:', err);
        setError(err instanceof Error ? err.message : 'Error loading cafes');
      } finally {
        setLoading(false);
      }
    };

    loadCafes();
  }, []);

  if (loading) {
    return <div>Loading cafes...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Upload Test Page</h1>
      <p>Found {cafes.length} cafes:</p>
      <ul>
        {cafes.map((cafe: any) => (
          <li key={cafe.id}>
            {cafe.name} - Value: {cafe.value} - Address: {cafe.address}
          </li>
        ))}
      </ul>
    </div>
  );
}