(function($,fyr){
  "use strict";
  var $gallery = null, $holderIMG = null, getImage = function(ximg){
    var $src, $srcset, $img = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
    ximg.attr("src", $img), ximg.waypoint(function(func) {
      $src = ximg.attr("data-src"), ximg.css("opacity",0), "undefined" != typeof $src && $("<img/>").attr("src", $src).on("load", function() {
      $(this).remove(), ximg.attr("src", $src), $srcset = ximg.attr("data-srcset"), "undefined" != typeof $srcset && ximg.attr("srcset", $srcset), ximg.removeAttr("data-src data-srcset"), resetHolder(ximg, ximg.parents($holderIMG)), Waypoint.refreshAll()
      }), this.destroy()
    }, {
      offset: "115%"
    })
  }, resetHolder = function(ximg, xholder){
	  fyr.loadModule("masonry2", function() { fyr.modules.masonry($gallery,$holderIMG), ximg.css("opacity",1) })
  };
  fyr.modules.gallery = {
    init: function(){
	  $gallery = $(".post-gallery .post-gallery-grid"), $holderIMG = "li", fyr.helpers.attachOnce($gallery.find("img"), "gallery", getImage)
    }
  }
}($,fyr));$(fyr.modules.gallery.init);
