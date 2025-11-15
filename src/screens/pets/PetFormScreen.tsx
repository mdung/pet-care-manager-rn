import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { usePets } from '@/hooks/usePets';
import { Pet, PetSpecies, PetSex } from '@/types/pet';
import { TextInputField } from '@/components/TextInputField';
import { Button } from '@/components/Button';
import { AvatarPicker } from '@/components/AvatarPicker';
import { PET_SPECIES } from '@/utils/constants';
import dayjs from 'dayjs';

const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  species: yup.string().required('Species is required'),
  breed: yup.string(),
  dateOfBirth: yup.string().required('Date of birth is required'),
  sex: yup.string().required('Sex is required'),
  notes: yup.string(),
  microchipNumber: yup.string(),
  registrationNumber: yup.string(),
  insuranceId: yup.string(),
  emergencyContactName: yup.string(),
  emergencyContactPhone: yup.string(),
  emergencyContactRelationship: yup.string(),
  preferredVetId: yup.string(),
});

export const PetFormScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { petId } = (route.params as { petId?: string }) || {};
  const { pets, addPet, updatePet } = usePets();
  const [avatarUri, setAvatarUri] = useState<string | undefined>();

  const existingPet = petId ? pets.find(p => p.id === petId) : undefined;

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: existingPet?.name || '',
      species: existingPet?.species || 'dog',
      breed: existingPet?.breed || '',
      dateOfBirth: existingPet?.dateOfBirth
        ? dayjs(existingPet.dateOfBirth).format('YYYY-MM-DD')
        : dayjs().subtract(1, 'year').format('YYYY-MM-DD'),
      sex: existingPet?.sex || 'unknown',
      notes: existingPet?.notes || '',
      microchipNumber: existingPet?.microchipNumber || '',
      registrationNumber: existingPet?.registrationNumber || '',
      insuranceId: existingPet?.insuranceId || '',
      emergencyContactName: existingPet?.emergencyContact?.name || '',
      emergencyContactPhone: existingPet?.emergencyContact?.phone || '',
      emergencyContactRelationship: existingPet?.emergencyContact?.relationship || '',
      preferredVetId: existingPet?.preferredVetId || '',
    },
  });

  useEffect(() => {
    if (existingPet?.avatarUri) {
      setAvatarUri(existingPet.avatarUri);
    }
  }, [existingPet]);

  const onSubmit = async (data: any) => {
    try {
      const petData = {
        ...data,
        avatarUri,
        dateOfBirth: dayjs(data.dateOfBirth).toISOString(),
      };

      if (petId) {
        await updatePet(petId, petData);
        Alert.alert('Success', 'Pet updated successfully');
      } else {
        await addPet(petData);
        Alert.alert('Success', 'Pet added successfully');
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to save pet');
    }
  };

  const selectedSpecies = watch('species');
  const selectedSex = watch('sex');

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <AvatarPicker
          imageUri={avatarUri}
          onImageSelected={setAvatarUri}
          size={120}
        />

        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, value } }) => (
            <TextInputField
              label="Pet Name *"
              value={value}
              onChangeText={onChange}
              error={errors.name?.message}
            />
          )}
        />

        <View style={styles.section}>
          <Text style={styles.label}>Species *</Text>
          <View style={styles.optionsRow}>
            {PET_SPECIES.map(species => (
              <TouchableOpacity
                key={species}
                style={[
                  styles.optionButton,
                  selectedSpecies === species && styles.optionButtonSelected,
                ]}
                onPress={() => setValue('species', species)}
              >
                <Text
                  style={[
                    styles.optionText,
                    selectedSpecies === species && styles.optionTextSelected,
                  ]}
                >
                  {species.charAt(0).toUpperCase() + species.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <Controller
          control={control}
          name="breed"
          render={({ field: { onChange, value } }) => (
            <TextInputField
              label="Breed"
              value={value}
              onChangeText={onChange}
              error={errors.breed?.message}
              placeholder="e.g., Golden Retriever"
            />
          )}
        />

        <Controller
          control={control}
          name="dateOfBirth"
          render={({ field: { onChange, value } }) => (
            <TextInputField
              label="Date of Birth *"
              value={value}
              onChangeText={onChange}
              error={errors.dateOfBirth?.message}
              placeholder="YYYY-MM-DD"
            />
          )}
        />

        <View style={styles.section}>
          <Text style={styles.label}>Sex *</Text>
          <View style={styles.optionsRow}>
            {(['male', 'female', 'unknown'] as PetSex[]).map(sex => (
              <TouchableOpacity
                key={sex}
                style={[
                  styles.optionButton,
                  selectedSex === sex && styles.optionButtonSelected,
                ]}
                onPress={() => setValue('sex', sex)}
              >
                <Text
                  style={[
                    styles.optionText,
                    selectedSex === sex && styles.optionTextSelected,
                  ]}
                >
                  {sex.charAt(0).toUpperCase() + sex.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

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
              placeholder="Health issues, personality, allergies, etc."
            />
          )}
        />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Additional Information</Text>

          <Controller
            control={control}
            name="microchipNumber"
            render={({ field: { onChange, value } }) => (
              <TextInputField
                label="Microchip Number"
                value={value}
                onChangeText={onChange}
                placeholder="Enter microchip number"
              />
            )}
          />

          <Controller
            control={control}
            name="registrationNumber"
            render={({ field: { onChange, value } }) => (
              <TextInputField
                label="Registration Number"
                value={value}
                onChangeText={onChange}
                placeholder="Enter registration number"
              />
            )}
          />

          <Controller
            control={control}
            name="insuranceId"
            render={({ field: { onChange, value } }) => (
              <TextInputField
                label="Insurance ID"
                value={value}
                onChangeText={onChange}
                placeholder="Link to insurance record"
              />
            )}
          />

          <Text style={styles.subsectionTitle}>Emergency Contact</Text>

          <Controller
            control={control}
            name="emergencyContactName"
            render={({ field: { onChange, value } }) => (
              <TextInputField
                label="Contact Name"
                value={value}
                onChangeText={onChange}
                placeholder="Emergency contact name"
              />
            )}
          />

          <Controller
            control={control}
            name="emergencyContactPhone"
            render={({ field: { onChange, value } }) => (
              <TextInputField
                label="Contact Phone"
                value={value}
                onChangeText={onChange}
                placeholder="Phone number"
                keyboardType="phone-pad"
              />
            )}
          />

          <Controller
            control={control}
            name="emergencyContactRelationship"
            render={({ field: { onChange, value } }) => (
              <TextInputField
                label="Relationship"
                value={value}
                onChangeText={onChange}
                placeholder="e.g., Owner, Family"
              />
            )}
          />

          <Controller
            control={control}
            name="preferredVetId"
            render={({ field: { onChange, value } }) => (
              <TextInputField
                label="Preferred Vet ID"
                value={value}
                onChangeText={onChange}
                placeholder="Link to preferred vet"
              />
            )}
          />
        </View>

        <Button
          title={petId ? 'Update Pet' : 'Add Pet'}
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
  section: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#000',
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    backgroundColor: '#fff',
  },
  optionButtonSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  optionText: {
    fontSize: 14,
    color: '#000',
  },
  optionTextSelected: {
    color: '#fff',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 16,
    marginTop: 8,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginTop: 16,
    marginBottom: 8,
  },
  submitButton: {
    marginTop: 8,
    marginBottom: 32,
  },
});

