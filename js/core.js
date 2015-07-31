console.log('start background');

chrome.runtime.onMessage.addListener(function (req, sender, cb) {
	//console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
	
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
});