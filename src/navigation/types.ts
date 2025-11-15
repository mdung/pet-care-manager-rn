import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<BottomTabParamList>;
  PetForm: { petId?: string };
  PetDetail: { petId: string };
  VaccineList: { petId?: string };
  VaccineForm: { vaccineId?: string; petId?: string };
  ReminderList: { petId?: string };
  ReminderForm: { reminderId?: string; petId?: string };
  ExpenseForm: { expenseId?: string; petId?: string };
  ExpenseSummary: undefined;
  Export: undefined;
  WeightTracking: { petId: string };
  WeightForm: { weightId?: string; petId: string };
  HealthDashboard: undefined;
  Statistics: undefined;
  GroomingList: { petId?: string };
  GroomingForm: { groomingId?: string; petId: string };
  ActivityLog: { petId?: string };
  ActivityForm: { activityId?: string; petId: string };
};

export type BottomTabParamList = {
  Pets: undefined;
  Expenses: undefined;
  Settings: undefined;
};

export type PetStackParamList = {
  PetList: undefined;
  PetDetail: { petId: string };
  PetForm: { petId?: string };
  VaccineList: { petId: string };
  VaccineForm: { vaccineId?: string; petId: string };
  ReminderList: { petId: string };
  ReminderForm: { reminderId?: string; petId: string };
};

