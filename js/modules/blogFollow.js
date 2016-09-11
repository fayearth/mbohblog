(function($,sfr){
  'use strict';

  var $wrapper = null,
      $element = ".blogPage",
      $replacer = "followers-container";

  var fetchGapi = function () {
    $.getScript("https://apis.google.com/js/plusone.js").done(function() {
      followersIframeOpen("https://www.blogger.com/followers.g?blogID\x3d"+sfr.env.data.blogID+"\x26colors\x3dCgt0cmFuc3BhcmVudBILdHJhbnNwYXJlbnQaBjY2NjY2NiIGMjI4OGJiKgZmZmZmZmYyBjAwMDAwMDoGNjY2NjY2QgYyMjg4YmJKBjk5OTk5OVIGMjI4OGJiWgt0cmFuc3BhcmVudA%3D%3D\x26pageSize\x3d108\x26origin\x3d"+sfr.env.data.homepageUrl);
    });
  };

  var followersIframeOpen = function (url) {
    window.followersIframe = null;
    gapi.load("gapi.iframes", function() {
      if (gapi.iframes && gapi.iframes.getContext) {
        window.followersIframe = gapi.iframes.getContext().openChild({
          url: url,
          where: document.getElementById($replacer),
          messageHandlersFilter: gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER,
          messageHandlers: {
            '_ready': function(obj) {
              window.followersIframe.getIframeEl().height = obj.height;
            },
            'reset': function() {
              window.followersIframe.close();
              followersIframeOpen("https://www.blogger.com/followers.g?blogID\x3d"+sfr.env.data.blogID+"\x26colors\x3dCgt0cmFuc3BhcmVudBILdHJhbnNwYXJlbnQaBjY2NjY2NiIGMjI4OGJiKgZmZmZmZmYyBjAwMDAwMDoGNjY2NjY2QgYyMjg4YmJKBjk5OTk5OVIGMjI4OGJiWgt0cmFuc3BhcmVudA%3D%3D\x26pageSize\x3d108\x26origin\x3d"+sfr.env.data.homepageUrl);
            },
            'open': function(url) {
              window.followersIframe.close();
              followersIframeOpen(url);
            },
            'blogger-ping': function() {
            }
          }
        });
      }
    });
  };

  sfr.modules.blogFollow = {
    init: function(){
      $wrapper = $($element);
      sfr.helpers.attachOnce($wrapper, 'blog-follow', function () {
        fetchGapi();
      }); 
    }
  };

}($,SFR)); $(SFR.modules.blogFollow.init);
