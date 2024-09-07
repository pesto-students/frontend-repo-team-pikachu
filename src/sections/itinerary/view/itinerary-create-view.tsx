'use client';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { ItineraryNewEditForm } from '../itinerary-new-edit-form';

// ----------------------------------------------------------------------

export function ItineraryCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Create a new tour"
        links={[
          { name: 'Dashboard', href: paths.app.root },
          { name: 'Tour', href: paths.app.tourPlan.home },
          { name: 'New tour' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <ItineraryNewEditForm />
    </DashboardContent>
  );
}
