exports.worth = function(req, res) {
  if (req.isAuthenticated()) {
    var fb = require('fb');

    function compositeImage(source, watermark, destination, callback) {
      var exec = require('child_process').exec;
      var command = [
        'composite',
        '-geometry',
        '95x95+31+32',
        watermark,
        source,
        destination
      ];
      exec(command.join(' '), function(err, stdout, stderr) {
        console.log(stderr);
        fs.unlink(watermark);
        callback();
      });
    }

    function addText(source,text1,text2,destination,callback){
      var exec = require('child_process').exec;
      var command = [
        'convert',
        source,
        '-gravity',
        'North',
        '-pointsize',
        '35',
        '-draw',
        '"fill black text 30,50 '+ text1 + ' fill white text -70,300 \'$ '+ text2 +' \' "',
        '-strip',
        '-quality',
        '75',
        destination
      ];
      exec(command.join(' '), function(err, stdout, stderr) {
        console.log(stderr);
        console.log(command.join(' '));
        callback();
      });
    }

    var fs = require('fs');
    var request = require('request');

    var download = function(uri, filename, callback) {
      request.head(uri, function(err, res, body) {
        request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
      });
    };

    var userId = req.user.id;

    var name = '../data/public/worth/' + Date.now() + '.jpg';

    var des;
    var value = Math.floor((Math.random() * 100000000000) + 100000000);
    download(req.user.photos[0].value, name, function() {
      console.log('done');
      des = "\"../data/public/worth/" + userId + ".jpg\"";
      compositeImage("public/templates/networth.png", name, des, function() {
        addText(des,"\'"+ req.user.displayName + "\'",value,des,function () {
          console.log(req.user);
          res.redirect("/worth/" + req.user.id);
        })

      });
    });

  } else {
    res.render('appPre', {
      title: "Find Your Net Worth in 10 Years",
      user: "fb.00ps.xyz",
      url: "http://fb.00ps.xyz/worth/",
      description: "Click Here to Find your Net Worth in 10 Years",
      IDecription: "Click Here to Find your Net Worth in 10 Years",
      image : "/templates/networthcover.png",
      imageLink: "http://fb.00ps.xyz/templates/networthcover.png",
      topA : "Click Here to Find your Net Worth in 10 Years",
      app :'/worth/',
      authenticated : false
    });
  }
}

exports.display = function(req, res) {
  var fs = require('fs');

  if (!fs.existsSync('../data/public/worth/' + req.params.id.substring(0,17) + ".jpg")) {
    //req.logout();
    res.redirect('/worth/');
  } else {
    var topA;
    var authe;
    if (req.isAuthenticated() && req.params.id === req.user.id) {
      topA = 'Try Again';
      authe = true;
    } else {
      topA = 'Click Here to Find your Net Worth in 10 Years';
      authe = false;
    }

    res.render('appPre', {
      "image": "/worth/" + req.params.id + ".jpg",
      "user": "fb.00ps.xyz",
      "title": "Find Your Net Worth in 10 Years",
      "url": "http://fb.00ps.xyz/worth/" + req.params.id,
      "description": "Click Here to Find your Net Worth in 10 Years",
      "IDecription": "Click Here to Find your Net Worth in 10 Years",
      "imageLink": "http://fb.00ps.xyz/worth/" + req.params.id + ".jpg",
      "topA": topA,
      "app" :'/worth/',
      "authenticated" : authe
    });
  }
}
