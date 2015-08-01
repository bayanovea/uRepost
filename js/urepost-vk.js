"use strict";


var uRepostVK = (function () {
	
	var elBtnTemplate01 = '<span class="urepost-vk-btn"></span>';
	var init = function () {
		addListeners();
	};
	var addListeners = function () {
		$(document)
			.on('mouseenter', 'div.post', function () {
				
				if ($(this).height() < 120) return;
				
				var $elPost = $(this).css({'position': 'relative'});
				var idPost = $elPost.attr('id');
				var $icon = $(elBtnTemplate01);
				$icon.appendTo($elPost.find('.post_image:first'))
					.on('click.uRepostBtnClick', function () {
						startLoading($icon);
						async.parallel(
							{
								post: function (cb){
									var action = {
										method: 'vk.getPost',
										postId: idPost
									};
									chrome.runtime.sendMessage(action, function (res) {
										cb(res.err, res.post);
									});
								},
								modules: function (cb) {
									chrome.runtime.sendMessage({method: 'uapi.getModules'}, function (res) {
										cb(res.err, res.modules);
									});
								},
								tmpl: function (cb) {
									$.get(chrome.extension.getURL('pages/modal.html'), function (tmpl) {
										cb(null, tmpl);
									})
									.fail(function() {
										cb(new Error('can not get popup template'), null);
									});
								}
							},
							function (err, results) {
								endLoading($icon);
								if (err) {
									console.log(err);
									showMessage('Возникла ошибка', 'error');
									return;
								}
								showPopup(results);
							}
						);
						
					});
			})
			.on('mouseleave', 'div.post', function () {
				$('.urepost-vk-btn', $(this)).off('.uRepostBtnClick').remove();
			})
			.on('click', '.js-urepost-modal-close', function () {
				closePopup();
			})
			.on('change', '.js-modules', function () {
				var module = $(this).val();
				disableBtn();
				$('.js-categories', $(this).closest('.js-urepost-modal')).attr('disabled', 'disabled');
				chrome.runtime.sendMessage({method: 'uapi.getCategories', module: module}, function (res) {
					if (res.err) {
						console.log(res.err);
						showMessage('Возникла ошибка', 'error');
						return;
					}
					showCategories(res.categories);
					enableBtn();
				});
			})
			.on('click', '.js-add-post', function () {
				disableBtn();
				var module = $('.js-modules').val();
				var data = {};
				var $popup = $('.js-urepost-modal');
				$('.js-data-param', $popup).each(function () {
					data[$(this).attr('name')] = $(this).val();
				});
				chrome.runtime.sendMessage({method: 'uapi.createPost', module: module, data: data}, function (res) {
					if (res.err) {
						console.log(res.err);
						showMessage('Возникла ошибка', 'error');
						enableBtn();
						return;
					}
					showMessage('Пост успешно отправлен', 'success');
				});
			});
	};
	var showPopup = function (data) {
		var $modal = $(_.template(data.tmpl)({post: data.post, modules: data.modules}));
		$('body').append($modal);
		$('.js-modules', $modal).trigger('change');
		$modal.fadeIn();
	};
	var closePopup = function () {
		var $popup = $('.js-urepost-modal');
		$popup.fadeOut(300, function () {
			$popup.remove();
		});
	};
	var showCategories = function (categories) {
		if ( ! categories.length) {
			return disableBtn();
		}
		var options = '';
		categories.forEach(function (category) {
			options += '<option value="' + category.id + '">' + category.name + '</option>';
		});
		$('.js-categories').html(options).removeAttr('disabled');
		enableBtn();
	};
	var enableBtn = function () {
		$('.js-add-post').removeAttr('disabled');
	};
	var disableBtn = function () {
		$('.js-add-post').attr('disabled', 'disabled');
	};
	var showMessage = function (text, status) {
		var $modal = $('.js-urepost-modal-content');
		if ( ! $modal.length) {
			return alert(text);
		}
		var $mess = $('<div class="urepost-modal-message urepost-modal-message--' + status + '">' + text + '</div>');
		$mess.appendTo($modal);
		setTimeout(function () {
			$mess.fadeOut(300, function () {
				$mess.remove();
			});
			if (status === 'success') {
				closePopup();
			}
		}, 1000);
	};
	var startLoading = function ($icon) {
		$icon.addClass('urepost-vk-btn--loading');
	};
	var endLoading = function ($icon) {
		$icon.removeClass('urepost-vk-btn--loading');
	};
	
	return {
		init: init
	};
	
})();

uRepostVK.init();
