'use strict';

var getVK = {
	
	db: chrome.storage.local,
	apiUrl: 'https://api.vk.com/method/wall.getById?posts=',
	
	init: function () {
		var me = this;
		me.getAccessToken(function (vkToken) {
			me.token = vkToken;
		});
	},
	
	getAccessToken: function(cb) {
		var me = this;
		me.db.get('vkToken', function (data) {
			cb(data.vkToken);
		});
	},
	
	getPostById: function(id, cb) {
		var me = this;
		if ( ! me.token) {
			console.log('no token');
			return;
		}
		$.ajax({
			url: me.apiUrl + id + '&access_token=' + me.token
		})
		.done(function (res) {
			cb(res);
		})
		.fail(function () {
			cb(null);
		});
	}
	
};

getVK.init();
