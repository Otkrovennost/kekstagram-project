'use strict';

(function () {
  var HASHTAGS_MAX_LENGTH = 20;
  var HASHTAGS_MAX_NUMBER = 5;
  var userHashtag = document.querySelector('.text__hashtags');
  var userComment = document.querySelector('.text__description');

  var hashtagsValidation = function (userInput) {
    if (userInput === '') {
      return '';
    }

    var arrayHashtags = userInput.toLowerCase().split(' ');
    // console.log(arrayHashtags);

    if (arrayHashtags.length > HASHTAGS_MAX_NUMBER) {
      return 'Вы не можете использовать больше 5 хэштегов';
    }

    for (var i = 0; i < arrayHashtags.length; i++) {
      var hashtag = arrayHashtags[i];

      if (hashtag[0] !== '#') {
        return 'Вы забыли поставить знак #';
      }

      if (hashtag === '#') {
        return ' Вы не ввели текст хэштэга';
      }

      var cutHashtag = hashtag.slice(1);

      if (cutHashtag.indexOf('#') !== -1) {
        return 'Вы забыли поставить пробел между хэштегами';
      }

      if (arrayHashtags.indexOf(hashtag) !== i) {
        return 'Вы уже использовали данный хэштег';
      }

      if (hashtag.length > HASHTAGS_MAX_LENGTH) {
        return 'Длина хэштега должна быть не больше 20 символов, включая решётку';
      }
    }
    return '';
  };

  userHashtag.addEventListener('input', function () {
    var hashtagError = hashtagsValidation(userHashtag.value);
    userHashtag.setCustomValidity(hashtagError);
  });

  userHashtag.addEventListener('keydown', window.utils.stopCloseByEscHandler);
  userComment.addEventListener('keydown', window.utils.stopCloseByEscHandler);

})();
