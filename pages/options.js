var PageOptions = (function () {
	
	
	
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
	
	function joinVK(cb) {
		
		var action = {
			method: 'vk.auth'
		};
		
		chrome.runtime.sendMessage(action, function (res) {
			if (res.err) {
				return cb(res.err);
			}
		});
	}
	
	function onStorage(changes, namespace){
		for (var key in changes) {
			var storageChange = changes[key];
			
			switch (key) {
				case "uapi_options" :
					break;
				case "vkToken" :
					var $elBtn = $('[data-join-vk]');
					$elBtn.removeClass('btn-default');
					$elBtn.addClass('btn-success');
					$elBtn.prop('disabled', true);
					break;
			}
			
			console.log(storageChange);
		}
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
				var $elBtn = $(this);
				joinVK(function (result) {
					if (result) {
						$elBtn.removeClass('btn-default');
						$elBtn.addClass('btn-success');
						$elBtn.prop('disabled', true);
					} else {
						$elBtn.removeClass('btn-success');
						$elBtn.addClass('btn-default');
						$elBtn.removeAttr('disabled');
					}
				});
			});
		
		chrome.storage.onChanged.addListener(onStorage);
		
		chrome.storage.local.get('vkToken', function (result) {
			var $elBtn = $('[data-join-vk]');
			var token = result['vkToken'];
			if ( token) {
				$elBtn.removeClass('btn-default');
				$elBtn.addClass('btn-success');
				$elBtn.prop('disabled', true);
			}else{
				$elBtn.removeClass('btn-success');
				$elBtn.addClass('btn-default');
				$elBtn.removeAttr('disabled');
			}
		});
	}
	
	return {
		init: init
	}
})();

$(function () {
	PageOptions.init();
});