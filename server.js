require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const chalk = require('chalk');
const session = require('express-session');
const passport = require('./passport.config');

const app = express();
app.enable('trust proxy');
const PORT = process.env.PORT;
const connectDB = require('./test');
const Routes = require('./routes/index');

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true  // important pour les cookies de session
}));

// Session
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000, 
    secure: true,
    sameSite: 'none'
  }
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());
app.use(Routes);

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// 2. Callback après que Google redirige
app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Succès → redirige vers le frontend
    res.redirect(process.env.CLIENT_URL + '/');
  }
);

// 3. Vérifie si l'utilisateur est connecté (utilisé par React)
app.get('/api/auth/me', (req, res) => {
    console.log('Session ID:', req.sessionID);
  console.log('Session:', req.session);
  console.log('User:', req.user);
  if (req.isAuthenticated()) {
    res.json({ user: req.user });
  } else {
    res.status(401).json({ user: null });
  }
});

// 4. Déconnexion
app.get('/auth/logout', (req, res) => {
  req.logout(() => {
    res.redirect(process.env.CLIENT_URL);
  });
});

app.listen(PORT, async()=>{
    console.log(chalk.green("It's dancing Guys !! \n http://localhost:"+PORT));
   await connectDB();
} )
