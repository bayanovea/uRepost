console.log('start background');


chrome.runtime.onMessage.addListener(
	function (request, sender, sendResponse) {
		
		console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
		
		sendResponse({msg: "goodbye"});
	}
);