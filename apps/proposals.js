exports.proposal = function(req, res) {
  if (req.isAuthenticated()) {
    var fb = require('fb');

    function compositeImage(source, watermark, destination, callback) {
      var exec = require('child_process').exec;
      var command = [
        'composite',
        '-geometry',
        '100x100+27+25',
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
        '"fill white text 20,50 '+ text1 + ' fill white text 0,200 '+ text2 +' \' "',
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

    var name = '../data/public/proposal/' + Date.now() + '.jpg';

    var des;
    var value = (Math.floor((Math.random() * 30) + 1)).toString();
    download(req.user.photos[0].value, name, function() {
      console.log('done');
      des = "\"../data/public/proposal/" + userId + ".jpg\"";
      compositeImage("public/templates/proposal.png", name, des, function() {
        addText(des,"\'"+ req.user.displayName + "\'","\'"+value+"\'",des,function () {
          console.log(req.user);
          res.redirect("/proposal/" + req.user.id);
        })

      });
    });

  } else {
    res.render('appPre', {
      title: "Find The Number of Proposals You Get for This Valentine",
      user: "fb.00ps.xyz",
      url: "http://fb.00ps.xyz/proposal/",
      description: "Click Here to Find The Number of Proposals You Get for This Valentine",
      IDecription: "Click Here to Find The Number of Proposals You Get for This Valentine",
      image : "/templates/proposalcover.png",
      imageLink: "http://fb.00ps.xyz/templates/proposalcover.png",
      topA : "Click Here to Find The Number of Proposals You Get for This Valentine",
      app :'/proposal/',
      authenticated : false
    });
  }
}

exports.display = function(req, res) {
  var fs = require('fs');

  if (!fs.existsSync('../data/public/proposal/' + req.params.id.substring(0,17) + ".jpg")) {
    //req.logout();
    res.redirect('/proposal/');
  } else {
    var topA;
    var authe;
    if (req.isAuthenticated() && req.params.id === req.user.id) {
      topA = 'Try Again';
      authe = true;
    } else {
      topA = "Click Here to Find The Number of Proposals You Get for This Valentine";
      authe = false;
    }

    res.render('appPre', {
      "image": "/proposal/" + req.params.id + ".jpg",
      "user": "fb.00ps.xyz",
      "title": "Find The Number of Proposals You Get for This Valentine",
      "url": "http://fb.00ps.xyz/proposal/" + req.params.id,
      "description": "Find The Number of Proposals You Get for This Valentine",
      "IDecription": "Find The Number of Proposals You Get for This Valentine",
      "imageLink": "http://fb.00ps.xyz/proposal/" + req.params.id + ".jpg",
      "topA": topA,
      "app" :'/proposal/',
      "authenticated" : authe
    });
  }
}
