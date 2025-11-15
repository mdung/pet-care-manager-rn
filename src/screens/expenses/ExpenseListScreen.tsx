import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useExpenses } from '@/hooks/useExpenses';
import { usePets } from '@/hooks/usePets';
import { useSettings } from '@/hooks/useSettings';
import { Card } from '@/components/Card';
import { EmptyState } from '@/components/EmptyState';
import { Button } from '@/components/Button';
import { Expense } from '@/types/expense';
import { formatDate, formatCurrency } from '@/utils/formatters';
import { EXPENSE_CATEGORIES } from '@/utils/constants';

export const ExpenseListScreen: React.FC = () => {
  const navigation = useNavigation();
  const { expenses, deleteExpense } = useExpenses();
  const { pets } = usePets();
  const { settings } = useSettings();
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredExpenses = useMemo(() => {
    let filtered = expenses;
    if (selectedPetId) {
      filtered = filtered.filter(e => e.petId === selectedPetId);
    }
    if (selectedCategory) {
      filtered = filtered.filter(e => e.category === selectedCategory);
    }
    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [expenses, selectedPetId, selectedCategory]);

  const totalAmount = useMemo(() => {
    return filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
  }, [filteredExpenses]);

  const handleDelete = (expense: Expense) => {
    Alert.alert(
      'Delete Expense',
      `Are you sure you want to delete this expense?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteExpense(expense.id);
            } catch (error) {
              Alert.alert('Error', 'Failed to delete expense');
            }
          },
        },
      ]
    );
  };

  const renderExpense = (expense: Expense) => {
    const pet = pets.find(p => p.id === expense.petId);
    return (
      <Card key={expense.id} style={styles.expenseCard}>
        <View style={styles.expenseHeader}>
          <View style={styles.expenseInfo}>
            <Text style={styles.expenseCategory}>
              {expense.category.charAt(0).toUpperCase() + expense.category.slice(1)}
            </Text>
            {pet && <Text style={styles.expensePet}>{pet.name}</Text>}
          </View>
          <Text style={styles.expenseAmount}>
            {formatCurrency(expense.amount, settings.defaultCurrency)}
          </Text>
        </View>
        {expense.description && (
          <Text style={styles.expenseDescription}>{expense.description}</Text>
        )}
        {expense.vendor && (
          <Text style={styles.expenseVendor}>Vendor: {expense.vendor}</Text>
        )}
        <Text style={styles.expenseDate}>{formatDate(expense.date)}</Text>
        <View style={styles.expenseActions}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('ExpenseForm' as never, {
                expenseId: expense.id,
                petId: expense.petId,
              } as never)
            }
          >
            <Text style={styles.editButton}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDelete(expense)}>
            <Text style={styles.deleteButton}>Delete</Text>
          </TouchableOpacity>
        </View>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.filters}>
        <View style={styles.filterRow}>
          <Text style={styles.filterLabel}>Filter by Pet:</Text>
          <TouchableOpacity
            style={[styles.filterButton, !selectedPetId && styles.filterButtonActive]}
            onPress={() => setSelectedPetId(null)}
          >
            <Text style={[styles.filterButtonText, !selectedPetId && styles.filterButtonTextActive]}>
              All
            </Text>
          </TouchableOpacity>
          {pets.map(pet => (
            <TouchableOpacity
              key={pet.id}
              style={[styles.filterButton, selectedPetId === pet.id && styles.filterButtonActive]}
              onPress={() => setSelectedPetId(selectedPetId === pet.id ? null : pet.id)}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  selectedPetId === pet.id && styles.filterButtonTextActive,
                ]}
              >
                {pet.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.filterRow}>
          <Text style={styles.filterLabel}>Filter by Category:</Text>
          <TouchableOpacity
            style={[styles.filterButton, !selectedCategory && styles.filterButtonActive]}
            onPress={() => setSelectedCategory(null)}
          >
            <Text style={[styles.filterButtonText, !selectedCategory && styles.filterButtonTextActive]}>
              All
            </Text>
          </TouchableOpacity>
          {EXPENSE_CATEGORIES.map(category => (
            <TouchableOpacity
              key={category}
              style={[
                styles.filterButton,
                selectedCategory === category && styles.filterButtonActive,
              ]}
              onPress={() => setSelectedCategory(selectedCategory === category ? null : category)}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  selectedCategory === category && styles.filterButtonTextActive,
                ]}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.summary}>
        <Text style={styles.summaryLabel}>Total:</Text>
        <Text style={styles.summaryAmount}>
          {formatCurrency(totalAmount, settings.defaultCurrency)}
        </Text>
      </View>

      {filteredExpenses.length === 0 ? (
        <EmptyState
          title="No expenses"
          message="Add expenses to track your pet care costs"
          actionLabel="Add Expense"
          onAction={() => navigation.navigate('ExpenseForm' as never, {} as never)}
        />
      ) : (
        <FlatList
          data={filteredExpenses}
          renderItem={({ item }) => renderExpense(item)}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          ListHeaderComponent={
            <View style={styles.header}>
              <Text style={styles.headerText}>Expenses</Text>
              <Button
                title="+ Add Expense"
                onPress={() => navigation.navigate('ExpenseForm' as never, {} as never)}
                style={styles.addButton}
              />
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  filters: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: 12,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginRight: 8,
    color: '#000',
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#E5E5EA',
    marginRight: 8,
    marginBottom: 4,
  },
  filterButtonActive: {
    backgroundColor: '#007AFF',
  },
  filterButtonText: {
    fontSize: 12,
    color: '#000',
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  summary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  summaryLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  summaryAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  list: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  addButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  expenseCard: {
    marginBottom: 12,
  },
  expenseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  expenseInfo: {
    flex: 1,
  },
  expenseCategory: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  expensePet: {
    fontSize: 12,
    color: '#666',
  },
  expenseAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  expenseDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  expenseVendor: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  expenseDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  expenseActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
    gap: 16,
  },
  editButton: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
  },
  deleteButton: {
    color: '#FF3B30',
    fontSize: 14,
    fontWeight: '600',
  },
});

