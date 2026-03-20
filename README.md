# Scores App

A React Native application that displays scores fetched from an API endpoint.

## Features

- Fetches scores from `/scores` endpoint on page load
- Displays scores in a clean, modern interface
- Scores are automatically sorted by score (highest to lowest)
- Auto-polling every 2 seconds for live updates
- Stats tab with average scores and per-user breakdowns
- Error handling for API failures
- Loading states

## Getting Started

### Prerequisites

- Node.js (version 20 or higher)
- npm or yarn
- Expo Go app installed on a physical device (iOS or Android)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Scan the QR code in the terminal on your mobile device with Expo Go installed.

## API Requirements

The application expects two endpoints:

### `/scores`
Returns an array of score objects:
```typescript
{
  id: string;
  userId: string;
  score: number;
  updated: Date;
}
```

### `/users`
Returns an array of user objects:
```typescript
{
  id: string;
  username: string;
  title: string;
}
```

## Project Structure

```
src/
├── App.tsx          # Main application component
├── Score.tsx        # Individual score component
├── types.ts         # TypeScript type definitions
└── index.ts         # Application entry point
```

## Features in Detail

### Score Display
- Each score shows the user and score value
- Scores are displayed in cards
- Score values are highlighted with a blue badge
- Scores are automatically sorted by score (highest to lowest)

### Data Fetching
- Fetches scores and users when the component mounts
- Auto-polls every 2 seconds for live updates
- Error handling with user-friendly messages
- Loading states during initial fetch

### Styling
- Modern, clean design
- Professional color scheme
