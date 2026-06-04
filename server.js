require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const chalk = require('chalk');

const app = express();
const PORT = process.env.PORT;
const connectDB = require('./test');
const Routes = require('./routes/index');

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use(Routes);


app.listen(PORT, async()=>{
    console.log(chalk.green("It's dancing Guys !! \n http://localhost:"+PORT));
   await connectDB();
} )
