'use strict';

(function () {
  var RANDOM_PHOTOS_NUMBER = 10;
  var filters = document.querySelector('.img-filters__form');
  var photosPupularFilter = filters.querySelector('#filter-popular');
  var photosRandomFilter = filters.querySelector('#filter-random');
  var photosDiscussedFilter = filters.querySelector('#filter-discussed');

  var photosPupularFilterHandler = function (elems) {
    return elems.slice();
  }

  var photosRandomFilterHandler = function (elems) {
    var randomPhotos = [];
    var copiedPictures = elems.slice();
    for (var i = 0; i < RANDOM_PHOTOS_NUMBER; i++) {
      var randomIndex = window.utils.getRandomNumber(0, copiedPictures.length - 1);
      var splicedElements = copiedPictures.splice(randomIndex, 1);
      randomPhotos.push(splicedElements[0]);
    }
    return randomPhotos;
  }

  var userFilter = function (filter, elems) {
    switch (filter) {
      case 'filter-popular':
        return photosPupularFilterHandler(elems);
      case 'filter-random':
        return photosRandomFilterHandler(elems);
      case 'filter-discussed':
        return console.log('hi');
      default:
        return [];
    }
  };

})();
