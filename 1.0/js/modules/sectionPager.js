(function($, sfr){
  "use strict";
  var $wrapper = null,
      listBtnNext = '.pager.pager-next',
      listBtnPrev = '.pager.pager-prev',
      wrapperSelector = '#Blog1',
      listSelector = '.s-row',
      beaconSelector = '.list-beacon',
      maxPost = 6,
      rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
  var createWaypoints = function () {
    $wrapper.find(beaconSelector).each(function () {
      var $this = $(this);
      sfr.helpers.attachOnce($this, 'list-beacon', function () {
        createWaypoint($this);
      });
    });
  };
  var createWaypoint = function ($waypoint) {
    var listNext = $waypoint.data('list-next');
    $waypoint.waypoint(function () {
      if ( !$waypoint.data('page-loaded') ) {
        fetchPage(listNext);
        $waypoint.data('page-loaded', true);
      }; this.destroy()
    }, {
      offset: 'bottom-in-view'
    });
  };
  var getNewLocation = function(newLink){
    var regEx = /&start\=[\d]+/,
        newPage,
        newPathname;
    newPage = newLink.match(regEx) !== null && newLink.split(regEx)[0];
    newPathname = newPage.split(/\?updated-max=/)[1];
    return window.location.pathname+ "?updated-max=" +newPathname
  };
  var loadPage = function(html){
    var newDom = $('<div></div>').append(html.replace(rscript, '')),
        newPosts = newDom.find(wrapperSelector+" "+listSelector).children(),
        newLink = newDom.find(beaconSelector).data("list-next");
    removeLoader();
    $wrapper.find(listSelector).append(newPosts);
    $wrapper.find(beaconSelector).remove();
    if(newLink){
      $(listBtnNext).attr("href",getNewLocation(newLink)).addClass('shown')
    }
    $(window).trigger('sfr-DOMChange');
  };
  var fetchPage = function (listNext) {
    var dfr = $.Deferred();
    addLoader();
    removeLoader(10000);
    listNext = listNext || $wrapper.find(beaconSelector).data("list-next");
    $.ajax({
      type: 'GET',
      url: listNext,
      dataType: 'html',
      success: dfr.resolve,
      error: dfr.reject
    });
    dfr.promise().done(function(response) {
      loadPage(response);
    });
  };
  var getSection = function(baseUrl){
    var strSection,strSectionIdx,substrSection,nameSection;
    if (baseUrl.indexOf("?q=") != -1 || baseUrl.indexOf(".html") != -1) {
        return
    };
    strSection = baseUrl.indexOf("/search/label/") + 14;
    if (strSection != 13) {
      strSectionIdx = baseUrl.indexOf("?");
      substrSection = (strSectionIdx == -1) ? baseUrl.substring(strSection) : baseUrl.substring(strSection, strSectionIdx);
      nameSection = "feeds/posts/summary/-/" + substrSection + "?alt=json-in-script&max-results=99999";
    } else {
      nameSection = "feeds/posts/summary?alt=json-in-script&max-results=99999";
    }
    return nameSection
  };
  var getLinkPrev = function(listPrev){
    var dfr = $.Deferred();
    $.ajax({
      type: 'GET',
      url: sfr.env.data.homepageUrl + getSection(baseUrl),
      dataType: 'jsonp',
      success: dfr.resolve,
      error: dfr.reject
    });
    dfr.promise().done(function(response) {
      var getUrl = location.href,
          strUrl = getUrl.indexOf("/search/label/") != -1,
          substrUrl = strUrl ? getUrl.substr(getUrl.indexOf("/search/label/") + 14, getUrl.length) : "";
      substrUrl = substrUrl.indexOf("?") != -1 ? substrUrl.substr(0, substrUrl.indexOf("?")) : substrUrl;
      var pathUrl = strUrl ? "search/label/" + substrUrl + "?updated-max=" : "search?updated-max=",
          feedEntry = response.feed.entry.length,
          entryLength = Math.ceil(feedEntry / maxPosts()-1);
      if (entryLength <= 1) {
        return
      }
      var selector,pathPack = [""];
      strUrl ? pathPack.push("search/label/" + substrUrl + "?max-results=" + maxPosts()) : pathPack.push("?max-results=" + maxPosts());
      for (var count = 2; count <= entryLength; count++) {
        var chosenFeed = (count - 1) * maxPosts() - 1,
            datePublish = response.feed.entry[chosenFeed].published.$t,
            dateUrl = datePublish.substring(0, 19) + datePublish.substring(23, 29);
        selector = 1;
		dateUrl = dateUrl.replace(/\+/,"%2B");
        if (getUrl.indexOf(dateUrl) == -1) {
          selector = count
        }
        pathPack.push(pathUrl + dateUrl + "&max-results=" + maxPosts());
        listPrev.attr("href","/"+pathPack[selector]).addClass("shown")
      };
    });
  };
  var maxPosts = function(){
    var regEx = /\max-results=/,
        totalPost = baseUrl.match(regEx) !== null ? baseUrl.split(regEx)[1] : maxPost;
    return totalPost
  };
  var getPrevPage = function(){
    var listPrev = $wrapper.find(listBtnPrev);
    if(listPrev.length>0){
      getLinkPrev(listPrev)
    }
  };
  var addLoader = function () {
    $wrapper.toggleClass('is-loading-page', true);
  };
  var removeLoader = function (timeout) {
    timeout = timeout || 1;
    sfr.helpers.debounce(function () {
      $wrapper.toggleClass('is-loading-page', false);
    }, timeout, 'loading-page');
  }
  sfr.modules.sectionPager = {
    init: function(){
      $wrapper = $(wrapperSelector);
      sfr.helpers.attachOnce($wrapper, 'section-pager', function () {
        getPrevPage();createWaypoints();
      });
    }
  };
}($, SFR));
$(SFR.modules.sectionPager.init);
