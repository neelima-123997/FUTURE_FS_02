const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

/* ---------------- DATABASE CONNECTION ---------------- */
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect((err) => {
  if (err) {
    console.error(" MySQL Connection Failed:", err.message);
  } else {
    console.log("MySQL Connected");
  }
});

/* ---------------- HOME ---------------- */
app.get("/", (req, res) => {
  res.send("CRM Backend Running (Real Version)");
});

/* ---------------- CREATE TABLE (optional safety) ---------------- */
const createTable = `
CREATE TABLE IF NOT EXISTS leads (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255),
  source VARCHAR(100),
  status VARCHAR(50),
  notes TEXT
);
`;

db.query(createTable);

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
      return res.status(500).json({ error: "Failed to add lead" });
    }

    res.json({
      id: result.insertId,
      name,
      email,
      source,
      status: "New",
      notes
    });
  });
});

/* ---------------- GET LEADS ---------------- */
app.get('/api/leads', (req, res) => {
  db.query('SELECT * FROM leads', (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: "Failed to fetch leads" });
    }
    res.json(results);
  });
});

/* ---------------- UPDATE LEAD ---------------- */
app.put('/api/leads/:id', (req, res) => {
  const { status } = req.body;

  db.query(
    'UPDATE leads SET status=? WHERE id=?',
    [status, req.params.id],
    (err) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: "Failed to update lead" });
      }
      res.json({ message: "Lead updated" });
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
        return res.status(500).json({ error: "Failed to delete lead" });
      }
      res.json({ message: "Lead deleted" });
    }
  );
});

/* ---------------- SERVER START ---------------- */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🚀 Server running on port " + PORT);
});
