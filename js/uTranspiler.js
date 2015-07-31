'use strict';

var uTranspiler = (function () {
	
	var ut = {
		
		vk: function (rawData) {
			var data = rawData.response.wall[0];
			var newData = {};
			newData.title = '';
			newData.content = data.text.replace(/\[(.*?)\|(.*?)\]/gi, '<a href="https://vk.com/$1" target="_blank>$2</a>');
			
			if (data.post_type === 'copy') {
				newData.content = (data.copy_text ? data.copy_text + '<br>' : '') + newData.content;
			}
			var posterId = data.post_type === 'copy' ? data.copy_owner_id : data.from_id;
			if (posterId < 0) {
				newData.title = 'Репост "' + rawData.response.groups[0].name + '"';
			}
			else {
				newData.title = 'Репост "' + rawData.response.profiles[0].first_name + ' ' + rawData.response.profiles[0].last_name + '"';
			}
			
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