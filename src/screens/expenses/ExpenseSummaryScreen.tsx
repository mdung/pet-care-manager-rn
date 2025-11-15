import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useExpenses } from '@/hooks/useExpenses';
import { usePets } from '@/hooks/usePets';
import { useSettings } from '@/hooks/useSettings';
import { Card } from '@/components/Card';
import { ExpenseCharts } from '@/components/ExpenseCharts';
import { Button } from '@/components/Button';
import { formatCurrency } from '@/utils/formatters';
import { EXPENSE_CATEGORIES } from '@/utils/constants';
import { shareService } from '@/services/sharing/shareService';
import Toast from 'react-native-toast-message';
import dayjs from 'dayjs';

export const ExpenseSummaryScreen: React.FC = () => {
  const { expenses } = useExpenses();
  const { pets } = usePets();
  const { settings } = useSettings();

  const handleShareReport = async () => {
    try {
      // Share overall expense report
      let reportText = `💰 Overall Expense Report\n\n`;
      reportText += `Total Spent: ${formatCurrency(
        expenses.reduce((sum, e) => sum + e.amount, 0),
        settings.defaultCurrency
      )}\n`;
      reportText += `Total Expenses: ${expenses.length}\n\n`;
      
      const isAvailable = await require('expo-sharing').Sharing.isAvailableAsync();
      if (isAvailable) {
        await require('expo-sharing').Sharing.shareAsync(reportText as any);
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Expense report shared',
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to share report',
      });
    }
  };

  const currentMonth = dayjs().format('YYYY-MM');
  const currentYear = dayjs().format('YYYY');

  const monthlyExpenses = useMemo(() => {
    return expenses.filter(e => dayjs(e.date).format('YYYY-MM') === currentMonth);
  }, [expenses, currentMonth]);

  const yearlyExpenses = useMemo(() => {
    return expenses.filter(e => dayjs(e.date).format('YYYY') === currentYear);
  }, [expenses, currentYear]);

  const expensesByCategory = useMemo(() => {
    const categoryTotals: Record<string, number> = {};
    expenses.forEach(e => {
      categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
    });
    return categoryTotals;
  }, [expenses]);

  const expensesByPet = useMemo(() => {
    const petTotals: Record<string, number> = {};
    expenses.forEach(e => {
      petTotals[e.petId] = (petTotals[e.petId] || 0) + e.amount;
    });
    return petTotals;
  }, [expenses]);

  const totalMonthly = monthlyExpenses.reduce((sum, e) => sum + e.amount, 0);
  const totalYearly = yearlyExpenses.reduce((sum, e) => sum + e.amount, 0);
  const totalAll = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <ScrollView style={styles.container}>
      <ExpenseCharts expenses={expenses} currency={settings.defaultCurrency} />
      <View style={styles.content}>
        <View style={styles.shareButtonContainer}>
          <Button
            title="Share Expense Report"
            onPress={handleShareReport}
            variant="secondary"
            style={styles.shareButton}
          />
        </View>
        <Card style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>This Month:</Text>
            <Text style={styles.summaryValue}>
              {formatCurrency(totalMonthly, settings.defaultCurrency)}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>This Year:</Text>
            <Text style={styles.summaryValue}>
              {formatCurrency(totalYearly, settings.defaultCurrency)}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>All Time:</Text>
            <Text style={styles.summaryValue}>
              {formatCurrency(totalAll, settings.defaultCurrency)}
            </Text>
          </View>
        </Card>

        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>By Category</Text>
          {EXPENSE_CATEGORIES.map(category => {
            const amount = expensesByCategory[category] || 0;
            const percentage = totalAll > 0 ? (amount / totalAll) * 100 : 0;
            return (
              <View key={category} style={styles.categoryRow}>
                <View style={styles.categoryInfo}>
                  <Text style={styles.categoryName}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </Text>
                  <Text style={styles.categoryPercentage}>
                    {percentage.toFixed(1)}%
                  </Text>
                </View>
                <Text style={styles.categoryAmount}>
                  {formatCurrency(amount, settings.defaultCurrency)}
                </Text>
              </View>
            );
          })}
        </Card>

        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>By Pet</Text>
          {pets.map(pet => {
            const amount = expensesByPet[pet.id] || 0;
            return (
              <View key={pet.id} style={styles.petRow}>
                <Text style={styles.petName}>{pet.name}</Text>
                <Text style={styles.petAmount}>
                  {formatCurrency(amount, settings.defaultCurrency)}
                </Text>
              </View>
            );
          })}
        </Card>
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
  summaryCard: {
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#666',
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    color: '#000',
    marginRight: 8,
  },
  categoryPercentage: {
    fontSize: 12,
    color: '#999',
  },
  categoryAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  petRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  petName: {
    fontSize: 16,
    color: '#000',
  },
  petAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  shareButtonContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  shareButton: {
    marginBottom: 16,
  },
});

