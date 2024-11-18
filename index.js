const express = require('express');
const db = require('./db'); // Database setup
const app = express();
const port = 3000;

app.use(express.json());

app.get('/todos', (req, res) => {
    const { completed } = req.query;
    let sql = 'SELECT * FROM todos';
    let params = [];
    if (completed === 'true' || completed === 'false') {
        sql += ' WHERE completed = ?';
        params.push(completed === 'true' ? 1 : 0);
    }
    db.all(sql, params, (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

app.post('/todos', (req, res) => {
    const { task, priority } = req.body;
    if (!task) {
        return res.status(400).json({ error: "Task is required" });
    }
    const sql = 'INSERT INTO todos (task, priority) VALUES (?, ?)';

    db.run(sql, [task, priority || 'medium'], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: this.lastID });
    });
});

app.put('/todos/:id', (req, res) => {
    const { id } = req.params;
    const { task, completed, priority } = req.body;
    const sql = `
        UPDATE todos
        SET task = COALESCE(?, task),
            completed = COALESCE(?, completed),
            priority = COALESCE(?, priority)
        WHERE id = ?
    `;
    db.run(sql, [task, completed, priority, id], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: "To-Do item not found" });
        }
        res.json({ message: "To-Do item updated successfully" });
    });
});

app.put('/todos/complete-all', (req, res) => {
    const sql = 'UPDATE todos SET completed = 1';
    db.run(sql, [], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ message: "All to-dos marked as completed" });
    });
});

app.delete('/todos/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM todos WHERE id = ?';

    db.run(sql, id, function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (this.changes === 0) {
            return res.status(404).json({ error: "To-Do item not found" });
        }
      
        res.status(204).send();
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

