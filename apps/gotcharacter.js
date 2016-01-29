exports.gotCharacter = function(req, res) {
  if (req.isAuthenticated()) {
    var fb = require('fb');

    function compositeImage(source, profPic,character,destination, callback) {
      var exec = require('child_process').exec;
      var command = [
        'convert',
        source,
        profPic,
        '-geometry',
        '85x85+32+27',
        '-composite',
        character,
        '-geometry',
        '85x85+426+266',
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
        '20',
        '-font',
        'public/templates/Game-of-Thrones.ttf',
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

    var name = '../data/public/gotChar/' + Date.now() + '.jpg';
    var charName ;
    var charPath = 'public/templates/GOT/'+req.user.gender+"/";
    fs.readdir('public/templates/GOT/'+req.user.gender+"/",function (err,files) {
      var value = Math.floor((Math.random() * files.length));
      charPath += files[value];
      charName = files[value].split("-").slice(0,-1).join(' ');
    });
    var des;
    download(req.user.photos[0].value, name, function() {
      console.log('done');
      des = "\"../data/public/gotChar/" + userId + ".jpg\"";
      compositeImage('public/templates/gotChar.png', name,charPath, des, function() {
        addText(des,"\'"+ req.user.displayName + "\'",charName,des,function () {
          res.redirect("/gotcharacter/" + req.user.id);
        })

      });
    });

  } else {
    res.render('gotcharacterPre', {
      title: "Find Your Game of Thrones character",
      url: "http://fb.00ps.xyz/gotcharacter/",
      description: "Click Here to Find Your Game of Thrones character",
      IDecription: "Click Here to Find Your Game of Thrones character",
      imageLink: ""
    });
  }
}

exports.display = function(req, res) {
  var fs = require('fs');

  if (!fs.existsSync('../data/public/gotChar/' + req.params.id + ".jpg")) {
    res.redirect('/gotcharacter/');
  } else {
    var topA;

    if (req.isAuthenticated()&& req.params.id === req.user.id) {
      topA = 'Try Again';
    } else {
      topA = 'Click Here to Find Your Game of Thrones character';
    }

    res.render('gotcharacterPost', {
      image: "/gotChar/" + req.params.id + ".jpg",
      user: "fb.00ps.xyz",
      title: "Find Your Game of Thrones character",
      url: "http://fb.00ps.xyz/gotcharacter/" + req.params.id,
      description: "Click Here to Find Your Game of Thrones character",
      IDecription: "Click Here to Find Your Game of Thrones character",
      imageLink: "http://fb.00ps.xyz/gotChar/" + req.params.id + ".jpg",
      topA: topA
    });
  }
}
