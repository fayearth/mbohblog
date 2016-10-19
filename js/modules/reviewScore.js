(function($, sfr){
  "use strict";
  var loadBar = function($this){
    $this.waypoint(function($waypoint){
      var scoreNum = $this.find(".score-number").html(), 
          scoreBar = $this.find(".review-final-bars"),
          $percent = scoreNum * 10,
          $bar = scoreBar.find("span"); 
      $bar.animate({width: $percent+"%"},1500);
      if($percent == 100){$bar.addClass("w100")}; 
      this.destroy()
    },{
      offset: "115%"
    })
  };
  sfr.modules.reviewScore = function(){
    sfr.helpers.attachOnce(".review-final-scoring", "review-final", loadBar)
  }
}($, SFR));$(SFR.modules.reviewScore);
