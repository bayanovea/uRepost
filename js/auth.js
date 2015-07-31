'use strict';

var auth = {
	
	authUrl: 'https://oauth.vk.com/authorize',
	authOpts: {
		client_id: '5014245',
		scope: 'wall',
		redirect_uri: 'https://oauth.vk.com/blank.html',
		response_type: 'token',
		display: 'popup'
	},
	db: chrome.storage.local,
	
	init: function() {
		var me = this;
		me.addListeners();
		me.getAccessToken(function (data) {
			me.showToken(data.vkToken);
		});
	},
	
	addListeners: function() {
		var me = this;
		$(document)
			.on('click', '.js-auth', function () {
				me.auth(me.showToken);
			});
	},
	
	auth: function(cb) {
		var me = this;
		var authOptsArr = [];
		Object.keys(me.authOpts).forEach(function (opt) {
			authOptsArr.push(opt + '=' + me.authOpts[opt]);
		});
		chrome.windows.create(
			{
				url: me.authUrl + '?' + authOptsArr.join('&'),
				type: 'panel'
			},
			function(window) {
				var authTabId = window.tabs[0].id;
				var tabUpdateListener = function(tabId, changeInfo) {
					if (authTabId === tabId && changeInfo.url && (changeInfo.url.indexOf('access_token=') + 1)) {
						var token = changeInfo.url.split('access_token=')[1].split('&')[0];
						me.saveAccessToken(token, cb);
						chrome.tabs.remove(tabId);
						chrome.tabs.onUpdated.removeListener(tabUpdateListener);
					}
				}
				chrome.tabs.onUpdated.addListener(tabUpdateListener);
			}
		);
	},
	
	showToken: function (vkToken) {
		if (vkToken) {
			$('.js-token').show();
			$('.js-token-val').html(vkToken);
			$('.js-auth').hide();
		}
		else {
			$('.js-token').hide();
			$('.js-auth').show();
		}
	},
	
	saveAccessToken: function(token, cb) {
		var me = this;
		me.db.set({vkToken: token}, function () {
			cb(token);
		});
	},
	
	getAccessToken: function(cb) {
		var me = this;
		me.db.get('vkToken', cb);
	}
	
};

auth.init();