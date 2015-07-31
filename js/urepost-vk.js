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
					.on('click', function () {
						var action = {
							method: 'vk.repost',
							postId: idPost
						};
						
						chrome.runtime.sendMessage(action, function (data) {
							showPopup(data);
							console.log(data);
						});
					});
			})
			.on('mouseleave', 'div.post', function () {
				$('.urepost-vk-btn', $(this)).remove();
			});
	};
	var showPopup = function (data) {
		$.get(chrome.extension.getURL('pages/modal.html'), function (tmpl) {
			uAPI.getModules(function (modules) {
				console.log(modules);
				//$('body').append(_.template(tmpl)({data: data}));
			});
		});
	};
	
	return {
		init: init
	};
	
})();

uRepostVK.init();
