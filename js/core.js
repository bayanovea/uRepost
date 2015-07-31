var Core = (function () {
	
	function onUApiOptions(newOption){
		
	}
	
	function onMessage(req, sender, cb) {
		switch (req.method) {
			case "vk.repost":
				var postId = req.postId.replace('post', '');
				getVK.getPostById(postId, function (data) {
					cb(data);
				});
				break;
			default :
				cb({data: data});
				break;
		}
		return true;
	}
	
	function onStorage(changes, namespace) {
		for (var key in changes) {
			var storageChange = changes[key];
			
			switch (key){
				case "uapi_options" :
					uAPI.init(options);
					break;
			}
			
			console.log(storageChange);
		}
	}
	
	function init() {
		
		chrome.storage.local.get('uapi_options', function (result) {
			var options = result['uapi_options'];
			if (!options) return;
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