var PageOptions = (function () {
	
	function joinVK(cb){
		
	}
	
	function fillUApiOptions(cb) {
		chrome.storage.local.get('uapi_options', function (result) {
			var
				form = $('[data-uapi-options]')[0],
				options = result['uapi_options'];
			if (! options)
				return cb();
			
			for (var name in options) {
				$('input[name="' + name + '"]', form).val(options[name]);
			}
			cb();
		})
	}
	
	function validationUApiOption(options, cb) {
		var
			valid = true;
		//TODO :
		if (valid) {
			cb(null);
		} else {
			cb(true);
		}
	}
	
	function saveUApiOptions(options, cb) {
		//chrome.storage.onChanged.addListener(function(){});
		chrome.storage.local.set({'uapi_options': options}, function () {
			cb();
		});
	}
	
	function init() {
		fillUApiOptions(function () {
			$(':submit', '[data-uapi-options]').removeAttr('disabled');
		});
		
		// Настройки uAPI
		$('[data-uapi-options]')
			.submit(function (event) {
				var form = this;
				event.preventDefault();
				var options = {};
				
				$('input', this).each(function () {
					var $elInput = $(this);
					options[$elInput.attr('name')] = $elInput.val();
				});
				
				$(':submit', form).prop('disabled', true);
				
				validationUApiOption(options, function (err) {
					if (err) {
						$('[data-uapi-error]').show();
						return;
					}
					$('[data-uapi-error]').hide();
					
					saveUApiOptions(options, function () {
						$(':submit', form).removeAttr('disabled');
					});
				});
				
				return event.preventDefault();
			});
		
		$('[data-join-vk]')
			.on('click', function () {
				
			});
	}
	
	return {
		init: init
	}
})();

$(function () {
	PageOptions.init();
});