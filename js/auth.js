'use strict';

var auth = {
	
	init: function() {
		var me = this;
		me.addListeners();
		me.auth();
	},
	
	addListeners: function() {},
	
	auth: function() {
		var authOpts = '';
	},
	
	saveAccessToken: function() {},
	
	getAccessToken: function() {}
	
};

auth.init();