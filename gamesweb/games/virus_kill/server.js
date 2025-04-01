const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database setup
const db = new sqlite3.Database('./scores.db');

// Create table if it doesn't exist
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS scores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    score INTEGER NOT NULL,
    level INTEGER NOT NULL,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`);
});

// API Endpoints
app.post('/add-score', (req, res) => {
  const { username, score, level } = req.body;
  
  db.run(
    'INSERT INTO scores (username, score, level) VALUES (?, ?, ?)',
    [username, score, level],
    function(err) {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      res.json({ id: this.lastID });
    }
  );
});

app.get('/leaderboard', (req, res) => {
  db.all(
    'SELECT username, score, level FROM scores ORDER BY score DESC LIMIT 10',
    [],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(rows);
    }
  );
});

// Start server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));