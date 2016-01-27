function restoreSettings() {
  var filename = $('img').attr('src');
  //alert( $('img').prop('src') );
  //alert( $('img').prop('src') );
  $.ajax({
    url: '/tempDel/' + filename,
    type: 'POST',
  });
  console.log(filename);
}

function shareFb() {
  window.fbAsyncInit = function() {
    FB.init({
      appId: '1653824821565450',
      xfbml: true,
      version: 'v2.5'
    });
  };
  (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {
      return;
    }
    js = d.createElement(s);
    js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));
  FB.ui({
    method: 'feed',
    link: window.location.href,
    caption: 'An example caption',
  }, function(response) {});
}

function fbShare(url, title, descr, image, winWidth, winHeight) {
        var winTop = (screen.height / 2) - (winHeight / 2);
        var winLeft = (screen.width / 2) - (winWidth / 2);
        window.open('http://www.facebook.com/sharer.php?s=100&p[title]=' + title + '&p[summary]=' + descr + '&p[url]=' + url + '&p[images][0]=' + image, 'sharer', 'top=' + winTop + ',left=' + winLeft + ',toolbar=0,status=0,width=' + winWidth + ',height=' + winHeight);
    }
