const db = require('./database');

db.run(`INSERT INTO scores (username, score) VALUES (?, ?)`, ["Player1", 100], function(err) {
    if (err) return console.error(err.message);
    console.log("Score added with ID:", this.lastID);
});

db.close();
