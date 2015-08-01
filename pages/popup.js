var Popup = (function () {
	var
		$elHistory = null,
		elTemplate = null;
	history = [];
	
	function addRepost(repost) {
		var el = $(elTemplate).clone()[0];
		var dt = new Date(repost._create);
		var xx = function (n) {
			return n < 10 ? '0' + n : n;
		};
		
		$('[data-date]', el).html(xx(dt.getHours()) + ':' + ':' + xx(dt.getMinutes()));
		$('[data-title]', el).html(repost.title);
		
		$elHistory.append(el);
		if (repost.err) {
			$(el).show().find('[data-date]').addClass('label-danger');
		} else {
			$(el).show().find('[data-date]').addClass('label-success');
		}
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