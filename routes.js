exports = module.exports = function(app, passport) {
  var worth = require('./apps/worth');
  app.get('/account', ensureAuthenticated, function(req, res) {
    res.render('account', {
      user: req.user
    });
  });

  //app.get('/login', function(req, res){
  //res.render('login', { user: req.user });
  //});

  // GET /auth/facebook
  //   Use passport.authenticate() as route middleware to authenticate the
  //   request.  The first step in Facebook authentication will involve
  //   redirecting the user to facebook.com.  After authorization, Facebook will
  //   redirect the user back to this application at /auth/facebook/callback
  //app.get('/auth/facebook/:',
  //passport.authenticate('facebook'),
  //function(req, res){
  // The request will be redirected to Facebook for authentication, so this
  // function will not be called.
  //});
  app.get('/worth', worth.worth);
  app.get('/auth/facebook/:id', function(req, res, next) {
    passport.authenticate(
      'facebook', {
        callbackURL: "/auth/facebook/callback/" + req.params.id
      }
    )(req, res, next);
  });

  // GET /auth/facebook/callback
  //   Use passport.authenticate() as route middleware to authenticate the
  //   request.  If authentication fails, the user will be redirected back to the
  //   login page.  Otherwise, the primary route function function will be called,
  //   which, in this example, will redirect the user to the home page.
  app.get('/auth/facebook/callback/:id',
    passport.authenticate('facebook', {
      failureRedirect: '/login'
    }),
    function(req, res) {
      res.redirect("/" + req.id);
    });

  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect('/')
  }
}
