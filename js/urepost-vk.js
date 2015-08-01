"use strict";


var uRepostVK = (function () {
	
	var elBtnTemplate01 = '<span class="urepost-vk-btn"></span>';
	var init = function () {
		addListeners();
	};
	var addListeners = function () {
		$(document)
			.on('mouseenter', 'div.post', function () {
				var $elPost = $(this).css({'position': 'relative'});
				var idPost = $elPost.attr('id');
				
				$(elBtnTemplate01).appendTo($elPost.find('.post_image:first'))
					.on('click.uRepostBtnClick', function () {
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
									});
								}
							},
							function (err, results) {
								if (err) {
									console.log(err);
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
				closePopup($(this).closest('.js-urepost-modal'));
			})
			.on('change', '.js-modules', function () {
				var module = $(this).val();
				$('.js-categories', $(this).closest('.js-urepost-modal')).attr('disabled', 'disabled');
				chrome.runtime.sendMessage({method: 'uapi.getCategories', module: module}, function (res) {
					if (res.err) {
						console.log(res.err);
						return;
					}
					showCategories(res.categories);
				});
			})
			.on('click', '.js-add-post', function () {
				var module = $('.js-modules').val();
				var data = {};
				$('.js-data-param', '.js-urepost-modal').each(function () {
					data[$(this).attr('name')] = $(this).val();
				});
				chrome.runtime.sendMessage({method: 'uapi.createPost', module: module, data: data}, function (res) {
					if (res.err) {
						console.log(res.err);
						return;
					}
					console.log('ok!!!!!');
				});
			});
	};
	var showPopup = function (data) {
		var $modal = $(_.template(data.tmpl)({post: data.post, modules: data.modules}));
		$('body').append($modal);
		$('.js-modules', $modal).trigger('change');
		$modal.fadeIn();
	};
	var closePopup = function ($popup) {
		$popup.fadeOut(300, function () {
			$el.remove();
		});
	};
	var showCategories = function (categories) {
		var options = '';
		categories.forEach(function (category) {
			options += '<option value="' + category.id + '">' + category.name + '</option>';
		});
		$('.js-categories').html(options).removeAttr('disabled');
		$('.js-add-post').removeAttr('disabled');
	};
	
	return {
		init: init
	};
	
})();

uRepostVK.init();
