// check if user is logged in

module.exports = (req, res, next) => {
  if(req.isAuthenticated()){
    if(req.path == '/login' || req.path == '/signup'){
      res.redirect('/overview');
    } else {
      return next();
    }
  } else {
    if(req.path == '/login' || req.path == '/signup'){
      return next();
    } else {
      res.redirect('/login');
    }
  }
};