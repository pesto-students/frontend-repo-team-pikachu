'use client';

import type { ITourItem } from 'src/types/tour';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { ItineraryNewEditForm } from '../itinerary-new-edit-form';

// ----------------------------------------------------------------------

type Props = {
  tour?: ITourItem;
};

export function ItineraryEditView({ tour }: Props) {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit"
        links={[
          { name: 'Home', href: paths.app.root },
          { name: 'Tour', href: paths.app.tourPlan.home },
          { name: tour?.name },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <ItineraryNewEditForm currentTour={tour} />
    </DashboardContent>
  );
}
