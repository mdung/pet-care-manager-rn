import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Pet } from '@/types/pet';
import { formatDate } from '@/utils/formatters';
import { getAge } from '@/services/dates/dateUtils';

interface PetInfoWidgetProps {
  pet: Pet;
  compact?: boolean;
}

/**
 * Pet Info Widget Component
 * 
 * This component displays essential pet information in a widget-friendly format.
 * For actual home screen widgets, this would need to be implemented natively:
 * - iOS: Using WidgetKit
 * - Android: Using App Widgets
 * 
 * This component can be used within the app as a preview or for widget configuration.
 */
export const PetInfoWidget: React.FC<PetInfoWidgetProps> = ({ pet, compact = false }) => {
  return (
    <View style={[styles.container, compact && styles.compact]}>
      <View style={styles.header}>
        <Text style={styles.petName}>{pet.name}</Text>
        <Text style={styles.petSpecies}>
          {pet.species.charAt(0).toUpperCase() + pet.species.slice(1)}
        </Text>
      </View>
      
      {!compact && (
        <>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Age:</Text>
            <Text style={styles.value}>{getAge(pet.dateOfBirth)}</Text>
          </View>
          
          {pet.breed && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>Breed:</Text>
              <Text style={styles.value}>{pet.breed}</Text>
            </View>
          )}
          
          {pet.microchipNumber && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>Microchip:</Text>
              <Text style={styles.value}>{pet.microchipNumber}</Text>
            </View>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  compact: {
    padding: 12,
  },
  header: {
    marginBottom: 8,
  },
  petName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  petSpecies: {
    fontSize: 14,
    color: '#666',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    color: '#999',
  },
  value: {
    fontSize: 12,
    color: '#000',
    fontWeight: '500',
  },
});

