const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

/* ---------------- DATABASE ---------------- */
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

/* SAFE CONNECT (DO NOT CRASH APP) */
db.connect((err) => {
  if (err) {
    console.log("DB NOT CONNECTED:", err.message);
  } else {
    console.log(" MySQL Connected");
  }
});

/* ---------------- HEALTH CHECK ---------------- */
app.get("/", (req, res) => {
  res.send("CRM Backend Running ");
});

/* ---------------- ADD LEAD ---------------- */
app.post('/api/leads', (req, res) => {
  const { name, email, source, notes } = req.body;

  const sql = `
    INSERT INTO leads (name, email, source, status, notes)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(sql, [name, email, source, 'New', notes], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: "DB error (add lead)" });
    }

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

/* ---------------- GET LEADS (SAFE) ---------------- */
app.get('/api/leads', (req, res) => {
  db.query('SELECT * FROM leads', (err, results) => {
    if (err) {
      console.log(err);
      return res.json([]); // IMPORTANT: no crash
    }
    res.json(results);
  });
});

/* ---------------- UPDATE STATUS ---------------- */
app.put('/api/leads/:id', (req, res) => {
  const { status } = req.body;

  db.query(
    'UPDATE leads SET status=? WHERE id=?',
    [status, req.params.id],
    (err) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: "DB error (update)" });
      }
      res.json({ message: "Status updated" });
    }
  );
});

/* ---------------- DELETE LEAD ---------------- */
app.delete('/api/leads/:id', (req, res) => {
  db.query(
    'DELETE FROM leads WHERE id=?',
    [req.params.id],
    (err) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: "DB error (delete)" });
      }
      res.json({ message: "Lead deleted" });
    }
  );
});

/* ---------------- SERVER START ---------------- */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(" Server running on port " + PORT);
});
