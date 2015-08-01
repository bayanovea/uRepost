var PageOptions = (function () {
	var
		resource = {
			vkOnline: 'ВК подключен',
			vkOffline: 'Подключить ВК',
			INVALID_CONSUMER_KEY : 'Некорректный consumer key',
			UNKNOWN_TOKEN : 'Неизвестный token'
		};
	
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
		return cb(null);
		
		//TODO:
		chrome.runtime.sendMessage({method: 'uapi.validation', options: options}, function (res) {
			if (res.err) {
				switch (res.err.code){
					case 'INVALID_CONSUMER_KEY':
						cb(resource.INVALID_CONSUMER_KEY);
						return;
					case 'UNKNOWN_TOKEN':
						cb(resource.UNKNOWN_TOKEN);
						return;
				}
				return cb('Неизвестная ошибка');
			}
			return cb(null);
		});
	}
	
	function saveUApiOptions(options, cb) {
		chrome.storage.local.set({'uapi_options': options}, function () {
			cb();
		});
	}
	
	function joinVK(cb) {
		chrome.runtime.sendMessage({method: 'vk.auth'}, function (res) {
			if (res.err) {
				return cb(res.err);
			}
			cb(null);
		});
	}
	
	function fillVKOptions(options) {
		options = options || {};
		var
			$elBtn = $('[data-join-vk]');
		
		if (options.online) {
			$elBtn.html(resource.vkOnline);
			$elBtn.removeClass('btn-success');
			$elBtn.addClass('btn-default');
			$elBtn.prop('disabled', true);
		} else {
			$elBtn.html(resource.vkOffline);
			$elBtn.removeClass('btn-default');
			$elBtn.addClass('btn-success');
			$elBtn.removeAttr('disabled');
		}
	}
	
	function onStorage(changes) {
		for (var key in changes) {
			var storageChange = changes[key];
			switch (key) {
				case "uapi_options" :
					
					break;
				case "vkToken" :
					var token = storageChange.newValue;
					if (token) {
						fillVKOptions({online: true})
					} else {
						fillVKOptions({});
					}
					break;
			}
		}
	}
	
	function init() {
		
		fillUApiOptions(function () {
			$(':submit', '[data-uapi-options]').show();
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
				
				if (options.mainUrl.indexOf('http://') !== 0 && options.mainUrl.indexOf('https://') !== 0) {
					options.mainUrl = 'http://' + options.mainUrl;
				}
				if (options.mainUrl.slice(- 1) === '/') {
					options.mainUrl = options.mainUrl.slice(0, - 1);
				}
				if (! /.*\/uapi$/.test(options.mainUrl)) {
					options.mainUrl += '/uapi';
				}
				$('input[name="mainUrl"]', this).val(options.mainUrl);
				
				$(':submit', form).prop('disabled', true);
				
				validationUApiOption(options, function (err) {
					$(':submit', form).removeAttr('disabled');

					if (err) {
						$('[data-uapi-error]').show().html(err);
						console.log(err);
						return;
					}
					$('[data-uapi-error]').hide();
					
					saveUApiOptions(options, function () {
					});
				});
				
				return event.preventDefault();
			});
		
		$('[data-join-vk]')
			.on('click', function () {
				var $elBtn = $(this);
				joinVK(function (err, result) {
				});
			});
		
		chrome.storage.onChanged.addListener(onStorage);
		
		chrome.storage.local.get('vkToken', function (result) {
			var token = result['vkToken'];
			if (token) {
				fillVKOptions({online: true})
			} else {
				fillVKOptions({})
			}
			$('[data-join-vk]').show();
		});
	}
	
	return {
		init: init
	}
})();

$(function () {
	PageOptions.init();
});