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
import { useExpenses } from '@/hooks/useExpenses';
import { usePets } from '@/hooks/usePets';
import { useSettings } from '@/hooks/useSettings';
import { ExpenseCategory } from '@/types/expense';
import { TextInputField } from '@/components/TextInputField';
import { Button } from '@/components/Button';
import { EXPENSE_CATEGORIES } from '@/utils/constants';
import dayjs from 'dayjs';

const schema = yup.object().shape({
  category: yup.string().required('Category is required'),
  amount: yup
    .number()
    .required('Amount is required')
    .positive('Amount must be greater than 0'),
  date: yup.string().required('Date is required'),
  description: yup.string(),
  vendor: yup.string(),
});

export const ExpenseFormScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { expenseId, petId } = (route.params as { expenseId?: string; petId?: string }) || {};
  const { expenses, addExpense, updateExpense } = useExpenses();
  const { pets } = usePets();
  const { settings } = useSettings();

  const existingExpense = expenseId ? expenses.find(e => e.id === expenseId) : undefined;
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
      category: existingExpense?.category || 'other',
      amount: existingExpense?.amount || 0,
      date: existingExpense?.date
        ? dayjs(existingExpense.date).format('YYYY-MM-DD')
        : dayjs().format('YYYY-MM-DD'),
      description: existingExpense?.description || '',
      vendor: existingExpense?.vendor || '',
    },
  });

  const selectedCategory = watch('category');

  const onSubmit = async (data: any) => {
    if (!petId && !existingExpense?.petId) {
      Alert.alert('Error', 'Please select a pet');
      return;
    }

    try {
      const expenseData = {
        petId: petId || existingExpense!.petId,
        category: data.category as ExpenseCategory,
        amount: parseFloat(data.amount),
        date: dayjs(data.date).toISOString(),
        description: data.description || undefined,
        vendor: data.vendor || undefined,
      };

      if (expenseId) {
        await updateExpense(expenseId, expenseData);
        Alert.alert('Success', 'Expense updated successfully');
      } else {
        await addExpense(expenseData);
        Alert.alert('Success', 'Expense added successfully');
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to save expense');
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
          <Text style={styles.label}>Category *</Text>
          <View style={styles.optionsRow}>
            {EXPENSE_CATEGORIES.map(category => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.optionButton,
                  selectedCategory === category && styles.optionButtonSelected,
                ]}
                onPress={() => setValue('category', category)}
              >
                <Text
                  style={[
                    styles.optionText,
                    selectedCategory === category && styles.optionTextSelected,
                  ]}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <Controller
          control={control}
          name="amount"
          render={({ field: { onChange, value } }) => (
            <TextInputField
              label={`Amount (${settings.defaultCurrency}) *`}
              value={value?.toString() || ''}
              onChangeText={text => onChange(text ? parseFloat(text) : 0)}
              error={errors.amount?.message}
              keyboardType="numeric"
              placeholder="0.00"
            />
          )}
        />

        <Controller
          control={control}
          name="date"
          render={({ field: { onChange, value } }) => (
            <TextInputField
              label="Date *"
              value={value}
              onChangeText={onChange}
              error={errors.date?.message}
              placeholder="YYYY-MM-DD"
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
              placeholder="What was this expense for?"
            />
          )}
        />

        <Controller
          control={control}
          name="vendor"
          render={({ field: { onChange, value } }) => (
            <TextInputField
              label="Vendor"
              value={value}
              onChangeText={onChange}
              error={errors.vendor?.message}
              placeholder="e.g., ABC Vet Clinic"
            />
          )}
        />

        <Button
          title={expenseId ? 'Update Expense' : 'Add Expense'}
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

