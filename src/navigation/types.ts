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

