import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useVaccines } from '@/hooks/useVaccines';
import { usePets } from '@/hooks/usePets';
import { Card } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { EmptyState } from '@/components/EmptyState';
import { Button } from '@/components/Button';
import { Vaccine, VaccineStatus } from '@/types/vaccine';
import { formatDate } from '@/utils/formatters';
import { getDaysUntil } from '@/services/dates/dateUtils';

export const VaccineListScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { petId } = (route.params as { petId: string }) || {};
  const { vaccines, deleteVaccine } = useVaccines();
  const { getPetById } = usePets();

  const pet = petId ? getPetById(petId) : undefined;
  const petVaccines = useMemo(() => {
    return petId ? vaccines.filter(v => v.petId === petId) : vaccines;
  }, [vaccines, petId]);

  const groupedVaccines = useMemo(() => {
    const grouped: Record<VaccineStatus, Vaccine[]> = {
      overdue: [],
      upcoming: [],
      completed: [],
    };
    petVaccines.forEach(v => {
      grouped[v.status].push(v);
    });
    return grouped;
  }, [petVaccines]);

  const handleDelete = (vaccine: Vaccine) => {
    Alert.alert(
      'Delete Vaccine',
      `Are you sure you want to delete ${vaccine.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteVaccine(vaccine.id);
            } catch (error) {
              Alert.alert('Error', 'Failed to delete vaccine');
            }
          },
        },
      ]
    );
  };

  const renderVaccine = (vaccine: Vaccine) => (
    <Card key={vaccine.id} style={styles.vaccineCard}>
      <View style={styles.vaccineHeader}>
        <Text style={styles.vaccineName}>{vaccine.name}</Text>
        <Badge
          label={vaccine.status}
          variant={
            vaccine.status === 'overdue'
              ? 'danger'
              : vaccine.status === 'completed'
              ? 'success'
              : 'info'
          }
        />
      </View>
      {vaccine.dateAdministered && (
        <Text style={styles.vaccineDetail}>
          Administered: {formatDate(vaccine.dateAdministered)}
        </Text>
      )}
      <Text style={styles.vaccineDetail}>
        Next due: {formatDate(vaccine.nextDueDate)}
        {vaccine.status === 'upcoming' && (
          <Text style={styles.daysText}>
            {' '}(in {getDaysUntil(vaccine.nextDueDate)} days)
          </Text>
        )}
      </Text>
      {vaccine.vetClinicName && (
        <Text style={styles.vaccineDetail}>Vet: {vaccine.vetClinicName}</Text>
      )}
      {vaccine.notes && (
        <Text style={styles.vaccineNotes}>{vaccine.notes}</Text>
      )}
      <View style={styles.vaccineActions}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('VaccineForm' as never, { vaccineId: vaccine.id, petId: vaccine.petId } as never)
          }
        >
          <Text style={styles.editButton}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDelete(vaccine)}>
          <Text style={styles.deleteButton}>Delete</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );

  if (petVaccines.length === 0) {
    return (
      <View style={styles.container}>
        <EmptyState
          title="No vaccines recorded"
          message={pet ? `Add vaccines for ${pet.name}` : 'Add vaccines for your pets'}
          actionLabel="Add Vaccine"
          onAction={() =>
            navigation.navigate('VaccineForm' as never, { petId: petId || '' } as never)
          }
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={[
          ...groupedVaccines.overdue,
          ...groupedVaccines.upcoming,
          ...groupedVaccines.completed,
        ]}
        renderItem={({ item }) => renderVaccine(item)}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.headerText}>
              {pet ? `${pet.name}'s Vaccines` : 'All Vaccines'}
            </Text>
            <Button
              title="+ Add Vaccine"
              onPress={() =>
                navigation.navigate('VaccineForm' as never, { petId: petId || '' } as never)
              }
              style={styles.addButton}
            />
          </View>
        }
      />
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
  vaccineCard: {
    marginBottom: 12,
  },
  vaccineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  vaccineName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    flex: 1,
  },
  vaccineDetail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  daysText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  vaccineNotes: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    fontStyle: 'italic',
  },
  vaccineActions: {
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

