'use strict';

(function () {
  var photosList = [];
  var pictureElements = null;

  var setIndexForPhotosList = function () {
    photosList.forEach(function (photo) {
      photo.index = photosList.indexOf(photo);
    });
  };

  var successHandler = function (data) {
    photosList = data;
    setIndexForPhotosList();
    window.photo.getSimilarPicture(photosList);
    addHandlerOnPicture();
  };

  var sendRequestForData = function () {
    window.server.load(successHandler);
  };

  var addHandlerOnPicture = function () {
    pictureElements = document.querySelectorAll('.picture');

    pictureElements.forEach(function (pictureElement) {
      pictureElement.addEventListener('click', pictureElementClickHandler);
    });
  };

  var pictureElementClickHandler = function (elem) {
    elem.preventDefault();

    var picture = elem.target;
    picture = picture.parentElement;

    var elemIndex = picture.dataset.index;

    window.photo.popupOpenHandler(photosList[elemIndex]);
  };

  sendRequestForData();

})();
