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

  var getLabelUrl = function(baseUrl){
    var strLabels,strLabelsIdx,nmaLabels,nmaLabel;
    if (baseUrl.indexOf("?q=") != -1 || baseUrl.indexOf(".html") != -1) {
        return
    };
    strLabels = baseUrl.indexOf("/search/label/") + 14;

    if (strLabels != 13) {
      strLabelsIdx = baseUrl.indexOf("?");
      nmaLabels = (strLabelsIdx == -1) ? baseUrl.substring(strLabels) : baseUrl.substring(strLabels, strLabelsIdx);
      nmaLabel = "feeds/posts/summary/-/" + nmaLabels + "?alt=json-in-script&max-results=99999";
    } else {
      nmaLabel = "feeds/posts/summary?alt=json-in-script&max-results=99999";
    }
    return nmaLabel
  };

  var getLink = function(listPrev){
    var dfr = $.Deferred();
    $.ajax({
      type: 'GET',
      url: sfr.env.data.homepageUrl + getLabelUrl(baseUrl),
      dataType: 'jsonp',
      success: dfr.resolve,
      error: dfr.reject
    });

    dfr.promise().done(function(o) {
      var m = location.href,
          l = m.indexOf("/search/label/") != -1,
          a = l ? m.substr(m.indexOf("/search/label/") + 14, m.length) : "";
      a = a.indexOf("?") != -1 ? a.substr(0, a.indexOf("?")) : a;
      var g = l ? "search/label/" + a + "?updated-max=" : "search?updated-max=",
          k = o.feed.entry.length,
          e = Math.ceil(k / maxPosts()-1);
      if (e <= 1) {
        return
      }
      var n = 1,
          h = [""];
      l ? h.push("search/label/" + a + "?max-results=" + maxPosts()) : h.push("?max-results=" + maxPosts());
      for (var d = 2; d <= e; d++) {
        var c = (d - 1) * maxPosts() - 1,
            b = o.feed.entry[c].published.$t,
            f = b.substring(0, 19) + b.substring(23, 29),
            i = f.split("T")[0];
        f = f.replace(/\+/,"%2B");
        if (m.indexOf(f) == -1) {
          n = d
        }
        h.push(g + f + "&max-results=" + maxPosts());
        listPrev.attr("href","/"+h[n]).addClass("shown")
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
      getLink(listPrev)
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

  sfr.modules.listPager = {
    init: function(){
      $wrapper = $(wrapperSelector);

      sfr.helpers.attachOnce($wrapper, 'list-pager', function () {
        getPrevPage();createWaypoints();
      });
    }
  };

}($, SFR));

$(SFR.modules.listPager.init);
