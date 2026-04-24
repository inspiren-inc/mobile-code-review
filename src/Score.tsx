import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { Score as ScoreType } from './types';

interface ScoreProps {
  score: ScoreType;
  onPress?: () => void;
}

const Score: React.FC<ScoreProps> = ({ score, onPress }) => {
  return (
    <Pressable onPress={onPress} style={styles.scoreItem}>
      <Text style={styles.scoreName}>{score.userId}</Text>
      <Text style={styles.scoreValue}>{score.score}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  scoreItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginVertical: 8,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 8,
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
  },
  scoreName: {
    fontSize: 16,
    fontWeight: 500,
    color: '#333'
  },
  scoreValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007bff',
    backgroundColor: '#e3f2fd',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 20,
    minWidth: 60,
    textAlign: 'center'
  }
});

export default Score;
