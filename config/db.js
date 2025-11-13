import pkg from "pg";
const { Pool } = pkg;
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // important for Render PostgreSQL
  },
});

// 🧠 Try connecting once to confirm database connection
pool
  .connect()
  .then(() => {
    console.log("✅ PostgreSQL connected successfully!");
    console.log("🌍 Database URL:", process.env.DATABASE_URL ? "Loaded" : "Missing");
  })
  .catch((err) => {
    console.error("❌ PostgreSQL connection failed!");
    console.error("Error details:", err.message);
  });

export default pool;
