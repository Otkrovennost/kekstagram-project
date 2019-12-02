'use strict';

(function () {
  var SUCCESS = 200;
  var SERVER_TIMEOUT = 10000;
  // var SUCCESS_MESS = 'Форма успешно отправлена';
  var STATUS_MESS = 'Cтатус ответа: ';
  var CONNECT_FAIL_MESS = 'Произошла ошибка соединения';
  var REQUEST_FAIL_MESS = 'Запрос не успел выполниться за ';
  var MILLISECONDS = 'мс';
  var URL_GET = 'https://js.dump.academy/kekstagram/data';
  // var URL_POST = 'https://js.dump.academy/keksobooking';
  var elMain = document.querySelector('main');
  var elError;
  var elSuccess;
  var elErrorButton;

  var isUndefined = function (el) {
    return typeof el === 'undefined';
  };

  var closeByEscapeHandler = function (evt) {
    if (evt.keyCode === window.utils.escKeyCode) {
      if (!isUndefined(elError)) {
        elError.removeEventListener('keydown', closeByEscapeHandler);
        elError.remove();
      } else if (!isUndefined(elSuccess)) {
        elSuccess.removeEventListener('keydown', closeByEscapeHandler);
        elSuccess.remove();
      }
    }
  };

  var closeByClickHandler = function () {
    if (!isUndefined(elError)) {
      elError.removeEventListener('click', closeByClickHandler);
      elError.remove();
    } else if (!isUndefined(elSuccess)) {
      elSuccess.removeEventListener('click', closeByClickHandler);
      elSuccess.remove();
    }
  };

  var errorHandler = function (errorMess) {
    var elErrorTemplate = document.querySelector('#error').content.querySelector('section.error');
    elError = elErrorTemplate.cloneNode(true);
    var elErrorMess = elError.querySelector('.error__title');
    elErrorMess.innerText = errorMess;
    elErrorButton = elError.querySelector('.error__button');

    elMain.insertBefore(elError, elMain.firstChild);
    document.addEventListener('keydown', closeByEscapeHandler);
    elErrorButton.addEventListener('click', closeByClickHandler);
    elError.addEventListener('click', closeByClickHandler);
  };

  // var successHandler = function (successMess) {
  //   var elSuccessTemplate = document.querySelector('#success').content.querySelector('section.success');
  //   elSuccess = elSuccessTemplate.cloneNode(true);
  //   var elSuccessMessage = elSuccess.querySelector('.success__title');
  //   elSuccessMessage.innerText = successMess;

  //   elMain.insertBefore(elSuccess, elMain.firstChild);
  //   document.addEventListener('keydown', closeByEscapeHandler);
  //   elSuccess.addEventListener('click', closeByClickHandler);
  // };

  window.server = {
    // upload: function (data, onSuccess) {
    //   var xhr = new XMLHttpRequest();
    //   xhr.responseType = 'json';

    //   xhr.addEventListener('load', function () {
    //     if (xhr.status === SUCCESS) {
    //       onSuccess(xhr.response);
    //       successHandler(SUCCESS_MESS);
    //     } else {
    //       errorHandler(STATUS_MESS + xhr.status + ' ' + xhr.statusText);
    //     }
    //   });

    //   xhr.addEventListener('error', function () {
    //     errorHandler(CONNECT_FAIL_MESS);
    //   });

    //   xhr.open('POST', URL_POST);
    //   xhr.timeout = SERVER_TIMEOUT;

    //   xhr.addEventListener('timeout', function () {
    //     errorHandler(REQUEST_FAIL_MESS + xhr.timeout + MILLISECONDS);
    //   });

    //   xhr.send(data);
    // },

    load: function (onSuccess) {
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'json';

      xhr.addEventListener('load', function () {
        if (xhr.status === SUCCESS) {
          onSuccess(xhr.response);
        } else {
          errorHandler(STATUS_MESS + xhr.status + ' ' + xhr.statusText);
        }
      });

      xhr.addEventListener('error', function () {
        errorHandler(CONNECT_FAIL_MESS);
      });

      xhr.open('GET', URL_GET);
      xhr.timeout = SERVER_TIMEOUT;

      xhr.addEventListener('timeout', function () {
        errorHandler(REQUEST_FAIL_MESS + xhr.timeout + MILLISECONDS);
      });

      xhr.send();
    }
  };
})();
