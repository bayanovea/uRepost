var Core = (function () {
	
	
	function onMessage(req, sender, cb) {
		switch (req.method) {
			case 'vk.auth':
				authVK.auth(function (token) {
					cb({err: null, token: token});
				});
				break;
			case 'vk.getPost':
				var postId = req.postId.replace('post', '');
				getVK.getPostById(postId, function (post) {
					//TODO: Error -----------------^^^^^
					cb({
						err: null,
						post: post
					});
				});
				break;
			case 'uapi.getModules':
				uAPI.getModules(function (err, modules) {
					if (err.message === 'not init'){
						window.open(chrome.extension.getURL('pages/options.html'))	
					}
					cb({
						err: err,
						modules: modules
					});
				});
				break;
			case 'uapi.getCategories':
				uAPI.getCategories(req.module, function (err, categories) {
					cb({
						err: err,
						categories: categories
					});
				});
				break;
			case 'uapi.createPost':
				uAPI.createPost(req.module, req.data, function (err, data) {
					cb({
						err: err,
						data: data
					});
				});
				break;
			default :
				cb(new Error('unknown method'));
				break;
		}
		return true;
	}
	
	function onStorage(changes, namespace) {
		for (var key in changes) {
			var storageChange = changes[key];
			switch (key) {
				case "uapi_options" :
					uAPI.init(storageChange.newValue);
					break;
			}
			console.log(storageChange);
		}
	}
	
	function init() {
		
		chrome.storage.local.get('uapi_options', function (result) {
			var options = result['uapi_options'];
			if (! options) return;
			uAPI.init(options);
		});
		
		chrome.runtime.onMessage.addListener(onMessage);
		chrome.storage.onChanged.addListener(onStorage);
	}
	
	return {
		init: init
	}
	
})();


Core.init();