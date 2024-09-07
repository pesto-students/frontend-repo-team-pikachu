'use client';

import { useState, useEffect } from 'react';

import Grid from '@mui/material/Unstable_Grid2';

import axios, { endpoints } from 'src/utils/axios';

import { DashboardContent } from 'src/layouts/dashboard';
import { SeoIllustration } from 'src/assets/illustrations';

import { AppWelcome } from '../app-welcome';

// ----------------------------------------------------------------------

export function OverviewAppView() {
  const [currentUser, setCurrentUser] = useState({
    userId: null,
    email: null,
    organizationId: null,
    firstName: null,
    lastName: null,
    phone: null,
  });

  const getCurrentUser = async () => {
    try {
      const response = await axios.get(endpoints.auth.me);
      const { data } = response.data;
      setCurrentUser(data);
    } catch (error) {
      console.error('Error during fetching user:', error);
    }
  };

  useEffect(() => {
    getCurrentUser();
  }, []);

  return (
    <DashboardContent maxWidth="xl">
      <Grid container spacing={3}>
        <Grid xs={12} md={12}>
          <AppWelcome
            title={`Hi ${currentUser.firstName} 👋`}
            description="Welcome to TravelSuite! Your one stop destination for all your travel management needs."
            img={<SeoIllustration hideBackground />}
          />
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
