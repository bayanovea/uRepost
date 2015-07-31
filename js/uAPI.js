(function () {
	
	var option = {
		
		//oauth_nonce: md5(microtime().mt_rand()), //не изменять
		oauth_nonce: CryptoJS.enc.Base64.stringify(CryptoJS.MD5("#$%^^&*IJB")),
		timestamp: Math.floor(Date.now / 1000), //не изменять
		sig_method: 'HMAC-SHA1', //не изменять
		oauth_version: '1.0', //не изменять
		
		consumer_key: 'Nvw3Wm7v1bN8',
		consumer_secret: 'Tu.yUtCw9ygRQPJFrDpgHurMeWn7q7',
		oauth_token: 'Ugqe53bimpieTA4wZoSPPfWgakL.v5zjRREXl4RJ',
		oauth_token_secret: 'yRylogtLxZ4a0.gSdGRhRhn443ZVH422cqEVuGTx',
		main_url: 'http://alphatest-6347.ucoz.ru/uapi'
	};
	
	
	$('#u-api-test')
		.on('click', function () {
			console.log('TEST !!');
		});
	
})();