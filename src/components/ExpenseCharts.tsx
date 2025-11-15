import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { PieChart, BarChart, LineChart } from 'react-native-chart-kit';
import { Expense } from '@/types/expense';
import { formatCurrency } from '@/utils/formatters';
import dayjs from 'dayjs';

const screenWidth = Dimensions.get('window').width;

interface ExpenseChartsProps {
  expenses: Expense[];
  currency: string;
}

export const ExpenseCharts: React.FC<ExpenseChartsProps> = ({ expenses, currency }) => {
  // Pie chart data by category
  const categoryData = useMemo(() => {
    const categoryTotals: Record<string, number> = {};
    expenses.forEach(e => {
      categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
    });

    const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];
    let colorIndex = 0;

    return {
      labels: Object.keys(categoryTotals).map(cat => cat.charAt(0).toUpperCase() + cat.slice(1)),
      datasets: [{
        data: Object.values(categoryTotals),
        colors: Object.keys(categoryTotals).map(() => colors[colorIndex++ % colors.length]),
      }],
    };
  }, [expenses]);

  // Monthly bar chart data
  const monthlyData = useMemo(() => {
    const monthlyTotals: Record<string, number> = {};
    expenses.forEach(e => {
      const month = dayjs(e.date).format('MMM YYYY');
      monthlyTotals[month] = (monthlyTotals[month] || 0) + e.amount;
    });

    const sortedMonths = Object.keys(monthlyTotals).sort((a, b) => 
      dayjs(a, 'MMM YYYY').valueOf() - dayjs(b, 'MMM YYYY').valueOf()
    );

    return {
      labels: sortedMonths,
      datasets: [{
        data: sortedMonths.map(month => monthlyTotals[month]),
      }],
    };
  }, [expenses]);

  // Line chart data (trend over time)
  const trendData = useMemo(() => {
    const dailyTotals: Record<string, number> = {};
    expenses.forEach(e => {
      const date = dayjs(e.date).format('MM/DD');
      dailyTotals[date] = (dailyTotals[date] || 0) + e.amount;
    });

    const sortedDates = Object.keys(dailyTotals).sort((a, b) => 
      dayjs(a, 'MM/DD').valueOf() - dayjs(b, 'MM/DD').valueOf()
    );

    return {
      labels: sortedDates.slice(-7), // Last 7 days
      datasets: [{
        data: sortedDates.slice(-7).map(date => dailyTotals[date]),
        color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
        strokeWidth: 2,
      }],
    };
  }, [expenses]);

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 2,
    color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
  };

  if (expenses.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No expense data to display</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Expenses by Category</Text>
        {categoryData.labels.length > 0 && (
          <PieChart
            data={categoryData}
            width={screenWidth - 32}
            height={220}
            chartConfig={chartConfig}
            accessor="data"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
        )}
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Monthly Expenses</Text>
        {monthlyData.labels.length > 0 && (
          <BarChart
            data={monthlyData}
            width={screenWidth - 32}
            height={220}
            chartConfig={chartConfig}
            verticalLabelRotation={30}
            fromZero
          />
        )}
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Expense Trends (Last 7 Days)</Text>
        {trendData.labels.length > 0 && (
          <LineChart
            data={trendData}
            width={screenWidth - 32}
            height={220}
            chartConfig={chartConfig}
            bezier
          />
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  chartContainer: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 16,
    textAlign: 'center',
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});

