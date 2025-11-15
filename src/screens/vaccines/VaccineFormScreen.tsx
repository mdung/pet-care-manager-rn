import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useVaccines } from '@/hooks/useVaccines';
import { usePets } from '@/hooks/usePets';
import { TextInputField } from '@/components/TextInputField';
import { Button } from '@/components/Button';
import dayjs from 'dayjs';

const schema = yup.object().shape({
  name: yup.string().required('Vaccine name is required'),
  dateAdministered: yup.string(),
  nextDueDate: yup.string().required('Next due date is required'),
  vetClinicName: yup.string(),
  notes: yup.string(),
});

export const VaccineFormScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { vaccineId, petId } = (route.params as { vaccineId?: string; petId?: string }) || {};
  const { vaccines, addVaccine, updateVaccine } = useVaccines();
  const { pets } = usePets();

  const existingVaccine = vaccineId ? vaccines.find(v => v.id === vaccineId) : undefined;
  const selectedPet = petId ? pets.find(p => p.id === petId) : undefined;

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: existingVaccine?.name || '',
      dateAdministered: existingVaccine?.dateAdministered
        ? dayjs(existingVaccine.dateAdministered).format('YYYY-MM-DD')
        : '',
      nextDueDate: existingVaccine?.nextDueDate
        ? dayjs(existingVaccine.nextDueDate).format('YYYY-MM-DD')
        : dayjs().add(1, 'year').format('YYYY-MM-DD'),
      vetClinicName: existingVaccine?.vetClinicName || '',
      notes: existingVaccine?.notes || '',
    },
  });

  const onSubmit = async (data: any) => {
    if (!petId && !existingVaccine?.petId) {
      Alert.alert('Error', 'Please select a pet');
      return;
    }

    try {
      const vaccineData = {
        petId: petId || existingVaccine!.petId,
        name: data.name,
        dateAdministered: data.dateAdministered || undefined,
        nextDueDate: dayjs(data.nextDueDate).toISOString(),
        vetClinicName: data.vetClinicName || undefined,
        notes: data.notes || undefined,
      };

      if (vaccineId) {
        await updateVaccine(vaccineId, vaccineData);
        Alert.alert('Success', 'Vaccine updated successfully');
      } else {
        await addVaccine(vaccineData);
        Alert.alert('Success', 'Vaccine added successfully');
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to save vaccine');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {selectedPet && (
          <View style={styles.petInfo}>
            <Text style={styles.petInfoText}>Pet: {selectedPet.name}</Text>
          </View>
        )}

        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, value } }) => (
            <TextInputField
              label="Vaccine Name *"
              value={value}
              onChangeText={onChange}
              error={errors.name?.message}
              placeholder="e.g., Rabies, Parvo, etc."
            />
          )}
        />

        <Controller
          control={control}
          name="dateAdministered"
          render={({ field: { onChange, value } }) => (
            <TextInputField
              label="Date Administered"
              value={value}
              onChangeText={onChange}
              error={errors.dateAdministered?.message}
              placeholder="YYYY-MM-DD (optional)"
            />
          )}
        />

        <Controller
          control={control}
          name="nextDueDate"
          render={({ field: { onChange, value } }) => (
            <TextInputField
              label="Next Due Date *"
              value={value}
              onChangeText={onChange}
              error={errors.nextDueDate?.message}
              placeholder="YYYY-MM-DD"
            />
          )}
        />

        <Controller
          control={control}
          name="vetClinicName"
          render={({ field: { onChange, value } }) => (
            <TextInputField
              label="Vet/Clinic Name"
              value={value}
              onChangeText={onChange}
              error={errors.vetClinicName?.message}
              placeholder="e.g., ABC Vet Clinic"
            />
          )}
        />

        <Controller
          control={control}
          name="notes"
          render={({ field: { onChange, value } }) => (
            <TextInputField
              label="Notes"
              value={value}
              onChangeText={onChange}
              error={errors.notes?.message}
              multiline
              numberOfLines={4}
              placeholder="Additional notes..."
            />
          )}
        />

        <Button
          title={vaccineId ? 'Update Vaccine' : 'Add Vaccine'}
          onPress={handleSubmit(onSubmit)}
          style={styles.submitButton}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  content: {
    padding: 16,
  },
  petInfo: {
    backgroundColor: '#E5E5EA',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  petInfoText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  submitButton: {
    marginTop: 8,
    marginBottom: 32,
  },
});

