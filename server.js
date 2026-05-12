const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// MySQL Connection 
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect(err => {
  if (err) {
    console.error('MySQL connection failed:', err);
    return;
  }
  console.log('MySQL Connected');
});

// Routes
app.post('/api/leads', (req, res) => {
  const { name, email, source, notes } = req.body;

  const sql = 'INSERT INTO leads (name,email,source,status,notes) VALUES (?,?,?,?,?)';

  db.query(sql, [name, email, source, 'New', notes], (err, result) => {
    if (err) return res.status(500).json({ error: 'Failed to add lead' });

    res.json({
      id: result.insertId,
      name,
      email,
      source,
      status: 'New',
      notes
    });
  });
});

app.get('/api/leads', (req, res) => {
  db.query('SELECT * FROM leads', (err, results) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch leads' });
    res.json(results);
  });
});

app.put('/api/leads/:id', (req, res) => {
  const { status } = req.body;

  db.query('UPDATE leads SET status=? WHERE id=?',
    [status, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: 'Failed to update status' });
      res.json({ message: 'Status updated' });
    });
});

app.delete('/api/leads/:id', (req, res) => {
  db.query('DELETE FROM leads WHERE id=?',
    [req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: 'Failed to delete lead' });
      res.json({ message: 'Lead deleted' });
    });
});

// IMPORTANT FIX (Railway needs this)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
