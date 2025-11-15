import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { usePets } from '@/hooks/usePets';
import { useExpenses } from '@/hooks/useExpenses';
import { useVaccines } from '@/hooks/useVaccines';
import { useSettings } from '@/hooks/useSettings';
import { Card } from '@/components/Card';
import { formatCurrency } from '@/utils/formatters';
import { statisticsService } from '@/services/statistics/statisticsService';

export const StatisticsScreen: React.FC = () => {
  const { pets } = usePets();
  const { expenses } = useExpenses();
  const { vaccines } = useVaccines();
  const { settings } = useSettings();

  const stats = useMemo(() => {
    return statisticsService.calculateOverallStatistics(pets, expenses, vaccines);
  }, [pets, expenses, vaccines]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Card style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Overall Statistics</Text>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{stats.totalPets}</Text>
              <Text style={styles.summaryLabel}>Total Pets</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>
                {formatCurrency(stats.totalSpentAll, settings.defaultCurrency)}
              </Text>
              <Text style={styles.summaryLabel}>Total Spent</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>
                {formatCurrency(stats.averageMonthlyExpenseAll, settings.defaultCurrency)}
              </Text>
              <Text style={styles.summaryLabel}>Avg Monthly</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>
                {stats.overallHealthCompliance.toFixed(0)}%
              </Text>
              <Text style={styles.summaryLabel}>Health Compliance</Text>
            </View>
          </View>
        </Card>

        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Key Insights</Text>
          <View style={styles.insightItem}>
            <Text style={styles.insightLabel}>Most Expensive Category:</Text>
            <Text style={styles.insightValue}>
              {stats.mostExpensiveCategoryAll.charAt(0).toUpperCase() + 
               stats.mostExpensiveCategoryAll.slice(1)}
            </Text>
          </View>
          <View style={styles.insightItem}>
            <Text style={styles.insightLabel}>Total Expenses Recorded:</Text>
            <Text style={styles.insightValue}>{stats.totalExpensesAll}</Text>
          </View>
        </Card>

        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Per Pet Statistics</Text>
          {stats.petStatistics.map(stat => {
            const pet = pets.find(p => p.id === stat.petId);
            if (!pet) return null;

            return (
              <TouchableOpacity key={stat.petId} style={styles.petStatItem}>
                <View style={styles.petStatLeft}>
                  <Text style={styles.petStatName}>{pet.name}</Text>
                  <Text style={styles.petStatDetails}>
                    {stat.totalExpenses} expenses • {stat.healthComplianceRate.toFixed(0)}% compliance
                  </Text>
                </View>
                <View style={styles.petStatRight}>
                  <Text style={styles.petStatAmount}>
                    {formatCurrency(stat.totalSpent, settings.defaultCurrency)}
                  </Text>
                  <Text style={styles.petStatCategory}>
                    Top: {stat.mostExpensiveCategory}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </Card>

        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Spending Trends</Text>
          <View style={styles.trendItem}>
            <Text style={styles.trendLabel}>Average Monthly Expense:</Text>
            <Text style={styles.trendValue}>
              {formatCurrency(stats.averageMonthlyExpenseAll, settings.defaultCurrency)}
            </Text>
          </View>
          <View style={styles.trendItem}>
            <Text style={styles.trendLabel}>Total Lifetime Spending:</Text>
            <Text style={styles.trendValue}>
              {formatCurrency(stats.totalSpentAll, settings.defaultCurrency)}
            </Text>
          </View>
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
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  summaryItem: {
    width: '48%',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
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
  insightItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  insightLabel: {
    fontSize: 16,
    color: '#666',
  },
  insightValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  petStatItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  petStatLeft: {
    flex: 1,
  },
  petStatName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  petStatDetails: {
    fontSize: 12,
    color: '#666',
  },
  petStatRight: {
    alignItems: 'flex-end',
  },
  petStatAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 4,
  },
  petStatCategory: {
    fontSize: 12,
    color: '#666',
  },
  trendItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  trendLabel: {
    fontSize: 16,
    color: '#666',
  },
  trendValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
});

