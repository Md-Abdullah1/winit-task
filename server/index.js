const express = require("express");
const cors = require("cors");
const { connectToDatabase } = require("./config/db");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
const indexRouter = require("./routes");
app.use("/api", indexRouter);

// Root redirect to /api
app.get("/", (req, res) => {
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

const PORT = process.env.PORT || 5000;
connectToDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to database", err);
    process.exit(1);
  });

module.exports = app;