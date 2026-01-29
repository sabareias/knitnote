const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { start } = require('repl');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({ origin: process.env.CLIENT_ORIGIN }));
app.use(express.json());

// SQLite setup
const fs = require('fs');
const dbPath = path.join(__dirname, 'data.db');
console.log('SQLite DB path:', dbPath);
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Failed to open SQLite database:', err);
    } else {
        console.log('SQLite database opened');
        try {
            const exists = fs.existsSync(dbPath);
            const stats = exists ? fs.statSync(dbPath) : null;
            console.log('DB file exists:', exists, stats ? `size=${stats.size}` : '');
        } catch (fsErr) {
            console.error('Error checking DB file:', fsErr);
        }
    }
});

db.run(`
    CREATE TABLE IF NOT EXISTS Projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        category TEXT NOT NULL,
        craft TEXT NOT NULL,
        pattern TEXT,
        yarn TEXT,
        startDate TEXT,
        endDate TEXT,
        completed INTEGER NOT NULL DEFAULT 0,
        progress INTEGER NOT NULL DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
`, (err) => {
    if (err) {
        console.error('Error creating table:', err);
    } else {
        console.log('Projects table ready');
        // quick sanity check: count rows
        db.get('SELECT COUNT(*) AS count FROM Projects', [], (cErr, row) => {
            if (cErr) {
                console.error('Error counting Projects rows:', cErr);
            } else {
                console.log('Projects row count:', row ? row.count : 0);
            }
        });
    }
});

// Routes 
app.get('/api/Projects', (req, res) => {

const sql = 'SELECT id, title, category, craft, pattern, yarn, startDate, endDate, completed, progress, created_at FROM Projects ORDER BY id DESC';

    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error('Error fetching items:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        const projects = rows.map((row) => ({
            id: row.id,
            title: row.title,
            category: row.category,
            craft: row.craft,
            pattern: row.pattern,
            yarn: row.yarn,
            startDate: row.startDate,
            endDate: row.endDate,
            completed: row.completed === 1, //0/1 -> false/true
            progress: row.progress === 1, //0/1 -> false/true
            created_at: row.created_at
        }));

        res.json(projects);
    });
});

app.post('/api/Projects', (req, res) => {
    console.log('POST /api/Projects body:', req.body);
    const { title, category, craft, pattern, yarn, startDate, endDate, completed, progress } = req.body;

    const trimmedTitle = title.trim();
    const trimmedPattern = pattern ? pattern.trim() : '';
    const trimmedYarn = yarn ? yarn.trim() : '';
    const start = startDate ? startDate : '';
    const end = endDate ? endDate : '';


    // validate title
    if (!trimmedTitle || trimmedTitle.length < 3) {
        return res.status(400).json({ error: 'Project title must be at least 3 characters long.' });
    } else if (trimmedTitle.length > 100) {
        return res.status(400).json({ error: 'Project title must not exceed 100 characters.' });
    }

    // validate category
    if (category === "") {
        return res.status(400).json({ error: 'Category is required.' });
    }
    
    // validate craft
    if (craft === "") {
        return res.status(400).json({ error: 'Craft type is required.' });
    }

    // validate pattern (if provided)
    if (trimmedPattern) {
        if (trimmedPattern.length < 3) {
            return res.status(400).json({ error: 'Pattern name must be at least 3 characters long.' });
        } else if (trimmedPattern.length > 100) {
            return res.status(400).json({ error: 'Pattern must not exceed 100 characters.' });
        }
    }

    // validate yarn (if provided)
    if (trimmedYarn) {
        if (trimmedYarn.length < 3) {
            return res.status(400).json({ error: 'Yarn name must be at least 3 characters long.' });
        } else if (trimmedYarn.length > 100) {
            return res.status(400).json({ error: 'Yarn must not exceed 100 characters.' });
        }
    }

    // validate dates (if provided)
    if (start && end && new Date(start) > new Date(end)) {
        return res.status(400).json({ error: 'Start date cannot be later than end date.' });
    }

    // validate completed boolean
    // sets true if endDate is provided, false if not
    let completedInt = (end ? 1 : 0);

    // validate progress boolean
    let progressInt = (start && !end ? 1 : 0);


    const sql = 'INSERT INTO Projects (title, category, craft, pattern, yarn, startDate, endDate, completed, progress) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const params = [trimmedTitle, category, craft, trimmedPattern, trimmedYarn, start, end, completedInt, progressInt];


    db.run(sql, params, function (err) {
    if (err) {
        console.error('Error inserting item:', err);
        return res.status(500).json({ error: 'Database error' });
    }
    const createdAt = new Date().toISOString()

    res.status(201).json({
        id: this.lastID,
        title: trimmedTitle,
        category: category,
        craft: craft,
        pattern: trimmedPattern,
        yarn: trimmedYarn,
        startDate: start,
        endDate: end,
        completed: completedInt,
        progress: progressInt,
        created_at: createdAt
    });
    });
});

app.delete('/api/Projects/:id', (req, res) => {
    const id = req.params.id;

    db.run('DELETE FROM Projects WHERE id = ?', [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0)
        return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Project deleted' });
    });
});

app.patch('/api/Projects/:id', (req, res) => {
    const id = Number(req.params.id);
    const { title, category, craft, pattern, yarn, startDate, endDate, completed, progress } = req.body;
    try {
        const fields = [];
        const values = [];
        if (title !== undefined) {
            fields.push('title = ?');
            values.push(title.trim());
        }
        if (category !== undefined) {
            fields.push('category = ?');
            values.push(category);
        }
        if (craft !== undefined) {
            fields.push('craft = ?');
            values.push(craft);
        }
        if (pattern !== undefined) {
            fields.push('pattern = ?');
            values.push(pattern.trim());
        }
        if (yarn !== undefined) {
            fields.push('yarn = ?');
            values.push(yarn.trim());
        }
        if (startDate !== undefined) {
            fields.push('startDate = ?');
            values.push(startDate);
        }
        if (endDate !== undefined) {
            fields.push('endDate = ?');
            values.push(endDate);
        }
        if (completed !== undefined) { 
            fields.push("completed = ?"); 
            values.push(completed ? 1 : 0); 
        }
        if (progress !== undefined) { 
            fields.push("progress = ?"); 
            values.push(progress ? 1 : 0); 
        }
        if (fields.length === 0) {
            return res.status(400).json({ error: 'No fields to update' });
        }
        values.push(id);
        const sql = `UPDATE Projects SET ${fields.join(', ')} WHERE id = ?`;
        db.run(sql, values, function (err) {
            if (err) {
                console.error('Error updating project:', err);
                return res.status(500).json({ error: 'Database error' });
            }   
            db.get('SELECT * FROM Projects WHERE id = ?', [id], (err, project) => {
                if (err) return res.status(500).json({ error: 'Database error' });
                res.json({...project, completed: project.completed === 1 });

            });
        });

    } catch {
        res.status(500).json({ error: 'Server error' });
    }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

