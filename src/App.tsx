import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Score from './Score';
import { Score as ScoreType } from './types';

const App: React.FC = () => {
  const [scores, setScores] = useState<ScoreType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchScores = async () => {
    try {
      setError(null);
      const response = await fetch('/scores');

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      const scoresWithDates = data.map((score: any) => ({
        ...score,
        updated: new Date(score.updated)
      }));

      setScores(scoresWithDates);
    } catch (err) {
      console.error('Error fetching scores:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch scores');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScores();
  }, []);

  const sortedScores = [...scores].sort((a, b) => b.score - a.score);

  if (loading) {
    return (
      <View style={styles.app}>
        <Text style={styles.loading}>Loading scores...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.app}>
        <View style={styles.appHeader}>
          <Text style={styles.appHeaderTitle}>Score Leaderboard</Text>
        </View>

        <View style={styles.appMain}>
          {error && <Text style={styles.errorMessage}>Error: {error}</Text>}

          {scores.length === 0 && !error ? (
            <Text style={styles.noScores}>No scores available</Text>
          ) : (
            <View style={styles.scoresList}>
              {sortedScores.map((score) => (
                <Score key={score.id} score={score} />
              ))}
            </View>
          )}
        </View>

        <View style={styles.appFooter}>
          <Text style={styles.appFooterText}>
            Click refresh to update scores
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    flex: 1
  },
  app: {
    maxWidth: 800,
    padding: 20
  },
  loading: {
    textAlign: 'center',
    fontSize: 18,
    color: '#666',
    padding: 40
  },
  appHeader: {
    textAlign: 'center',
    marginBottom: 30
  },
  appHeaderTitle: {
    color: '#333',
    marginBottom: 20,
    fontSize: 24,
    fontWeight: 600
  },
  appMain: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    marginBottom: 20
  },
  errorMessage: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#f5c6cb',
    borderRadius: 6,
    marginBottom: 20,
    textAlign: 'center'
  },
  noScores: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    padding: 40,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef'
  },
  scoresList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8
  },
  appFooter: {
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
    marginTop: 20
  },
  appFooterText: {
    margin: 0,
    padding: 10,
    backgroundColor: '#ffffff',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e9ecef'
  }
});

export default App;
