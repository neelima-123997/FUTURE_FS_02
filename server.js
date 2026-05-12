const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

/* ---------------- HOME ROUTE ---------------- */
app.get("/", (req, res) => {
  res.send("CRM Backend is LIVE ");
});

/* ---------------- DEMO LEADS ---------------- */
app.get("/api/leads", (req, res) => {
  res.json([
    {
      id: 1,
      name: "Neelima Demo Lead",
      email: "demo@gmail.com",
      source: "Website",
      status: "New",
      notes: "Sample data working"
    },
    {
      id: 2,
      name: "Test Customer",
      email: "test@gmail.com",
      source: "Instagram",
      status: "Contacted",
      notes: "Demo CRM entry"
    }
  ]);
});

/* ---------------- ADD LEAD (SAFE) ---------------- */
app.post("/api/leads", (req, res) => {
  res.json({
    message: "Demo mode - Lead received",
    data: req.body
  });
});

/* ---------------- UPDATE LEAD (SAFE) ---------------- */
app.put("/api/leads/:id", (req, res) => {
  res.json({
    message: "Demo mode - Update success",
    id: req.params.id,
    status: req.body.status
  });
});

/* ---------------- DELETE LEAD (SAFE) ---------------- */
app.delete("/api/leads/:id", (req, res) => {
  res.json({
    message: "Demo mode - Delete success",
    id: req.params.id
  });
});

/* ---------------- SERVER START ---------------- */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(" Server running on port " + PORT);
});
