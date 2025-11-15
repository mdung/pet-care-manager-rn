import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { usePets } from '@/hooks/usePets';
import { useVaccines } from '@/hooks/useVaccines';
import { useReminders } from '@/hooks/useReminders';
import { useExpenses } from '@/hooks/useExpenses';
import { Card } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { getAge } from '@/services/dates/dateUtils';
import { formatDate } from '@/utils/formatters';
import { VaccineStatus } from '@/types/vaccine';

export const PetDetailScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { petId } = (route.params as { petId: string }) || {};
  const { getPetById, deletePet } = usePets();
  const { getVaccinesByPetId } = useVaccines();
  const { getRemindersByPetId } = useReminders();
  const { getExpensesByPetId } = useExpenses();

  const pet = petId ? getPetById(petId) : undefined;

  if (!pet) {
    return (
      <View style={styles.container}>
        <Text>Pet not found</Text>
      </View>
    );
  }

  const vaccines = getVaccinesByPetId(petId);
  const reminders = getRemindersByPetId(petId);
  const expenses = getExpensesByPetId(petId);

  const upcomingVaccines = vaccines.filter(v => v.status === 'upcoming');
  const overdueVaccines = vaccines.filter(v => v.status === 'overdue');
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

  const handleDelete = () => {
    Alert.alert(
      'Delete Pet',
      `Are you sure you want to delete ${pet.name}? This will also delete all associated vaccines, reminders, and expenses.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deletePet(pet.id);
              navigation.goBack();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete pet');
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        {pet.avatarUri ? (
          <Image source={{ uri: pet.avatarUri }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>{pet.name[0].toUpperCase()}</Text>
          </View>
        )}
        <Text style={styles.name}>{pet.name}</Text>
        <Text style={styles.details}>
          {pet.species.charAt(0).toUpperCase() + pet.species.slice(1)}
          {pet.breed && ` • ${pet.breed}`}
        </Text>
        <Text style={styles.age}>{getAge(pet.dateOfBirth)} old</Text>
      </View>

      <View style={styles.actions}>
        <Button
          title="Edit Pet"
          onPress={() => navigation.navigate('PetForm' as never, { petId: pet.id } as never)}
          variant="secondary"
          style={styles.actionButton}
        />
        <Button
          title="Delete Pet"
          onPress={handleDelete}
          variant="danger"
          style={styles.actionButton}
        />
      </View>

      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Stats</Text>
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{vaccines.length}</Text>
            <Text style={styles.statLabel}>Vaccines</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{reminders.length}</Text>
            <Text style={styles.statLabel}>Reminders</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>${totalExpenses.toFixed(2)}</Text>
            <Text style={styles.statLabel}>Total Expenses</Text>
          </View>
        </View>
        {overdueVaccines.length > 0 && (
          <View style={styles.alert}>
            <Text style={styles.alertText}>
              ⚠️ {overdueVaccines.length} overdue vaccine{overdueVaccines.length > 1 ? 's' : ''}
            </Text>
          </View>
        )}
      </Card>

      <Card style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Vaccines</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('VaccineList' as never, { petId: pet.id } as never)}
          >
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        {vaccines.length === 0 ? (
          <Text style={styles.emptyText}>No vaccines recorded</Text>
        ) : (
          <View>
            {upcomingVaccines.slice(0, 3).map(vaccine => (
              <View key={vaccine.id} style={styles.listItem}>
                <Text style={styles.listItemText}>{vaccine.name}</Text>
                <Badge
                  label={vaccine.status}
                  variant={vaccine.status === 'overdue' ? 'danger' : 'info'}
                />
              </View>
            ))}
          </View>
        )}
      </Card>

      <Card style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Weight Tracking</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('WeightTracking' as never, { petId: pet.id } as never)}
          >
            <Text style={styles.seeAll}>View</Text>
          </TouchableOpacity>
        </View>
      </Card>

      <Card style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Upcoming Reminders</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('ReminderList' as never, { petId: pet.id } as never)}
          >
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        {reminders.length === 0 ? (
          <Text style={styles.emptyText}>No reminders</Text>
        ) : (
          <View>
            {reminders.slice(0, 3).map(reminder => (
              <View key={reminder.id} style={styles.listItem}>
                <Text style={styles.listItemText}>{reminder.title}</Text>
                <Text style={styles.listItemSubtext}>
                  {formatDate(reminder.reminderDate)}
                </Text>
              </View>
            ))}
          </View>
        )}
      </Card>

      {pet.notes && (
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Notes</Text>
          <Text style={styles.notesText}>{pet.notes}</Text>
        </Card>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    color: '#fff',
    fontSize: 48,
    fontWeight: 'bold',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  details: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  age: {
    fontSize: 14,
    color: '#999',
  },
  actions: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  actionButton: {
    flex: 1,
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
  },
  seeAll: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  alert: {
    marginTop: 12,
    padding: 8,
    backgroundColor: '#FFF3CD',
    borderRadius: 8,
  },
  alertText: {
    color: '#856404',
    fontSize: 14,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  listItemText: {
    fontSize: 16,
    color: '#000',
    flex: 1,
  },
  listItemSubtext: {
    fontSize: 12,
    color: '#666',
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
  },
  notesText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

