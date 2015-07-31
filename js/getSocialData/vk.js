'use strict';

var getVK = {
	
	db: chrome.storage.local,
	apiUrl: 'https://api.vk.com/method/wall.getById?posts=',
	
	init: function () {
		var me = this;
		me.getAccessToken();
	},
	
	checkAccessToken: function (cb) {
		var me = this;
		if ( ! me.token) {
			console.log('no token');
			authVK.auth(function () {
				me.getAccessToken(cb);
			});
			return;
		}
		cb();
	},
	
	getAccessToken: function(cb) {
		var me = this;
		me.db.get('vkToken', function (data) {
			me.token = data.vkToken;
			cb && cb(me.token);
		});
	},
	
	getPostById: function(id, cb) {
		var me = this;
		me.checkAccessToken(function () {
			$.ajax({
				url: me.apiUrl + id + '&extended=1&access_token=' + me.token
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
