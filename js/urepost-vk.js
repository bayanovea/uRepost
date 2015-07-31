"use strict";


(function () {
	console.log("VK [search posts]");
	
	var elBtnTemplate01 = '<span class="urepost-vk-btn"></span>';
	
	
	$(document)
		.on('mouseenter', 'div.post', function () {
			var
				$elPost = $(this),
				idPost = $elPost.attr('id');
			
			$elPost.css({'position': 'relative'});
			
			$(elBtnTemplate01).appendTo($elPost.find('.post_image:first'))
				.on('click', function () {
					var method = {
						method: 'vk.repost',
						postId: idPost
					};
					
					chrome.runtime.sendMessage(method,
						function (response) {
							console.log(response);
						}
					);
				});
		})
		.on('mouseleave', 'div.post', function () {
			var $elPost = $(this);
			$('.urepost-vk-btn', $elPost).remove();
		});
})();


