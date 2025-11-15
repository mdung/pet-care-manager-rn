import React, { useEffect } from 'react';
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
import { useReminders } from '@/hooks/useReminders';
import { usePets } from '@/hooks/usePets';
import { useSettings } from '@/hooks/useSettings';
import { ReminderType, RepeatOption } from '@/types/reminder';
import { TextInputField } from '@/components/TextInputField';
import { Button } from '@/components/Button';
import { REMINDER_TYPES, REPEAT_OPTIONS } from '@/utils/constants';
import dayjs from 'dayjs';

const schema = yup.object().shape({
  type: yup.string().required('Type is required'),
  title: yup.string().required('Title is required'),
  description: yup.string(),
  reminderDate: yup.string().required('Date is required'),
  reminderTime: yup.string().required('Time is required'),
  repeat: yup.string().required('Repeat option is required'),
});

export const ReminderFormScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { reminderId, petId } = (route.params as { reminderId?: string; petId?: string }) || {};
  const { reminders, addReminder, updateReminder } = useReminders();
  const { pets } = usePets();
  const { settings } = useSettings();

  const existingReminder = reminderId ? reminders.find(r => r.id === reminderId) : undefined;
  const selectedPet = petId ? pets.find(p => p.id === petId) : undefined;

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      type: existingReminder?.type || 'custom',
      title: existingReminder?.title || '',
      description: existingReminder?.description || '',
      reminderDate: existingReminder?.reminderDate
        ? dayjs(existingReminder.reminderDate).format('YYYY-MM-DD')
        : dayjs().format('YYYY-MM-DD'),
      reminderTime: existingReminder?.reminderTime || settings.defaultReminderTime,
      repeat: existingReminder?.repeat || 'none',
    },
  });

  const selectedType = watch('type');
  const selectedRepeat = watch('repeat');

  const onSubmit = async (data: any) => {
    if (!petId && !existingReminder?.petId) {
      Alert.alert('Error', 'Please select a pet');
      return;
    }

    try {
      const reminderData = {
        petId: petId || existingReminder!.petId,
        type: data.type as ReminderType,
        title: data.title,
        description: data.description || undefined,
        reminderDate: dayjs(data.reminderDate).format('YYYY-MM-DD'),
        reminderTime: data.reminderTime,
        repeat: data.repeat as RepeatOption,
      };

      if (reminderId) {
        await updateReminder(reminderId, reminderData);
        Alert.alert('Success', 'Reminder updated successfully');
      } else {
        await addReminder(reminderData);
        Alert.alert('Success', 'Reminder added successfully');
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to save reminder');
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

        <View style={styles.section}>
          <Text style={styles.label}>Type *</Text>
          <View style={styles.optionsRow}>
            {REMINDER_TYPES.map(type => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.optionButton,
                  selectedType === type && styles.optionButtonSelected,
                ]}
                onPress={() => setValue('type', type)}
              >
                <Text
                  style={[
                    styles.optionText,
                    selectedType === type && styles.optionTextSelected,
                  ]}
                >
                  {type.replace('_', ' ').toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <Controller
          control={control}
          name="title"
          render={({ field: { onChange, value } }) => (
            <TextInputField
              label="Title *"
              value={value}
              onChangeText={onChange}
              error={errors.title?.message}
              placeholder="e.g., Vet appointment"
            />
          )}
        />

        <Controller
          control={control}
          name="description"
          render={({ field: { onChange, value } }) => (
            <TextInputField
              label="Description"
              value={value}
              onChangeText={onChange}
              error={errors.description?.message}
              multiline
              numberOfLines={3}
              placeholder="Additional details..."
            />
          )}
        />

        <Controller
          control={control}
          name="reminderDate"
          render={({ field: { onChange, value } }) => (
            <TextInputField
              label="Date *"
              value={value}
              onChangeText={onChange}
              error={errors.reminderDate?.message}
              placeholder="YYYY-MM-DD"
            />
          )}
        />

        <Controller
          control={control}
          name="reminderTime"
          render={({ field: { onChange, value } }) => (
            <TextInputField
              label="Time *"
              value={value}
              onChangeText={onChange}
              error={errors.reminderTime?.message}
              placeholder="HH:mm (e.g., 09:00)"
            />
          )}
        />

        <View style={styles.section}>
          <Text style={styles.label}>Repeat *</Text>
          <View style={styles.optionsRow}>
            {REPEAT_OPTIONS.map(repeat => (
              <TouchableOpacity
                key={repeat}
                style={[
                  styles.optionButton,
                  selectedRepeat === repeat && styles.optionButtonSelected,
                ]}
                onPress={() => setValue('repeat', repeat)}
              >
                <Text
                  style={[
                    styles.optionText,
                    selectedRepeat === repeat && styles.optionTextSelected,
                  ]}
                >
                  {repeat.charAt(0).toUpperCase() + repeat.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <Button
          title={reminderId ? 'Update Reminder' : 'Add Reminder'}
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
  submitButton: {
    marginTop: 8,
    marginBottom: 32,
  },
});

