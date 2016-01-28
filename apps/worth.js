exports.worth = function(req, res) {
  if (req.isAuthenticated()) {
    res.redirect("/worth/"+req.user.id);
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
      res.render('worthPost', {
        image: "/" + des.substring(15),
        title: "Find Your Net Worth in 10 Years",
        url: "http://fb.00ps.xyz/worth/"+userId,
        description: "Click Here to Find your Net Worth in 10 Years",
        IDecription: "Click Here to Find your Net Worth in 10 Years",
        imageLink: "/" + des.substring(15)
      });
    });

  });

}
