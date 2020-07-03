'use strict';

(function () {
  var ENTER_KEYCODE = 13;
  var ESC_KEYCODE = 27;

  var stopCloseByEscHandler = function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      evt.stopPropagation();
    }
  };

  var getRandomNumber = function (minNumber, maxNumber) {
    return Math.floor(Math.random() * (Math.floor(maxNumber) - Math.ceil(minNumber) + 1)) + Math.ceil(minNumber);
  }

  window.utils = {
    stopCloseByEscHandler: stopCloseByEscHandler,
    getRandomNumber: getRandomNumber,
    enterKeyCode: ENTER_KEYCODE,
    escKeyCode: ESC_KEYCODE
  };
})();
