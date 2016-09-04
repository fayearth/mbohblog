(function ($, sfr) {
    'use strict';

    sfr.modules.popupCenter = function (url, title, w, h) {
        // http://stackoverflow.com/questions/4068373/center-a-popup-window-on-screen
        // http://www.xtf.dk/2011/08/center-new-popup-window-even-on.html
        // Fixes dual-screen position                         Most browsers      Firefox
        var dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : screen.left,
            dualScreenTop = window.screenTop != undefined ? window.screenTop : screen.top,
            width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width,
            height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height,
            left = ((width / 2) - (w / 2)) + dualScreenLeft,
            top = ((height / 2) - (h / 2)) + dualScreenTop,
            newWindow;

        newWindow = window.open(url, title, 'scrollbars=yes, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);

        // Puts focus on the newWindow
        if (window.focus && newWindow) {
            newWindow.focus();
        }
    };

}($, SFR));
