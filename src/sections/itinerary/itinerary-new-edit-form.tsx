import type { DropResult } from 'react-beautiful-dnd';

import { z as zod } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState, useEffect, useCallback } from 'react';
import { Droppable, Draggable, DragDropContext } from 'react-beautiful-dnd';

import LoadingButton from '@mui/lab/LoadingButton';
import {
  Box,
  Card,
  Step,
  Stack,
  Button,
  Divider,
  Stepper,
  MenuItem,
  StepLabel,
  CardHeader,
  Typography,
  IconButton,
} from '@mui/material';

import { paths } from 'src/routes/paths';

import axios, { endpoints } from 'src/utils/axios';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Form, Field, schemaHelper } from 'src/components/hook-form';

const DURATION_OPTIONS = ['2 Days 1 Night', '3 Days 2 Nights', '4 Days 3 Nights'];

const ITEM_TYPES = ['Accommodation', 'Transportation', 'Activities', 'Meals'];

const NewTourSchema = zod.object({
  title: zod.string().min(1, { message: 'Title is required!' }),
  source: zod.string().min(1, { message: 'Source is required!' }),
  destinations: zod
    .array(zod.string())
    .min(1, { message: 'At least one destination is required!' }),
  duration: zod.string().min(1, { message: 'Duration is required!' }),
  startDate: schemaHelper.date({ message: { required_error: 'Start date is required!' } }),
  endDate: schemaHelper.date({ message: { required_error: 'End date is required!' } }),
  numberOfTravellers: zod.number().min(1, { message: 'Number of travellers is required!' }),
  tags: zod.array(zod.string()).min(1, { message: 'At least one tag is required!' }),
  itinerary: zod
    .array(
      zod.object({
        day: zod.number(),
        items: zod
          .array(
            zod.object({
              type: zod.string(),
              details: zod.string(),
            })
          )
          .min(1, { message: 'At least one item is required for each day' }),
      })
    )
    .min(1, { message: 'Itinerary is required' }),
  tourPhotos: zod.array(zod.any()),
});

type NewTourSchemaType = zod.infer<typeof NewTourSchema>;

type Item = {
  type: string;
  details: string;
};

type DayItem = {
  day: number;
  items: Item[];
};

export function ItineraryNewEditForm({ currentTour }: any) {
  const router = useRouter();

  const [activeStep, setActiveStep] = useState(0);
  const [days, setDays] = useState<DayItem[]>([]);

  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const methods = useForm<NewTourSchemaType>({
    mode: 'all',
    resolver: zodResolver(NewTourSchema),
    defaultValues: {
      title: currentTour?.tourData?.title || '',
      source: currentTour?.tourData?.source || '',
      destinations: currentTour?.tourData?.destinations || [],
      duration: currentTour?.tourData?.duration || '',
      startDate: currentTour?.tourData?.startDate || null,
      endDate: currentTour?.tourData?.endDate || null,
      numberOfTravellers: currentTour?.tourData?.numberOfTravellers || 1,
      tags: currentTour?.tourData?.tags || [],
      itinerary: currentTour?.tourData?.itinerary || [],
      tourPhotos: currentTour?.tourData?.tourPhotos || [],
    },
  });

  const {
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
    trigger,
  } = methods;

  const duration = watch('duration');

  useEffect(() => {
    const durationDays = parseInt(duration.split(' ')[0], 10);
    const initialDays =
      currentTour?.tourData?.itinerary ||
      Array.from({ length: durationDays }, (_, i) => ({ day: i + 1, items: [] }));
    setDays(initialDays);
  }, [duration, currentTour?.tourData?.itinerary]);

  const onSubmit = handleSubmit(async (formData) => {
    try {
      setIsUploading(true);
      setUploadProgress(0);
      const tourId = currentTour?.tourId || uuidv4();
      const tourData = {
        title: formData.title,
        source: formData.source,
        destinations: formData.destinations,
        duration: formData.duration,
        startDate: formData.startDate,
        endDate: formData.endDate,
        numberOfTravellers: formData.numberOfTravellers,
        tags: formData.tags,
        itinerary: formData.itinerary,
        createdAt: currentTour?.tourData?.createdAt || new Date(),
        updatedAt: new Date(),
      };

      let res;
      if (currentTour) {
        // Update existing tour
        res = await axios.put(endpoints.tour.update(tourId), { tourId, tourData });
      } else {
        // Create new tour
        res = await axios.post(endpoints.tour.create, { tourId, tourData });
      }

      if (
        res.data &&
        (res.data.code === 200 || res.data.code === 201) &&
        res.data.status === 'success'
      ) {
        toast.success(currentTour ? 'Tour updated successfully' : 'Tour created successfully');
        router.push(paths.app.tourPlan.home);
      }
    } catch (error) {
      console.error('Error creating tour:', error);
      toast.error('Error creating tour');
    } finally {
      setIsUploading(false);
    }
  });

  const handleNext = async () => {
    let isValid = false;

    switch (activeStep) {
      case 0:
        isValid = await trigger([
          'title',
          'source',
          'destinations',
          'duration',
          'startDate',
          'endDate',
          'numberOfTravellers',
          'tags',
        ]);
        break;
      case 1:
        isValid = await trigger('itinerary');
        if (isValid) {
          const itineraryValue = methods.getValues('itinerary');
          isValid = itineraryValue.every((day) => day.items.length > 0);
          if (!isValid) {
            methods.setError('itinerary', {
              type: 'manual',
              message: 'Each day must have at least one item',
            });
          }
        }
        break;
      case 2:
        isValid = await trigger('tourPhotos');
        break;
      default:
        isValid = true;
    }

    if (isValid) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleRemoveFile = useCallback(
    (inputFile: File | string) => {
      const filtered = methods.getValues('tourPhotos').filter((file) => file !== inputFile);
      setValue('tourPhotos', filtered, { shouldValidate: true });
    },
    [setValue, methods]
  );

  const handleRemoveAllFiles = useCallback(() => {
    setValue('tourPhotos', [], { shouldValidate: true });
  }, [setValue]);

  const renderTourDetails = (
    <Card>
      <CardHeader title="Tour Details" />
      <Divider />
      <Stack spacing={3} sx={{ p: 3 }}>
        <Field.Text name="title" label="Title" />
        <Field.Select name="source" label="Source">
          <MenuItem value="New Delhi">New Delhi</MenuItem>
          <MenuItem value="Mumbai">Mumbai</MenuItem>
          <MenuItem value="Chennai">Chennai</MenuItem>
          <MenuItem value="Kolkata">Kolkata</MenuItem>
        </Field.Select>
        <Field.MultiSelect
          checkbox
          name="destinations"
          label="Destinations"
          options={[
            { value: 'Jaipur', label: 'Jaipur' },
            { value: 'Agra', label: 'Agra' },
            { value: 'Udaipur', label: 'Udaipur' },
          ]}
        />
        <Field.Select name="duration" label="Duration">
          {DURATION_OPTIONS.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Field.Select>
        <Stack direction="row" spacing={2}>
          <Field.DatePicker name="startDate" label="Start Date" />
          <Field.DatePicker name="endDate" label="End Date" />
        </Stack>
        <Field.Text name="numberOfTravellers" label="Number of Travellers" type="number" />
        <Field.Autocomplete
          multiple
          name="tags"
          label="Tags"
          options={['Family', 'Friends', 'Solo', 'Adventure', 'Relaxing', 'Historical', 'Cultural']}
        />
      </Stack>
    </Card>
  );

  const renderItineraryEditor = () => {
    const handleAddItem = (dayIndex: number, itemType: string) => {
      const newDays = [...days];
      newDays[dayIndex].items.push({ type: itemType, details: '' });
      setDays(newDays);
      setValue(`itinerary`, newDays);
    };

    const handleRemoveItem = (dayIndex: number, itemIndex: number) => {
      const newDays = [...days];
      newDays[dayIndex].items.splice(itemIndex, 1);
      setDays(newDays);
      setValue(`itinerary`, newDays);
    };

    const handleItemChange = (
      dayIndex: number,
      itemIndex: number,
      field: 'type' | 'details',
      value: string
    ) => {
      const newDays = [...days];
      newDays[dayIndex].items[itemIndex][field] = value;
      setDays(newDays);
      setValue(`itinerary`, newDays);
    };

    const onDragEnd = (result: DropResult) => {
      if (!result.destination) return;

      const newDays = [...days];
      const sourceDay = parseInt(result.source.droppableId, 10);
      const destinationDay = parseInt(result.destination.droppableId, 10);
      const [reorderedItem] = newDays[sourceDay].items.splice(result.source.index, 1);
      newDays[destinationDay].items.splice(result.destination.index, 0, reorderedItem);

      setDays(newDays);
      setValue(`itinerary`, newDays);
    };

    return (
      <Card>
        <CardHeader title="Itinerary Editor" />
        <Divider />
        <DragDropContext onDragEnd={onDragEnd}>
          {days.map((day, dayIndex) => (
            <Stack key={day.day} spacing={2} sx={{ p: 3 }}>
              <Typography variant="h6">Day {day.day}</Typography>
              <Droppable droppableId={`${dayIndex}`}>
                {(droppableProvided) => (
                  <div {...droppableProvided.droppableProps} ref={droppableProvided.innerRef}>
                    {day.items.map((item, itemIndex) => (
                      <Draggable
                        key={`${dayIndex}-${itemIndex}`}
                        draggableId={`${dayIndex}-${itemIndex}`}
                        index={itemIndex}
                      >
                        {(draggableProvided) => (
                          <div
                            ref={draggableProvided.innerRef}
                            {...draggableProvided.draggableProps}
                            {...draggableProvided.dragHandleProps}
                          >
                            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                              <Iconify width="24" icon="mdi:drag" />
                              <Field.Select
                                name={`itinerary.${dayIndex}.items.${itemIndex}.type`}
                                value={item.type}
                                onChange={(e) =>
                                  handleItemChange(dayIndex, itemIndex, 'type', e.target.value)
                                }
                              >
                                {ITEM_TYPES.map((type) => (
                                  <MenuItem key={type} value={type}>
                                    {type}
                                  </MenuItem>
                                ))}
                              </Field.Select>
                              <Field.Text
                                name={`itinerary.${dayIndex}.items.${itemIndex}.details`}
                                value={item.details}
                                onChange={(e) =>
                                  handleItemChange(dayIndex, itemIndex, 'details', e.target.value)
                                }
                              />
                              <IconButton onClick={() => handleRemoveItem(dayIndex, itemIndex)}>
                                <Iconify width="24" icon="mdi:delete" />
                              </IconButton>
                            </Stack>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {droppableProvided.placeholder}
                  </div>
                )}
              </Droppable>
              <Stack direction="row" spacing={1}>
                {ITEM_TYPES.map((type) => (
                  <Button
                    key={type}
                    variant="outlined"
                    startIcon={<Iconify width="24" icon="mdi:add" />}
                    onClick={() => handleAddItem(dayIndex, type)}
                  >
                    {type}
                  </Button>
                ))}
              </Stack>
              {day.items.length === 0 && (
                <Typography color="error" variant="caption">
                  Please add at least one item for this day
                </Typography>
              )}
            </Stack>
          ))}
        </DragDropContext>
      </Card>
    );
  };

  const renderPhotosUploadTourPlan = () => (
    <Card>
      <CardHeader title="Upload Tour Photos" />
      <Divider />
      <Stack spacing={3} sx={{ p: 3 }}>
        <Typography variant="subtitle2">Photos</Typography>
        <Field.Upload
          multiple
          thumbnail
          name="tourPhotos"
          maxSize={3145728} // 3 MB
          onRemove={handleRemoveFile}
          onRemoveAll={handleRemoveAllFiles}
          onDrop={(acceptedFiles) => {
            const newFiles = acceptedFiles.map((file) =>
              Object.assign(file, {
                preview: URL.createObjectURL(file),
              })
            );
            setValue('tourPhotos', newFiles, { shouldValidate: true });
          }}
        />
        <Typography variant="caption" color="textSecondary">
          Allowed *.jpeg, *.jpg, *.png, *.gif
          <br /> Max size of 3 MB
        </Typography>
      </Stack>
    </Card>
  );

  const renderPreviewTourPlan = () => {
    const values = methods.getValues();

    return (
      <Card>
        <CardHeader title="Tour Plan Preview" />
        <Divider />
        <Stack spacing={3} sx={{ p: 3 }}>
          <Typography variant="h4">Tour Details</Typography>
          <Stack spacing={2}>
            <Typography>
              <Box fontWeight="bold">Title</Box> {values.title}
            </Typography>
            <Typography>
              <Box fontWeight="bold">Source</Box> {values.source}
            </Typography>
            <Typography>
              <Box fontWeight="bold">Destinations</Box> {values.destinations.join(', ')}
            </Typography>
            <Typography>
              <Box fontWeight="bold">Duration</Box> {values.duration}
            </Typography>
            <Typography>
              <Box fontWeight="bold">Start Date</Box> {values.startDate?.toLocaleString()}
            </Typography>
            <Typography>
              <Box fontWeight="bold">End Date</Box> {values.endDate?.toLocaleString()}
            </Typography>
            <Typography>
              <Box fontWeight="bold">Number of Travellers</Box> {values.numberOfTravellers}
            </Typography>
            <Typography>
              <Box fontWeight="bold">Tags</Box> {values.tags.join(', ')}
            </Typography>
          </Stack>

          <Divider />

          <Typography variant="h4" sx={{ mt: 3 }}>
            Itinerary
          </Typography>
          {values.itinerary.map((day, index) => (
            <Stack key={index} spacing={1}>
              <Typography variant="subtitle1">Day {day.day}</Typography>
              {day.items.map((item, itemIndex) => (
                <Typography key={itemIndex}>
                  {item.type}: {item.details}
                </Typography>
              ))}
            </Stack>
          ))}

          <Divider />

          <Typography variant="h4" sx={{ mt: 3 }}>
            Tour Photos
          </Typography>

          {values.tourPhotos.length > 0 ? (
            <Stack direction="row" flexWrap="wrap" spacing={2}>
              {values.tourPhotos.map((photo: File, index: number) => (
                <img
                  key={index}
                  src={URL.createObjectURL(photo)}
                  alt={`Tour site ${index + 1}`}
                  style={{ width: 100, height: 100, objectFit: 'cover' }}
                />
              ))}
            </Stack>
          ) : (
            <Typography variant="body1" sx={{ mt: 2 }}>
              No photos uploaded.
            </Typography>
          )}
        </Stack>
      </Card>
    );
  };

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={5}>
        <Stepper activeStep={activeStep}>
          <Step>
            <StepLabel>Tour Details</StepLabel>
          </Step>
          <Step>
            <StepLabel>Itinerary</StepLabel>
          </Step>
          <Step>
            <StepLabel>Photos</StepLabel>
          </Step>
          <Step>
            <StepLabel>Preview</StepLabel>
          </Step>
        </Stepper>

        {activeStep === 0 && renderTourDetails}
        {activeStep === 1 && renderItineraryEditor()}
        {activeStep === 2 && renderPhotosUploadTourPlan()}
        {activeStep === 3 && renderPreviewTourPlan()}

        <Stack direction="row" justifyContent="space-between">
          <Button disabled={activeStep === 0} onClick={handleBack}>
            Back
          </Button>
          {activeStep < 3 ? (
            <Button variant="contained" onClick={handleNext}>
              Next
            </Button>
          ) : (
            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
              {currentTour ? 'Save Changes' : 'Create Tour Plan'}
            </LoadingButton>
          )}
        </Stack>
        {Object.keys(errors).length > 0 && (
          <Typography fontSize={12} color="error" sx={{ mt: 2 }}>
            Please fill in all required fields correctly before proceeding.
          </Typography>
        )}
      </Stack>
    </Form>
  );
}
