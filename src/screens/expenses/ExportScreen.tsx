import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useExpenses } from '@/hooks/useExpenses';
import { usePets } from '@/hooks/usePets';
import { useVaccines } from '@/hooks/useVaccines';
import { useReminders } from '@/hooks/useReminders';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { exportService } from '@/services/export/exportService';
import Toast from 'react-native-toast-message';

export const ExportScreen: React.FC = () => {
  const { pets } = usePets();
  const { expenses } = useExpenses();
  const { vaccines } = useVaccines();
  const { reminders } = useReminders();
  const [exporting, setExporting] = useState(false);

  const handleExportJSON = async () => {
    try {
      setExporting(true);
      const fileUri = await exportService.exportToJSON({
        pets,
        expenses,
        vaccines,
        reminders,
      });
      await exportService.shareFile(fileUri);
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Data exported successfully',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to export data',
      });
    } finally {
      setExporting(false);
    }
  };

  const handleExportCSV = async () => {
    try {
      setExporting(true);
      const fileUri = await exportService.exportExpensesToCSV(expenses, pets);
      await exportService.shareFile(fileUri);
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Expenses exported to CSV',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to export CSV',
      });
    } finally {
      setExporting(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Export Data</Text>
          <Text style={styles.sectionDescription}>
            Export your pet care data to share or backup
          </Text>

          <Button
            title="Export All Data (JSON)"
            onPress={handleExportJSON}
            disabled={exporting}
            loading={exporting}
            style={styles.exportButton}
          />

          <Button
            title="Export Expenses (CSV)"
            onPress={handleExportCSV}
            disabled={exporting}
            loading={exporting}
            variant="secondary"
            style={styles.exportButton}
          />
        </Card>

        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Data Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Pets:</Text>
            <Text style={styles.summaryValue}>{pets.length}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Expenses:</Text>
            <Text style={styles.summaryValue}>{expenses.length}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Vaccines:</Text>
            <Text style={styles.summaryValue}>{vaccines.length}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Reminders:</Text>
            <Text style={styles.summaryValue}>{reminders.length}</Text>
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
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  exportButton: {
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  summaryLabel: {
    fontSize: 16,
    color: '#666',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
});

