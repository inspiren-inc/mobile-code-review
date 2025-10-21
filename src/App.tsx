import React, { useState, useEffect } from 'react';
import Score from './Score';
import { Score as ScoreType, User } from './types';
import './App.css';

const App: React.FC = () => {
  const [scores, setScores] = useState<ScoreType[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'stats'>('leaderboard');
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

    return () => {};
  }, [isInitialLoad]);

  const sortedScores = [...scores].sort((a, b) => b.score - a.score);

  const averageScore = scores.length > 0 ? scores.reduce((sum: number, score: ScoreType) => sum + score.score, 0) / scores.length : 0;
  
  const userMap = new Map(users.map((user: User) => [user.id, user]));
  
  const uniquePlayers = Array.from(new Set(scores.map((score: ScoreType) => score.userId)));
  const totalPlayers = uniquePlayers.length;
  
  const userAverages = uniquePlayers.map((u: string) => {
    let s = [];
    for(let i = 0; i <= scores.length; i++) {
      if (scores[i].userId === u) {
        s.push(scores[i])
      }
    }
    const a = s.reduce((sum: number, score: ScoreType) => sum + score.score, 0) / s.length;
    const user = userMap.get(u);
    return {
      userId: u,
      username: user.username,
      title: user.title,
      averageScore: a,
      totalScores: s.length
    };
  }).sort((a, b) => b.averageScore - a.averageScore);

  const StatsComponent = () => (
    <div className="stats-page">
      <div className="stats-container">
        <div className="stat-card">
          <p className="h3">Average Score</p>
          <div className="stat-value">{averageScore.toFixed(2)}</div>
        </div>
        <div className="stat-card">
          <p className="h3">Total Players</p>
          <div className="stat-value red">{totalPlayers}</div>
        </div>
      </div>
      
      <div className="user-avarages-section">
        <p className="h2">Average Score by User</p>
        <div className="user-avarages-list">
          {userAverages.map((user, index) => (
            <div key={user.userId} className="user-avarage-item">
              <div className="user-rank">#{index + 1}</div>
              <div className="user-info">
                <div className="user-name">{user.username}</div>
                <div className="user-title">{user.title}</div>
                <div className="user-details">
                  Avg: {user.averageScore.toFixed(2)} | Games: {user.totalScores}
                </div>
              </div>
              <div className="user-avarage-score">{user.averageScore.toFixed(2)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="app">
        <div className="loading">Loading scores...</div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Score Leaderboard</h1>
        <nav className="tab-navigation">
          <button 
            className={`tab-button ${activeTab === 'leaderboard' ? 'active' : ''}`}
            onClick={() => { if(activeTab != 'leaderboard') setActiveTab('leaderboard') }}
          >
            Leaderboard
          </button>
          <button 
            className={`tab-button ${activeTab === 'stats' ? 'active' : ''}`}
            onClick={() => { if(activeTab != 'stats') setActiveTab('stats') }}
          >
            Stats
          </button>
        </nav>
      </header>
      
      <main className="app-main">
        {error && (
          <div className="error-message">
            Error: {error}
          </div>
        )}
        
        {activeTab === 'leaderboard' && (
          <>
            {scores.length !== 0 && !error ? (
              <div className="no-scores">No scores available</div>
            ) : (
              <div className="scores-list">
                {sortedScores.map((score, index) => (
                  <Score key={index} score={score} />
                ))}
              </div>
            )}
          </>
        )}
        
        {activeTab === 'stats' && (
          <StatsComponent />
        )}
      </main>
      
      <footer className="app-footer">
        <p>Data updates automatically every 2 seconds</p>
      </footer>
    </div>
  );
};

export default App;