'use strict';

var uTranspiler = (function () {
	
	var ut = {
		
		vk: function (data) {
			var text = data.text.replace(/\[(.*?)\|(.*?)\]/gi, '<a href="http://vk.com/$1" target="_blank>$2</a>');
			var newData = {
				title: 'Some Title',
				content: text
			};
			if (data.attachments) {
				data.attachments.forEach(function (attachment) {
					if (attachment.type === 'photo') {
						newData.content += '<p><img src="' + attachment.photo.src_big + '" style="max-width: 100%;"></p>';
					}
				});
			}
			return newData;
		},
		
		fb: function (data) {
			return {};
		}
		
	};
	
	return function (data, social) {
		return ut[social](data);
	}
	
}());