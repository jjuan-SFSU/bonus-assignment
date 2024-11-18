const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./todos.db', (err) => {
    if (err) {
        console.error("Cannot open database:", err.message);
    } else {
        db.run(`
            CREATE TABLE IF NOT EXISTS todos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                task TEXT NOT NULL,
                completed BOOLEAN NOT NULL DEFAULT false,
                priority TEXT NOT NULL DEFAULT 'medium'
            )
        `);
        console.log("SQLite database connected.");
    }
});

module.exports = db;

