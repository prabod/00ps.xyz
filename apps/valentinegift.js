exports.valentinegift = function(req, res) {
  if (req.isAuthenticated()) {
    var fb = require('fb');

    function compositeImage(source, profPic,character,destination, callback) {
      var exec = require('child_process').exec;
      var command = [
        'convert',
        source,
        profPic,
        '-geometry',
        '87x87+34+34',
        '-composite',
        character,
        '-geometry',
        '130x130+545+237',
        '-composite',
        destination
      ];
      exec(command.join(' '), function(err, stdout, stderr) {
        console.log(stderr);
        fs.unlink(profPic);
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
        '40',
        '-font',
        'public/templates/Circle-Of-Love.ttf',
        '-draw',
        '"fill white text 50,50 '+ text1 + ' fill white text -100,290 \''+ text2 +'\' "',
        '-strip',
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

    var name = '../data/public/valentinegift/' + Date.now() + '.jpg';
    var charName ;
    var charPath = 'public/templates/val/';
    fs.readdir('public/templates/val/',function (err,files) {
      var value = Math.floor((Math.random() * files.length));
      charPath += files[value];
      charName = files[value].split("-").slice(0,-1).join(' ');
    });
    var des;
    download(req.user.photos[0].value, name, function() {
      console.log('done');
      des = "\"../data/public/valentinegift/" + userId + ".jpg\"";
      compositeImage('public/templates/valentinegift.png', name,charPath, des, function() {
        addText(des,"\'"+ req.user.displayName + "\'",charName,des,function () {
          res.redirect("/valentinegift/" + req.user.id);
        })

      });
    });

  } else {
    res.render('appPre', {
      title: "Find The Gift you are Going to Get for Valentine",
      url: "http://fb.00ps.xyz/valentinegift/",
      description: "Click Here to Find The Gift you are Going to Get for Valentine",
      IDecription: "Click Here to Find The Gift you are Going to Get for Valentine",
      image : "/templates/valentinegiftCover.png",
      imageLink: "http://fb.00ps.xyz/templates/valentinegiftCover.png",
      topA : "Click Here to Find The Gift you are Going to Get for Valentine",
      app :'/valentinegift/',
      authenticated : false
    });
  }
}

exports.display = function(req, res) {
  var fs = require('fs');

  if (!fs.existsSync('../data/public/valentinegift/' + req.params.id + ".jpg")) {
    console.log(req.params.id);
      res.redirect('/valentinegift/');
  } else {
    var topA;
    var authe= false;
    if (req.isAuthenticated() && req.params.id === req.user.id) {
      topA = 'Try Again';
      authe = true;
    } else {
      topA = 'Click Here to Find The Gift you are Going to Get for Valentine';
      authe = true;
    }

    res.render('appPre', {
      image: "/valentinegift/" + req.params.id + ".jpg",
      user: "fb.00ps.xyz",
      title: "Find The Gift you are Going to Get for Valentine",
      url: "http://fb.00ps.xyz/valentinegift/" + req.params.id,
      description: "Click Here to Find The Gift you are Going to Get for Valentine",
      IDecription: "Click Here to Find The Gift you are Going to Get for Valentine",
      imageLink: "http://fb.00ps.xyz/valentinegift/" + req.params.id + ".jpg",
      topA: topA,
      "app" :'/valentinegift/',
      "authenticated" : authe
    });
  }
}
