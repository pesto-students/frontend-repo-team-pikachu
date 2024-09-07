'use client';

import type { TourApiResponse } from 'src/types/tour';

import { useCallback } from 'react';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

import { paths } from 'src/routes/paths';

import { useTabs } from 'src/hooks/use-tabs';

import { DashboardContent } from 'src/layouts/dashboard';

import { ItineraryPreview } from 'src/sections/itinerary/itinerary-preview';

// import { TourDetailsContent } from '../tour-details-content';
// import { TourDetailsBookers } from '../tour-details-bookers';

import { ItineraryDetailsToolbar } from '../itinerary-details-toolbar';

// ----------------------------------------------------------------------

const TOUR_DETAILS_TABS = [
  { label: 'Tour Plan', value: 'content' },
  // { label: 'Booker', value: 'bookers' },
];

export const TOUR_PUBLISH_OPTIONS = [
  { label: 'Published', value: 'published' },
  { label: 'Draft', value: 'draft' },
];

type Props = {
  tour?: TourApiResponse['data'];
};

export function ItineraryDetailsView({ tour }: Props) {
  const tabs = useTabs('content');

  const handleChangePublish = useCallback((newValue: string) => {}, []);

  const renderTabs = (
    <Tabs value={tabs.value} onChange={tabs.onChange} sx={{ mb: { xs: 3, md: 5 } }}>
      {TOUR_DETAILS_TABS.map((tab) => (
        <Tab
          key={tab.value}
          iconPosition="end"
          value={tab.value}
          label={tab.label}
          // icon={
          //   tab.value === 'bookers' ? <Label variant="filled">{tour?.bookers.length}</Label> : ''
          // }
        />
      ))}
    </Tabs>
  );

  return (
    <DashboardContent>
      <ItineraryDetailsToolbar
        backLink={paths.app.tourPlan.home}
        editLink={paths.app.tourPlan.edit(`${tour?.tourId}`)}
        liveLink="#"
        publish=""
        onChangePublish={handleChangePublish}
        publishOptions={TOUR_PUBLISH_OPTIONS}
      />
      {renderTabs}

      {tabs.value === 'content' && tour && <ItineraryPreview tour={tour} />}

      {/* {tabs.value === 'bookers' && <TourDetailsBookers bookers={tour?.bookers} />} */}
    </DashboardContent>
  );
}
