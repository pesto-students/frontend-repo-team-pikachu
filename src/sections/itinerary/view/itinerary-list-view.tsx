'use client';

import type { ITourItem, ITourFilters } from 'src/types/tour';

import useSWR from 'swr';
import { useState, useEffect, useCallback } from 'react';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';
import { useSetState } from 'src/hooks/use-set-state';

import { orderBy } from 'src/utils/helper';
import axios, { endpoints } from 'src/utils/axios';
import { fIsAfter, fIsBetween } from 'src/utils/format-time';

import { _tourGuides } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';

import { ItineraryList } from '../itinerary-list';
import { ItinerarySort } from '../itinerary-sort';
import { ItinerarySearch } from '../itinerary-search';
import { ItineraryFilters } from '../itinerary-filters';
import { ItineraryFiltersResult } from '../itinerary-filters-result';

// ----------------------------------------------------------------------

const TOUR_SORT_OPTIONS = [
  { label: 'Latest', value: 'latest' },
  { label: 'Popular', value: 'popular' },
  { label: 'Oldest', value: 'oldest' },
];

const TOUR_SERVICE_OPTIONS = [
  { label: 'Audio guide', value: 'Audio guide' },
  { label: 'Food and drinks', value: 'Food and drinks' },
  { label: 'Lunch', value: 'Lunch' },
  { label: 'Private tour', value: 'Private tour' },
  { label: 'Special activities', value: 'Special activities' },
  { label: 'Entrance fees', value: 'Entrance fees' },
  { label: 'Gratuities', value: 'Gratuities' },
  { label: 'Pick-up and drop off', value: 'Pick-up and drop off' },
  { label: 'Professional guide', value: 'Professional guide' },
  { label: 'Transport by air-conditioned', value: 'Transport by air-conditioned' },
];

export function ItineraryListView() {
  const openFilters = useBoolean();

  const [sortBy, setSortBy] = useState('latest');

  const { data, error, mutate } = useSWR(endpoints.tour.all, async (url) => {
    const response = await axios.get(url);
    const { responseData } = response.data;
    if (response.data.status === 'success') {
      return responseData.map((tour: any) => ({
        id: tour.tourId,
        name: tour.tourData.title,
        destination: tour.tourData.destinations.join(', '),
        duration: tour.tourData.duration,
        createdAt: new Date(tour.tourData.createdAt),
        available: {
          startDate: new Date(tour.tourData.startDate),
          endDate: new Date(tour.tourData.endDate),
        },
        totalViews: 0,
        tourGuides: [],
        services: [],
      }));
    }
    throw new Error(data.message || 'Failed to fetch tours');
  });

  const isLoading = !data && !error;
  const [tours, setTours] = useState<ITourItem[]>([]);

  useEffect(() => {
    if (data) {
      setTours(data);
    }
  }, [data]);

  const handleUpdateTours = useCallback(
    (updatedTours: ITourItem[]) => {
      setTours(updatedTours);
      mutate(updatedTours, false); // Update the cache without revalidating
    },
    [mutate]
  );

  const search = useSetState<{
    query: string;
    results: ITourItem[];
  }>({ query: '', results: [] });

  const filters = useSetState<ITourFilters>({
    destination: [],
    tourGuides: [],
    services: [],
    startDate: null,
    endDate: null,
  });

  const dateError = fIsAfter(filters.state.startDate, filters.state.endDate);

  const dataFiltered = applyFilter({
    inputData: tours,
    filters: filters.state,
    sortBy,
    dateError,
  });

  const canReset =
    filters.state.destination.length > 0 ||
    filters.state.tourGuides.length > 0 ||
    filters.state.services.length > 0 ||
    (!!filters.state.startDate && !!filters.state.endDate);

  const notFound = !dataFiltered.length && canReset;

  const handleSortBy = useCallback((newValue: string) => {
    setSortBy(newValue);
  }, []);

  const handleSearch = useCallback(
    (inputValue: string) => {
      search.setState({ query: inputValue });

      if (inputValue) {
        const results = tours.filter(
          (tour: ITourItem) =>
            tour.name.toLowerCase().indexOf(search.state.query.toLowerCase()) !== -1
        );

        search.setState({ results });
      }
    },
    [search, tours]
  );

  const renderFilters = (
    <Stack
      spacing={3}
      justifyContent="space-between"
      alignItems={{ xs: 'flex-end', sm: 'center' }}
      direction={{ xs: 'column', sm: 'row' }}
    >
      <ItinerarySearch search={search} onSearch={handleSearch} />

      <Stack direction="row" spacing={1} flexShrink={0}>
        <ItineraryFilters
          filters={filters}
          canReset={canReset}
          dateError={dateError}
          open={openFilters.value}
          onOpen={openFilters.onTrue}
          onClose={openFilters.onFalse}
          options={{
            tourGuides: _tourGuides,
            services: TOUR_SERVICE_OPTIONS.map((option) => option.label),
          }}
        />

        <ItinerarySort sort={sortBy} onSort={handleSortBy} sortOptions={TOUR_SORT_OPTIONS} />
      </Stack>
    </Stack>
  );

  const renderResults = (
    <ItineraryFiltersResult filters={filters} totalResults={dataFiltered.length} />
  );

  if (isLoading) {
    return (
      <DashboardContent>
        <Stack alignItems="center" justifyContent="center" sx={{ height: '100vh' }}>
          <CircularProgress />
        </Stack>
      </DashboardContent>
    );
  }

  if (error) {
    return (
      <DashboardContent>
        <Typography color="error" variant="h6" align="center">
          {error}
        </Typography>
      </DashboardContent>
    );
  }

  return (
    <DashboardContent>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: { xs: 3, md: 5 } }}
      >
        <Typography variant="h4">Itinerary</Typography>
        <Button
          variant="contained"
          startIcon={<Iconify icon="mingcute:add-line" />}
          href={paths.app.tourPlan.new}
        >
          New Tour Plan
        </Button>
      </Stack>

      <Stack spacing={2.5} sx={{ mb: { xs: 3, md: 5 } }}>
        {renderFilters}

        {canReset && renderResults}
      </Stack>

      {notFound && <EmptyContent filled sx={{ py: 10 }} />}

      <ItineraryList tours={dataFiltered} onUpdateTours={handleUpdateTours} />
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------

type ApplyFilterProps = {
  sortBy: string;
  dateError: boolean;
  filters: ITourFilters;
  inputData: ITourItem[];
};

const applyFilter = ({ inputData, filters, sortBy, dateError }: ApplyFilterProps) => {
  const { services, destination, startDate, endDate, tourGuides } = filters;

  const tourGuideIds = tourGuides.map((tourGuide) => tourGuide.id);

  // Sort by
  if (sortBy === 'latest') {
    inputData = orderBy(inputData, ['createdAt'], ['desc']);
  }

  if (sortBy === 'oldest') {
    inputData = orderBy(inputData, ['createdAt'], ['asc']);
  }

  if (sortBy === 'popular') {
    inputData = orderBy(inputData, ['totalViews'], ['desc']);
  }

  // Filters
  if (destination.length) {
    inputData = inputData.filter((tour) => destination.includes(tour.destination));
  }

  if (tourGuideIds.length) {
    inputData = inputData.filter((tour) =>
      tour.tourGuides.some((filterItem) => tourGuideIds.includes(filterItem.id))
    );
  }

  if (services.length) {
    inputData = inputData.filter((tour) => tour.services.some((item) => services.includes(item)));
  }

  if (!dateError) {
    if (startDate && endDate) {
      inputData = inputData.filter((tour) =>
        fIsBetween(startDate, tour.available.startDate, tour.available.endDate)
      );
    }
  }

  return inputData;
};
