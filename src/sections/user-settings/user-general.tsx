import { z as zod } from 'zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { isValidPhoneNumber } from 'react-phone-number-input/input';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import LoadingButton from '@mui/lab/LoadingButton';

import axios, { endpoints } from 'src/utils/axios';

import { toast } from 'src/components/snackbar';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export type UpdateUserSchemaType = zod.infer<typeof UpdateUserSchema>;

export const UpdateUserSchema = zod.object({
  firstName: zod.string().min(1, { message: 'First Name is required!' }),
  lastName: zod.string().min(1, { message: 'Last Name is required!' }),
  email: zod
    .string()
    .min(6, { message: 'Email is required!' })
    .email({ message: 'Email must be a valid email address!' }),
  phone: schemaHelper.phoneNumber({ isValidPhoneNumber }),
});

export function UserSettingGeneral() {
  const methods = useForm<UpdateUserSchemaType>({
    mode: 'onBlur',
    resolver: zodResolver(UpdateUserSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting, errors },
    reset,
  } = methods;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(endpoints.user.me);
        console.log('USER', res.data);
        const { firstName, lastName, email, phone } = res.data;
        reset({ firstName, lastName, email, phone });
      } catch (error) {
        console.error(error);
      }
    };
    fetchUser();
  }, [reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      axios.put(endpoints.user.me, data);
      toast.success('Update success!');
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });

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
                name="firstName"
                label="First Name"
                error={!!errors.firstName}
                helperText={errors.firstName?.message}
              />
              <Field.Text
                name="lastName"
                label="Last Name"
                error={!!errors.lastName}
                helperText={errors.lastName?.message}
              />
              <Field.Text
                name="email"
                label="Business Email"
                error={!!errors.email}
                helperText={errors.email?.message}
              />
              <Field.Phone
                name="phone"
                label="Phone"
                error={!!errors.phone}
                helperText={errors.phone?.message}
              />
            </Box>

            <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                Save changes
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Form>
  );
}
