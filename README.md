# Pet Care Manager

A comprehensive React Native mobile application for managing your pets' vaccines, reminders, and expenses.

## Features

### 🐾 Pet Management
- Add and manage multiple pets
- Store pet information: name, species, breed, date of birth, sex, avatar, and notes
- View detailed pet profiles with quick stats

### 💉 Vaccine & Health Schedule
- Track vaccine records for each pet
- Automatic status calculation (Upcoming, Completed, Overdue)
- Set next due dates and track vaccination history
- Store vet/clinic information

### ⏰ Reminders
- Create reminders for vet visits, medicine, grooming, and custom events
- Schedule local notifications
- Set repeat options (none, weekly, monthly)
- Visual indicators for past, today, and upcoming reminders

### 💰 Expense Tracking
- Track expenses by category (Vet, Food, Grooming, Toys, Medicine, Other)
- Filter expenses by pet and category
- View monthly and yearly summaries
- Support for multiple currencies

### ⚙️ Settings
- Configure default currency
- Set default reminder time
- Enable/disable notifications

## Tech Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **State Management**: React Context API
- **Navigation**: React Navigation (Stack + Bottom Tabs)
- **Storage**: AsyncStorage for local data persistence
- **Date Handling**: dayjs
- **Notifications**: Expo Notifications
- **Forms**: react-hook-form with yup validation
- **Styling**: React Native StyleSheet

## Architecture

### State Management
The app uses React Context API for state management. This was chosen over Redux Toolkit because:
- Simpler setup with less boilerplate
- Built-in React solution
- Sufficient for the app's state management needs
- Easier to understand and maintain

### Project Structure
```
pet-care-manager-rn/
├── src/
│   ├── components/       # Reusable UI components
│   ├── screens/          # Screen components
│   ├── navigation/       # Navigation setup
│   ├── context/          # Context providers
│   ├── services/         # Business logic (storage, notifications, dates)
│   ├── hooks/            # Custom hooks
│   ├── types/            # TypeScript type definitions
│   └── utils/            # Utility functions and constants
├── App.tsx               # App entry point
└── package.json
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/mdung/pet-care-manager-rn.git
cd pet-care-manager-rn
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm start
# or
expo start
```

4. Run on your device:
   - Scan the QR code with Expo Go app (iOS/Android)
   - Or press `i` for iOS simulator / `a` for Android emulator

## Seed Data

The app includes seed data functionality that automatically loads sample pets, vaccines, reminders, and expenses on first launch. This helps demonstrate the app's features without starting from scratch.

To reset seed data, clear the app's storage or reinstall the app.

## Key Features Implementation

### Local Notifications
The app schedules local notifications for reminders using Expo Notifications. Notifications are automatically scheduled when reminders are created and canceled when reminders are deleted or updated.

### Data Persistence
All data is stored locally using AsyncStorage. No backend is required - everything works offline.

### Form Validation
All forms use react-hook-form with yup schema validation for type-safe and validated user input.

### Date Calculations
The app automatically calculates:
- Vaccine status (overdue, upcoming, completed)
- Reminder status (past, today, upcoming)
- Pet age from date of birth
- Days until upcoming events

## Development

### Adding New Features
1. Create types in `src/types/`
2. Add storage service in `src/services/storage/`
3. Create context provider in `src/context/`
4. Build screen components in `src/screens/`
5. Add navigation routes in `src/navigation/`

### Code Style
- Use TypeScript for all new files
- Follow the existing component structure
- Use functional components with hooks
- Keep components focused and reusable

## License

This project is private and proprietary.

## Author

mdung

