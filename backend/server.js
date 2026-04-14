const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");

const connectDB = require("./authentication/config/db");
const authRoutes = require("./authentication/routes/authRoutes");
const collectionRoutes = require("./authentication/routes/collectionRoutes");
const demandRoutes = require("./authentication/routes/demandRoutes");
const carbonRoutes = require("./authentication/routes/carbonRoutes");
const userProfileRoutes = require("./authentication/routes/userProfileRoutes");
const routingRoutes = require("./authentication/routes/routingRoutes");

dotenv.config();
connectDB();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const app = express();

app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files as static
app.use("/uploads", express.static(uploadsDir));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/collections", collectionRoutes);
app.use("/api/demands", demandRoutes);
app.use("/api/carbon", carbonRoutes);
app.use("/api/users", userProfileRoutes);
app.use("/api/routing", routingRoutes);

app.get("/", (req, res) => {
  res.send("AgriCycle API running ✅");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});