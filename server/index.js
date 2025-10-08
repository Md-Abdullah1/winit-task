require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const { connectToDatabase } = require("./config/db");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const indexRouter = require("./routes");
app.use("/api", indexRouter);


// Root redirect to /api
app.get("/", (req, res) => {
  console.log('yes logistics server running')
  res.redirect("/api");
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Not Found" });
});

// Error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Internal Server Error" });
});

function resolvePort(value) {
  const parsed = parseInt(value, 10);
  if (Number.isFinite(parsed) && parsed > 0 && parsed < 65536) return parsed;
  return 5000;
}

function resolveHost(value) {
  return (typeof value === 'string' && value.trim()) ? value : '0.0.0.0';
}

const PORT = resolvePort(process.env.PORT);
const HOST = resolveHost(process.env.HOST);
const server = http.createServer(app);

connectToDatabase()
  .then(() => {
    server.listen(PORT, HOST, () => {
      console.log(`Server running on http://${HOST}:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to database", err);
    process.exit(1);
  });

server.on("error", (err) => {
  console.error("HTTP server error:", err);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught exception:", err);
});

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled rejection:", reason);
});

module.exports = app;
