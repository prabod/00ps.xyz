exports.worth = function(req, res) {
  if (req.isAuthenticated()) {
    var fb = require('fb');
    function compositeImage(source, watermark, destination, callback) {
      var exec = require('child_process').exec;
      var command = [
        'composite',
        '-geometry',
        '+62+68',
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
    var fs = require('fs'),
      request = require('request');
    var download = function(uri, filename, callback) {
      request.head(uri, function(err, res, body) {
        request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
      });
    };
    var userId = req.user.id;
    var name = '../data/public/worth/' + Date.now() + '.jpg';
    var des;
    download(req.user.photos[0].value, name, function() {
      console.log('done');
      des = '../data/public/worth/' + userId + '.png';
      compositeImage('networrth.png', name, des, function() {
        req.user.path = "/" + des.substring(15);
        res.redirect("/worth/"+req.user.id);
      });
    });

  } else {
    res.render('worthPre', {
      title: "Find Your Net Worth in 10 Years",
      url: "http://fb.00ps.xyz/worth/",
      description: "Click Here to Find your Net Worth in 10 Years",
      IDecription: "Click Here to Find your Net Worth in 10 Years",
      imageLink: ""
    });
  }
}

exports.display = function(req, res) {
  res.render('worthPost', {
    image: req.user.path,
    user : req.user.id,
    title: "Find Your Net Worth in 10 Years",
    url: "http://fb.00ps.xyz/worth/"+req.user.id,
    description: "Click Here to Find your Net Worth in 10 Years",
    IDecription: "Click Here to Find your Net Worth in 10 Years",
    imageLink: "http://fb.00ps.xyz/worth" + req.user.path
  });
}
