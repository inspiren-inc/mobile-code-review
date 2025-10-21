import React from 'react';
import { Score as ScoreType } from './types';
import './Score.css';

interface ScoreProps {
  score: ScoreType;
}

const Score: React.FC<ScoreProps> = ({ score }) => {
  return (
    <div className="score-item">
      <div className="score-name">{score.userId}</div>
      <div className="score-value">{score.score}</div>
    </div>
  );
};

export default Score;
