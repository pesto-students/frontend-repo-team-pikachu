'use client';

import type { ITourItem } from 'src/types/tour';

import { useState, useEffect } from 'react';

import axios, { endpoints } from 'src/utils/axios';

import { ItineraryEditView } from 'src/sections/itinerary/view';

type Props = {
  id: string;
};

export default function ItineraryEditClient({ id }: Props) {
  const [currentTour, setCurrentTour] = useState({} as ITourItem);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTourData = async () => {
      try {
        const response = await axios.get(endpoints.tour.get(id));
        const { data } = response.data;
        setCurrentTour(data);
      } catch (responseError) {
        console.error('Error fetching tour data:', responseError);
        setError('Failed to fetch tour data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTourData();
  }, [id]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return <ItineraryEditView tour={currentTour} />;
}
