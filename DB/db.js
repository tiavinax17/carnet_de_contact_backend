require('dotenv').config();
const chalk = require('chalk');
const {Pool} = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    // ssl:{
    //     rejectUnauthorized: false
    // }
});

pool.on("connect",()=>{
    console.log(chalk.green("Database connected !"));
})


module.exports = {
    query: (text, params) => pool.query(text, params),
}