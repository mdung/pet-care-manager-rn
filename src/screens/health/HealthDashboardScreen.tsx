import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { usePets } from '@/hooks/usePets';
import { useVaccines } from '@/hooks/useVaccines';
import { useReminders } from '@/hooks/useReminders';
import { Card } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { formatDate } from '@/utils/formatters';
import dayjs from 'dayjs';

export const HealthDashboardScreen: React.FC = () => {
  const navigation = useNavigation();
  const { pets } = usePets();
  const { vaccines } = useVaccines();
  const { reminders } = useReminders();

  const healthStatus = useMemo(() => {
    const overdueVaccines = vaccines.filter(v => v.status === 'overdue');
    const upcomingVaccines = vaccines.filter(v => v.status === 'upcoming');
    const todayReminders = reminders.filter(r => {
      const reminderDate = dayjs(`${r.reminderDate} ${r.reminderTime}`);
      return reminderDate.isSame(dayjs(), 'day');
    });

    const petStatuses = pets.map(pet => {
      const petVaccines = vaccines.filter(v => v.petId === pet.id);
      const petOverdue = petVaccines.filter(v => v.status === 'overdue').length;
      const petUpcoming = petVaccines.filter(v => v.status === 'upcoming').length;
      
      let healthScore = 100;
      if (petOverdue > 0) healthScore -= petOverdue * 20;
      if (petUpcoming > 0) healthScore -= petUpcoming * 5;
      healthScore = Math.max(0, healthScore);

      let status: 'excellent' | 'good' | 'fair' | 'poor' = 'excellent';
      if (healthScore < 50) status = 'poor';
      else if (healthScore < 70) status = 'fair';
      else if (healthScore < 90) status = 'good';

      return {
        pet,
        healthScore,
        status,
        overdueCount: petOverdue,
        upcomingCount: petUpcoming,
      };
    });

    return {
      totalPets: pets.length,
      overdueVaccines: overdueVaccines.length,
      upcomingVaccines: upcomingVaccines.length,
      todayReminders: todayReminders.length,
      petStatuses,
    };
  }, [pets, vaccines, reminders]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return '#34C759';
      case 'good': return '#007AFF';
      case 'fair': return '#FF9500';
      case 'poor': return '#FF3B30';
      default: return '#999';
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Card style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Health Overview</Text>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{healthStatus.totalPets}</Text>
              <Text style={styles.summaryLabel}>Total Pets</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryValue, styles.dangerValue]}>
                {healthStatus.overdueVaccines}
              </Text>
              <Text style={styles.summaryLabel}>Overdue</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryValue, styles.warningValue]}>
                {healthStatus.upcomingVaccines}
              </Text>
              <Text style={styles.summaryLabel}>Upcoming</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{healthStatus.todayReminders}</Text>
              <Text style={styles.summaryLabel}>Today</Text>
            </View>
          </View>
        </Card>

        {healthStatus.overdueVaccines > 0 && (
          <Card style={styles.alertCard}>
            <Text style={styles.alertTitle}>⚠️ Action Required</Text>
            <Text style={styles.alertText}>
              You have {healthStatus.overdueVaccines} overdue vaccine{healthStatus.overdueVaccines > 1 ? 's' : ''}
            </Text>
            <TouchableOpacity
              style={styles.alertButton}
              onPress={() => navigation.navigate('VaccineList' as never, {} as never)}
            >
              <Text style={styles.alertButtonText}>View Vaccines</Text>
            </TouchableOpacity>
          </Card>
        )}

        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Pet Health Status</Text>
          {healthStatus.petStatuses.map(({ pet, healthScore, status, overdueCount, upcomingCount }) => (
            <TouchableOpacity
              key={pet.id}
              style={styles.petStatusItem}
              onPress={() => navigation.navigate('PetDetail' as never, { petId: pet.id } as never)}
            >
              <View style={styles.petStatusLeft}>
                <Text style={styles.petName}>{pet.name}</Text>
                <View style={styles.petStatusBadges}>
                  {overdueCount > 0 && (
                    <Badge label={`${overdueCount} Overdue`} variant="danger" />
                  )}
                  {upcomingCount > 0 && (
                    <Badge label={`${upcomingCount} Upcoming`} variant="warning" />
                  )}
                </View>
              </View>
              <View style={styles.petStatusRight}>
                <View style={[styles.healthScoreCircle, { borderColor: getStatusColor(status) }]}>
                  <Text style={[styles.healthScoreText, { color: getStatusColor(status) }]}>
                    {healthScore}
                  </Text>
                </View>
                <Text style={[styles.statusText, { color: getStatusColor(status) }]}>
                  {status.toUpperCase()}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </Card>

        <Card style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming Vaccines</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('VaccineList' as never, {} as never)}
            >
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          {vaccines
            .filter(v => v.status === 'upcoming')
            .sort((a, b) => new Date(a.nextDueDate).getTime() - new Date(b.nextDueDate).getTime())
            .slice(0, 5)
            .map(vaccine => {
              const pet = pets.find(p => p.id === vaccine.petId);
              return (
                <View key={vaccine.id} style={styles.vaccineItem}>
                  <View style={styles.vaccineInfo}>
                    <Text style={styles.vaccineName}>{vaccine.name}</Text>
                    {pet && <Text style={styles.vaccinePet}>{pet.name}</Text>}
                  </View>
                  <Text style={styles.vaccineDate}>{formatDate(vaccine.nextDueDate)}</Text>
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
    fontSize: 32,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 4,
  },
  dangerValue: {
    color: '#FF3B30',
  },
  warningValue: {
    color: '#FF9500',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666',
  },
  alertCard: {
    backgroundColor: '#FFF3CD',
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9500',
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#856404',
    marginBottom: 8,
  },
  alertText: {
    fontSize: 14,
    color: '#856404',
    marginBottom: 12,
  },
  alertButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FF9500',
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  alertButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  section: {
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
  petStatusItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  petStatusLeft: {
    flex: 1,
  },
  petName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  petStatusBadges: {
    flexDirection: 'row',
    gap: 8,
  },
  petStatusRight: {
    alignItems: 'center',
  },
  healthScoreCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  healthScoreText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
  },
  vaccineItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  vaccineInfo: {
    flex: 1,
  },
  vaccineName: {
    fontSize: 16,
    color: '#000',
    marginBottom: 2,
  },
  vaccinePet: {
    fontSize: 12,
    color: '#666',
  },
  vaccineDate: {
    fontSize: 12,
    color: '#666',
  },
});

