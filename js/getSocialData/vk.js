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
			me.getPostAttempts = (me.getPostAttempts || 0) + 1;
			$.ajax({
				url: me.apiUrl + id + '&extended=1&access_token=' + token
			})
			.done(function (res) {
				if (res.error) {
					// Дока по ошибкам тут: https://vk.com/dev/errors
					// код 5 приходит, если токен просрочен и т.п.
					// код 10 приходит в случае некорректного токена, означает: Internal server error: could not get application
					// пробуем 3 раза, если каждый раз ошибка - перестаем пробовать и возвращаем ошибку
					if (([5, 10, 15].indexOf(res.error.error_code) + 1) && me.getPostAttempts <= 3) {
						authVK.auth(function () {
							me.getPostById(id, cb);
						});
						return;
					}
					me.getPostAttempts = 0;
					return cb(new Error('vk get data error, attempts: ' + me.getPostAttempts), null);
				}
				cb(null, uTranspiler(res, 'vk'));
			})
			.fail(function () {
				cb(new Error('ajax request error'), null);
			});
		});
	}
	
};

getVK.init();
