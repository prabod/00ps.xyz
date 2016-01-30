exports = module.exports = function(app, passport) {
  var worth = require('./apps/worth');
  var gotcharacter = require('./apps/gotcharacter');
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
  //app.get('/auth/facebook/',
    //passport.authenticate('facebook'),
    //function(req, res) {
      // The request will be redirected to Facebook for authentication, so this
      // function will not be called.
    //});
  app.get('/',function (req,res) {
    res.render('index',{
      title: "00ps.xyz | Best Facebook Quizes",
      user: "fb.00ps.xyz",
      url: "http://fb.00ps.xyz/",
      description: "00ps.xyz | Best Facebook Quizes",
      IDecription: "00ps.xyz | Best Facebook Quizes",
      imageLink: "",
    });
  });
  app.get('/worth/', worth.worth);
  app.get('/worth/:id', worth.display);
  app.get('/gotcharacter/', gotcharacter.gotCharacter);
  app.get('/gotcharacter/:id', gotcharacter.display);
  app.get('/auth/facebook/:id/', function(req,res,next) {
  passport.authenticate(
    'facebook',
     {callbackURL: '/auth/facebook/login_callback/'+req.params.id,
      scope : ['user_friends','email']}
  )(req,res,next);
});

app.get('/auth/facebook/login_callback/:id', function(req,res,next) {
  passport.authenticate(
    'facebook',
     {
       callbackURL:"/auth/facebook/login_callback/"+req.params.id
     , successRedirect:"/"+req.params.id + "/"
     , failureRedirect:"/",
     scope : ['user_friends','email']
     }
   ) (req,res,next);
 });

  app.get('/logout', function(req, res) {
    req.logout();
    req.session.destroy();
    res.redirect('/');
  });
  app.post('/tempDel/:id/:photo', function(req, res) {
    var fs = require('fs');
    console.log(req.params.id);
    fs.unlinkSync('../data/public/' + req.params.id + "/" + req.params.photo);
  })
  app.all("*",function (req,res) {
    res.render('404',{
      title: "Sorry The Requested Page is Not Available",
      user: "fb.00ps.xyz",
      url: "http://fb.00ps.xyz/",
      description: "Sorry The Requested Page is Not Available",
      IDecription: "Sorry The Requested Page is Not Available",
      imageLink: "http://fb.00ps.xyz/images/pages/404.png",
    });
  });
  function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect('/')
  }
}
