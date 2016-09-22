(function($,sfr) {
  "use strict";
  var preview = function(url, $origin) {
    var self = this,
        offsetLeft = ($origin.offset().left + ($origin.outerWidth() / 2) - $(window).scrollLeft()) - ($(window).outerWidth() / 2),
        offsetTop = ($origin.offset().top + ($origin.outerHeight() / 2) - $(window).scrollTop()) - ($(window).outerHeight() / 2),
        $preview = $('<div class="galleryPreview"></div>'),
        $img = $('<img style="opacity:0" src="' + url + '" />');
    $preview.append($img),
    $img.on("load", function(func) {
      var scale = $origin.outerWidth() / $img.outerWidth();
      $img.css({
        transform: "translate(" + offsetLeft + "px," + offsetTop + "px) scale(" + scale + ")",
        opacity: 1
      });
      setTimeout(function() {
        $preview.addClass("galleryPreview-animated");
        $preview.trigger("sfr-ready")
      }, 5)
    }),
    this.render = function() {
      return $preview
    };
    return this
  };
  var attach = function($this) {
    if (!$this.attr("id") || $this.find(".image-active").length === 0) {
      $this.on("click", ".gallery-item a", function(func) {
        func.preventDefault();
        var $trigger = $(this),
            url = $trigger.attr("href"),
            previewInstance = new preview(url, $(this)),
            $previewInstance = previewInstance.render(),
            $loading = $('<div class="iconLoad"><i class="s-spinner"></i></div>');
        $this.addClass('isAttached');
        $trigger.parent().addClass('inPreview');
        $("body").append($previewInstance);
        $previewInstance.addClass("with-background").append($loading);
        $previewInstance.one("sfr-ready", function(func) {
          $loading.remove();
          $previewInstance.removeClass("with-background").addClass("galleryPreview-open");
          $previewInstance.one("click", function() {
            $previewInstance.removeClass("galleryPreview-open");
            $previewInstance.one("transitionend webkitTransitionEnd", function() {
              $previewInstance.remove();
              $this.removeClass('isAttached');$trigger.parent().removeClass('inPreview');
            })
          })
        })
      });
    }else{
      $this.addClass("isAttached");
      $this.on("click", ".preview .preview-wrap .image a", function(func) {
        func.preventDefault();
        var $trigger = $(this),
            url = $trigger.attr("href"),
            previewInstance = new preview(url, $(this)),
            $previewInstance = previewInstance.render(),
            $loading = $('<div class="iconLoad"><i class="s-spinner"></i></div>');
        $trigger.parent().append($loading);$trigger.css({'pointer-events':'none'});
        $("body").append($previewInstance);
        $previewInstance.one("sfr-ready", function(func) {
          $loading.remove();
          $trigger.hide();$trigger.css({'pointer-events':''});
          $previewInstance.addClass("galleryPreview-open");
          $previewInstance.one("click", function() {
            $previewInstance.removeClass("galleryPreview-open");
            $previewInstance.one("transitionend webkitTransitionEnd", function() {
              $previewInstance.remove();
              $trigger.show()
            })
          })
        })
      });
      var active = $this.find(".image-active").index();
      var total = $this.find(".preview .preview-wrap .image").length - 1;
      var id = $this.attr("id").substr(8);
      var openImage = function(image) {
        if (image === active || image < 0 || image > total) {
          return
        }
        var classIn, classOut;
        if (image > active) {
          classIn = "right";
          classOut = "left"
        } else {
          classIn = "left";
          classOut = "right"
        }
        active = image;
        var $previousImage = $this.find(".image-active");
        var $currentImage = $this.find(".preview .image#image_" + (image + 1));
        $previousImage.removeClass("image-active").addClass("image-out-" + classOut);
        $previousImage.one("webkitAnimationEnd animationend", function() {
          $previousImage.removeClass("image-out-" + classOut)
        });
        $currentImage.addClass("image-active image-in-" + classIn);
        $currentImage.one("webkitAnimationEnd animationend", function() {
          $currentImage.removeClass("image-in-" + classIn)
        });
        $this.trigger("sfr-galleryimagechanged", active)
      };
      var showImage = function(image){
        var regex = /\/s[0-9]+(\/)?/,
            url = image.data("src"),
            $loading = $('<div class="iconLoad"><i class="s-spinner"></i></div>'),
            $width = image.attr("width"),
            $wMax = url.replace(regex,"/w"+$width+"/")+" "+$width+"w",
            $wSmall = url.replace(regex,"/w200/")+" 200w",
            $wMed = url.replace(regex,"/w320/")+" 320w",
            $wLarge = url.replace(regex,"/w400/")+" 400w",
            $wHuge = url.replace(regex,"/w640/")+" 640w";
        image.parent().append($loading);
        if("undefined" !== typeof image.attr("data-src")) {
          $("<img/>").attr("src",url.replace(regex,"/w"+$width+"/")).load(function(){
            $(this).remove(); $loading.remove(); image.attr("src",url.replace(regex,"/w"+$width+"/"));image.removeAttr("data-src")
          });
        }
        if($width > 640){
          image.attr("srcset",$wMax+", "+$wMed+", "+$wLarge+", "+$wHuge+", "+$wSmall);
          image.attr("sizes","(max-width: "+$width+"px) 100vw, "+$width+"px")
        }else{
          image.attr("srcset",$wMax+", "+$wMed+", "+$wLarge+", "+$wSmall);
          image.attr("sizes","(max-width: "+$width+"px) 100vw, "+$width+"px")
        }
      };
      $this.on("click", ".thumbs a", function(func) {
        func.preventDefault();
        var image = $(this).parent().index();
        openImage(image)
      });
      $this.on("sfr-galleryimagechanged", function(func, image) {
        $this.find(".thumbs a.selected").removeClass("selected");
        $this.find(".thumbs li:nth-child(" + (image + 1) + ") a").addClass("selected")
      });
      var $prev = $("<a class=\"images-navigate images-navigate-prev images-navigate-hide\"></a>");
      var $next = $("<a class=\"images-navigate images-navigate-next\"></a>");
      $prev.on("click", function(func) {
        func.preventDefault();
        openImage(active - 1)
      });
      $next.on("click", function(func) {
        func.preventDefault();
        openImage(active + 1)
      });
      $this.find(".preview").append($prev).append($next);
      $this.on("sfr-galleryimagechanged", function(func, image) {
        (image < 1) ? $prev.addClass("images-navigate-hide"): $prev.removeClass("images-navigate-hide");
        (image >= total) ? $next.addClass("images-navigate-hide"): $next.removeClass("images-navigate-hide")
      });
      $this.on("sfr-galleryimagechanged",function(func){
        var image = $this.find(".image-active img");;
        showImage(image)
      });
      $(window).on("keydown.sfr-gallerykeydown", function(func) {
        if (func.keyCode === 37) {
          func.preventDefault();
          openImage(active - 1)
        }
        if (func.keyCode === 39) {
          func.preventDefault();
          openImage(active + 1)
        }
      });
      $this.trigger("sfr-galleryimagechanged", active);
    }
  };
  sfr.components.gallery = function(){
    sfr.helpers.attachOnce(".gallery", "gallery", attach)
  }
  $(window).on("sfr-DOMChange", sfr.components.gallery);
}($,SFR));
$(SFR.components.gallery);
