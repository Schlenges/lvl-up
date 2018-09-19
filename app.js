// -----------------------------------------------------------------
//                               SETUP 
// -----------------------------------------------------------------

const express = require('express');
      methodOverride = require('method-override'); // for form input
      bodyParser = require('body-parser');
      passport = require('passport');
      LocalStrategy = require('passport-local').Strategy;
      flash = require('express-flash');
      cookieParser = require('cookie-parser');
      db = require('./db');

const app = express();

app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

// Passport setup
require('./config/passport');
app.use(cookieParser('keyboard cat'));
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//-----------------------------------------------------------------
//                            ROUTES 
// -----------------------------------------------------------------

const loginRoutes = require('./routes/login');
      updateRoutes = require('./routes/updates');
      skillRoutes = require('./routes/skills');
      battleRoutes = require('./routes/battles');
      authentication = require('./routes/middleware/auth');

app.all('*', authentication);

app.use('/', loginRoutes);
app.use('/updates', updateRoutes);
app.use('/skills', skillRoutes);
app.use('/battles', battleRoutes);


// -----------------------------------------------------------------
//                            SERVER
// -----------------------------------------------------------------

// Start Server
const port = 3000;
app.listen(port, function(){
  console.log('Server started on port ' + port);
});