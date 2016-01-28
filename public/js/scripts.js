function restoreSettings() {
  var filename = $('.img1').attr('src');
  //alert( $('img').prop('src') );
  //alert( $('img').prop('src') );
  $.ajax({
    url: '/tempDel' + filename,
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
  (function() {
    var e = $("meta[property='og:url']").attr("content");
    var t = 626,
      o = 496,
      n = screen.width / 2 - t / 2,
      r = screen.height / 2 - o / 2 - 50;
    window.open("https://www.facebook.com/sharer/sharer.php?u=" + e, "facebook-share-dialog", "width=" + t + ",height=" + o + ",top=" + r + ",left=" + n)
  });
}

  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-72946878-1', 'auto');
  ga('send', 'pageview');
