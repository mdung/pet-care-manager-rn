import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Card } from '@/components/Card';
import { EmptyState } from '@/components/EmptyState';
import { Button } from '@/components/Button';
import { formatDate, formatCurrency } from '@/utils/formatters';
import { GROOMING_SERVICE_TYPES } from '@/utils/constants';
import { groomingStorage } from '@/services/storage/groomingStorage';
import { GroomingRecord } from '@/types/grooming';
import { usePets } from '@/hooks/usePets';
import { useSettings } from '@/hooks/useSettings';

export const GroomingListScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { petId } = (route.params as { petId?: string }) || {};
  const { pets } = usePets();
  const { settings } = useSettings();
  const [groomingRecords, setGroomingRecords] = React.useState<GroomingRecord[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    loadGroomingRecords();
  }, [petId]);

  const loadGroomingRecords = async () => {
    try {
      if (petId) {
        const records = await groomingStorage.getByPetId(petId);
        setGroomingRecords(records);
      } else {
        const allRecords = await groomingStorage.getAll();
        setGroomingRecords(allRecords);
      }
    } catch (error) {
      console.error('Error loading grooming records:', error);
    } finally {
      setLoading(false);
    }
  };

  const pet = petId ? pets.find(p => p.id === petId) : undefined;
  const nextGrooming = useMemo(() => {
    return groomingRecords
      .filter(r => r.nextGroomingDate && new Date(r.nextGroomingDate) > new Date())
      .sort((a, b) => new Date(a.nextGroomingDate!).getTime() - new Date(b.nextGroomingDate!).getTime())[0];
  }, [groomingRecords]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {nextGrooming && (
        <Card style={styles.nextGroomingCard}>
          <Text style={styles.nextGroomingTitle}>Next Grooming</Text>
          <Text style={styles.nextGroomingDate}>
            {formatDate(nextGrooming.nextGroomingDate!)}
          </Text>
          {nextGrooming.groomerName && (
            <Text style={styles.nextGroomingGroomer}>
              {nextGrooming.groomerName}
            </Text>
          )}
        </Card>
      )}

      {groomingRecords.length === 0 ? (
        <EmptyState
          title="No grooming records"
          message={pet ? `Add grooming records for ${pet.name}` : 'Add grooming records'}
          actionLabel="Add Grooming"
          onAction={() => navigation.navigate('GroomingForm' as never, { petId: petId || '' } as never)}
        />
      ) : (
        <FlatList
          data={groomingRecords}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <Card style={styles.groomingCard}>
              <View style={styles.groomingHeader}>
                <Text style={styles.groomingService}>
                  {item.serviceType.replace('_', ' ').toUpperCase()}
                </Text>
                {item.cost && (
                  <Text style={styles.groomingCost}>
                    {formatCurrency(item.cost, settings.defaultCurrency)}
                  </Text>
                )}
              </View>
              <Text style={styles.groomingDate}>{formatDate(item.date)}</Text>
              {item.groomerName && (
                <Text style={styles.groomerInfo}>Groomer: {item.groomerName}</Text>
              )}
              {item.nextGroomingDate && (
                <Text style={styles.nextDate}>
                  Next: {formatDate(item.nextGroomingDate)}
                </Text>
              )}
              {item.notes && (
                <Text style={styles.groomingNotes}>{item.notes}</Text>
              )}
            </Card>
          )}
          ListHeaderComponent={
            <View style={styles.header}>
              <Text style={styles.headerText}>
                {pet ? `${pet.name}'s Grooming History` : 'All Grooming Records'}
              </Text>
              <Button
                title="+ Add Grooming"
                onPress={() => navigation.navigate('GroomingForm' as never, { petId: petId || '' } as never)}
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
  nextGroomingCard: {
    margin: 16,
    marginBottom: 0,
    backgroundColor: '#E3F2FD',
  },
  nextGroomingTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1976D2',
    marginBottom: 4,
  },
  nextGroomingDate: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  nextGroomingGroomer: {
    fontSize: 14,
    color: '#666',
  },
  groomingCard: {
    marginBottom: 12,
  },
  groomingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  groomingService: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  groomingCost: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  groomingDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  groomerInfo: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  nextDate: {
    fontSize: 12,
    color: '#007AFF',
    marginBottom: 4,
  },
  groomingNotes: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    fontStyle: 'italic',
  },
});

