require("dotenv").config();
const pg = require("pg");
const chalk = require("chalk");

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// On crée une fonction asynchrone pour gérer la connexion
async function connectDB() {
    try {
        const res = await pool.query("SELECT NOW()");
        if (res.rows) {
            console.log(chalk.green("DB connected!!"));
        }
        return pool;
    } catch (err) {
        console.error(chalk.red("DB connection error:"), err);
    }
}

module.exports = connectDB;