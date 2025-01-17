import React, { useState, useEffect } from 'react';
import './App.css';  // Import your styles here

// Jikan API for fetching recent manga
const JIKAN_API = "https://api.jikan.moe/v4/manga";

const App = () => {
  const [manga, setManga] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchManga = async () => {
      try {
        const response = await fetch(JIKAN_API);
        if (!response.ok) {
          throw new Error("Failed to fetch manga");
        }
        const data = await response.json();
        setManga(data.data);  // Assuming 'data' contains manga array
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchManga();
  }, []);

  if (loading) {
    return <div className="loading">Loading manga updates...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="app-container">
      <h1>Latest Manga Updates</h1>
      <p className="subtitle">Here are some of the most recent manga:</p>
      <div className="manga-list">
        {manga.map((m) => (
          <div key={m.mal_id} className="manga-card">
            <img src={m.images.jpg.image_url} alt={m.title} className="manga-image" />
            <div className="manga-details">
              <h3>{m.title}</h3>
              <p><strong>Type:</strong> {m.type}</p>
              <p><strong>Status:</strong> {m.status}</p>
              <p><strong>Score:</strong> {m.score}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
