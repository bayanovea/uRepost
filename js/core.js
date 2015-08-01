var Core = (function () {
	var
		MAX_HISTORY = 5;
	
	
	function addHistory(err, data) {
		chrome.storage.local.get('history', function (result) {
			var
				history = result['history'] || [],
				post = {
					_create: Date.now(),
					title: data.title
				};
			
			if (err) {
				post.err = true
			}
			
			if (history.length > MAX_HISTORY) {
				history.shift();
			}
			
			history.push(post);
			chrome.storage.local.set({'history': history}, function () {
				cb();
			});
		});
	}
	
	
	function onMessage(req, sender, cb) {
		switch (req.method) {
			case 'vk.auth':
				authVK.auth(function (token) {
					cb({err: null, token: token});
				});
				break;
			case 'vk.getPost':
				var postId = req.postId.replace('post', '');
				getVK.getPostById(postId, function (err, post) {
					//TODO: Error -----------------^^^^^
					cb({
						err: err,
						post: post
					});
				});
				break;
			case 'uapi.getModules':
				uAPI.getModules(function (err, modules) {
					if (err && err.message === 'not init') {
						window.open(chrome.extension.getURL('pages/options.html'));
					}
					
					cb({
						err: err,
						modules: modules
					});
				});
				break;
			case 'uapi.getCategories':
				uAPI.getCategories(req.module, function (err, categories) {
					if (err && err.message === 'not init') {
						window.open(chrome.extension.getURL('pages/options.html'));
					}
					
					cb({
						err: err,
						categories: categories
					});
				});
				break;
			case 'uapi.createPost':
				uAPI.createPost(req.module, req.data, function (err, data) {
					if (err && err.message === 'not init') {
						window.open(chrome.extension.getURL('pages/options.html'));
					}
					
					addHistory(err, data);
					
					cb({
						err: err,
						data: data
					});
				});
				break;
			case 'popup.getHistory':
				chrome.storage.local.get('history', function (result) {
					var history = result['history'];
					cb({
						err: null,
						history: history
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
		
		
		chrome.browserAction.onClicked.addListener(function () {
			window.open(chrome.extension.getURL('pages/options.html'));
		});
		
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