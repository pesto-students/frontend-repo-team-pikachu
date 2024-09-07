'use client';

import type { TourApiResponse } from 'src/types/tour';

import { useState, useEffect } from 'react';

import axios, { endpoints } from 'src/utils/axios';

import { ItineraryDetailsView } from 'src/sections/itinerary/view';

type Props = {
  id: string;
};

export default function ItineraryDetailsClient({ id }: Props) {
  const [currentTour, setCurrentTour] = useState({} as TourApiResponse['data']);
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

  return <ItineraryDetailsView tour={currentTour} />;
}
