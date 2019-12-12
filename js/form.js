'use strict';

(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
  var BASE_PHOTO_TRANSFORM = 'scale(1)';
  var BASE_PHOTO_FILTER = 'none';
  var scaleValue = {
    MIN: 25,
    MAX: 100,
    STEP: 25
  };
  var cssFilters = {
    none: {
      class: 'effects__preview--none',
      property: null,
      value: null,
    },
    chrome: {
      class: 'effects__preview--chrome',
      property: 'grayscale',
      minValue: 0,
      maxValue: 1,
      unit: '',
    },
    sepia: {
      class: 'effects__preview--sepia',
      property: 'sepia',
      minValue: 0,
      maxValue: 1,
      unit: '',
    },
    marvin: {
      class: 'effects__preview--marvin',
      property: 'invert',
      minValue: 0,
      maxValue: 100,
      unit: '%',
    },
    phobos: {
      class: 'effects__preview--phobos',
      property: 'blur',
      minValue: 0,
      maxValue: '3',
      unit: 'px',
    },
    heat: {
      class: 'effects__preview--heat',
      property: 'brightness',
      minValue: 1,
      maxValue: 3,
      unit: '',
    },
  };
  var PinPosition = {
    MIN: 0,
    MAX: 450,
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
  var photoEffectsLevel = uploadForm.querySelector('.effect-level');
  var effectsList = uploadForm.querySelector('.effects__list');
  var effectPinElement = uploadForm.querySelector('.effect-level__pin');
  var effectLineElement = uploadForm.querySelector('.effect-level__line');
  var lineDepthElement = uploadForm.querySelector('.effect-level__depth');
  var effectValueElement = uploadForm.querySelector('.effect-level__value');
  var blockPinElement = uploadForm.querySelector('.img-upload__effect-level');
  blockPinElement.style.display = 'none';
  var photoUpload;
  var scaleControlNumber;

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
      photoEffectsLevel.classList.add('hidden');
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

  var setCssValues = function (value) {
    effectPinElement.style.left = value + 'px';
    lineDepthElement.style.width = value + 'px';
    effectLineElement.style.width = value + 'px';
  };

  var changeEffectLevel = function (min, max, effect, position, propertyUnit) {
    var unit = propertyUnit || '';
    var value = (max - min) * (position / PinPosition.MAX) + min;
    var changedFilterValue = '' + effect + '(' + value + unit + ')';
    photoUpload.style.filter = changedFilterValue;
    effectValueElement.value = Math.round(value);
  };

  effectPinElement.addEventListener('mousedown', function (evt) {
    evt.preventDefault();
    var selectedFilter = document.querySelector('input[type="radio"]:checked').value;
    var startPoint = evt.clientX;

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var shift = startPoint - moveEvt.clientX;
      var position = effectPinElement.offsetLeft - shift;
      startPoint = moveEvt.clientX;

      if (position <= PinPosition.MIN) {
        position = PinPosition.MIN;
      }

      if (position > PinPosition.MAX) {
        position = PinPosition.MAX;
      }
      setCssValues(position);
      changeEffectLevel(cssFilters[selectedFilter].minValue, cssFilters[selectedFilter].maxValue, cssFilters[selectedFilter].property, position, cssFilters[selectedFilter].unit);
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  effectsList.addEventListener('click', function (evt) {
    var filterRadio = evt.target.closest('input');
    if (filterRadio) {
      setCssValues(PinPosition.MAX);
      photoUpload.classList = '';
      photoUpload.style.filter = null;
      photoUpload.classList.add(cssFilters[filterRadio.value].class);
      blockPinElement.style.display = (!filterRadio.value) ? 'none' : 'block';
    }
  });

  var resetFormHandler = function () {
    resetForm();
    photoUpload.removeAttribute('class');
    uploadFileOverlay.classList.add('hidden');
    blockPinElement.style.display = 'none';
  };

  uploadFileInput.addEventListener('change', openOverlay);

  photoScaleBigger.addEventListener('click', scaleBiggerHandler);

  photoScaleSmaller.addEventListener('click', scaleSmallerHandler);

  uploadFileClosed.addEventListener('click', closeOverlay);

  uploadForm.addEventListener('submit', function (evt) {
    if (uploadForm.checkValidity()) {
      evt.preventDefault();
      window.server.upload(new FormData(uploadForm), resetFormHandler);
    }
  });

})();
