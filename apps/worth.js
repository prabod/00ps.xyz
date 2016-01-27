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
      var name = '../data/public/' + Date.now() + '.jpg';
      var des;
      download(req.user.photos[0].value, name, function() {
        console.log('done');
        des = '../data/public/'+ Date.now()+'.png';
        compositeImage('networrth.png', name, des ,function () {
          res.render('worthPost', {
            image: des.substring(15)
          });
        });

      });

  } else {
    res.render('worthPre');
  }
}
