import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Score from './Score';
import { Score as ScoreType, User } from './types';

const App: React.FC = () => {
  const [scores, setScores] = useState<ScoreType[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'stats'>(
    'leaderboard'
  );
  const [isInitialLoad, setInitialLoad] = useState(true);

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
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('/users');

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setUsers(data);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (isInitialLoad) {
        setInitialLoad(false);
        setLoading(true);
      }
      await Promise.all([fetchScores(), fetchUsers()]);
      if (isInitialLoad) {
        setLoading(false);
      }
    };

    fetchData();

    setInterval(() => {
      fetchData();
    }, 2000);
  }, [isInitialLoad]);

  const sortedScores = [...scores].sort((a, b) => b.score - a.score);

  const averageScore =
    scores.length > 0
      ? scores.reduce((sum: number, score: ScoreType) => sum + score.score, 0) /
        scores.length
      : 0;

  const userMap = new Map(users.map((user: User) => [user.id, user]));

  const uniquePlayers = Array.from(
    new Set(scores.map((score: ScoreType) => score.userId))
  );
  const totalPlayers = uniquePlayers.length;

  const userAverages = uniquePlayers
    .map((u: string) => {
      let s = [];
      for (let i = 0; i <= scores.length; i++) {
        if (scores[i].userId === u) {
          s.push(scores[i]);
        }
      }
      const a =
        s.reduce((sum: number, score: ScoreType) => sum + score.score, 0) /
        s.length;
      const user = userMap.get(u);
      return {
        userId: u,
        username: user.username,
        title: user.title,
        averageScore: a,
        totalScores: s.length
      };
    })
    .sort((a, b) => b.averageScore - a.averageScore);

  const StatsComponent = () => (
    <View style={styles.statsPage}>
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statTitle}>Average Score</Text>
          <Text style={styles.statValue}>{averageScore.toFixed(2)}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statTitle}>Total Players</Text>
          <Text style={styles.statValueRed}>{totalPlayers}</Text>
        </View>
      </View>

      <View style={styles.userAveragesSection}>
        <Text style={styles.userAveragesSectionTitle}>
          Average Score by User
        </Text>
        <View style={styles.userAveragesList}>
          {userAverages.map((user, index) => (
            <View key={user.userId} style={styles.userAverageItem}>
              <Text style={styles.userRank}>#{index + 1}</Text>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{user.username}</Text>
                <Text style={styles.userTitle}>{user.title}</Text>
                <Text style={styles.userDetails}>
                  Avg: {user.averageScore.toFixed(2)} | Games:{' '}
                  {user.totalScores}
                </Text>
              </View>
              <Text style={styles.userAverageScore}>
                {user.averageScore.toFixed(2)}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );

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
          <View style={styles.tabNavigation}>
            <Pressable
              style={[
                styles.tabButton,
                activeTab === 'leaderboard' && styles.tabButtonActive
              ]}
              onPress={() => {
                if (activeTab != 'leaderboard') setActiveTab('leaderboard');
              }}
            >
              <Text>Leaderboard</Text>
            </Pressable>
            <Pressable
              style={[
                styles.tabButton,
                activeTab === 'stats' && styles.tabButtonActive
              ]}
              onPress={() => {
                if (activeTab != 'stats') setActiveTab('stats');
              }}
            >
              <Text>Stats</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.appMain}>
          {error && <Text style={styles.errorMessage}>Error: {error}</Text>}

          {activeTab === 'leaderboard' && (
            <>
              {scores.length !== 0 && !error ? (
                <Text style={styles.noScores}>No scores available</Text>
              ) : (
                <View style={styles.scoresList}>
                  {sortedScores.map((score, index) => (
                    <Score key={index} score={score} />
                  ))}
                </View>
              )}
            </>
          )}

          {activeTab === 'stats' && <StatsComponent />}
        </View>

        <View style={styles.appFooter}>
          <Text style={styles.appFooterText}>
            Data updates automatically every 2 seconds
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
  tabNavigation: {
    display: 'flex',
    gap: 0,
    marginBottom: 20,
    flexDirection: 'row'
  },
  tabButton: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderBottomWidth: 0,
    paddingVertical: 12,
    paddingHorizontal: 24,
    fontSize: 16,
    fontWeight: 500,
    color: '#495057',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    marginHorizontal: 2,
    flex: 1
  },
  tabButtonHover: {
    backgroundColor: '#e9ecef',
    color: '#212529'
  },
  tabButtonActive: {
    backgroundColor: '#ffffff',
    color: '#007bff',
    borderColor: '#007bff',
    borderBottomWidth: 1,
    borderBottomColor: '#ffffff',
    position: 'relative',
    zIndex: 1
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
  },

  statsContainer: {
    gap: 20,
    paddingVertical: 20,
    paddingHorizontal: 0,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  statCard: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 12,
    padding: 24,
    textAlign: 'center',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
  },
  statTitle: {
    marginVertical: 12,
    color: '#495057',
    fontSize: 16,
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  statValue: {
    fontSize: 36,
    fontWeight: 700,
    color: '#007bff',
    margin: 0
  },
  statValueRed: {
    color: '#7e3022'
  },
  statsPage: {
    display: 'flex',
    flexDirection: 'column',
    gap: 30
  },
  userAveragesSection: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 24,
    borderWidth: 1,
    borderColor: '#e9ecef'
  },
  userAveragesSectionTitle: {
    marginVertical: 20,
    color: '#333',
    fontSize: 1.5,
    fontWeight: 600,
    textAlign: 'center'
  },
  userAveragesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12
  },
  userAverageItem: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 20,
    boxShadow: '0 2in 4in rgba(0, 0, 0, 0.05)'
  },
  userRank: {
    fontWeight: 700,
    color: '#007bff',
    fontSize: 18,
    minWidth: 40,
    textAlign: 'center'
  },
  userInfo: {
    flex: 1,
    marginLeft: 16
  },
  userName: {
    fontWeight: 600,
    color: '#333',
    fontSize: 18,
    marginBottom: 2
  },
  userTitle: {
    fontWeight: 500,
    color: '#007bff',
    fontSize: 14,
    marginBottom: 4,
    fontStyle: 'italic'
  },
  userDetails: {
    fontSize: 14,
    color: '#666'
  },
  userAverageScore: {
    fontWeight: 700,
    color: '#007bff',
    fontSize: 20,
    minWidth: 30,
    textAlign: 'right'
  }
});

export default App;
