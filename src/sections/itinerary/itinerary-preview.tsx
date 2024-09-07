import type { TourApiResponse } from 'src/types/tour';

import React from 'react';

import { Box, Chip, Card, Divider, Typography, CardContent } from '@mui/material';
import {
  Timeline,
  TimelineDot,
  TimelineItem,
  TimelineContent,
  TimelineSeparator,
  TimelineConnector,
} from '@mui/lab';

import { fDateRangeShortLabel } from 'src/utils/format-time';

import { Iconify } from 'src/components/iconify';


interface ItineraryPreviewProps {
  tour: TourApiResponse['data'];
}

export const ItineraryPreview: React.FC<ItineraryPreviewProps> = ({ tour }) => (
    <Card elevation={3}>
      <CardContent>
        <Typography variant="h4" gutterBottom>
          {tour.tourData.title}
        </Typography>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Box>
            <Typography variant="subtitle1">
              <Iconify icon="mdi:map-marker" sx={{ mr: 1, verticalAlign: 'middle' }} />
              {tour.tourData.destinations.join(', ')}
            </Typography>
            <Typography variant="subtitle2">
              <Iconify icon="mdi:calendar-range" sx={{ mr: 1, verticalAlign: 'middle' }} />
              {fDateRangeShortLabel(
                new Date(tour.tourData.startDate),
                new Date(tour.tourData.endDate)
              )}
            </Typography>
          </Box>
          <Typography variant="h6">{tour.tourData.duration}</Typography>
        </Box>

        <Box mb={2}>
          {tour.tourData.tags.map((tag, index) => (
            <Chip key={index} label={tag} sx={{ mr: 1, mb: 1 }} />
          ))}
        </Box>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" gutterBottom>
          Itinerary
        </Typography>
        <Timeline>
          {tour.tourData.itinerary.map((day, index) => (
            <TimelineItem key={index}>
              <TimelineSeparator>
                <TimelineDot />
                {index < tour.tourData.itinerary.length - 1 && <TimelineConnector />}
              </TimelineSeparator>
              <TimelineContent>
                <Typography variant="subtitle1">Day {day.day}</Typography>
                {day.items.map((item, itemIndex) => (
                  <Typography key={itemIndex} variant="body2">
                    {item.type}: {item.details}
                  </Typography>
                ))}
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" gutterBottom>
          Tour Details
        </Typography>
        <Typography variant="body2">
          <strong>Source:</strong> {tour.tourData.source}
        </Typography>
        <Typography variant="body2">
          <strong>Number of Travelers:</strong> {tour.tourData.numberOfTravellers}
        </Typography>

        <Box mt={2}>
          <Typography variant="subtitle2">
            <Iconify icon="mdi:calendar" sx={{ mr: 1, verticalAlign: 'middle' }} />
            {/* Created: {new Date(tour.tourData.createdAt).toLocaleDateString()} */}
          </Typography>
          <Typography variant="subtitle2">
            <Iconify icon="mdi:update" sx={{ mr: 1, verticalAlign: 'middle' }} />
            {/* Updated: {new Date(tour.tourData.updatedAt).toLocaleDateString()} */}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );

export default ItineraryPreview;
