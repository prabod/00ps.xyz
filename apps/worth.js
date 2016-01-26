exports.worth = function(req, res) {
    if (req.isAuthenticated()) {
      function compositeImage(source, watermark, destination, callback) {
        var spawn = require('child_process').spawn;
        var composite = spawn('gm', [
          'composite',
          '-geometry',
          '+5+6',
          watermark,
          source,
          destination
        ]);

        composite.stdout.on('data', function(data) {
          console.log(data);
        });

        composite.stderr.on('data', function(data) {
          console.log(data);
        });

        composite.on('exit', function(code) {
          if (code != 0) {
            console.log('gm composite process exited with code ' + code);
          }
          callback();
        });
      }
      var userId = req.user.id;
      fb.setAccessToken('CAAXgJRkCmAoBAHQ8KjKcjcVMMH1X3s3SSo2ZBLb0ZCKEBkOKTHbLAmGG2Di3WQIdZBkEKZBifUhwac0ek72U0g7HRpShXSyWZCVzOFIsd2M8XkPlzCjqTFZCRZBsvhnaE1CmLPNjTpqS6bv0F92jdSnlmHAt4EKfGrp6s9WGQ9kHKXwcZBhOvbMqaNbZBGX8Wdvqla27mTpKTfCM3s3uPqmYs');
      FB.api(userId + '/picture', '?height=100&width=100', function(res) {
          console.log(res);
          compositeImage('../worrth.png', res.data.url, '../new.png');
        });
      res.render('worthPost',{image:'../new.png'});
      }
      else {
        res.render('worthPre');
      }
    }
