import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { isValidPhoneNumber } from 'react-phone-number-input/input';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import axios, { endpoints } from 'src/utils/axios';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { SplashScreen } from 'src/components/loading-screen';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export type UpdateUserSchemaType = zod.infer<typeof UpdateUserSchema>;

export const UpdateUserSchema = zod.object({
  name: zod.string().min(1, { message: 'First Name is required!' }),
  address: zod.string().min(1, { message: 'Address is required!' }),
  website: zod.string().url({ message: 'Website must be a valid URL!' }),
  description: zod.string().min(1, { message: 'Description is required!' }),
  phone: schemaHelper.phoneNumber({ isValidPhoneNumber }),
});

export function OrganizationSettingGeneral() {
  const [organizationExists, setOrganizationExists] = useState<boolean | null>(null);

  const methods = useForm<UpdateUserSchemaType>({
    mode: 'onBlur',
    resolver: zodResolver(UpdateUserSchema),
    defaultValues: {
      name: '',
      address: '',
      website: '',
      phone: '',
      description: '',
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting, errors },
    reset,
  } = methods;

  useEffect(() => {
    const fetchOrganizationOfUser = async () => {
      try {
        const response = await axios.get(endpoints.organization.me);
        const { data } = response.data;
        const { name, address, website, phone, description } = data;
        reset({ name, address, website, phone, description });
        setOrganizationExists(true);
      } catch (error) {
        if (error.code === 404) {
          setOrganizationExists(false);
        } else {
          console.error(error);
        }
      }
    };
    fetchOrganizationOfUser();
  }, [reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (organizationExists) {
        await axios.put(endpoints.organization.me, data);
        toast.success('Organization updated successfully!');
      } else {
        await axios.post(endpoints.organization.me, data);
        toast.success('Organization created successfully!');
        setOrganizationExists(true);
      }
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
      toast.error('An error occurred. Please try again.');
    }
  });

  if (organizationExists === null) {
    return <SplashScreen />;
  }

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={12}>
          <Card sx={{ p: 3 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
            >
              <Field.Text
                name="name"
                label="Name"
                error={!!errors.name}
                helperText={errors.name?.message}
              />

              <Field.Text
                name="address"
                label="Address"
                error={!!errors.address}
                helperText={errors.address?.message}
              />

              <Field.Phone
                name="phone"
                label="Phone"
                error={!!errors.phone}
                helperText={errors.phone?.message}
              />

              <Field.Text
                name="website"
                label="Website"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Iconify icon="bi:globe" width={24} />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
              <Field.Text name="description" multiline rows={4} label="Description" />
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {organizationExists ? 'Update Organization' : 'Create Organization'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Form>
  );
}
