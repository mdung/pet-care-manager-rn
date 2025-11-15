import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useReminders } from '@/hooks/useReminders';
import { usePets } from '@/hooks/usePets';
import { Card } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { EmptyState } from '@/components/EmptyState';
import { Button } from '@/components/Button';
import { Reminder } from '@/types/reminder';
import { formatDateTime, getRelativeTime } from '@/utils/formatters';
import { getReminderStatus } from '@/services/dates/dateUtils';

type SortOption = 'date' | 'type' | 'title';

export const ReminderListScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { petId } = (route.params as { petId?: string }) || {};
  const { reminders, deleteReminder } = useReminders();
  const { getPetById } = usePets();
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string | 'all'>('all');
  const [sortBy, setSortBy] = useState<SortOption>('date');

  const pet = petId ? getPetById(petId) : undefined;
  const petReminders = useMemo(() => {
    return petId ? reminders.filter(r => r.petId === petId) : reminders;
  }, [reminders, petId]);

  const filteredAndSortedReminders = useMemo(() => {
    let filtered = petReminders;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        r =>
          r.title.toLowerCase().includes(query) ||
          r.description?.toLowerCase().includes(query)
      );
    }

    // Apply type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(r => r.type === typeFilter);
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'date':
          const dateA = new Date(`${a.reminderDate} ${a.reminderTime}`).getTime();
          const dateB = new Date(`${b.reminderDate} ${b.reminderTime}`).getTime();
          return dateA - dateB;
        case 'type':
          return a.type.localeCompare(b.type);
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    return sorted;
  }, [petReminders, searchQuery, typeFilter, sortBy]);

  const handleDelete = (reminder: Reminder) => {
    Alert.alert(
      'Delete Reminder',
      `Are you sure you want to delete "${reminder.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteReminder(reminder.id);
            } catch (error) {
              Alert.alert('Error', 'Failed to delete reminder');
            }
          },
        },
      ]
    );
  };

  const renderReminder = (reminder: Reminder) => {
    const status = getReminderStatus(reminder.reminderDate, reminder.reminderTime);
    const statusVariant =
      status === 'past' ? 'default' : status === 'today' ? 'warning' : 'info';

    return (
      <Card key={reminder.id} style={styles.reminderCard}>
        <View style={styles.reminderHeader}>
          <Text style={styles.reminderTitle}>{reminder.title}</Text>
          <Badge label={status} variant={statusVariant} />
        </View>
        <Text style={styles.reminderType}>
          {reminder.type.replace('_', ' ').toUpperCase()}
        </Text>
        <Text style={styles.reminderDateTime}>
          {formatDateTime(reminder.reminderDate, reminder.reminderTime)}
        </Text>
        <Text style={styles.reminderRelative}>
          {getRelativeTime(`${reminder.reminderDate} ${reminder.reminderTime}`)}
        </Text>
        {reminder.description && (
          <Text style={styles.reminderDescription}>{reminder.description}</Text>
        )}
        {reminder.repeat !== 'none' && (
          <Text style={styles.reminderRepeat}>
            Repeats: {reminder.repeat}
          </Text>
        )}
        <View style={styles.reminderActions}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('ReminderForm' as never, {
                reminderId: reminder.id,
                petId: reminder.petId,
              } as never)
            }
          >
            <Text style={styles.editButton}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDelete(reminder)}>
            <Text style={styles.deleteButton}>Delete</Text>
          </TouchableOpacity>
        </View>
      </Card>
    );
  };

  if (petReminders.length === 0) {
    return (
      <View style={styles.container}>
        <EmptyState
          title="No reminders"
          message={pet ? `Add reminders for ${pet.name}` : 'Add reminders for your pets'}
          actionLabel="Add Reminder"
          onAction={() =>
            navigation.navigate('ReminderForm' as never, { petId: petId || '' } as never)
          }
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredAndSortedReminders}
        renderItem={({ item }) => renderReminder(item)}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No reminders found</Text>
          </View>
        }
        ListHeaderComponent={
          <View>
            <View style={styles.header}>
              <Text style={styles.headerText}>
                {pet ? `${pet.name}'s Reminders` : 'All Reminders'}
              </Text>
              <Button
                title="+ Add Reminder"
                onPress={() =>
                  navigation.navigate('ReminderForm' as never, { petId: petId || '' } as never)
                }
                style={styles.addButton}
              />
            </View>
            <View style={styles.filterContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search by title or description..."
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              <View style={styles.filterRow}>
                <Text style={styles.filterLabel}>Type:</Text>
                {(['all', 'vet_visit', 'medicine', 'grooming', 'custom'] as const).map(type => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.filterButton,
                      typeFilter === type && styles.filterButtonActive,
                    ]}
                    onPress={() => setTypeFilter(type)}
                  >
                    <Text
                      style={[
                        styles.filterButtonText,
                        typeFilter === type && styles.filterButtonTextActive,
                      ]}
                    >
                      {type === 'all' ? 'All' : type.replace('_', ' ').toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={styles.sortRow}>
                <Text style={styles.sortLabel}>Sort by:</Text>
                {(['date', 'type', 'title'] as SortOption[]).map(option => (
                  <TouchableOpacity
                    key={option}
                    style={[styles.sortButton, sortBy === option && styles.sortButtonActive]}
                    onPress={() => setSortBy(option)}
                  >
                    <Text
                      style={[
                        styles.sortButtonText,
                        sortBy === option && styles.sortButtonTextActive,
                      ]}
                    >
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
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
  reminderCard: {
    marginBottom: 12,
  },
  reminderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reminderTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    flex: 1,
  },
  reminderType: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  reminderDateTime: {
    fontSize: 16,
    color: '#000',
    marginBottom: 4,
  },
  reminderRelative: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  reminderDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  reminderRepeat: {
    fontSize: 12,
    color: '#007AFF',
    marginTop: 8,
    fontWeight: '600',
  },
  reminderActions: {
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
  filterContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#fff',
    marginBottom: 12,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  sortRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginRight: 8,
    color: '#000',
  },
  sortLabel: {
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
  sortButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#E5E5EA',
    marginRight: 8,
    marginBottom: 4,
  },
  sortButtonActive: {
    backgroundColor: '#007AFF',
  },
  sortButtonText: {
    fontSize: 12,
    color: '#000',
  },
  sortButtonTextActive: {
    color: '#fff',
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

