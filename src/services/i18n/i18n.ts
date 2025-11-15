import { I18n } from 'i18n-js';
import { Language } from '@/types/i18n';

const translations = {
  en: {
    pets: 'Pets',
    expenses: 'Expenses',
    health: 'Health',
    settings: 'Settings',
    addPet: 'Add Pet',
    petName: 'Pet Name',
    species: 'Species',
    breed: 'Breed',
    dateOfBirth: 'Date of Birth',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    loading: 'Loading...',
    noData: 'No data available',
    success: 'Success',
    error: 'Error',
  },
  es: {
    pets: 'Mascotas',
    expenses: 'Gastos',
    health: 'Salud',
    settings: 'Configuración',
    addPet: 'Agregar Mascota',
    petName: 'Nombre de la Mascota',
    species: 'Especie',
    breed: 'Raza',
    dateOfBirth: 'Fecha de Nacimiento',
    save: 'Guardar',
    cancel: 'Cancelar',
    delete: 'Eliminar',
    edit: 'Editar',
    loading: 'Cargando...',
    noData: 'No hay datos disponibles',
    success: 'Éxito',
    error: 'Error',
  },
  fr: {
    pets: 'Animaux',
    expenses: 'Dépenses',
    health: 'Santé',
    settings: 'Paramètres',
    addPet: 'Ajouter un Animal',
    petName: 'Nom de l\'Animal',
    species: 'Espèce',
    breed: 'Race',
    dateOfBirth: 'Date de Naissance',
    save: 'Enregistrer',
    cancel: 'Annuler',
    delete: 'Supprimer',
    edit: 'Modifier',
    loading: 'Chargement...',
    noData: 'Aucune donnée disponible',
    success: 'Succès',
    error: 'Erreur',
  },
};

const i18n = new I18n(translations);
i18n.defaultLocale = 'en';
i18n.enableFallback = true;

export const setLanguage = (language: Language) => {
  i18n.locale = language;
};

export const getLanguage = (): Language => {
  return (i18n.locale as Language) || 'en';
};

export const translate = (key: string, params?: any): string => {
  return i18n.t(key, params);
};

export default i18n;

