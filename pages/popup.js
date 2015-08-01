var Popup = (function () {
	var
		$elHistory = null,
		elTemplate = null;
	history = [];
	
	function addRepost(repost) {
		var el = $(elTemplate).clone()[0];
		
		$('[data-date]', el).html(new Date(repost._create).toTimeString());
		$('[data-title]', el).html(repost.title);
		
		$elHistory.append(el);
		$(el).show();
	}
	
	function init() {
		
		$elHistory = $('[data-history]');
		elTemplate = $('[data-template]').clone()[0];
		
		chrome.runtime.sendMessage({method: "popup.getHistory"}, function (res) {
			if (res.err) return;
			
			$elHistory.empty();
			
			for (var post in res.history) {
				addRepost(res.history[post]);
			}
		});
	}
	
	return {
		init: init
	};
})();


$(function () {
	Popup.init();
});