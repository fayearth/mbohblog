(function($,fyr){
  "use strict";
  var $wrapper = null,
      wrapperSelector = ".feed",
      btnNext = ".pager-next",
      btnPrev = ".pager-prev",
      beaconSelector = ".page-beacon",
      maxPost = 20;
  var getFeeds = function(){
      var strSection, substrSection, nameSection;
      if (baseUrl.indexOf("?q=") != -1 || baseUrl.indexOf(".html") != -1) { return };
      strSection = baseUrl.indexOf("/search/label/") + 14;
      if (strSection != 13) {
        substrSection = getLabel();
        nameSection = "feeds/posts/summary/-/" + substrSection + "?alt=json-in-script&max-results=99999";
      } else {
        nameSection = "feeds/posts/summary?alt=json-in-script&max-results=99999";
      };
      return nameSection
  };
  var getLabel = function(){
      var strLabel, strLabelReg, nameLabel;
      strLabel = baseUrl.indexOf("/search/label/") + 14;
      strLabelReg = baseUrl.indexOf("?");
      nameLabel = (strLabelReg == -1) ? baseUrl.substring(strLabel) : baseUrl.substring(strLabel, strLabelReg);
      return nameLabel
  };
  var maxPosts = function(){
      var regEx = /\max-results=/,
          regEx2 = /\Terbaru/,
          totalPost = baseUrl.match(regEx) !== null ? baseUrl.split(regEx)[1] : maxPost,
          perLabel = baseUrl.match(regEx2) !== null ? totalPost-4 : totalPost;
      return perLabel
  };
  var getPrevLink = function(btnPrev){
      var dfr = $.Deferred();
      $.ajax({
        type: 'GET',
        url: fyr.env.data.homepageUrl + getFeeds(),
        dataType: 'jsonp',
        success: dfr.resolve,
        error: dfr.reject
      });
      dfr.promise().done(function(response) {
        var getUrl = baseUrl,
            strUrl = getUrl.indexOf("/search/label/") != -1,
            substrUrl = strUrl ? getUrl.substr(getUrl.indexOf("/search/label/") + 14, getUrl.length) : "";
        substrUrl = substrUrl.indexOf("?") != -1 ? substrUrl.substr(0, substrUrl.indexOf("?")) : substrUrl;
        var pathUrl = strUrl ? "search/label/" + substrUrl + "?updated-max=" : "search?updated-max=",
            feedEntry = response.feed.entry.length,
            entryLength = Math.ceil(feedEntry / maxPosts()-1);
        /*if (entryLength == 0) { return }*/
        var selector,pathPack = [""];
        strUrl ? pathPack.push("search/label/" + substrUrl) : pathPack.push("?max-results=" + maxPosts());
        selector = 1;
        for (var count = 2; count <= entryLength; count++) {
          var chosenFeed = (count - 1) * maxPosts() - 1,
              datePublish = response.feed.entry[chosenFeed].published.$t,
              dateUrl = datePublish.substring(0, 19) + datePublish.substring(23, 29);
          dateUrl = dateUrl.replace(/\+/,"%2B");
          if (getUrl.indexOf(dateUrl) == -1) { selector = count }
          pathPack.push(pathUrl + dateUrl);
        }; console.log(pathPack)
        if(!(btnPrev.parent().hasClass("shown"))){ btnPrev.parent().addClass("shown") };
        btnPrev.attr("href","/"+pathPack[selector])
      })
   };
  var btnNextShow = function(beacon){
      var $url = beacon.data("url");
      if(!($(btnNext).parent().hasClass("shown"))){ $(btnNext).parent().addClass("shown") };
      $(btnNext).attr("href",$url)
  };
  var getPrevPage = function(){
      var $this = $wrapper.find(btnPrev); $this.length && getPrevLink($this)
  };
  var getNextPage = function(){
      $wrapper.find(beaconSelector).each(function(){
         var $this = $(this); fyr.helpers.attachOnce($this, 'page-beacon', function () { btnNextShow($this) })
      })
  };
  fyr.modules.indexPager = {
      init: function(){
          $wrapper = $(wrapperSelector);
          fyr.helpers.attachOnce($wrapper, "index-pager", function () {
              getNextPage();getPrevPage();
          })
      }
  }
}($,fyr));
$(fyr.modules.indexPager.init);
