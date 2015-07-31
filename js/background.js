console.log('start background');

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	//console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
	var postId = request.id.replace('post', '');
	getVK.getPostById(postId, function (data) {
		sendResponse({data: data});
	});
	return true;
});