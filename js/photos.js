'use strict';

(function () {

  var VISIBLE_COMMENTS = 5;
  var bigPicture = document.querySelector('.big-picture');
  var commentsLoader = bigPicture.querySelector('.social__comments-loader');
  var commentsCount = bigPicture.querySelector('.social__comment-count');
  var commentsBlock = document.querySelector('.social__comments');
  var commentTemplate = commentsBlock.querySelector('.social__comment');
  var popupClose = null;
  var allCommentsList;

  var similarListElement = document.querySelector('.pictures');
  var similarPictureTemplate = document.querySelector('#picture')
    .content
    .querySelector('.picture');

  var renderPicture = function (template, picture) {
    var pictureElement = template.cloneNode(true);

    pictureElement.querySelector('.picture__img').src = picture.url;
    pictureElement.querySelector('.picture__likes').textContent = picture.likes;
    pictureElement.querySelector('.picture__comments').textContent = picture.comments.length;
    pictureElement.dataset.index = picture.index;

    return pictureElement;
  };

  var getSimilarPicture = function (photoDesc) {
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < photoDesc.length; i++) {
      fragment.appendChild(renderPicture(similarPictureTemplate, photoDesc[i]));
    }
    similarListElement.appendChild(fragment);
  };

  var createComment = function (comment) {
    var commentElement = commentTemplate.cloneNode(true);
    var pictureElement = commentElement.querySelector('.social__picture');
    pictureElement.alt = comment.name;
    pictureElement.src = comment.avatar;
    commentElement.querySelector('.social__text').textContent = comment.message;
    commentsBlock.appendChild(commentElement);
  };

  var renderComments = function (data) {
    allCommentsList = data;
    var commentsRenderList = data.slice(0, VISIBLE_COMMENTS);

    while (commentsBlock.firstChild) {
      commentsBlock.firstChild.remove();
    }

    commentsRenderList.forEach(createComment);
    commentsLoader.classList.add('hidden');
    commentsCount.textContent = commentsRenderList.length + ' из ' + allCommentsList.length + ' комментариев';

    if (data.length > VISIBLE_COMMENTS) {
      commentsLoader.classList.remove('hidden');
      commentsLoader.addEventListener('click', onLoadMoreClick);
    }
  };

  var onLoadMoreClick = function () {
    var commentsRendered = bigPicture.querySelectorAll('.social__comment').length;
    var copiedComments = allCommentsList.slice();

    copiedComments.slice(commentsRendered, commentsRendered + VISIBLE_COMMENTS).forEach(createComment);
    commentsRendered = bigPicture.querySelectorAll('.social__comment').length;
    commentsCount.textContent = commentsRendered + ' из ' + copiedComments.length + ' комментариев';

    if (commentsRendered === copiedComments.length) {
      commentsLoader.classList.add('hidden');
      commentsLoader.removeEventListener('click', onLoadMoreClick);
    }
  };

  var getBigPicture = function (data) {
    bigPicture.querySelector('.big-picture__img img').src = data.url;
    bigPicture.querySelector('.likes-count').textContent = data.likes;
    bigPicture.querySelector('.social__caption').textContent = data.description;

    renderComments(data.comments);
  };

  var popupCloseHandler = function () {
    bigPicture.classList.add('hidden');
  };

  var popupOpenHandler = function (data) {
    getBigPicture(data);
    bigPicture.classList.remove('hidden');

    popupClose = document.querySelector('.big-picture__cancel');
    popupClose.addEventListener('click', popupCloseHandler);

    document.addEventListener('keydown', function (evt) {
      if (evt.keyCode === window.utils.escKeyCode) {
        bigPicture.classList.add('hidden');
      }
    });
  };

  window.photo = {
    getSimilarPicture: getSimilarPicture,
    getBigPicture: getBigPicture,
    popupOpenHandler: popupOpenHandler
  };

})();
