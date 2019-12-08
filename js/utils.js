'use strict';

(function () {
  var ENTER_KEYCODE = 13;
  var ESC_KEYCODE = 27;

  var stopCloseByEscHandler = function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      evt.stopPropagation();
    }
  };

  window.utils = {
    stopCloseByEscHandler: stopCloseByEscHandler,
    enterKeyCode: ENTER_KEYCODE,
    escKeyCode: ESC_KEYCODE
  };
})();
