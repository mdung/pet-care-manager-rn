import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { useWeights } from '@/context/WeightContext';
import { usePets } from '@/hooks/usePets';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { formatDate } from '@/utils/formatters';
import dayjs from 'dayjs';

const screenWidth = Dimensions.get('window').width;

export const WeightTrackingScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { petId } = (route.params as { petId: string }) || {};
  const { getWeightsByPetId } = useWeights();
  const { getPetById } = usePets();

  const pet = petId ? getPetById(petId) : undefined;
  const weights = useMemo(() => {
    return petId ? getWeightsByPetId(petId) : [];
  }, [petId, getWeightsByPetId]);

  const chartData = useMemo(() => {
    if (weights.length === 0) return null;

    const sortedWeights = [...weights].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    return {
      labels: sortedWeights.map(w => dayjs(w.date).format('MM/DD')),
      datasets: [{
        data: sortedWeights.map(w => w.weight),
        color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
        strokeWidth: 2,
      }],
    };
  }, [weights]);

  const latestWeight = weights.length > 0 
    ? weights.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]
    : null;

  if (!pet) {
    return (
      <View style={styles.container}>
        <Text>Pet not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Card style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Weight Tracking - {pet.name}</Text>
          {latestWeight ? (
            <View style={styles.currentWeight}>
              <Text style={styles.currentWeightLabel}>Current Weight:</Text>
              <Text style={styles.currentWeightValue}>{latestWeight.weight} kg</Text>
              <Text style={styles.currentWeightDate}>
                {formatDate(latestWeight.date)}
              </Text>
            </View>
          ) : (
            <Text style={styles.noDataText}>No weight records yet</Text>
          )}
        </Card>

        {chartData && (
          <Card style={styles.chartCard}>
            <Text style={styles.chartTitle}>Weight History</Text>
            <LineChart
              data={chartData}
              width={screenWidth - 64}
              height={220}
              chartConfig={{
                backgroundColor: '#ffffff',
                backgroundGradientFrom: '#ffffff',
                backgroundGradientTo: '#ffffff',
                decimalPlaces: 1,
                color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: { borderRadius: 16 },
              }}
              bezier
            />
          </Card>
        )}

        <Card style={styles.historyCard}>
          <Text style={styles.historyTitle}>Weight History</Text>
          {weights.length === 0 ? (
            <Text style={styles.noDataText}>No weight records</Text>
          ) : (
            weights
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map(weight => (
                <View key={weight.id} style={styles.weightItem}>
                  <View style={styles.weightItemLeft}>
                    <Text style={styles.weightValue}>{weight.weight} kg</Text>
                    <Text style={styles.weightDate}>{formatDate(weight.date)}</Text>
                    {weight.notes && (
                      <Text style={styles.weightNotes}>{weight.notes}</Text>
                    )}
                  </View>
                </View>
              ))
          )}
        </Card>

        <Button
          title="+ Add Weight Record"
          onPress={() => navigation.navigate('WeightForm' as never, { petId } as never)}
          style={styles.addButton}
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
  summaryCard: {
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
  },
  currentWeight: {
    alignItems: 'center',
  },
  currentWeightLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  currentWeightValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 4,
  },
  currentWeightDate: {
    fontSize: 12,
    color: '#999',
  },
  noDataText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    padding: 16,
  },
  chartCard: {
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 16,
    textAlign: 'center',
  },
  historyCard: {
    marginBottom: 16,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
  },
  weightItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  weightItemLeft: {
    flex: 1,
  },
  weightValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  weightDate: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  weightNotes: {
    fontSize: 14,
    color: '#666',
  },
  addButton: {
    marginTop: 8,
    marginBottom: 32,
  },
});

