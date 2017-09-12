(function($,fyr){
  "use strict";
  var attach = function($this){
    var active = $this.find(".tabber-body-item.active").index();
    var total = $this.find(".tabber-body-item").length - 1;
    var opentab = function(tab){
      if (tab === active || tab < 0 || tab > total) {
        return
      }
      active = tab;
      var $previousTab = $this.find(".tabber-body-item.active");
      var $currentTab = $this.find(".tabber-body-item#tab_" + (tab + 1));
      $previousTab.removeClass("active");
      $currentTab.addClass("active");
      $this.trigger("fyr-tabberbodychanged", active)
    };
    $this.on("click", ".tabber-nav a", function(func) {
      func.preventDefault();
      var tab = $(this).parent().index();
      opentab(tab)
    });
    $this.on("fyr-tabberbodychanged", function(func, tab) {
      $this.find(".tabber-nav a.selected").removeClass("selected");
      $this.find(".tabber-nav li:nth-child(" + (tab + 1) + ") a").addClass("selected")
    });
    $(window).on("keydown.fyr-tabberkeydown", function(func) {
      if (func.keyCode === 37) {
        func.preventDefault();
        opentab(active - 1)
      }
      if (func.keyCode === 39) {
        func.preventDefault();
        opentab(active + 1)
      }
    });
    $this.trigger("fyr-tabberbodychanged", active);
  };

  fyr.modules.tabbers = function(){
    fyr.helpers.attachOnce(".tabber", "tabber", attach)
  }
  
}($,fyr));$(fyr.modules.tabbers);
