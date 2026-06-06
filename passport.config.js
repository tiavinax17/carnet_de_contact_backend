const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const pool = require('./DB/db.js'); 

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback'
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const googleId = profile.id;
      const email = profile.emails[0].value;
      const displayName = profile.displayName;
      const avatarUrl = profile.photos[0]?.value;

      // Cherche l'utilisateur, sinon le crée (upsert)
      const result = await pool.query(
        `INSERT INTO users (google_id, email, display_name, avatar_url, last_login)
         VALUES ($1, $2, $3, $4, NOW())
         ON CONFLICT (google_id) DO UPDATE
           SET last_login = NOW(), display_name = $3, avatar_url = $4
         RETURNING *`,
        [googleId, email, displayName, avatarUrl]
      );

      return done(null, result.rows[0]);
    } catch (err) {
      return done(err, null);
    }
  }
));

// Sérialise l'utilisateur dans la session (on sauvegarde juste l'id)
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Désérialise : retrouve l'utilisateur depuis la session
passport.deserializeUser(async (id, done) => {
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    done(null, result.rows[0]);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;