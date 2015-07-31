'use strict';

var getVK = {
	
	db: chrome.storage.local,
	apiUrl: 'https://api.vk.com/method/wall.getById?posts=',
	
	init: function () {},
	
	getAccessToken: function (cb) {
		var me = this;
		me.db.get('vkToken', function (data) {
			if (data.vkToken) {
				cb && cb(data.vkToken);
				return;
			}
			console.log('no token');
			authVK.auth(cb);
		});
	},
	
	getPostById: function(id, cb) {
		var me = this;
		me.getAccessToken(function (token) {
			$.ajax({
				url: me.apiUrl + id + '&extended=1&access_token=' + token
			})
			.done(function (res) {
				cb(uTranspiler(res, 'vk'));
			})
			.fail(function () {
				cb(null);
			});
		});
	}
	
};

getVK.init();
