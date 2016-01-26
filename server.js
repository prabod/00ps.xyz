#!/bin/env node
//  OpenShift sample Node application
var express = require('express');
var fs      = require('fs');
var passport = require('passport')
  , util = require('util')
  , FacebookStrategy = require('passport-facebook').Strategy
  , logger = require('morgan')
  , session = require('express-session')
  , bodyParser = require("body-parser")
  , cookieParser = require("cookie-parser")
  , methodOverride = require('method-override');
  var mongoStore = require('connect-mongo')(session);
  var mongoose = require('mongoose');
  var autoIncrement = require('mongoose-auto-increment');
  var config = require('./config');
  var fb = require('fb');
  var FACEBOOK_APP_ID = "1653824821565450";
  var FACEBOOK_APP_SECRET = "8887aeba96c5dc4312b9475cf1db775c";




/**
 *  Define the sample application.
 */
var SampleApp = function() {

    //  Scope.
    var self = this;


    /*  ================================================================  */
    /*  Helper functions.                                                 */
    /*  ================================================================  */

    /**
     *  Set up server IP address and port # using env variables/defaults.
     */
    self.setupVariables = function() {
        //  Set the environment variables we need.
        self.ipaddress = process.env.OPENSHIFT_NODEJS_IP;
        self.port      = process.env.OPENSHIFT_NODEJS_PORT || 8080;

        if (typeof self.ipaddress === "undefined") {
            //  Log errors on OpenShift but continue w/ 127.0.0.1 - this
            //  allows us to run/test the app locally.
            console.warn('No OPENSHIFT_NODEJS_IP var, using 127.0.0.1');
            self.ipaddress = "127.0.0.1";
        };
    };


    /**
     *  Populate the cache.
     */
    self.populateCache = function() {
        if (typeof self.zcache === "undefined") {
            self.zcache = { 'index.html': '' };
        }

        //  Local cache for static content.
        self.zcache['index.html'] = fs.readFileSync('./index.html');
    };


    /**
     *  Retrieve entry (content) from cache.
     *  @param {string} key  Key identifying content to retrieve from cache.
     */
    self.cache_get = function(key) { return self.zcache[key]; };


    /**
     *  terminator === the termination handler
     *  Terminate server on receipt of the specified signal.
     *  @param {string} sig  Signal to terminate on.
     */
    self.terminator = function(sig){
        if (typeof sig === "string") {
           console.log('%s: Received %s - terminating sample app ...',
                       Date(Date.now()), sig);
           process.exit(1);
        }
        console.log('%s: Node server stopped.', Date(Date.now()) );
    };


    /**
     *  Setup termination handlers (for exit and a list of signals).
     */
    self.setupTerminationHandlers = function(){
        //  Process on exit and signals.
        process.on('exit', function() { self.terminator(); });

        // Removed 'SIGPIPE' from the list - bugz 852598.
        ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
         'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
        ].forEach(function(element, index, array) {
            process.on(element, function() { self.terminator(element); });
        });
    };


    /*  ================================================================  */
    /*  App server functions (main app logic here).                       */
    /*  ================================================================  */

    /**
     *  Create the routing table entries + handlers for the application.
     */


    /**
     *  Initialize the server (express) and create the routes and register
     *  the handlers.
     */
    self.initializeServer = function() {
        self.app = express.createServer();
        // configure Express
        self.app.config = config;


        //setup mongoose
        self.app.db = mongoose.createConnection(config.mongodb.uri);
        self.app.db.on('error', console.error.bind(console, 'mongoose connection error: '));
        autoIncrement.initialize(self.app.db);
        self.app.autoIncrement = autoIncrement;
        self.app.db.once('open', function() {
            //and... we have a data store
        });


        self.app.set('views', __dirname + '/views');
        self.app.set('view engine', 'jade');
        self.app.use(logger('combined'));
        self.app.use(cookieParser('prabod'));
        self.app.use(bodyParser.json());
        self.app.use(bodyParser.urlencoded({extended: true}));
        self.app.use(methodOverride());
        self.app.use(session({
            resave: true,
            saveUninitialized: true,
            secret: config.cryptoKey,
            store: new mongoStore({url: config.mongodb.uri})
        }));
        // Initialize Passport!  Also use passport.session() middleware, to support
        // persistent login sessions (recommended).
        self.app.use(passport.initialize());
        self.app.use(passport.session());
        self.app.use(express.static(__dirname + '/public'));
        self.app.get('/', function(req, res){
          res.render('base');
        });
        require('./routes')(self.app, passport);
    };

    self.passportIni = function () {
      passport.serializeUser(function(user, done) {
        done(null, user);
      });

      passport.deserializeUser(function(obj, done) {
        done(null, obj);
      });


      // Use the FacebookStrategy within Passport.
      //   Strategies in Passport require a `verify` function, which accept
      //   credentials (in this case, an accessToken, refreshToken, and Facebook
      //   profile), and invoke a callback with a user object.
      passport.use(new FacebookStrategy({
          clientID: FACEBOOK_APP_ID,
          clientSecret: FACEBOOK_APP_SECRET,
          callbackURL: "http://" + self.ipaddress + ":" + self.port + "/auth/facebook/callback"
        },
        function(accessToken, refreshToken, profile, done) {
          // asynchronous verification, for effect...
          process.nextTick(function () {

            // To keep the example simple, the user's Facebook profile is returned to
            // represent the logged-in user.  In a typical application, you would want
            // to associate the Facebook account with a user record in your database,
            // and return that user instead.
            return done(null, profile);
          });
        }
      ));
    }

    /**
     *  Initializes the sample application.
     */
    self.initialize = function() {
        self.setupVariables();
        self.populateCache();
        self.setupTerminationHandlers();
        self.passportIni();
        // Create the express server and routes.
        self.initializeServer();

    };


    /**
     *  Start the server (starts up the sample application).
     */
    self.start = function() {
        //  Start the app on the specific interface (and port).
        self.app.listen(self.port, self.ipaddress, function() {
            console.log('%s: Node server started on %s:%d ...',
                        Date(Date.now() ), self.ipaddress, self.port);
        });
    };

};   /*  Sample Application.  */



/**
 *  main():  Main code.
 */
var zapp = new SampleApp();
zapp.initialize();
zapp.start();
