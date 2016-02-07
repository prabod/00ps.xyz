exports.valentine = function(req, res) {
  if (req.isAuthenticated()) {
    var fb = require('fb');

    function compositeImage(source, watermark, destination, callback) {
      var exec = require('child_process').exec;
      var command = [
        'composite',
        '-geometry',
        '85x85+31+30',
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
        '"fill white text 40,50 '+ text1 + ' fill white text -20,250 '+ text2 +' \' "',
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

    var name = '../data/public/valentine/' + Date.now() + '.jpg';

    var des;
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var value = possible.charAt(Math.floor(Math.random() * possible.length));

    download(req.user.photos[0].value, name, function() {
      console.log('done');
      des = "\"../data/public/valentine/" + userId + ".jpg\"";
      compositeImage("public/templates/valentine.png", name, des, function() {
        addText(des,"\'"+ req.user.displayName + "\'",value,des,function () {
          console.log(req.user);
          res.redirect("/valentine/" + req.user.id);
        })

      });
    });

  } else {
    res.render('appPre', {
      title: "Find First Letter of your Valentine's Name",
      user: "fb.00ps.xyz",
      url: "http://fb.00ps.xyz/valentine/",
      description: "Click Here to Find First Letter of your Valentine's Name",
      IDecription: "Click Here to Find First Letter of your Valentine's Name",
      image : "/templates/valentinecover.png",
      imageLink: "http://fb.00ps.xyz/templates/valentinecover.png",
      topA : "Click Here to Find your Valentine's First letters",
      app :'/valentine/',
      authenticated : false
    });
  }
}

exports.display = function(req, res) {
  var fs = require('fs');

  if (!fs.existsSync('../data/public/valentine/' + req.params.id.substring(0,17) + ".jpg")) {
    //req.logout();
    res.redirect('/valentine/');
  } else {
    var topA;
    var authe;
    if (req.isAuthenticated() && req.params.id === req.user.id) {
      topA = 'Try Again';
      authe = true;
    } else {
      topA = "Click Here to Find First Letter of your Valentine's Name";
      authe = false;
    }

    res.render('appPre', {
      "image": "/valentine/" + req.params.id + ".jpg",
      "user": "fb.00ps.xyz",
      "title": "Find First Letter of your Valentine's Name",
      "url": "http://fb.00ps.xyz/valentine/" + req.params.id,
      "description": "Click Here to Find First Letter of your Valentine's Name",
      "IDecription": "Click Here to Find First Letter of your Valentine's Name",
      "imageLink": "http://fb.00ps.xyz/valentine/" + req.params.id + ".jpg",
      "topA": topA,
      "app" :'/valentine/',
      "authenticated" : authe
    });
  }
}
