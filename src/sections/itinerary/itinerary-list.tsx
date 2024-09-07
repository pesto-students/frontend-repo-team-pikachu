import type { ITourItem } from 'src/types/tour';

import React, { useMemo, useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Pagination, { paginationClasses } from '@mui/material/Pagination';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import axios, { endpoints } from 'src/utils/axios';

import { toast } from 'src/components/snackbar';

import { ItineraryItem } from './itinerary-item';

// ----------------------------------------------------------------------

type Props = {
  tours: ITourItem[];
  onUpdateTours: (updatedTours: ITourItem[]) => void;
};

const ITEMS_PER_PAGE = 9;

export function ItineraryList({ tours, onUpdateTours }: Props) {
  const router = useRouter();
  const [page, setPage] = useState(1);

  const handleView = useCallback(
    (id: string) => {
      router.push(paths.app.tourPlan.details(id));
    },
    [router]
  );

  const handleEdit = useCallback(
    (id: string) => {
      router.push(paths.app.tourPlan.edit(id));
    },
    [router]
  );

  const handleDelete = useCallback(
    async (id: string, title: string) => {
      try {
        await axios.delete(endpoints.tour.delete(id));
        toast.success(`Deleted ${title}.`);

        // Update local state immediately
        const updatedTours = tours.filter((tour) => tour.id !== id);
        onUpdateTours(updatedTours);
      } catch (error) {
        console.error(error);
        toast.error('Failed to delete tour');
      }
    },
    [tours, onUpdateTours]
  );

  const handleChangePage = (event: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage);
  };

  const paginatedTours = useMemo(() => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    return tours.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [tours, page]);

  const pageCount = Math.ceil(tours.length / ITEMS_PER_PAGE);

  return (
    <>
      <Box
        gap={3}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
        }}
      >
        {paginatedTours.map((tour) => (
          <ItineraryItem
            key={tour.id}
            tour={tour}
            onView={() => handleView(tour.id)}
            onEdit={() => handleEdit(tour.id)}
            onDelete={() => handleDelete(tour.id, tour.name)}
          />
        ))}
      </Box>

      {pageCount > 1 && (
        <Pagination
          count={pageCount}
          page={page}
          onChange={handleChangePage}
          sx={{
            mt: { xs: 5, md: 8 },
            [`& .${paginationClasses.ul}`]: { justifyContent: 'center' },
          }}
        />
      )}
    </>
  );
}
