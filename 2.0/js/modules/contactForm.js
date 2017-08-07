(function($,fyr){
  var attach = function(submit){
    var $form = $(this),
        $button = $form.find("button");
    $.ajax({
      cache: !1,
      data: $form.serialize(),
      dataType: "json",
      method: $form.attr("method").toUpperCase(),
      url: $form.attr("action") + $form.attr("data-snd") + "@gmail.com",
      beforeSend: function(xhr){
        $form.find(".formInput-text").toggleClass("disabled", !0);
        $button.toggleClass("btn-disabled", !0)
      },
      success: function(data){
        var $message = $form.attr("data-snd-success");
        sending && "function" == typeof sending[$message] && sending[$message]($form, $button, $)
      },
      error: function(data){
        var $message = $form.attr("data-snd-fail");
        sending && "function" == typeof sending[$message] && sending[$message]($form, $button, $.responseJSON)
      }
    });
    submit.preventDefault()
  };
  var sending = {
    sendingSuccess: function($form,$button,$){
      $form.toggleClass("is-delivered", !0);
      fyr.helpers.debounce(function() {
        $form.find(".formInput-text").toggleClass("disabled", !1);
        $form.toggleClass("is-delivered", !1);
        $form[0].reset();
        $button.toggleClass("btn-disabled", !1)
      }, 5000, "send-success-message")
    },
    sendingFail: function($form,$button,$){
      $form.toggleClass("is-failed", !0);
      fyr.helpers.debounce(function() {
        $form.find(".formInput-text").toggleClass("disabled", !1);
        $form.toggleClass("is-failed", !1);
        $button.toggleClass("btn-disabled", !1)
      }, 5000, "send-fail-message")
    }
  };

  fyr.modules.contactForm = {
    init: function(){
      fyr.helpers.attachOnce(".contact-form", "contact-form", function(submit){
        submit.on("submit", attach)
      })
    }
  }

}($, fyr)); $(fyr.modules.contactForm.init)
