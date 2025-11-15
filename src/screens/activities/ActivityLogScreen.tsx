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
import { Badge } from '@/components/Badge';
import { formatDate, formatDateTime } from '@/utils/formatters';
import { ACTIVITY_TYPES, MOOD_TYPES } from '@/utils/constants';
import { activityStorage } from '@/services/storage/activityStorage';
import { ActivityLog } from '@/types/activity';
import { usePets } from '@/hooks/usePets';

export const ActivityLogScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { petId } = (route.params as { petId?: string }) || {};
  const { pets } = usePets();
  const [activities, setActivities] = React.useState<ActivityLog[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    loadActivities();
  }, [petId]);

  const loadActivities = async () => {
    try {
      if (petId) {
        const records = await activityStorage.getByPetId(petId);
        setActivities(records);
      } else {
        const allRecords = await activityStorage.getAll();
        setActivities(allRecords);
      }
    } catch (error) {
      console.error('Error loading activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const pet = petId ? pets.find(p => p.id === petId) : undefined;

  const moodStats = useMemo(() => {
    const stats: Record<string, number> = {};
    activities.forEach(a => {
      if (a.mood) {
        stats[a.mood] = (stats[a.mood] || 0) + 1;
      }
    });
    return stats;
  }, [activities]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {activities.length > 0 && Object.keys(moodStats).length > 0 && (
        <Card style={styles.moodCard}>
          <Text style={styles.moodTitle}>Mood Summary</Text>
          <View style={styles.moodStats}>
            {Object.entries(moodStats).map(([mood, count]) => (
              <View key={mood} style={styles.moodStatItem}>
                <Text style={styles.moodLabel}>{mood}</Text>
                <Text style={styles.moodCount}>{count}</Text>
              </View>
            ))}
          </View>
        </Card>
      )}

      {activities.length === 0 ? (
        <EmptyState
          title="No activity logs"
          message={pet ? `Add activity logs for ${pet.name}` : 'Add activity logs'}
          actionLabel="Add Activity"
          onAction={() => navigation.navigate('ActivityForm' as never, { petId: petId || '' } as never)}
        />
      ) : (
        <FlatList
          data={activities}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <Card style={styles.activityCard}>
              <View style={styles.activityHeader}>
                <Text style={styles.activityType}>
                  {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                </Text>
                {item.mood && (
                  <Badge
                    label={item.mood}
                    variant={item.mood === 'happy' ? 'success' : 'info'}
                  />
                )}
              </View>
              <Text style={styles.activityDateTime}>
                {item.time
                  ? formatDateTime(item.date, item.time)
                  : formatDate(item.date)}
              </Text>
              {item.duration && (
                <Text style={styles.activityDuration}>Duration: {item.duration} minutes</Text>
              )}
              {item.description && (
                <Text style={styles.activityDescription}>{item.description}</Text>
              )}
              {item.behaviorNotes && (
                <Text style={styles.activityBehavior}>Behavior: {item.behaviorNotes}</Text>
              )}
            </Card>
          )}
          ListHeaderComponent={
            <View style={styles.header}>
              <Text style={styles.headerText}>
                {pet ? `${pet.name}'s Activity Log` : 'All Activity Logs'}
              </Text>
              <Button
                title="+ Add Activity"
                onPress={() => navigation.navigate('ActivityForm' as never, { petId: petId || '' } as never)}
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
  moodCard: {
    margin: 16,
    marginBottom: 0,
  },
  moodTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
  },
  moodStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  moodStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 8,
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
  },
  moodLabel: {
    fontSize: 14,
    color: '#666',
  },
  moodCount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  activityCard: {
    marginBottom: 12,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  activityType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  activityDateTime: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  activityDuration: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  activityDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  activityBehavior: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
    fontStyle: 'italic',
  },
});

