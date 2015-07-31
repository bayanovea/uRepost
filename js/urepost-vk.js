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
				chrome.runtime.sendMessage({method: 'uapi.getCategories', module: module}, function (res) {
					if (err) {
						console.log(err);
						return;
					}
					showcategories(res.categories);
				});
			});
	};
	var showPopup = function (data) {
		var $modal = $(_.template(data.tmpl)({post: data.post, modules: data.modules}));
		$('body').append($modal);
		$modal.fadeIn();
	};
	var closePopup = function ($popup) {
		$popup.fadeOut(300, function () {
			$el.remove();
		});
	};
	var showCategories = function (categories) {
		console.log(categories);
	};
	
	return {
		init: init
	};
	
})();

uRepostVK.init();
