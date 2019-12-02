'use strict';

(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
  var EFFECT_MAX_SCALE = 454;
  var BASE_PHOTO_TRANSFORM = 'scale(1)';
  var BASE_PHOTO_FILTER = 'none';
  var POINTS_PX = 'px';
  var SCALE_BASE_POINTS = '100%';
  var scaleValue = {
    MIN: 25,
    MAX: 100,
    STEP: 25
  };
  var effects = {
    none: {
      class: 'effects__preview--none',
      effectName: 'none',
      baseValue: ''
    },
    chrome: {
      class: 'effects__preview--chrome',
      effectName: 'grayscale',
      baseValue: '(1)',
      min: 0,
      max: 1,
      points: ''
    },
    sepia: {
      class: 'effects__preview--sepia',
      effectName: 'sepia',
      baseValue: '(1)',
      min: 0,
      max: 1,
      points: ''
    },
    marvin: {
      class: 'effects__preview--marvin',
      effectName: 'invert',
      baseValue: '(100%)',
      min: 0,
      max: 100,
      points: '%'
    },
    phobos: {
      class: 'effects__preview--phobos',
      effectName: 'blur',
      baseValue: '(3px)',
      min: 0,
      max: 3,
      points: 'px'
    },
    heat: {
      class: 'effects__preview--heat',
      effectName: 'brightness',
      baseValue: '(3)',
      min: 0,
      max: 3,
      points: ''
    }
  };
  var photoChooser = document.querySelector('.img-upload__start input[type=file]');
  var photoPreview = document.querySelector('.img-upload__preview');
  var uploadForm = document.querySelector('.img-upload__form');
  var uploadFileInput = uploadForm.querySelector('.img-upload__input');
  var uploadFileOverlay = uploadForm.querySelector('.img-upload__overlay');
  var uploadFileClosed = uploadForm.querySelector('.img-upload__cancel');
  var photoScaleSmaller = uploadForm.querySelector('.scale__control--smaller');
  var photoScaleBigger = uploadForm.querySelector('.scale__control--bigger');
  var photoScaleValue = uploadForm.querySelector('.scale__control--value');
  var filtersList = uploadForm.querySelector('.effects');
  var photoEffectsLevel = document.querySelector('.effect-level');
  var effectPin = uploadForm.querySelector('.effect-level__pin');
  var effectLine = uploadForm.querySelector('.effect-level__depth');
  var effectLevelValue = uploadForm.querySelector('.effect-level__value');
  var photoUpload;
  var scaleControlNumber;
  var selectedFilter;

  var resetForm = function () {
    uploadForm.reset();
  };

  var onEscPress = function (evt) {
    if (evt.keyCode === window.utils.escKeyCode) {
      closeOverlay();
    }
  };

  var closeOverlay = function () {
    resetForm();
    uploadFileOverlay.classList.add('hidden');
    document.removeEventListener('keydown', onEscPress);
  };

  var openOverlay = function () {
    photoLoadHandler();
    uploadFileOverlay.classList.remove('hidden');
    document.addEventListener('keydown', onEscPress);
  };

  var photoLoadHandler = function () {
    var file = photoChooser.files[0];
    var fileName = file.name.toLowerCase();

    var matches = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });

    if (matches) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        photoUpload = photoPreview.querySelector('img');
        photoUpload.src = reader.result;
        photoUpload.style.transform = BASE_PHOTO_TRANSFORM;
        photoUpload.style.filter = BASE_PHOTO_FILTER;
      });

      reader.readAsDataURL(file);
    }
  };

  var scaleBiggerHandler = function () {
    scaleControlNumber = parseInt(photoScaleValue.value, 10);

    if (scaleControlNumber < scaleValue.MAX) {
      scaleControlNumber += scaleValue.STEP;
      photoScaleValue.value = String(scaleControlNumber) + '%';
      photoUpload.style.transform = 'scale(' + (scaleControlNumber / 100) + ')';
    }
  };

  var scaleSmallerHandler = function () {
    scaleControlNumber = parseInt(photoScaleValue.value, 10);

    if (scaleControlNumber > scaleValue.MIN) {
      scaleControlNumber -= scaleValue.STEP;
      photoScaleValue.value = String(scaleControlNumber) + '%';
      photoUpload.style.transform = 'scale(' + (scaleControlNumber / 100) + ')';
    }
  };

  var filtersCheckHandler = function (evt) {
    var target = evt.target;
    selectedFilter = effects[target.value];
    updateEffectValue();
    photoUpload.style.filter = selectedFilter.effectName + selectedFilter.baseValue;

    if (selectedFilter.effectName === 'none') {
      photoEffectsLevel.classList.add('hidden');
    } else {
      photoEffectsLevel.classList.remove('hidden');
    }

    effectPin.addEventListener('mousedown', pinFiltersMovesHandler);
  };

  var pinFiltersMovesHandler = function (evt) {
    evt.preventDefault();

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var mouseMoveHandler = function (moveEvt) {
      moveEvt.preventDefault();

      var shift = {
        x: startCoords.x - moveEvt.clientX
      };

      startCoords = {
        x: moveEvt.clientX
      };

      if ((effectPin.offsetLeft - shift.x) < 0) {
        effectPin.style.left = 0 + POINTS_PX;
      } else {
        if ((effectPin.offsetLeft - shift.x) > EFFECT_MAX_SCALE) {
          effectPin.style.left = EFFECT_MAX_SCALE + POINTS_PX;
        } else {
          effectPin.style.left = (effectPin.offsetLeft - shift.x) + POINTS_PX;
        }
      }
      effectLine.style.width = effectPin.offsetLeft + POINTS_PX;
    };
    var calculateEffectValue = function (minValue, maxValue) {
      var effectValue = minValue + (maxValue - minValue) / (EFFECT_MAX_SCALE / effectPin.offsetLeft);
      effectLevelValue.value = effectValue;
      return effectValue;
    };

    var mouseUpHandler = function () {
      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);
      photoUpload.style.filter = selectedFilter.effectName + '(' + calculateEffectValue(selectedFilter.min, selectedFilter.max) + selectedFilter.points + ')';
    };

    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  };

  var updateEffectValue = function () {
    effectPin.style.left = SCALE_BASE_POINTS;
    effectLine.style.width = SCALE_BASE_POINTS;
  };

  uploadFileInput.addEventListener('change', openOverlay);

  photoScaleBigger.addEventListener('click', scaleBiggerHandler);

  photoScaleSmaller.addEventListener('click', scaleSmallerHandler);

  filtersList.addEventListener('change', filtersCheckHandler);

  uploadFileClosed.addEventListener('click', closeOverlay);
})();
